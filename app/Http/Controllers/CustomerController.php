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
        $vehicles = Vehicle::where('status', 'Available')->orderByDesc('id')->get();

        return Inertia::render('User/vehicleSearch', [
            'vehicles' => $vehicles,
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
