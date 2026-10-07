<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePackagePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'package' => ['required', Rule::in(array_keys(config('services.paychangu.packages')))],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:filter', 'max:254'],
        ];
    }
}
