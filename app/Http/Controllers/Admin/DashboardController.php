<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $counts = [
            'total' => Registration::query()->count(),
            'pending' => Registration::query()->where('payment_status', 'PENDING')->count(),
            'submitted' => Registration::query()->where('payment_status', 'PAYMENT_SUBMITTED')->count(),
            'paid' => Registration::query()->where('payment_status', 'PAID')->count(),
            'rejected' => Registration::query()->where('payment_status', 'PAYMENT_REJECTED')->count(),
        ];

        $recent = Registration::query()
            ->latest()
            ->limit(8)
            ->get(['id', 'full_name', 'email', 'payment_status', 'registration_reference', 'created_at']);

        return Inertia::render('Admin/Dashboard', [
            'counts' => $counts,
            'recent' => $recent,
            'masterclass' => config('masterclass'),
        ]);
    }
}
