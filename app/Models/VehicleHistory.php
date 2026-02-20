<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleHistory extends Model
{
    /** @use HasFactory<\Database\Factories\VehicleHistoryFactory> */
    use HasFactory;

    protected $fillable = ['vehicle_id', 'status'];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
