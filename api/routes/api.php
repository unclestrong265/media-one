<?php

use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\PackagePaymentController;
use Illuminate\Support\Facades\Route;

Route::post('v1/enquiries', [EnquiryController::class, 'store'])->middleware('throttle:enquiries');

Route::post('v1/package-payments', [PackagePaymentController::class, 'store'])->middleware('throttle:5,1');
Route::post('v1/package-payments/verify', [PackagePaymentController::class, 'verify'])->middleware('throttle:30,1');
Route::match(['get', 'post'], 'v1/package-payments/return', [PackagePaymentController::class, 'paymentReturn'])
    ->name('package-payments.return')->middleware('throttle:30,1');

Route::post('v1/package-payments/webhook', [PackagePaymentController::class, 'webhook'])->middleware('throttle:120,1');

Route::match(['get', 'post'], 'v1/package-payments/callback', [PackagePaymentController::class, 'paymentCallback'])
    ->name('package-payments.callback')->middleware('throttle:30,1');
