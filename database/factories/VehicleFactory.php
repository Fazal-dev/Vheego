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
        $vehicleTypes = ['Car', 'Van', 'SUV', 'Motorbike', 'ThreeWheeler'];
        $status = ['Active', 'Inactive'];
        $current_status = ['Available', 'Unavailable'];
        $pickUpLocation = ['Colombo', 'Kandy', 'Kurunegala', 'Jaffna'];

        return [
            'owner_id' => 2,
            'model' => $this->faker->word(),
            'brand' => $this->faker->randomElement($brands),
            'transmission' => $this->faker->randomElement($transmissions),
            'fuel_type' => $this->faker->randomElement($fuelTypes),
            'license_plate' => strtoupper($this->faker->bothify('??-####')),
            'color' => $this->faker->safeColorName(),
            'doors' => $this->faker->numberBetween(2, 5),
            'seats' => $this->faker->numberBetween(2, 8),
            'vehicle_type' => $this->faker->randomElement($vehicleTypes),
            'status' => $this->faker->randomElement($status),
            'current_status' => $this->faker->randomElement($current_status),
            'year_of_manufacture' => $this->faker->year(),
            'registration_date' => $this->faker->dateTimeBetween('-5 years', 'now'),
            'registration_expiry_date' => $this->faker->dateTimeBetween('now', '+2 years'),
            'daily_rental_price' => $this->faker->randomFloat(2, 50, 500),
            'weekly_rental_price' => $this->faker->randomFloat(2, 300, 2500),
            'monthly_rental_price' => $this->faker->randomFloat(2, 1000, 9000),
            'bond_amount' => $this->faker->randomFloat(2, 1000, 9000),
            'engine_capacity' => $this->faker->numberBetween(800, 4000),
            'engine_number' => strtoupper($this->faker->bothify('ENG#######')),
            'pickup_location' => $this->faker->randomElement($pickUpLocation),
            'image_urls' => json_encode([
                'front_image' => 'https://picsum.photos/800/600?random=' . rand(1, 1000),
                'back_image' => 'https://picsum.photos/800/600?random=' . rand(1001, 2000),
                'left_image' => 'https://picsum.photos/800/600?random=' . rand(2001, 3000),
                'right_image' => 'https://picsum.photos/800/600?random=' . rand(3001, 4000),
                'dashboard_image' => 'https://picsum.photos/800/600?random=' . rand(4001, 5000),
                'seat_image' => 'https://picsum.photos/800/600?random=' . rand(5001, 6000),
                'rc_front_image' => 'https://picsum.photos/800/600?random=' . rand(6001, 7000),
                'rc_back_image' => 'https://picsum.photos/800/600?random=' . rand(7001, 8000),
            ]),
            'description' => 'Well-maintained vehicle, perfect for city and long trips. Clean interior, smooth drive, and excellent fuel efficiency.',
            'highlights' => 'Fuel-efficient, Smooth drive',
        ];
    }
}
