<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OwnerController extends Controller
{

    private function getEarningsChartData($vehicleIds): array
    {
        return Booking::whereIn('vehicle_id', $vehicleIds)
            ->where('booking_status', 'Completed')
            ->where('payment_status', 'paid')
            ->where('start_date', '>=', now()->subMonths(8)->startOfMonth())
            ->select(
                DB::raw("DATE_FORMAT(start_date, '%b') as month"),
                DB::raw("DATE_FORMAT(start_date, '%Y-%m') as month_sort"),
                DB::raw('SUM(total_amount) as earnings'),
                DB::raw('COUNT(*) as bookings')
            )
            ->groupBy('month_sort', 'month')
            ->orderBy('month_sort')
            ->get()
            ->map(fn($row) => [
                'month'    => $row->month,
                'earnings' => (float) $row->earnings,
                'bookings' => (int)   $row->bookings,
            ])
            ->toArray();
    }
    /**
     * Display Owner Dashbord
     */
    public function index(Request $request)
    {
        $user       = Auth::user();
        $vehicleIds = $user->vehicles()->pluck('id');

        $stats = [
            'active_count'    => Booking::whereIn('vehicle_id', $vehicleIds)
                ->where('booking_status', 'OnTrip')
                ->count(),

            'total_earnings'  => Booking::whereIn('vehicle_id', $vehicleIds)
                ->where('booking_status', 'Completed')
                ->sum('total_amount'),
            'occupancy_rate'  => $this->getOccupancyRate($vehicleIds),
            'pendingPayout'  =>  Booking::whereIn('vehicle_id', $vehicleIds)
                ->where('booking_status', 'Completed')
                ->where('payment_status', 'paid')
                ->where('owner_paid', false)
                ->sum('total_amount'),
        ];

        // payout history for this owner
        $payoutHistory = Payout::where('owner_id', $user->id)
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn($payout) => [
                'id'        => $payout->id,
                'date'      => $payout->created_at->format('M j, Y'),
                'amount'    => (float) $payout->net_amount,
                'status'    => $payout->status,
                'ref'       => $payout->payment_reference ?? 'PAY-' . str_pad($payout->id, 8, '0', STR_PAD_LEFT),
            ]);


        $vehicles = $user->vehicles()
            ->with([
                'bookings' => fn($q) => $q->where('booking_status', 'OnTrip')
                    ->with('user')
                    ->latest()
                    ->limit(1),
            ])
            ->get()
            ->map(function ($vehicle) {
                $activeBooking  = $vehicle->bookings->first();
                $totalDays      = now()->daysInMonth;

                // days rented this month
                $rentedDays = $vehicle->bookings()
                    ->where('booking_status', 'Completed')
                    ->whereMonth('start_date', now()->month)
                    ->selectRaw('SUM(DATEDIFF(end_date, start_date)) as days')
                    ->value('days') ?? 0;

                // earnings this month
                $earned = $vehicle->bookings()
                    ->where('booking_status', 'Completed')
                    ->where('payment_status', 'paid')
                    ->whereMonth('start_date', now()->month)
                    ->sum('total_amount');

                // image — take first from image_urls
                $images = json_decode($vehicle->image_urls, true);
                $image  = $images[0] ?? null;

                return [
                    'id'         => $vehicle->id,
                    'name'       => "{$vehicle->brand} {$vehicle->model} {$vehicle->year_of_manufacture}",
                    'plate'      => $vehicle->license_plate,
                    'status'     => match ($vehicle->current_status) {
                        'rented'      => 'rented',
                        'maintenance' => 'maintenance',
                        default       => 'available',
                    },
                    'occupancy'  => $totalDays > 0
                        ? round(($rentedDays / $totalDays) * 100)
                        : 0,
                    'earned'     => (float) $earned,
                    'rating'  => round($vehicle->reviews->avg('rating'), 1) ?? 0,
                    'reviews' => $vehicle->reviews->count(),
                    'image'      => $image,
                    'renter'     => $activeBooking?->user?->name
                        ? explode(' ', $activeBooking->user->name)[0] . ' ' .
                        strtoupper(substr(explode(' ', $activeBooking->user->name)[1] ?? '', 0, 1)) . '.'
                        : null,
                    'returnDate' => $activeBooking
                        ? \Carbon\Carbon::parse($activeBooking->end_date)->format('M d')
                        : null,
                ];
            })
            ->sortByDesc('earned')
            ->take(3)
            ->values();

        $upcoming_booking = Booking::whereIn('vehicle_id', $vehicleIds)
            ->with(['vehicle', 'user'])
            ->where('booking_status', 'Booked')
            ->orderBy('start_date', 'asc')
            ->limit(4)
            ->get()
            ->map(fn($booking) => [
                'id'      => $booking->id,
                'vehicle' => $booking->vehicle->name,
                'renter'  => $booking->user->name,
                'avatar'  => strtoupper(substr($booking->user->name, 0, 1)),
                'start'   => \Carbon\Carbon::parse($booking->start_date)->format('M d'),
                'end'     => \Carbon\Carbon::parse($booking->end_date)->format('M d'),
                'amount'  => (float) $booking->total_amount,
                'status'  => match ($booking->booking_status) {
                    'Booked'  => 'confirmed',
                    'Pending' => 'pending',
                    default   => 'pending',
                },
            ]);

        return Inertia::render('Owner/ownerDashboard', [
            'state' => $stats,
            'earnings_chart' => $this->getEarningsChartData($vehicleIds),
            'upcomingBookings' => $upcoming_booking,
            'vehicles' => $vehicles,

        ]);
    }
    private function getOccupancyRate($vehicleIds): float
    {
        $totalDays          = now()->daysInMonth;
        $totalVehicles      = $vehicleIds->count();
        $totalAvailableDays = $totalDays * $totalVehicles;

        if ($totalAvailableDays === 0) return 0;

        $rentedDays = Booking::whereIn('vehicle_id', $vehicleIds)
            ->whereIn('booking_status', ['Completed', 'OnTrip'])
            ->whereMonth('start_date', now()->month)
            ->whereYear('start_date', now()->year)
            ->selectRaw('SUM(DATEDIFF(
            LEAST(end_date, LAST_DAY(NOW())),
            GREATEST(start_date, DATE_FORMAT(NOW(), "%Y-%m-01"))
        ) + 1) as days')
            ->value('days') ?? 0;

        return round(($rentedDays / $totalAvailableDays) * 100, 1);
    }
}
