<?php

use App\Http\Controllers\Api\EnquiryController;
use Illuminate\Support\Facades\Route;

Route::post('v1/enquiries', [EnquiryController::class, 'store'])->middleware('throttle:enquiries');
