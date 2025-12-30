<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display All Vehicles For Explore
     */
    public function findVehicle(Request $request)
    {
        $search = $request->input('search');
        $filters = $request->only(['type', 'transmission', 'fuel_type']);
        // SELECT `id`, `owner_id`, `model`, `brand`, `transmission`, `fuel_type`, `license_plate`, `color`, `doors`, `seats`, `vehicle_type`, `year_of_manufacture`, `registration_date`, `registration_expiry_date`, `daily_rental_price`, `weekly_rental_price`, `monthly_rental_price`, `bond_amount`, `engine_capacity`, `engine_number`, `pickup_location`, `image_urls`, `upload_folder`, `current_status`, `status`, `created_at`, `updated_at`, `approval_status` FROM `vehicles` WHERE 1
        $vehicles = Vehicle::where('current_status', 'available')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('brand', 'like', '%' . $search . '%')
                        ->orWhere('model', 'like', '%' . $search . '%');
                });
            })
            ->when($filters['type'] ?? null, function ($query, $type) {
                $query->where('vehicle_type', $type);
            })
            ->when($filters['transmission'] ?? null, function ($query, $transmission) {
                $query->where('transmission', $transmission);
            })
            ->when($filters['fuel_type'] ?? null, function ($query, $fuelType) {
                $query->where('fuel_type', $fuelType);
            })
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();

        $vehiclesTransformed = $vehicles->map(function ($vehicle) {
            $images = $vehicle->image_urls ? json_decode($vehicle->image_urls, true) : [];
            $frontImage = $images['front_image'] ?? null;

            return [
                'id' => $vehicle->id,
                'brand' => $vehicle->brand,
                'model' => $vehicle->model,
                'vehicle_type' => $vehicle->vehicle_type,
                'daily_price' => $vehicle->daily_rental_price,
                'year' => $vehicle->year_of_manufacture,
                'transmission' => $vehicle->transmission,
                'fuel_type' => $vehicle->fuel_type,
                'front_image_url' => $frontImage,
            ];
        });

        return Inertia::render('User/vehicleSearch', [
            'vehicles' => $vehiclesTransformed,
            'filters' => $filters,
            'search' => $search,
        ]);
    }
    /**
     * Display Custoemr Dashbord
     */
    public function getDashboard(Request $request)
    {
        return Inertia::render('User/customerDashboard');
    }
}
