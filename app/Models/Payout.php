<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;
    protected $fillable = [
        'owner_id',
        'booking_ids',
        'gross_amount',
        'commission',
        'net_amount',
        'status',
        'payment_reference',
        'payment_method',
        'paid_at',
    ];

    protected $casts = [
        'booking_ids' => 'array',
        'paid_at'     => 'datetime',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
