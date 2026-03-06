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
        $status = $this->faker->randomElement(['Pending', 'Booked', 'OnTrip', 'Completed', 'Cancelled']);
        $now = now();

        // Logic to set dates based on Status
        switch ($status) {
            case 'OnTrip':
                // Started in the last 24 hours, ends in the next 2 days
                $startDate = $this->faker->dateTimeBetween('-1 day', 'now');
                $endDate = $this->faker->dateTimeBetween('now', '+3 days');
                break;

            case 'Completed':
                // Everything happened in the past
                $startDate = $this->faker->dateTimeBetween('-2 months', '-1 month');
                $endDate = $this->faker->dateTimeBetween($startDate, '-1 week');
                break;

            case 'Booked':
            case 'Pending':
                // Everything happens in the future
                $startDate = $this->faker->dateTimeBetween('+1 day', '+1 month');
                $endDate = (clone $startDate)->modify('+' . rand(1, 5) . ' days');
                break;

            case 'Cancelled':
            default:
                $startDate = $this->faker->dateTimeBetween('-1 month', '+1 month');
                $endDate = (clone $startDate)->modify('+2 days');
                break;
        }

        $otp = rand(1000, 9999);

        return [
            'user_id' => 1,
            'vehicle_id' => Vehicle::factory(),
            // 'booking_reference' => 'VGO-' . strtoupper($this->faker->bothify('??###')),
            'booking_date' => $this->faker->dateTimeBetween('-3 months', $startDate)->format('Y-m-d'),
            'booking_time' => $this->faker->time('H:i:s'),

            'start_date' => $startDate->format('Y-m-d'),
            'start_time' => $this->faker->time('H:i:s'),

            'end_date' => $endDate->format('Y-m-d'),
            'end_time' => $this->faker->time('H:i:s'),

            'total_amount' => rand(3000, 15000), // Realistic currency values
            'booking_status' => $status,
            'payment_status' => ($status === 'Completed' || $status === 'OnTrip') ? 'paid' : 'pending',

            'pickup_location' => $this->faker->randomElement(['Colombo Fort', 'Negombo Airport', 'Kandy City Center', 'Galle Face']),
            'start_otp' => $otp,
            'end_otp' => $otp,
            'start_odometer' => rand(15000, 20000),
            'end_odometer' => ($status === 'Completed') ? rand(20001, 21000) : null,
            'license_number' => $this->faker->bothify('WP-####'),
            'owner_paid' => ($status === 'Completed') ? $this->faker->boolean(50) : false
        ];
    }
}
