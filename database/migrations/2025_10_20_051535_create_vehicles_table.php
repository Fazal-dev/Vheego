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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->string('model');
            $table->string('brand');
            $table->string('transmission');
            $table->string('fuel_type');
            $table->string('license_plate')->unique();
            $table->string('color');
            $table->integer('doors');
            $table->integer('seats');
            $table->string('vehicle_type');
            $table->year('year_of_manufacture');
            $table->date('registration_date');
            $table->date('registration_expiry_date');
            $table->decimal('daily_rental_price', 8, 2);
            $table->decimal('weekly_rental_price', 8, 2);
            $table->decimal('monthly_rental_price', 8, 2);
            $table->integer('engine_capacity');
            $table->string('engine_number');
            $table->text('image_urls');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
