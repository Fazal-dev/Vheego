<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Payout;
use App\Models\Review;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleHistory;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Customer',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => 'customer',
                'phone_no' => '07786868686',
                'profile_image' => 'https://picsum.photos/800/600?random=166',
            ]
        );

        $owner = User::create([
            'name' => 'owner',
            'email' => 'fazal@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'owner',
            'phone_no' => '0778433880',
            'profile_image' => 'https://picsum.photos/800/600?random=166',
        ]);

        User::create([
            'name' => 'Platform Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'phone_no' => '077868656',
            'profile_image' => 'https://picsum.photos/800/600?random=166',
        ]);

        $vehicles = Vehicle::factory(20)->create(['owner_id' => $owner->id]);

        $vehicles->each(function ($vehicle) {
            Booking::factory(5)->create([
                'vehicle_id' => $vehicle->id,
                'user_id'    => 1,
            ]);
        });

        // paid payouts for payout history
        Payout::factory(10)->paid()->create(['owner_id' => $owner->id]);

        // one pending payout
        Payout::factory()->pending()->create(['owner_id' => $owner->id]);

        VehicleHistory::factory(100)->create();

        $vehicleIds = $vehicles->pluck('id');
        Review::factory(50)->create([
            'vehicle_id'  => fn() => $vehicleIds->random(),
            'reviewer_id' => 1,
        ]);
    }
}
