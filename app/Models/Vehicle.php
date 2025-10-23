<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    /** @use HasFactory<\Database\Factories\VehicleFactory> */
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'model',
        'brand',
        'transmission',
        'fuel_type',
        'license_plate',
        'color',
        'doors',
        'seats',
        'vehicle_type',
        'year_of_manufacture',
        'registration_date',
        'registration_expiry_date',
        'daily_rental_price',
        'weekly_rental_price',
        'monthly_rental_price',
        'engine_capacity',
        'engine_number',
        'image_urls',
        'bond_amount'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
