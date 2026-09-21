<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEnquiryRequest;
use App\Models\Enquiry;
use Illuminate\Http\JsonResponse;

class EnquiryController extends Controller
{
    public function store(StoreEnquiryRequest $request): JsonResponse
    {
        $enquiry = Enquiry::create($request->safe()->only([
            'name', 'email', 'phone', 'company_name', 'service', 'message',
        ]));

        return response()->json([
            'message' => 'Thanks — your enquiry has been received.',
            'data' => ['id' => $enquiry->id],
        ], 201);
    }
}
