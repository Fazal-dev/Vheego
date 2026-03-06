<?php

namespace Database\Factories;

use App\Models\Payout;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payout>
 */
class PayoutFactory extends Factory
{

    protected $model = Payout::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gross      = $this->faker->randomFloat(2, 5000, 50000);
        $commission = round($gross * 0.15, 2);
        $net        = round($gross - $commission, 2);

        $status = $this->faker->randomElement(['pending', 'processing', 'paid', 'failed']);

        return [
            'owner_id'          => User::factory(),
            'booking_ids'       => json_encode(
                $this->faker->randomElements(
                    range(1, 50),
                    rand(2, 6)
                )
            ),
            'gross_amount'      => $gross,
            'commission'        => $commission,
            'net_amount'        => $net,
            'status'            => $status,
            'payment_reference' => $status === 'paid'
                ? 'PAY-' . strtoupper($this->faker->bothify('??####??'))
                : null,
            'payment_method'    => $this->faker->randomElement([
                'bank_transfer',
                'paypal',
                null
            ]),
            'paid_at'           => $status === 'paid' ? $this->faker->dateTimeBetween('-3 months', 'now') : null,
        ];
    }

    // inside PayoutFactory — add these state methods
    public function paid(): static
    {
        return $this->state(fn() => [
            'status'            => 'paid',
            'payment_reference' => 'PAY-' . strtoupper($this->faker->bothify('??####??')),
            'paid_at'           => $this->faker->dateTimeBetween('-3 months', 'now'),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn() => [
            'status'            => 'pending',
            'payment_reference' => null,
            'paid_at'           => null,
        ]);
    }
}
