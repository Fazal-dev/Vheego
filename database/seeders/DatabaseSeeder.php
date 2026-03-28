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
        $owner_2 = User::create([
            'name' => 'random owner',
            'email' => 'owner@gmail.com',
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
        $vehicles_2 = Vehicle::factory(20)->create(['owner_id' => $owner_2->id]);

        $vehicles_2->each(function ($vehicle) {
            Booking::factory(5)->create([
                'vehicle_id' => $vehicle->id,
                'user_id'    => 1,
            ]);
        });

        $vehicles->each(function ($vehicle) {
            Booking::factory(5)->create([
                'vehicle_id' => $vehicle->id,
                'user_id'    => 1,
            ]);
        });

        // Seed specific bookings to test cancellation feature for the customer (User 1)
        $testVehicles = $vehicles->random(3)->values(); // Get 3 random vehicles
        
        Booking::factory()->fullRefundable()->create([
            'vehicle_id' => $testVehicles[0]->id,
            'user_id'    => 1,
        ]);
        
        Booking::factory()->halfRefundable()->create([
            'vehicle_id' => $testVehicles[1]->id,
            'user_id'    => 1,
        ]);
        
        Booking::factory()->nonRefundable()->create([
            'vehicle_id' => $testVehicles[2]->id,
            'user_id'    => 1,
        ]);

        // paid payouts for payout history
        Payout::factory(10)->paid()->create(['owner_id' => $owner->id]);
        Payout::factory(10)->paid()->create(['owner_id' => $owner_2->id]);

        // one pending payout
        Payout::factory()->pending()->create(['owner_id' => $owner->id]);
        Payout::factory()->pending()->create(['owner_id' => $owner_2->id]);

        VehicleHistory::factory(100)->create();

        $vehicleIds = $vehicles->pluck('id');
        $vehicleIds_2 = $vehicles->pluck('id');

        Review::factory(50)->create([
            'vehicle_id'  => fn() => $vehicleIds->random(),
            'reviewer_id' => 1,
        ]);

        Review::factory(50)->create([
            'vehicle_id'  => fn() => $vehicleIds_2->random(),
            'reviewer_id' => 1,
        ]);
    }
}
