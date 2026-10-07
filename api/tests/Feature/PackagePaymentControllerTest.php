<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\TestWith;
use Tests\TestCase;

class PackagePaymentControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.paychangu.secret_key' => 'test-secret', 'services.paychangu.frontend_url' => 'https://example.test/media-one/']);
        Http::preventStrayRequests();
    }

    #[TestWith(['Starter', 150000])]
    #[TestWith(['Growth', 350000])]
    #[TestWith(['Pro', 750000])]
    public function test_checkout_uses_server_price_despite_tampered_amount(string $package, int $amount): void
    {
        Http::fake(['https://api.paychangu.com/payment' => Http::response([
            'status' => 'success', 'data' => ['checkout_url' => 'https://checkout.paychangu.com/123'],
        ])]);

        $response = $this->postJson('/api/v1/package-payments', [
            'package' => $package, 'name' => 'Mphatso Chirwa', 'email' => 'mphatso@example.test', 'amount' => 1,
        ]);

        $response->assertCreated()->assertJsonPath('data.checkout_url', 'https://checkout.paychangu.com/123');
        $this->assertDatabaseHas('package_payments', [
            'tx_ref' => $response->json('data.tx_ref'), 'package' => $package, 'amount' => $amount, 'status' => 'pending',
        ]);
        Http::assertSent(fn ($request) => $request['amount'] === $amount && $request['currency'] === 'MWK'
            && $request['tx_ref'] === $response->json('data.tx_ref')
            && $request->hasHeader('Authorization', 'Bearer test-secret')
            && $request['callback_url'] === route('package-payments.callback')
            && $request['return_url'] === route('package-payments.return')
            && $request['first_name'] === 'Mphatso' && $request['last_name'] === 'Chirwa'
            && $request['email'] === 'mphatso@example.test'
            && $request->hasHeader('Content-Type', 'application/json')
            && $request['customization']['title'] === 'Media One — '.$package
            && $request['meta']['package'] === $package);
    }

    public function test_custom_and_missing_customer_fields_return_422(): void
    {
        $this->postJson('/api/v1/package-payments', ['package' => 'Custom'])
            ->assertUnprocessable()->assertJsonValidationErrors(['package', 'name', 'email']);

        $this->assertDatabaseCount('package_payments', 0);
        Http::assertNothingSent();
    }

    public function test_missing_merchant_key_returns_503(): void
    {
        config(['services.paychangu.secret_key' => null]);

        $this->postJson('/api/v1/package-payments', [
            'package' => 'Starter', 'name' => 'Mphatso Chirwa', 'email' => 'mphatso@example.test',
        ])->assertServiceUnavailable()->assertJsonPath('message', 'Payments are not available yet. Please contact Media One.');

        $this->assertDatabaseCount('package_payments', 0);
        Http::assertNothingSent();
    }

    #[TestWith(['rejected'])]
    #[TestWith(['unsafe-url'])]
    #[TestWith(['connection'])]
    public function test_checkout_failure_returns_502_without_recording_paid(string $failure): void
    {
        Http::fake(['https://api.paychangu.com/payment' => match ($failure) {
            'connection' => Http::failedConnection(),
            'unsafe-url' => Http::response(['status' => 'success', 'data' => ['checkout_url' => 'https://evil.example/checkout']]),
            default => Http::response(['status' => 'failed'], 500),
        }]);

        $this->postJson('/api/v1/package-payments', [
            'package' => 'Starter', 'name' => 'Mphatso Chirwa', 'email' => 'mphatso@example.test',
        ])->assertStatus(502);

        $this->assertDatabaseHas('package_payments', ['status' => 'pending', 'paid_at' => null]);
        Http::assertSentCount(1);
    }

    public function test_verified_payment_is_recorded_once(): void
    {
        $reference = $this->createPendingPayment();
        Http::fake(['https://api.paychangu.com/verify-payment/'.$reference => Http::response([
            'status' => 'success', 'data' => ['status' => 'success', 'tx_ref' => $reference, 'currency' => 'MWK', 'amount' => 150000],
        ])]);

        $this->postJson('/api/v1/package-payments/verify', ['tx_ref' => $reference])
            ->assertOk()->assertJsonPath('data.status', 'paid');

        $this->assertDatabaseHas('package_payments', ['tx_ref' => $reference, 'status' => 'paid']);
        $paidAt = DB::table('package_payments')->where('tx_ref', $reference)->value('paid_at');
        $this->assertNotNull($paidAt);
        $this->postJson('/api/v1/package-payments/verify', ['tx_ref' => $reference])->assertJsonPath('data.status', 'paid');
        $this->assertDatabaseHas('package_payments', ['tx_ref' => $reference, 'paid_at' => $paidAt]);
        Http::assertSentCount(1);
    }

    #[TestWith(['amount', 1])]
    #[TestWith(['currency', 'USD'])]
    #[TestWith(['tx_ref', 'different-reference'])]
    #[TestWith(['status', 'pending'])]
    public function test_mismatched_or_incomplete_payment_is_not_accepted(string $field, mixed $value): void
    {
        $reference = $this->createPendingPayment();
        $data = ['status' => 'success', 'tx_ref' => $reference, 'currency' => 'MWK', 'amount' => 150000];
        $data[$field] = $value;
        Http::fake(['https://api.paychangu.com/verify-payment/'.$reference => Http::response(['status' => 'success', 'data' => $data])]);

        $this->postJson('/api/v1/package-payments/verify', ['tx_ref' => $reference, 'status' => 'success'])
            ->assertOk()->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('package_payments', ['tx_ref' => $reference, 'status' => 'pending', 'paid_at' => null]);
        Http::assertSentCount(1);
    }

    #[TestWith(['connection'])]
    #[TestWith(['rejected'])]
    #[TestWith(['malformed'])]
    public function test_verification_unavailable_returns_502(string $failure): void
    {
        $reference = $this->createPendingPayment();
        Http::fake(['https://api.paychangu.com/verify-payment/'.$reference => match ($failure) {
            'connection' => Http::failedConnection(),
            'malformed' => Http::response(['status' => 'success', 'data' => null]),
            default => Http::response(['status' => 'failed'], 503),
        }]);

        $this->postJson('/api/v1/package-payments/verify', ['tx_ref' => $reference])->assertStatus(502);

        $this->assertDatabaseHas('package_payments', ['tx_ref' => $reference, 'status' => 'pending', 'paid_at' => null]);
        Http::assertSentCount(1);
    }

    public function test_unknown_reference_returns_404_without_gateway_request(): void
    {
        $this->postJson('/api/v1/package-payments/verify', ['tx_ref' => (string) Str::uuid()])->assertNotFound();

        Http::assertNothingSent();
    }

    public function test_callback_redirects_to_configured_site_without_trusting_status(): void
    {
        $reference = $this->createPendingPayment();
        Http::fake(['https://api.paychangu.com/verify-payment/'.$reference => Http::response([
            'status' => 'success', 'data' => ['status' => 'pending', 'tx_ref' => $reference, 'currency' => 'MWK', 'amount' => 150000],
        ])]);

        $this->get('/api/v1/package-payments/return?tx_ref='.$reference.'&status=success&return_url=https://evil.test')
            ->assertRedirect('https://example.test/media-one/?payment_ref='.$reference.'#packages');

        $this->assertDatabaseHas('package_payments', ['tx_ref' => $reference, 'status' => 'pending']);
        Http::assertSentCount(1);
    }

    #[TestWith(['get'])]
    #[TestWith(['post'])]
    public function test_successful_callback_verifies_before_redirecting(string $method): void
    {
        $reference = $this->createPendingPayment();
        Http::fake(['https://api.paychangu.com/verify-payment/'.$reference => Http::response([
            'status' => 'success', 'data' => ['status' => 'success', 'tx_ref' => $reference, 'currency' => 'MWK', 'amount' => 150000],
        ])]);

        $this->call(strtoupper($method), '/api/v1/package-payments/callback', ['tx_ref' => $reference, 'status' => 'success'])
            ->assertStatus(303)->assertRedirect('https://example.test/media-one/?payment_ref='.$reference.'#packages');

        $this->assertDatabaseHas('package_payments', ['tx_ref' => $reference, 'status' => 'paid']);
        Http::assertSentCount(1);
    }

    public function test_callback_does_not_trust_claimed_success_and_redirects_during_gateway_outage(): void
    {
        $reference = $this->createPendingPayment();
        Http::fake(['https://api.paychangu.com/verify-payment/'.$reference => Http::failedConnection()]);

        $this->get('/api/v1/package-payments/callback?tx_ref='.$reference.'&status=success')
            ->assertRedirect('https://example.test/media-one/?payment_ref='.$reference.'#packages');

        $this->assertDatabaseHas('package_payments', ['tx_ref' => $reference, 'status' => 'pending', 'paid_at' => null]);
        Http::assertSentCount(1);
    }

    public function test_verified_failure_is_recorded_without_marking_paid(): void
    {
        $reference = $this->createPendingPayment();
        Http::fake(['https://api.paychangu.com/verify-payment/'.$reference => Http::response([
            'status' => 'success', 'data' => ['status' => 'failed', 'tx_ref' => $reference, 'currency' => 'MWK', 'amount' => 150000],
        ])]);

        $this->postJson('/api/v1/package-payments/verify', ['tx_ref' => $reference])->assertJsonPath('data.status', 'failed');

        $this->assertDatabaseHas('package_payments', ['tx_ref' => $reference, 'status' => 'failed', 'paid_at' => null]);
        Http::assertSentCount(1);
    }

    public function test_failed_return_accepts_post_without_trusting_its_status(): void
    {
        $reference = $this->createPendingPayment();
        Http::fake(['https://api.paychangu.com/verify-payment/'.$reference => Http::response([
            'status' => 'success', 'data' => ['status' => 'success', 'tx_ref' => $reference, 'currency' => 'MWK', 'amount' => 150000],
        ])]);

        $this->post('/api/v1/package-payments/return', ['tx_ref' => $reference, 'status' => 'failed'])
            ->assertStatus(303)->assertRedirect('https://example.test/media-one/?payment_ref='.$reference.'#packages');

        $this->assertDatabaseHas('package_payments', ['tx_ref' => $reference, 'status' => 'paid']);
        Http::assertSentCount(1);
    }

    public function test_unsigned_webhook_returns_401_without_verification(): void
    {
        config(['services.paychangu.webhook_secret' => 'webhook-secret']);
        $reference = $this->createPendingPayment();

        $this->postJson('/api/v1/package-payments/webhook', ['tx_ref' => $reference, 'status' => 'success'])
            ->assertUnauthorized();

        $this->assertDatabaseHas('package_payments', ['tx_ref' => $reference, 'status' => 'pending']);
        Http::assertNothingSent();
    }

    #[TestWith([150000, 'paid'])]
    #[TestWith([1, 'pending'])]
    public function test_signed_webhook_uses_verified_amount(int $verifiedAmount, string $expectedStatus): void
    {
        config(['services.paychangu.webhook_secret' => 'webhook-secret']);
        $reference = $this->createPendingPayment();
        $payload = json_encode(['tx_ref' => $reference, 'status' => 'success']);
        Http::fake(['https://api.paychangu.com/verify-payment/'.$reference => Http::response([
            'status' => 'success', 'data' => ['status' => 'success', 'tx_ref' => $reference, 'currency' => 'MWK', 'amount' => $verifiedAmount],
        ])]);

        $this->call('POST', '/api/v1/package-payments/webhook', [], [], [], [
            'CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json',
            'HTTP_SIGNATURE' => hash_hmac('sha256', $payload, 'webhook-secret'),
        ], $payload)->assertOk()->assertJsonPath('data.status', $expectedStatus);

        $this->assertDatabaseHas('package_payments', ['tx_ref' => $reference, 'status' => $expectedStatus]);
        Http::assertSentCount(1);
    }

    private function createPendingPayment(): string
    {
        $reference = (string) Str::uuid();
        DB::table('package_payments')->insert([
            'tx_ref' => $reference, 'package' => 'Starter', 'name' => 'Mphatso Chirwa', 'email' => 'mphatso@example.test',
            'amount' => 150000, 'currency' => 'MWK', 'status' => 'pending', 'created_at' => now(), 'updated_at' => now(),
        ]);

        return $reference;
    }
}
