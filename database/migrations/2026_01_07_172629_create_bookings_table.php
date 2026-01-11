<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');

            // Booking details
            $table->date('start_date');
            $table->date('booking_date');
            $table->time('booking_time');
            $table->date('end_date');
            $table->time('end_time');
            $table->time('start_time');

            // Pricing
            $table->decimal('total_amount', 10, 2);

            // Status fields
            $table->enum('booking_status', [
                'Pending',
                'Booked',
                'OnTrip',
                'Cancelled',
                'Completed'
            ])->default('Pending');

            $table->enum('payment_status', [
                'pending',
                'paid',
                'failed',
                'refunded'
            ])->default('pending');

            // Optional payment reference
            $table->string('payment_reference')->nullable();

            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
