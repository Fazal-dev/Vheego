<?php

namespace App\Events;

use App\Models\Booking;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class NewBookingReceived implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Booking $booking) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            // Only the vehicle owner gets this
            new PrivateChannel('owner.' . $this->booking->vehicle->owner_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'booking_id' => $this->booking->id,
            'vehicle' => $this->booking->vehicle->brand . ' ' . $this->booking->vehicle->model,
            'customer' => $this->booking->user->name,
            'start_date' => $this->booking->start_date,
            'end_date' => $this->booking->end_date,
            'total_amount' => $this->booking->total_amount,
        ];
    }

    // Don't queue — broadcast immediately
    public function broadcastQueue(): string
    {
        return 'broadcasts';
    }
}
