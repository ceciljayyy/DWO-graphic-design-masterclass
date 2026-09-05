<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\Admin\RegistrationAnalytics;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'range' => ['nullable', 'string', 'in:6h,12h,24h,48h,7d,14d,30d'],
        ]);

        return response()->json(
            RegistrationAnalytics::forRange($validated['range'] ?? null)
        );
    }
}
