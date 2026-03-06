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
        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');

            // which bookings are included in this payout
            $table->json('booking_ids');

            $table->decimal('gross_amount', 10, 2);   // total from bookings
            $table->decimal('commission', 10, 2);      // platform cut
            $table->decimal('net_amount', 10, 2);      // what owner receives

            $table->enum('status', [
                'pending',    // calculated, not sent yet
                'processing', // transfer initiated
                'paid',       // owner received money
                'failed',     // transfer failed
            ])->default('pending');

            $table->string('payment_reference')->nullable();
            $table->string('payment_method')->nullable();
            $table->timestamp('paid_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
};
