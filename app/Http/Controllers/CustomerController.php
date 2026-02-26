<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Vehicle;
use App\Models\VehicleHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\checkout\Session;

class CustomerController extends Controller
{
    /**
     * validate trip start steps
     */
    public function validateStep(Request $request, $step)
    {
        $rules = match ($step) {
            'license' => [
                'license_number' => 'required|string|min:6|max:12',
            ],
            'vehicle_docs' => [
                'checklist' => 'required|array|min:4',
                'checklist.*' => 'string|in:insurance,v_book,v_license,v_smog',
            ],
            'odometer' => [
                'odometer' => 'required|numeric|min:0',
            ],
            default => [],
        };

        $messages = match ($step) {
            'vehicle_docs' => [
                'checklist.required' => 'You must verify all documents before proceeding.',
                'checklist.min'      => 'Please ensure you have checked all required documents with the owner.',
            ],
            'license' => [
                'license_number.required' => 'Please enter the Driver\'s License number as shown on the card.',
            ],
            default => [],
        };

        $request->validate($rules, $messages);

        return back();
    }

    public function startTrip(Request $request)
    {
        $messages = [
            'otp.required' => 'Please enter the 4-digit verification code to start your trip.',
            'otp.digits'   => 'The verification code must be exactly 4 numeric digits.',
        ];

        $request->validate([
            'license_number' => 'required',
            'odometer'       => 'required|numeric',
            'otp'            => 'required|digits:4',
            'booking_id'     => 'required|exists:bookings,id',
        ], $messages);

        $booking = Booking::where('id', $request->booking_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($booking->booking_status !== 'Booked') {
            return back()->withErrors([
                'otp' => 'This trip cannot be started at the moment.',
            ]);
        }

        if ($booking->start_otp !== $request->otp) {
            return back()->withErrors([
                'otp' => 'The verification code is incorrect. Please verify with the vehicle owner.',
            ]);
        }

        $booking->update([
            'booking_status' => 'OnTrip',
            'start_odometer' => $request->odometer,
            'license_number' => $request->license_number
        ]);

        VehicleHistory::create([
            'vehicle_id' => $booking->vehicle_id,
            'status' => 'On Trip',
        ]);

        return back()->with('success', 'Your Trip started!');
    }
    /**
     * Check the the availablitiy of vehicle
     */
    public function checkAvailability(Request $request)
    {
        $start = $request->start_date;
        $end = $request->end_date;

        $isBooked = Booking::where('vehicle_id', $request->vehicle_id)
            ->whereIn('booking_status', ['Booked', 'OnTrip'])
            ->where(function ($query) use ($start, $end) {
                $query->where(function ($q) use ($start, $end) {
                    $q->where('start_date', '<=', $end)
                        ->where('end_date', '>=', $start);
                });
            })
            ->exists();

        return back()->with('isAvailable', !$isBooked);
    }
    /**
     * Display All Bookings belong to customer
     */
    public function getAllBookings(Request $request)
    {
        $user = $request->user();

        $status = $request->query('status', 'OnTrip');

        $query = $user->bookings()
            ->with('vehicle')
            ->orderBy('start_date', 'desc');

        if ($status !== 'all') {
            $query->where('booking_status', $status);
        }

        $bookings = $query->get()->map(function ($booking) {
            $images = json_decode($booking->vehicle->image_urls, true);
            $frontImage = $images['front_image'] ?? 'https://picsum.photos/800/600?random=200';

            return [
                'id' => $booking->id,
                'vehicle' => $booking->vehicle->brand . ' ' . $booking->vehicle->model,
                'image' => $frontImage,
                'pickup' => $booking->pickup_location ?? "Test",
                'dropoff' => $booking->pickup_location ?? "Test",
                'status' => $booking->booking_status,
                'startDate' => $booking->start_date,
                'endDate' => $booking->end_date,
                'payment_status' => $booking->payment_status,
                'total_amount' => $booking->total_amount,
            ];
        });

        return Inertia::render('User/booking-list', [
            'bookings' => $bookings,
            'currentFilter' => $status
        ]);
    }
    /**
     * Display All Vehicles For Explore
     */
    public function findVehicle(Request $request)
    {
        $search = $request->input('search');
        $filters = $request->only(['type', 'transmission', 'fuel_type', 'seats', 'sort']);

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
            ->when($filters['seats'] ?? null, function ($query, $seats) {
                $query->where('seats', '>=', $seats);
            })
            ->when($filters['sort'] ?? null, function ($query, $sort) {
                if ($sort === 'price_asc') {
                    $query->orderBy('daily_rental_price', 'asc');
                }

                if ($sort === 'price_desc') {
                    $query->orderBy('daily_rental_price', 'desc');
                }
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
                'seats' => $vehicle->seats
            ];
        });

        return Inertia::render('User/vehicleSearch', [
            'vehicles' => $vehiclesTransformed,
            'pagination' => [
                'current_page' => $vehicles->currentPage(),
                'last_page' => $vehicles->lastPage(),
                'next_page_url' => $vehicles->nextPageUrl(),
            ],
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

    /**
     * Display vehicle  Details
     */
    public function vehicleDetails(Request $request, Vehicle  $vehicle)
    {

        $images = collect(json_decode($vehicle->image_urls, true))
            ->filter()
            ->values();

        $owner = $vehicle->owner;

        // todo: actual trip counts
        $ownerTrips = 135;
        $vehicleTrips = 120;

        return Inertia::render('User/vehicle-details', [
            'vehicle' => [
                'id' => $vehicle->id,
                'brand' => $vehicle->brand,
                'model' => $vehicle->model,
                'year' => $vehicle->year_of_manufacture,
                'type' => $vehicle->vehicle_type,
                'daily_rental_price' => $vehicle->daily_rental_price,
                'pickup_location' => $vehicle->pickup_location ?? "Colombo",
                'seats' => $vehicle->seats,
                'doors' => $vehicle->doors,
                'transmission' => $vehicle->transmission,
                'fuel_type' => $vehicle->fuel_type,
                'description' => $vehicle->description,
                'highlights' => $vehicle->highlights,
                'images' => $images,
                'vehicleTrips' => $vehicleTrips,
                'ownerName' => $owner->name,
                'ownerJoinDate' => $owner->created_at,
                'ownerTrips' => $ownerTrips,
                'ownerAvatar' => $owner->profile_image ?? 'https://i.pravatar.cc/150?img=',
            ],
        ]);
    }

    /**
     * payment page show for customer
     */
    public function checkout(Request $request, Vehicle  $vehicle)
    {
        Stripe::setApiKey(config('services.stripe.sk'));

        $days = $request->query('days');
        $start_time = $request->query('start_time');
        $start_date = $request->query('start_date');
        $end_date = $request->query('end_date');
        $end_time = $request->query('end_time');
        $pickupLocation = $request->query('pickupLocation');

        $baseRental   = $vehicle->daily_rental_price * $days; // e.g., 5000 * 3 = 15000
        $insuranceFee = $vehicle->bond_amount;               // e.g., 5000
        $vat          = ($baseRental + $insuranceFee) * 0.08; // 8% VAT
        $totalAmount  = $baseRental + $insuranceFee + $vat;  // Total in LKR

        $lineItems = [
            [
                'price_data' => [
                    'currency' => 'lkr',
                    'product_data' => [
                        'name' => $vehicle->brand . ' ' . $vehicle->model,
                        'description' => "Vehicle rental for {$days} day(s)",
                    ],
                    'unit_amount' => max(200, (int) ($baseRental * 100)),
                ],
                'quantity' => 1,
            ],
            [
                'price_data' => [
                    'currency' => 'lkr',
                    'product_data' => [
                        'name' => 'Insurance Fee',
                        'description' => 'Covers damage protection during rental',
                    ],
                    'unit_amount' => (int) ($insuranceFee * 100),
                ],
                'quantity' => 1,
            ],
            [
                'price_data' => [
                    'currency' => 'lkr',
                    'product_data' => [
                        'name' => 'VAT (8%)',
                        'description' => 'Local tax included in total price',
                    ],
                    'unit_amount' => (int) ($vat * 100),
                ],
                'quantity' => 1,
            ],
        ];

        $session = Session::create([
            'mode' => 'payment',
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'success_url' => route('customer.checkout.success', []) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('customer.checkout.cancel', [
                'vehicle_id' => $vehicle->id
            ]),
            'metadata' => [
                'user_id' =>  $request->user()->id,
                'vehicle_id' => $vehicle->id,
                'days' => $days,
                'total_amount' => $totalAmount,
                'start_time' => $start_time,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'end_time' => $end_time,
                'pickupLocation' => $pickupLocation,
            ],
        ]);

        return redirect()->away($session->url);
    }

    /**
     * After payment show success message 
     */
    public function success(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.sk'));

        $sessionId = $request->query('session_id');

        $session = Session::retrieve($sessionId);

        //  Prevent duplicate booking
        if (Booking::where('payment_reference', $session->id)->exists()) {
            return Inertia::render('User/payment-success');
        }

        $meta = $session->metadata;

        $booking = Booking::create([
            'user_id' => $meta->user_id,
            'vehicle_id' => $meta->vehicle_id,
            'start_date' => $meta->start_date,
            'end_date' => $meta->end_date,
            'start_time' => $meta->start_time,
            'pickup_location' => $meta->pickupLocation,
            'end_time' => $meta->end_time,
            'booking_date' => now()->toDateString(),
            'booking_time' => now()->toTimeString(),
            'total_amount' => $meta->total_amount,
            'booking_status' => 'Booked',
            'payment_status' => 'paid',
            'payment_reference' => $session->id,
        ]);

        VehicleHistory::create([
            'vehicle_id' => $meta->vehicle_id,
            'status' => 'Booked',
        ]);

        $booking->refresh()->load(['user', 'vehicle']);

        Mail::to($booking->user->email)->send(new \App\Mail\BookingConfirmation($booking));

        return Inertia::render('User/payment-success', [
            'message' => 'Your payment was successful!',
        ]);
    }

    /**
     * After payment show Erro message 
     */
    public function cancel(Request $request)
    {
        $vehicleId = $request->query('vehicle_id');

        $vehicle = Vehicle::where('id', $vehicleId)->first();

        return Inertia::render('User/payment-cancel', [
            'vehicle' => [
                'id' => $vehicle->id,
                'brand' => $vehicle->brand,
                'model' => $vehicle->model,
            ],
            'message' => 'Payment was cancelled or failed. No charges were made.',
        ]);
    }
}
