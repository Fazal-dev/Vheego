<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vehicle;
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
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => 'customer',
                'phone_no' => '07786868686',
            ]
        );

        $user = User::create([
            'name' => 'Fazal',
            'email' => 'fazal@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'owner',
            'phone_no' => '0778433880',
        ]);

        User::create([
            'name' => 'Platform Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'phone_no' => '077868656',
        ]);
        Vehicle::factory(20)->create();
    }
}
