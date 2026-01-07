<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'vehicle_id',
        'total_amount',
        'booking_status',
        'start_date',
        'start_time',
        'booking_date',
        'booking_time',
        'end_date',
        'end_time',
        'payment_status',
        'payment_reference',
    ];

    // A booking belongs to a renter
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A booking belongs to a vehicle
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
