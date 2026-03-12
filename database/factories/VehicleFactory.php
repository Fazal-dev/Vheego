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
            'bond_amount' => $this->faker->randomFloat(2, 1000, 9000),
            'engine_capacity' => $this->faker->numberBetween(800, 4000),
            'engine_number' => strtoupper($this->faker->bothify('ENG#######')),
            'pickup_location' => $this->faker->randomElement($pickUpLocation),
            'image_urls' => json_encode(
                $this->faker->randomElement([

                    // Set 1 — BMW sedan (blue)
                    [
                        'front_image'     => 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80&auto=format&fit=crop',
                        'back_image'      => 'https://images.unsplash.com/photo-1617814076668-8dfc6fe3b744?w=800&q=80&auto=format&fit=crop',
                        'left_image'      => 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&q=80&auto=format&fit=crop',
                        'right_image'     => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop',
                        'dashboard_image' => 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80&auto=format&fit=crop',
                        'seat_image'      => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
                        'rc_front_image'  => 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80&auto=format&fit=crop',
                        'rc_back_image'   => 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80&auto=format&fit=crop',
                    ],

                    // Set 2 — White SUV
                    [
                        'front_image'     => 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80&auto=format&fit=crop',
                        'back_image'      => 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80&auto=format&fit=crop',
                        'left_image'      => 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80&auto=format&fit=crop',
                        'right_image'     => 'https://images.unsplash.com/photo-1543796076-c8b86b16a21f?w=800&q=80&auto=format&fit=crop',
                        'dashboard_image' => 'https://images.unsplash.com/photo-1617814076668-8dfc6fe3b744?w=800&q=80&auto=format&fit=crop',
                        'seat_image'      => 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&auto=format&fit=crop',
                        'rc_front_image'  => 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80&auto=format&fit=crop',
                        'rc_back_image'   => 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80&auto=format&fit=crop',
                    ],

                    // Set 3 — Black Audi / sedan
                    [
                        'front_image'     => 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80&auto=format&fit=crop',
                        'back_image'      => 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80&auto=format&fit=crop',
                        'left_image'      => 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80&auto=format&fit=crop',
                        'right_image'     => 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=800&q=80&auto=format&fit=crop',
                        'dashboard_image' => 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80&auto=format&fit=crop',
                        'seat_image'      => 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80&auto=format&fit=crop',
                        'rc_front_image'  => 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80&auto=format&fit=crop',
                        'rc_back_image'   => 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80&auto=format&fit=crop',
                    ],

                    // Set 4 — Red sporty
                    [
                        'front_image'     => 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80&auto=format&fit=crop',
                        'back_image'      => 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80&auto=format&fit=crop',
                        'left_image'      => 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80&auto=format&fit=crop',
                        'right_image'     => 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80&auto=format&fit=crop',
                        'dashboard_image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
                        'seat_image'      => 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80&auto=format&fit=crop',
                        'rc_front_image'  => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop',
                        'rc_back_image'   => 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80&auto=format&fit=crop',
                    ],
                ])
            ),
            'description' => 'Well-maintained vehicle, perfect for city and long trips. Clean interior, smooth drive, and excellent fuel efficiency.',
            'highlights' => 'Fuel-efficient, Smooth drive',
        ];
    }
}
