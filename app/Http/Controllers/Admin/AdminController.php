<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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

    /**
     * Display Review vehicles Details
     */
    public function reviewVehiclePage(Request $request, $id)
    {

        $vehicle = Vehicle::with('owner')->findOrFail($id);

        $vehicle->image_urls = json_decode($vehicle->image_urls);
        $owner = $vehicle->owner;
        return Inertia::render('Admin/VehicleApproval/reviewVehicle', [
            'vehicle' => $vehicle,
            'owner' => $owner,
        ]);
    }
    /**
     * Admin review vehicles Details and approve/reject
     */
    public function updateApprovalStatus(Request $request, Vehicle  $vehicle)
    {

        $request->validate([
            'approval_status' => 'required|in:Approved,Rejected',
        ]);

        $status = $request->approval_status;
        $owner = $vehicle->owner;
        if ($status === "Approved") {
            $vehicle->approval_status = "Approved";
            $vehicle->status = "Active";
            Mail::to($owner->email)->send(new \App\Mail\VehicleApproved($vehicle));
        }

        if ($status === "Rejected") {
            $vehicle->approval_status = "Rejected";
            $vehicle->status = "Inactive";
            Mail::to($owner->email)->send(new \App\Mail\VehicleRejected($vehicle));
        }

        // $vehicle->save();

        return to_route('admin.vehicleApproval')->withSuccess("Vehicle has been $status successfully.");
    }
}
