<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OwnerController extends Controller
{
    /**
     * Display Owner Dashbord
     */
    public function index(Request $request)
    {
        return Inertia::render('Owner/ownerDashboard');
    }
}
