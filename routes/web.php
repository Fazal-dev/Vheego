<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPayoutController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\Owner\OwnerBankDetailsController;
use App\Http\Controllers\Owner\OwnerController;
use App\Http\Controllers\Owner\OwnerPayoutsController;
use App\Http\Controllers\Owner\OwnerRevenueController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
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

        Route::post('/trips/start/validate/{step}', 'validateStep')
            ->name('trips.validate-step');

        Route::post('/trips/start', 'startTrip')
            ->name('trips.start-trip');

        Route::post('/trips/end/validate/{step}', 'validateEndStep')->name('trips.end-trip-validate-step');

        Route::post('/trips/end', 'endTrip')
            ->name('trips.end-trip');
    });

Route::middleware(['auth', 'role:owner', 'verified', 'web'])->prefix('owner')
    ->name('owner.')->group(function () {

        Route::resource('vehicles', VehicleController::class);

        Route::controller(OwnerController::class)->group(function () {
            Route::get('dashboard', 'index')->name('ownerDashboard');
        });

        Route::get('/revenue', [OwnerRevenueController::class, 'index'])->name('revenue');

        Route::prefix('payouts')->name('payouts.')->controller(OwnerPayoutsController::class)->group(function () {
            Route::get('/', 'index')->name('index');
        });

        Route::controller(OwnerBankDetailsController::class)->prefix('bank-details')->name('bank-details.')->group(function () {
            Route::get('/',    'show')->name('show');
            Route::post('/',   'update')->name('update');
        });

        Route::prefix('bookings')->name('bookings.')
            ->controller(BookingController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::post('/trips/start/validate/{step}', 'validateStep')->name('validate-step');
                Route::post('/trips/end/validate/{step}', 'validateEndTrip')->name('end-trip-validate-step');
            });
    });

Route::middleware(['auth', 'role:admin', 'verified', 'web'])->prefix('admin')
    ->name('admin.')->controller(AdminController::class)->group(function () {
        Route::get('vehicle-approval', 'index')->name('vehicleApproval');
        Route::get('vehicle-review/{id}', 'reviewVehiclePage')->name('reviewVehicle');
        Route::post('vehicle-approval/{vehicle}', 'updateApprovalStatus')->name('vehicleApprovals');
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('adminDashboard');
        Route::prefix('payouts')->name('payouts.')->controller(AdminPayoutController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/{owner}', 'show')->name('show');
            Route::post('/bulk-trigger', 'bulkTrigger')->name('bulk-trigger');
            Route::post('/{owner}/trigger', 'trigger')->name('trigger');
            Route::patch('/{owner}/commission', 'updateCommission')->name('update-commission');
        });
    });

Route::get('/test', function () {
    return view('emails.booking.confirmation');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
