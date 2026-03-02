<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Review;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehicle_id'  => Vehicle::inRandomOrder()->first()->id ?? Vehicle::factory(),
            'booking_id'  => Booking::inRandomOrder()->first()->id ?? Booking::factory(),
            'reviewer_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'rating' => $this->faker->randomElement([1, 2, 3, 4, 4, 5, 5, 5, 5, 5]),
            'comment'     => $this->faker->paragraph(2),
        ];
    }
}
