<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display Admin Dashbord
     */
    public function getDashboard(Request $request)
    {
        return Inertia::render('Admin/adminDashboard');
    }
    /**
     * Display Approval vehicles list
     */
    public function index(Request $request)
    {

        $vehicles = Vehicle::where('status', 'Inactive')->orderByDesc('id')->get();

        return Inertia::render('Admin/VehicleApproval/index', [
            'vehicles' => $vehicles,
        ]);
    }
}
