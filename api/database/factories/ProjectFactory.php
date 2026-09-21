<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
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
            'quote_id' => null,
            'name' => fake()->catchPhrase(),
            'status' => 'discovery',
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ];
    }
}
