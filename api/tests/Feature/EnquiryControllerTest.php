<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class EnquiryControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_creates_an_enquiry_and_returns_201_for_a_valid_payload(): void
    {
        $payload = [
            'name' => 'Grace Banda',
            'email' => 'grace@example.test',
            'phone' => '+265991234567',
            'company_name' => 'Banda Traders',
            'service' => 'branding',
            'message' => 'We need a corporate identity for a new business.',
        ];

        $response = $this->postJson('/api/v1/enquiries', $payload);

        $response
            ->assertCreated()
            ->assertJsonPath('message', 'Thanks — your enquiry has been received.')
            ->assertJsonStructure(['data' => ['id']]);

        $this->assertDatabaseHas('enquiries', [
            'email' => 'grace@example.test',
            'service' => 'branding',
            'status' => 'new',
            'source' => 'website',
        ]);
    }

    public function test_returns_422_when_required_enquiry_fields_are_missing(): void
    {
        $response = $this->postJson('/api/v1/enquiries', []);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'service', 'message']);
    }
}
