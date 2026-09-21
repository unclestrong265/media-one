<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'project_id' => null,
            'reference' => 'INV-'.fake()->unique()->numerify('######'),
            'status' => 'draft',
            'currency' => 'MWK',
            'total' => fake()->randomFloat(2, 100000, 5000000),
            'due_at' => now()->addDays(30),
            'paid_at' => null,
        ];
    }
}
