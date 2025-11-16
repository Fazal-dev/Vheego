<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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
        $messages = [
            'front_image.required' => 'The Front Image is required.',
            'back_image.required' => 'The Back Image is required.',
            'left_image.required' => 'The Left Image is required.',
            'right_image.required' => 'The Right Image is required.',
            'dashboard_image.required' => 'The Dashboard Image is required.',
            'seat_image.required' => 'The Seat Image is required.',
            'rc_front_image.required' => 'The RC Front Image is required.',
            'rc_back_image.required' => 'The RC Back Image is required.',
            'pickup_location.required' => 'The Pick Up Address is required.',
        ];

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
            'pickup_location' => 'required|string|max:100',
            'front_image' => 'required|file|mimes:jpg,jpeg,png,webp',
            'back_image' => 'required|file|mimes:jpg,jpeg,png,webp',
            'left_image' => 'required|file|mimes:jpg,jpeg,png,webp',
            'right_image' => 'required|file|mimes:jpg,jpeg,png,webp',
            'dashboard_image' => 'required|file|mimes:jpg,jpeg,png,webp',
            'seat_image' => 'required|file|mimes:jpg,jpeg,png,webp',
            'rc_front_image' => 'required|file|mimes:jpg,jpeg,png,webp',
            'rc_back_image' => 'required|file|mimes:jpg,jpeg,png,webp',
        ], $messages);

        $validated['owner_id'] = Auth::id();

        $imagePaths = [];

        $uniqueFolder = uniqid();

        $path = "";

        $imageFields = [
            'front_image',
            'back_image',
            'left_image',
            'right_image',
            'dashboard_image',
            'seat_image',
            'rc_front_image',
            'rc_back_image',
        ];

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $extension = $file->getClientOriginalExtension();
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $fileName = $originalName . '_' . time() . '.' . $extension;
                $path = $file->storeAs("vehicles/{$uniqueFolder}", $fileName, 'public');
                $imagePaths[$field] = asset(Storage::url($path));
            }
        }

        $validated['image_urls'] = json_encode($imagePaths);
        $validated['upload_folder'] = $uniqueFolder;

        Vehicle::create($validated);

        return to_route('owner.vehicles.index')->withSuccess('Vehicle created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $vehicle->old_images = json_decode($vehicle->image_urls, true) ?? [];

        return Inertia::render('Vehicle/vehicleShow', ['vehicle' => $vehicle]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $vehicle->old_images = json_decode($vehicle->image_urls, true) ?? [];

        return Inertia::render('Vehicle/vehicleEdit', ['vehicle' => $vehicle]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $messages = [
            'pickup_location.required' => 'The Pick Up Address is required.',
        ];
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
            'pickup_location' => 'required|string|max:100',
            'front_image' => 'nullable',
            'back_image' => 'nullable',
            'left_image' => 'nullable',
            'right_image' => 'nullable',
            'dashboard_image' => 'nullable',
            'seat_image' => 'nullable',
            'rc_front_image' => 'nullable',
            'rc_back_image' => 'nullable',
            'image_urls.*' => 'nullable',
        ], $messages);

        $validated['owner_id'] = Auth::id();

        $vehicle = Vehicle::findOrFail($id);

        $validated['owner_id'] = Auth::id();

        // Decode existing image URLs from DB
        $existingImages = json_decode($vehicle->image_urls ?? '{}', true) ?? [];

        // These are the same fields used in store()
        $imageFields = [
            'front_image',
            'back_image',
            'left_image',
            'right_image',
            'dashboard_image',
            'seat_image',
            'rc_front_image',
            'rc_back_image',
        ];

        $newImages = [];
        $folder = $vehicle->upload_folder;

        // Loop through image fields
        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {

                // delete old file if it exists
                if (!empty($existingImages[$field])) {
                    $oldPath = str_replace('/storage/', '', $existingImages[$field]);
                    Storage::disk('public')->delete($oldPath);
                }

                // save new file
                $file = $request->file($field);
                $extension = $file->getClientOriginalExtension();
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $fileName = $originalName . '_' . time() . '.' . $extension;

                $path = $file->storeAs("vehicles/{$folder}", $fileName, 'public');
                $newImages[$field] = asset(Storage::url($path));
            }
        }

        // merge; new images override old ones
        $mergedImages = array_merge($existingImages, $newImages);

        $validated['image_urls'] = json_encode($mergedImages);

        $vehicle->update($validated);

        return to_route('owner.vehicles.index')->withSuccess('Vehicle updated successfully.');
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
