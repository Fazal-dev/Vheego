<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payout;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OwnerPayoutsController extends Controller
{
    public function index(Request $request)
    {
        $ownerId = Auth::id();

        // ── Filters ──────────────────────────────────────────────────────────
        $status    = $request->input('status');          // paid|pending|processing|failed|null
        $dateFrom  = $request->input('date_from');
        $dateTo    = $request->input('date_to');

        // ── Summary stats (always unfiltered) ───────────────────────────────
        $totalPaid = Payout::where('owner_id', $ownerId)
            ->where('status', 'paid')
            ->sum('net_amount');

        $totalPending = Payout::where('owner_id', $ownerId)
            ->whereIn('status', ['pending', 'processing'])
            ->sum('net_amount');

        $totalFailed = Payout::where('owner_id', $ownerId)
            ->where('status', 'failed')
            ->sum('net_amount');

        $payoutCount = Payout::where('owner_id', $ownerId)->count();

        // ── Payouts query (with filters) ─────────────────────────────────────
        $query = Payout::where('owner_id', $ownerId)->latest();

        if ($status && in_array($status, ['pending', 'processing', 'paid', 'failed'])) {
            $query->where('status', $status);
        } else {
            $query->where('status', 'pending');
        }

        if ($dateFrom) {
            $query->where('created_at', '>=', Carbon::parse($dateFrom)->startOfDay());
        }

        if ($dateTo) {
            $query->where('created_at', '<=', Carbon::parse($dateTo)->endOfDay());
        }

        $payouts = $query->paginate(10)->through(function ($p) {
            // Resolve the actual bookings inside this payout
            $bookingIds = is_array($p->booking_ids)
                ? $p->booking_ids
                : json_decode($p->booking_ids ?? '[]', true) ?? [];
            // $bookingIds = $p->booking_ids ?? [];
            $bookings   = [];

            if (!empty($bookingIds)) {
                $bookings = Booking::with('vehicle:id,brand,model')
                    ->whereIn('id', $bookingIds)
                    ->get()
                    ->map(fn($b) => [
                        'id'             => $b->id,
                        'vehicle'        => trim(($b->vehicle?->brand ?? '') . ' ' . ($b->vehicle?->model ?? '')),
                        'start_date'     => $b->start_date,
                        'end_date'       => $b->end_date,
                        'total_amount'   => (float) $b->total_amount,
                        'booking_status' => $b->booking_status,
                    ])
                    ->toArray();
            }

            return [
                'id'                => $p->id,
                'gross_amount'      => (float) $p->gross_amount,
                'commission'        => (float) $p->commission,
                'net_amount'        => (float) $p->net_amount,
                'status'            => $p->status,
                'payment_method'    => $p->payment_method,
                'payment_reference' => $p->payment_reference,
                'paid_at'           => $p->paid_at?->format('Y-m-d'),
                'created_at'        => $p->created_at->format('Y-m-d'),
                'booking_count'     => count($bookingIds),
                'bookings'          => $bookings,
            ];
        });

        return Inertia::render('Owner/Payouts', [
            'summary' => [
                'total_paid'    => (float) $totalPaid,
                'total_pending' => (float) $totalPending,
                'total_failed'  => (float) $totalFailed,
                'payout_count'  => $payoutCount,
            ],
            'payouts' => $payouts,
            'filters' => [
                'status'    => $status,
                'date_from' => $dateFrom,
                'date_to'   => $dateTo,
            ],
        ]);
    }
}
