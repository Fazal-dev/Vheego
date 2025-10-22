<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vehicles = Vehicle::where('owner_id', Auth::id())->orderByDesc('id')->get();

        return Inertia::render('Vehicle/vehicleList', [
            'vehicles' => $vehicles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Vehicle/vehicleCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'model' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'transmission' => 'required|string|max:50',
            'fuel_type' => 'required|string|max:50',
            'license_plate' => 'required|string|max:50|unique:vehicles,license_plate',
            'color' => 'required|string|max:50',
            'doors' => 'required|integer|min:1|max:10',
            'seats' => 'required|integer|min:1|max:20',
            'vehicle_type' => 'required|string|max:50',
            'year_of_manufacture' => 'required|integer|min:1900|max:' . date('Y'),
            'registration_date' => 'required|date',
            'registration_expiry_date' => 'required|date|after:registration_date',
            'daily_rental_price' => 'required|numeric|min:0',
            'weekly_rental_price' => 'required|numeric|min:0',
            'monthly_rental_price' => 'required|numeric|min:0',
            'bond_amount' => 'required|numeric|min:0',
            'engine_capacity' => 'required|string',
            'engine_number' => 'required|string|max:100',
        ]);

        $validated['owner_id'] = Auth::id();
        $validated['image_urls'] = "";

        Vehicle::create($validated);

        return to_route('owner.vehicles.index')->withSuccess('Vehicle created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $vehicle = Vehicle::findOrFail($id);

        return Inertia::render('Vehicle/vehicleEdit', ['vehicle' => $vehicle]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'model' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'transmission' => 'required|string|max:50',
            'fuel_type' => 'required|string|max:50',
            'license_plate' => 'required|string|max:50|unique:vehicles,license_plate,' . $id,
            'color' => 'required|string|max:50',
            'doors' => 'required|integer|min:1|max:10',
            'seats' => 'required|integer|min:1|max:20',
            'vehicle_type' => 'required|string|max:50',
            'year_of_manufacture' => 'required|integer|min:1900|max:' . date('Y'),
            'registration_date' => 'required|date',
            'registration_expiry_date' => 'required|date|after:registration_date',
            'daily_rental_price' => 'required|numeric|min:0',
            'weekly_rental_price' => 'required|numeric|min:0',
            'monthly_rental_price' => 'required|numeric|min:0',
            'bond_amount' => 'required|numeric|min:0',
            'engine_capacity' => 'required|string',
            'engine_number' => 'required|string|max:100',
        ]);

        $validated['owner_id'] = Auth::id();
        $validated['image_urls'] = "";

        Vehicle::where('id', $id)->update($validated);

        return to_route('owner.vehicles.index')->withSuccess('Vehicle Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {

        $vehicle = Vehicle::findOrFail($id);

        if (Auth::id() !== $vehicle->owner_id) {
            return redirect()->back()->with('error', 'You are not authorized to delete this vehicle.');
        }

        $vehicle->delete();

        return to_route('owner.vehicles.index')->withSuccess('Vehicle deleted successfully.');
    }
}
