<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePackagePaymentRequest;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PackagePaymentController extends Controller
{
    public function store(StorePackagePaymentRequest $request): JsonResponse
    {
        abort_unless(config('services.paychangu.secret_key'), 503, 'Payments are not available yet. Please contact Media One.');
        $data = $request->validated();
        $amount = config('services.paychangu.packages')[$data['package']];
        $reference = (string) Str::uuid();
        DB::table('package_payments')->insert([
            'tx_ref' => $reference, 'package' => $data['package'], 'name' => $data['name'],
            'email' => $data['email'], 'amount' => $amount, 'currency' => 'MWK',
            'status' => 'pending', 'created_at' => now(), 'updated_at' => now(),
        ]);
        $names = explode(' ', trim($data['name']), 2);
        try {
            $response = Http::withToken(config('services.paychangu.secret_key'))
                ->asJson()->acceptJson()->connectTimeout(5)->timeout(20)
                ->post('https://api.paychangu.com/payment', [
                    'amount' => $amount, 'currency' => 'MWK', 'tx_ref' => $reference,
                    'first_name' => $names[0], 'last_name' => $names[1] ?? '', 'email' => $data['email'],
                    'callback_url' => route('package-payments.callback'),
                    'return_url' => route('package-payments.return'),
                    'customization' => [
                        'title' => 'Media One — '.$data['package'],
                        'description' => $data['package'] === 'Pro' ? 'First month of Pro creative support' : $data['package'].' package starting price',
                    ],
                    'meta' => ['package' => $data['package']],
                ]);
        } catch (ConnectionException) {
            Log::warning('PayChangu checkout connection failed.', ['tx_ref' => $reference]);

            return response()->json(['message' => 'Unable to reach PayChangu. Please try again later.'], 502);
        }
        $checkoutUrl = $response->json('data.checkout_url');
        if (! $response->successful() || $response->json('status') !== 'success' || ! is_string($checkoutUrl)
            || parse_url($checkoutUrl, PHP_URL_SCHEME) !== 'https'
            || parse_url($checkoutUrl, PHP_URL_HOST) !== 'checkout.paychangu.com') {
            Log::warning('PayChangu checkout could not be created.', ['tx_ref' => $reference, 'http_status' => $response->status()]);

            return response()->json(['message' => 'Unable to open PayChangu checkout. Please try again later.'], 502);
        }

        return response()->json(['data' => ['checkout_url' => $checkoutUrl, 'tx_ref' => $reference]], 201);
    }

    public function verify(Request $request): JsonResponse
    {
        $data = $request->validate(['tx_ref' => ['required', 'uuid']]);
        $payment = DB::table('package_payments')->where('tx_ref', $data['tx_ref'])->first();
        abort_if($payment === null, 404);
        if ($payment->status !== 'paid') {
            abort_unless(config('services.paychangu.secret_key'), 503, 'Payment verification is temporarily unavailable.');
            try {
                $response = Http::withToken(config('services.paychangu.secret_key'))
                    ->acceptJson()->connectTimeout(5)->timeout(15)
                    ->get('https://api.paychangu.com/verify-payment/'.$payment->tx_ref);
            } catch (ConnectionException) {
                return response()->json(['message' => 'Payment verification is temporarily unavailable. Please check again.'], 502);
            }
            if (! $response->successful() || $response->json('status') !== 'success') {
                return response()->json(['message' => 'Payment verification is temporarily unavailable. Please check again.'], 502);
            }
            $verified = $response->json('data');
            if (! is_array($verified)) {
                return response()->json(['message' => 'Payment verification is temporarily unavailable. Please check again.'], 502);
            }
            if (($verified['status'] ?? null) === 'failed'
                && ($verified['tx_ref'] ?? null) === $payment->tx_ref
                && ($verified['currency'] ?? null) === $payment->currency) {
                DB::table('package_payments')->where('id', $payment->id)->where('status', '!=', 'paid')
                    ->update(['status' => 'failed', 'updated_at' => now()]);
            }
            if (($verified['status'] ?? null) === 'success'
                && ($verified['tx_ref'] ?? null) === $payment->tx_ref
                && ($verified['currency'] ?? null) === $payment->currency
                && is_numeric($verified['amount'] ?? null)
                && (float) $verified['amount'] >= $payment->amount) {
                DB::table('package_payments')->where('id', $payment->id)->where('status', '!=', 'paid')
                    ->update(['status' => 'paid', 'paid_at' => now(), 'updated_at' => now()]);
            }
        }
        $status = DB::table('package_payments')->where('id', $payment->id)->value('status');

        return response()->json(['data' => ['status' => $status, 'package' => $payment->package, 'tx_ref' => $payment->tx_ref]]);
    }

    public function webhook(Request $request): JsonResponse
    {
        $secret = config('services.paychangu.webhook_secret');
        abort_unless(is_string($secret) && $secret !== '', 503);
        abort_unless(hash_equals(hash_hmac('sha256', $request->getContent(), $secret), (string) $request->header('Signature')), 401);
        $reference = $request->input('tx_ref', $request->input('data.tx_ref'));
        if (! is_string($reference) || ! Str::isUuid($reference)
            || ! DB::table('package_payments')->where('tx_ref', $reference)->exists()) {
            return response()->json(['received' => true]);
        }
        $request->merge(['tx_ref' => $reference]);

        return $this->verify($request);
    }

    public function paymentCallback(Request $request): RedirectResponse
    {
        return $this->paymentReturn($request);
    }

    public function paymentReturn(Request $request): RedirectResponse
    {
        $this->verify($request);
        $data = $request->validate(['tx_ref' => ['required', 'uuid']]);
        $url = rtrim(config('services.paychangu.frontend_url'), '/').'/';

        return redirect()->away($url.'?payment_ref='.rawurlencode($data['tx_ref']).'#packages', 303);
    }
}
