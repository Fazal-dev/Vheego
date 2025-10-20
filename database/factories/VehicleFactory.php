<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brands = ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'Hyundai', 'Kia', 'Ford', 'BMW', 'Audi', 'Mercedes'];
        $transmissions = ['Automatic', 'Manual'];
        $fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
        $vehicleTypes = ['Car', 'Van', 'SUV', 'Truck', 'Motorbike'];

        return [
            'owner_id' => User::factory(),
            'model' => $this->faker->word(),
            'brand' => $this->faker->randomElement($brands),
            'transmission' => $this->faker->randomElement($transmissions),
            'fuel_type' => $this->faker->randomElement($fuelTypes),
            'license_plate' => strtoupper($this->faker->bothify('??-####')),
            'color' => $this->faker->safeColorName(),
            'doors' => $this->faker->numberBetween(2, 5),
            'seats' => $this->faker->numberBetween(2, 8),
            'vehicle_type' => $this->faker->randomElement($vehicleTypes),
            'year_of_manufacture' => $this->faker->year(),
            'registration_date' => $this->faker->dateTimeBetween('-5 years', 'now'),
            'registration_expiry_date' => $this->faker->dateTimeBetween('now', '+2 years'),
            'daily_rental_price' => $this->faker->randomFloat(2, 50, 500),
            'weekly_rental_price' => $this->faker->randomFloat(2, 300, 2500),
            'monthly_rental_price' => $this->faker->randomFloat(2, 1000, 9000),
            'engine_capacity' => $this->faker->numberBetween(800, 4000),
            'engine_number' => strtoupper($this->faker->bothify('ENG#######')),
            'image_urls' => json_encode([$this->faker->imageUrl(800, 600, 'car', true)]),
        ];
    }
}
