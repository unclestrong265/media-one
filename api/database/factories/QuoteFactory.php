<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Quote;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Quote>
 */
class QuoteFactory extends Factory
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
            'enquiry_id' => null,
            'reference' => 'Q-'.fake()->unique()->numerify('######'),
            'status' => 'draft',
            'currency' => 'MWK',
            'subtotal' => fake()->randomFloat(2, 100000, 5000000),
            'tax' => 0,
            'total' => fake()->randomFloat(2, 100000, 5000000),
            'valid_until' => now()->addDays(14),
        ];
    }
}
