<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VehicleController;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'role:customer', 'verified', 'web'])->prefix('customer')
    ->name('customer.')
    ->controller(CustomerController::class)->group(function () {
        Route::get('dashboard', 'getDashboard')->name('customerDashboard');
        Route::get('find-vehicle', 'findVehicle')->name('findVehicle');
        Route::get('details-vehicle/{vehicle}', 'vehicleDetails')->name('vehicleDetails');
        Route::get('checkout/{vehicle}', 'checkout')->name('checkout');
        Route::get('checkout-success', 'success')->name('checkout.success');
        Route::get('checkout-cancel', 'cancel')->name('checkout.cancel');
        Route::get('bookings', 'getAllBookings')->name('bookings');
        Route::post('check-availability', 'checkAvailability')->name('checkAvailability');
    });

Route::middleware(['auth', 'role:owner', 'verified', 'web'])->prefix('owner')
    ->name('owner.')->group(function () {

        Route::resource('vehicles', VehicleController::class);

        Route::get('dashboard', function () {
            return Inertia::render('Owner/ownerDashboard');
        })->name('ownerDashboard');
    });

Route::middleware(['auth', 'role:admin', 'verified', 'web'])->prefix('admin')
    ->name('admin.')->controller(AdminController::class)->group(function () {
        Route::get('dashboard', 'getDashboard')->name('adminDashboard');
        Route::get('vehicle-approval', 'index')->name('vehicleApproval');
        Route::get('vehicle-review/{id}', 'reviewVehiclePage')->name('reviewVehicle');
        Route::post('vehicle-approval/{vehicle}', 'updateApprovalStatus')->name('vehicleApprovals');
    });

Route::get('/test', function () {
    return view('emails.vehicle.rejected');
});
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
