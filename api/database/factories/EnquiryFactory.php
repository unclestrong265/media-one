<?php

namespace Database\Factories;

use App\Models\Enquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Enquiry>
 */
class EnquiryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->optional()->e164PhoneNumber(),
            'company_name' => fake()->optional()->company(),
            'service' => fake()->randomElement(['branding', 'digital-marketing', 'creative-design', 'printing', 'website', 'app', 'hosting', 'other']),
            'message' => fake()->paragraph(),
            'status' => 'new',
            'source' => 'website',
        ];
    }
}
