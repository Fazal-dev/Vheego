<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Redis;
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
    });


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
