<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\checkout\Session;

class CustomerController extends Controller
{
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
        $days = (int) $request->query('days', 1);

        $baseRental = $vehicle->daily_rental_price * $days;
        $insuranceFee = (int) $vehicle->bond_amount * 100;
        $vat = (int) (($baseRental + $insuranceFee) * 0.08);

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
                    'unit_amount' => $insuranceFee,
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
                    'unit_amount' => $vat,
                ],
                'quantity' => 1,
            ],
        ];

        $session = Session::create([
            'mode' => 'payment',
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'success_url' => route('customer.checkout.success', [
                "vehicle_id" => $vehicle->id
            ]),
            'cancel_url' => route('customer.checkout.cancel', [
                "vehicle_id" => $vehicle->id
            ]),
        ]);
        return redirect()->away($session->url);
    }

    /**
     * After payment show success message 
     */
    public function success()
    {
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
