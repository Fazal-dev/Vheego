<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OwnerBankDetailsController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        return Inertia::render('Owner/BankDetails', [
            'bankDetails' => $user->bank_details,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'bank_name'           => 'required|string|max:100',
            'account_holder_name' => 'required|string|max:100',
            'account_number'      => 'required|string|min:6|max:50',
            'routing_number'      => 'nullable|string|max:50',
            'account_type'        => 'required|in:savings,current,checking',
        ]);

        Auth::user()->update(['bank_details' => $validated]);

        return back()->with('success', 'Bank details saved successfully.');
    }
}
