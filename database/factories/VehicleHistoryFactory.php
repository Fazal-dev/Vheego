<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VehicleHistory>
 */
class VehicleHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Sync with existing vehicles
            'vehicle_id' => Vehicle::inRandomOrder()->first()?->id ?? Vehicle::factory(),

            // Random status related to vehicle lifecycle
            'status' => $this->faker->randomElement([
                'Available',
                'On Trip',
                'Booked',
                'Under Repair',
                'Retired'
            ]),

            // Using a past date for history
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ];
    }
}
