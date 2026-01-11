<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\checkout\Session;

class CustomerController extends Controller
{
    /**
     * Display All Bookings belong to customer
     */
    public function getAllBookings(Request $request)
    {
        $user = $request->user();

        // Fetch all bookings for the user, including related vehicle info
        $bookings = $user->bookings()
            ->with('vehicle') // assuming you have a relation `vehicle` in Booking model
            ->orderBy('start_date', 'desc')
            ->get()
            ->map(function ($booking) {

                $images = $booking->vehicle->image_url;
                if (is_string($images)) {
                    $images = json_decode($images, true);
                }
                $frontImage = $images['front_image'] ?? 'https://picsum.photos/800/600?random=200';
                return [
                    'id' => $booking->id,
                    'vehicle' => $booking->vehicle->brand . ' ' . $booking->vehicle->model,
                    'image' => $frontImage ?? 'https://picsum.photos/800/600?random=200',
                    'pickup' => $booking->pickup_location ?? "Test",
                    'dropoff' => $booking->pickup_location ?? "Test",
                    'status' => $booking->booking_status,
                    'startDate' => $booking->start_date,
                    'endDate' => $booking->end_date,
                ];
            });

        // dd($bookings);
        return Inertia::render('User/booking-list', [
            'bookings' => $bookings
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
                'location' => $vehicle->location ?? "Colombo",
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

        Booking::create([
            'user_id' => $meta->user_id,
            'vehicle_id' => $meta->vehicle_id,
            'start_date' => $meta->start_date,
            'end_date' => $meta->end_date,
            'start_time' => $meta->start_time,
            'end_time' => $meta->end_time,
            'booking_date' => now()->toDateString(),
            'booking_time' => now()->toTimeString(),
            'total_amount' => $meta->total_amount,
            'booking_status' => 'Booked',
            'payment_status' => 'paid',
            'payment_reference' => $session->id,
        ]);

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
