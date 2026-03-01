<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * validate trip start steps
     */
    public function validateStep(Request $request, $step)
    {
        $rules = match ($step) {
            'verify_renter' => [],
            'inspection' => [
                'checklist' => 'required|array|min:3',
                'checklist.*' => 'string|in:exterior,interior,emergency',
            ],
            default => [],
        };

        $messages = match ($step) {
            'inspection' => [
                'checklist.required' => 'You must inspect the vehicle before proceeding.',
                'checklist.min' => 'Please ensure all inspection items are checked.',
            ],
            default => [],
        };

        $request->validate($rules, $messages);
        if ($step == 'inspection') {
            $booking = Booking::findOrFail($request->booking_id);

            $newOtp = rand(1000, 9999);

            $booking->update([
                'start_otp' => $newOtp,
            ]);

            $booking->refresh();
            return back()->with('otp', $newOtp);
        }

        return back();
    }

    /**
     * Display a listing of bookings for the owner's vehicles.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $status = $request->query('status', 'OnTrip');

        $query = Booking::whereHas('vehicle', function ($q) use ($user) {
            $q->where('owner_id', $user->id);
        })
            ->with(['vehicle', 'user'])
            ->orderBy('created_at', 'desc');

        if ($status !== 'all') {
            $query->where('booking_status', $status);
        }

        $bookings = $query->get()->map(function ($booking) {
            $images = json_decode($booking->vehicle->image_urls, true);
            $frontImage = $images['front_image'] ?? 'https://picsum.photos/800/600?random=200';

            return [
                'id' => $booking->id,
                'renter_image' => $booking->user->profile_image ?? '/default-avatar.png',
                'start_otp' => $booking->start_otp,
                'vehicle_odometer' => $booking->vehicle->current_odometer ?? 0,
                'vehicle' => "{$booking->vehicle->brand} {$booking->vehicle->model}",
                'image' => $frontImage,
                'renter_name' => $booking->user->name,
                'status' => $booking->booking_status,
                'startDate' => $booking->start_date,
                'endDate' => $booking->end_date,
                'pickup' => $booking->pickup_location ?? "Test",
                'dropoff' => $booking->pickup_location ?? "Test",
                'payment_status' => $booking->payment_status,
                'total_amount' => $booking->total_amount,
            ];
        });



        return Inertia::render('Owner/booking-owner-list', [
            'bookings' => $bookings,
            'currentFilter' => $status
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
