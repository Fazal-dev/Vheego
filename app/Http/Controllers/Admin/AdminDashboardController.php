<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $now   = Carbon::now();
        $som   = $now->copy()->startOfMonth(); // start of month
        $lastM = $now->copy()->subMonth()->startOfMonth();

        // ── Core stats ──────────────────────────────────────────────────────
        $totalRevenue = Booking::where('payment_status', 'paid')
            ->sum('total_amount');

        $totalBookings  = Booking::count();
        $activeVehicles = Vehicle::where('status', 'Active')->count();

        // Customers only (renters)
        $totalUsers = User::where('role', 'customer')->count();
        $totalOwners = User::where('role', 'owner')->count();

        // Vehicles submitted but not yet approved (Inactive = awaiting review)
        $pendingApprovals = Vehicle::where('status', 'Inactive')->count();

        // ── Month-over-month deltas ──────────────────────────────────────────
        $revenueThisMonth  = Booking::where('payment_status', 'paid')
            ->where('created_at', '>=', $som)
            ->sum('total_amount');

        $revenueLastMonth  = Booking::where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastM, $som])->sum('total_amount');

        $bookingsThisMonth = Booking::where('created_at', '>=', $som)->count();
        $bookingsLastMonth = Booking::whereBetween('created_at', [$lastM, $som])->count();

        $newUsersThisMonth = User::where('created_at', '>=', $som)
            ->whereIn('role', ['customer', 'owner'])->count();

        $newUsersLastMonth = User::whereBetween('created_at', [$lastM, $som])
            ->whereIn('role', ['customer', 'owner'])->count();

        // ── Monthly revenue + bookings (last 6 months) ──────────────────────
        $monthlyRevenue = collect(range(5, 0))->map(function ($i) use ($now) {
            $m = $now->copy()->subMonths($i);
            return [
                'month'    => $m->format('M'),
                'revenue'  => (float) Booking::where('payment_status', 'paid')
                    ->whereYear('created_at', $m->year)
                    ->whereMonth('created_at', $m->month)
                    ->sum('total_amount'),
                'bookings' => Booking::whereYear('created_at', $m->year)
                    ->whereMonth('created_at', $m->month)
                    ->count(),
            ];
        })->values();

        // ── Booking status breakdown ─────────────────────────────────────────
        $bookingStatusCounts = Booking::selectRaw('booking_status as status, count(*) as count')
            ->groupBy('booking_status')
            ->get();

        // ── Recent bookings (latest 8) ───────────────────────────────────────
        $recentBookings = Booking::with(['user:id,name', 'vehicle:id,brand,model'])
            ->latest()
            ->take(8)
            ->get()
            ->map(fn($b) => [
                'id'             => $b->id,
                'customer_name'  => $b->user?->name ?? '—',
                'vehicle'        => trim(($b->vehicle?->brand ?? '') . ' ' . ($b->vehicle?->model ?? '')),
                'total_amount'   => (float) $b->total_amount,
                'booking_status' => $b->booking_status,
                'payment_status' => $b->payment_status,
                'booking_date'   => $b->booking_date,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_revenue'        => (float) $totalRevenue,
                'total_bookings'       => $totalBookings,
                'active_vehicles'      => $activeVehicles,
                'total_users'          => $totalUsers,
                'total_owners'         => $totalOwners,
                'pending_approvals'    => $pendingApprovals,
                'revenue_this_month'   => (float) $revenueThisMonth,
                'revenue_last_month'   => (float) $revenueLastMonth,
                'bookings_this_month'  => $bookingsThisMonth,
                'bookings_last_month'  => $bookingsLastMonth,
                'new_users_this_month' => $newUsersThisMonth,
                'new_users_last_month' => $newUsersLastMonth,
            ],
            'monthly_revenue'       => $monthlyRevenue,
            'booking_status_counts' => $bookingStatusCounts,
            'recent_bookings'       => $recentBookings,
        ]);
    }
}
