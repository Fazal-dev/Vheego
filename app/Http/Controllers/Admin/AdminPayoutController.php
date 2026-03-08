<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payout;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminPayoutController extends Controller
{
    /**
     * List all owners with their pending payout balances.
     */
    public function index()
    {
        $owners = User::where('role', 'owner')
            ->withCount('vehicles')
            ->with(['payouts' => fn($q) => $q->latest()->limit(1)])
            ->get()
            ->map(function ($owner) {
                $vehicleIds = $owner->vehicles()->pluck('id');

                $pendingBookings = Booking::whereIn('vehicle_id', $vehicleIds)
                    ->where('booking_status', 'Completed')
                    ->where('payment_status', 'paid')
                    ->where('owner_paid', false)
                    ->count();

                $grossPending = Booking::whereIn('vehicle_id', $vehicleIds)
                    ->where('booking_status', 'Completed')
                    ->where('payment_status', 'paid')
                    ->where('owner_paid', false)
                    ->sum('total_amount');

                $commission     = round($grossPending * ($owner->commission_rate / 100), 2);
                $netPending     = round($grossPending - $commission, 2);
                $lastPayout     = $owner->payouts->first();

                return [
                    'id'               => $owner->id,
                    'name'             => $owner->name,
                    'email'            => $owner->email,
                    'commission_rate'  => (float) $owner->commission_rate,
                    'vehicles_count'   => $owner->vehicles_count,
                    'pending_bookings' => $pendingBookings,
                    'gross_pending'    => (float) $grossPending,
                    'commission'       => (float) $commission,
                    'net_pending'      => (float) $netPending,
                    'has_bank_details' => !empty($owner->bank_details),
                    'last_payout_date' => $lastPayout?->paid_at?->format('M j, Y') ?? null,
                    'last_payout_amount' => $lastPayout ? (float) $lastPayout->net_amount : null,
                ];
            })
            ->sortByDesc('gross_pending')
            ->values();

        $summary = [
            'total_pending'       => $owners->sum('gross_pending'),
            'total_net_pending'   => $owners->sum('net_pending'),
            'owners_with_pending' => $owners->where('pending_bookings', '>', 0)->count(),
            'total_owners'        => $owners->count(),
        ];

        return Inertia::render('Admin/payout/index', [
            'owners'  => $owners,
            'summary' => $summary,
        ]);
    }

    /**
     * Show breakdown for a single owner: pending bookings + payout history.
     */
    public function show(User $owner)
    {
        $vehicleIds = $owner->vehicles()->pluck('id');

        $pendingBookings = Booking::whereIn('vehicle_id', $vehicleIds)
            ->where('booking_status', 'Completed')
            ->where('payment_status', 'paid')
            ->where('owner_paid', false)
            ->with('vehicle')
            ->orderBy('end_date', 'desc')
            ->get()
            ->map(fn($b) => [
                'id'          => $b->id,
                'vehicle'     => "{$b->vehicle->brand} {$b->vehicle->model} {$b->vehicle->year_of_manufacture}",
                'start_date'  => \Carbon\Carbon::parse($b->start_date)->format('M j, Y'),
                'end_date'    => \Carbon\Carbon::parse($b->end_date)->format('M j, Y'),
                'days'        => \Carbon\Carbon::parse($b->start_date)->diffInDays($b->end_date) ?: 1,
                'gross'       => (float) $b->total_amount,
                'commission'  => round($b->total_amount * ($owner->commission_rate / 100), 2),
                'net'         => round($b->total_amount - ($b->total_amount * ($owner->commission_rate / 100)), 2),
            ]);

        $grossTotal   = $pendingBookings->sum('gross');
        $commTotal    = $pendingBookings->sum('commission');
        $netTotal     = $pendingBookings->sum('net');

        $payoutHistory = Payout::where('owner_id', $owner->id)
            ->latest()
            ->get()
            ->map(fn($p) => [
                'id'        => $p->id,
                'date'      => $p->created_at->format('M j, Y'),
                'paid_at'   => $p->paid_at?->format('M j, Y H:i'),
                'gross'     => (float) $p->gross_amount,
                'commission' => (float) $p->commission,
                'net'       => (float) $p->net_amount,
                'status'    => $p->status,
                'reference' => $p->payment_reference ?? 'PAY-' . str_pad($p->id, 8, '0', STR_PAD_LEFT),
                'method'    => $p->payment_method,
                'bookings_count' => count(is_array($p->booking_ids) ? $p->booking_ids : json_decode($p->booking_ids ?? '[]', true)),
            ]);

        return Inertia::render('Admin/payout/Show', [
            'owner' => [
                'id'              => $owner->id,
                'name'            => $owner->name,
                'email'           => $owner->email,
                'commission_rate' => (float) $owner->commission_rate,
                'bank_details'    => $owner->bank_details,
                'vehicles_count'  => $owner->vehicles()->count(),
            ],
            'pendingBookings' => $pendingBookings,
            'summary' => [
                'gross'      => $grossTotal,
                'commission' => $commTotal,
                'net'        => $netTotal,
                'count'      => $pendingBookings->count(),
            ],
            'payoutHistory' => $payoutHistory,
        ]);
    }

    /**
     * Trigger payout for a single owner. Simulates a bank transfer.
     */
    public function trigger(User $owner)
    {
        $vehicleIds = $owner->vehicles()->pluck('id');

        $bookings = Booking::whereIn('vehicle_id', $vehicleIds)
            ->where('booking_status', 'Completed')
            ->where('payment_status', 'paid')
            ->where('owner_paid', false)
            ->get();

        if ($bookings->isEmpty()) {
            return back()->with('error', "No pending bookings for {$owner->name}.");
        }

        DB::transaction(function () use ($bookings, $owner) {
            $gross      = $bookings->sum('total_amount');
            $commission = round($gross * ($owner->commission_rate / 100), 2);
            $net        = round($gross - $commission, 2);
            $reference  = 'PAY-' . strtoupper(substr(md5(uniqid()), 0, 10)) . '-' . now()->format('YmdHis');

            Payout::create([
                'owner_id'          => $owner->id,
                'booking_ids'       => $bookings->pluck('id')->toArray(),
                'gross_amount'      => $gross,
                'commission'        => $commission,
                'net_amount'        => $net,
                'status'            => 'paid',
                'payment_method'    => 'bank_transfer',
                'payment_reference' => $reference,
                'paid_at'           => now(),
            ]);

            Booking::whereIn('id', $bookings->pluck('id'))->update(['owner_paid' => true]);
        });

        return back()->with('success', "Payout triggered successfully for {$owner->name}.");
    }

    /**
     * Bulk trigger payouts for ALL owners with pending balance.
     */
    public function bulkTrigger()
    {
        $owners = User::where('role', 'owner')->get();
        $processed = 0;

        foreach ($owners as $owner) {
            $vehicleIds = $owner->vehicles()->pluck('id');

            $bookings = Booking::whereIn('vehicle_id', $vehicleIds)
                ->where('booking_status', 'Completed')
                ->where('payment_status', 'paid')
                ->where('owner_paid', false)
                ->get();

            if ($bookings->isEmpty()) continue;

            DB::transaction(function () use ($bookings, $owner) {
                $gross      = $bookings->sum('total_amount');
                $commission = round($gross * ($owner->commission_rate / 100), 2);
                $net        = round($gross - $commission, 2);
                $reference  = 'PAY-' . strtoupper(substr(md5(uniqid()), 0, 10)) . '-' . now()->format('YmdHis');

                Payout::create([
                    'owner_id'          => $owner->id,
                    'booking_ids'       => $bookings->pluck('id')->toArray(),
                    'gross_amount'      => $gross,
                    'commission'        => $commission,
                    'net_amount'        => $net,
                    'status'            => 'paid',
                    'payment_method'    => 'bank_transfer',
                    'payment_reference' => $reference,
                    'paid_at'           => now(),
                ]);

                Booking::whereIn('id', $bookings->pluck('id'))->update(['owner_paid' => true]);
            });

            $processed++;
        }

        return back()->with('success', "Bulk payout completed. {$processed} owner(s) paid.");
    }

    /**
     * Update commission rate for an owner.
     */
    public function updateCommission(Request $request, User $owner)
    {

        $request->validate([
            'commission_rate' => 'required|numeric|min:0|max:50',
        ]);

        $owner->update(['commission_rate' => $request->commission_rate]);

        return back()->with('success', "Commission rate updated for {$owner->name}.");
    }
}
