<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payout;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OwnerRevenueController extends Controller
{
    public function index()
    {
        $owner    = Auth::user();
        $ownerId  = $owner->id;

        $vehicleIds = $owner->vehicles()->pluck('id');

        // ── Commission summary ───────────────────────────────────────────────
        $totalGross      = Payout::where('owner_id', $ownerId)->sum('gross_amount');
        $totalCommission = Payout::where('owner_id', $ownerId)->sum('commission');
        $totalNet        = Payout::where('owner_id', $ownerId)->sum('net_amount');

        // Gross from bookings (paid only) — source of truth for revenue
        $totalBookingRevenue = Booking::whereIn('vehicle_id', $vehicleIds)
            ->where('payment_status', 'paid')
            ->sum('total_amount');

        // ── Monthly stats — last 12 months ───────────────────────────────────
        // Revenue = paid bookings, Commission = from payouts for that month
        $monthlyStats = collect(range(11, 0))->map(function ($i) use ($vehicleIds, $ownerId) {
            $m = now()->subMonths($i);

            $gross = (float) Booking::whereIn('vehicle_id', $vehicleIds)
                ->where('payment_status', 'paid')
                ->whereYear('created_at', $m->year)
                ->whereMonth('created_at', $m->month)
                ->sum('total_amount');

            $commission = (float) Payout::where('owner_id', $ownerId)
                ->whereYear('created_at', $m->year)
                ->whereMonth('created_at', $m->month)
                ->sum('commission');

            $bookings = Booking::whereIn('vehicle_id', $vehicleIds)
                ->whereYear('created_at', $m->year)
                ->whereMonth('created_at', $m->month)
                ->count();

            return [
                'month'      => $m->format('M y'),
                'gross'      => $gross,
                'commission' => $commission,
                'net'        => round($gross - $commission, 2),
                'bookings'   => $bookings,
            ];
        })->values();

        // ── Per-vehicle revenue — all time ────────────────────────────────────
        $vehicleStats = $owner->vehicles()
            ->get()
            ->map(function ($v) {
                $gross = (float) $v->bookings()
                    ->where('payment_status', 'paid')
                    ->sum('total_amount');

                $totalBookings     = $v->bookings()->count();
                $completedBookings = $v->bookings()
                    ->where('booking_status', 'Completed')
                    ->count();

                return [
                    'id'             => $v->id,
                    'name'           => $v->brand . ' ' . $v->model,
                    'vehicle_type'   => $v->vehicle_type,
                    'license_plate'  => $v->license_plate,
                    'status'         => $v->status,
                    'gross_revenue'  => $gross,
                    'net_revenue'    => round($gross * (1 - ($v->owner->commission_rate ?? 10) / 100), 2),
                    'total_bookings' => $totalBookings,
                    'completed'      => $completedBookings,
                    'daily_rate'     => (float) $v->daily_rental_price,
                ];
            })
            ->sortByDesc('gross_revenue')
            ->values();

        return Inertia::render('Owner/Revenue', [
            'commission_summary' => [
                'total_gross'           => (float) $totalGross,
                'total_commission'      => (float) $totalCommission,
                'total_net'             => (float) $totalNet,
                'total_booking_revenue' => (float) $totalBookingRevenue,
                'commission_rate'       => (float) $owner->commission_rate,
            ],
            'monthly_stats'  => $monthlyStats,
            'vehicle_stats'  => $vehicleStats,
        ]);
    }
}
