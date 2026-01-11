<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get random user and vehicle IDs
        $userId = User::inRandomOrder()->first()->id ?? 1;
        $vehicleId = Vehicle::inRandomOrder()->first()->id ?? 1;

        $startDate = $this->faker->dateTimeBetween('now', '+1 month');
        $endDate = (clone $startDate)->modify('+' . rand(1, 7) . ' days');

        $totalAmount = rand(50, 500) * ($endDate->diff($startDate)->days + 1);

        return [
            'user_id' => $userId,
            'vehicle_id' => $vehicleId,
            'booking_date' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'booking_time' => $this->faker->time(),
            'start_date' => $startDate->format('Y-m-d'),
            'start_time' => $this->faker->time(),
            'end_date' => $endDate->format('Y-m-d'),
            'end_time' => $this->faker->time(),
            'total_amount' => $totalAmount,
            'booking_status' => $this->faker->randomElement(['Pending', 'Booked', 'OnTrip', 'Cancelled', 'Completed']),
            'payment_status' => $this->faker->randomElement(['pending', 'paid', 'failed', 'refunded']),
            'payment_reference' => $this->faker->optional()->uuid(),
        ];
    }
}
