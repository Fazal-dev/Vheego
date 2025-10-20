<?php

use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'role:customer', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'role:owner', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'role:owner', 'verified', 'web'])->prefix('owner')
    ->name('owner.')->group(function () {

        Route::resource('vehicles', VehicleController::class);

        Route::get('dashboard', function () {
            return Inertia::render('Owner/ownerDashboard');
        })->name('ownerDashboard');
    });


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
