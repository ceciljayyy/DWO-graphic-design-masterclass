<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Support\RegistrationReference;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RegistrationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Register', [
            'masterclass' => config('masterclass'),
            'experienceLevels' => ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
            'schedules' => [
                ['value' => 'WEEKDAYS', 'label' => 'Weekdays (Monday – Friday)'],
                ['value' => 'WEEKENDS', 'label' => 'Weekends (Saturday & Sunday)'],
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:191', 'regex:/^[A-Za-z][A-Za-z\'\-]*(?:\s+[A-Za-z][A-Za-z\'\-]*)+$/'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'whatsapp' => ['required', 'string', 'max:30'],
            'location' => ['required', 'string', 'max:191'],
            'experience_level' => ['required', 'in:BEGINNER,INTERMEDIATE,ADVANCED'],
            'schedule' => ['required', 'in:WEEKDAYS,WEEKENDS'],
            'marketing_source' => ['nullable', 'in:INSTAGRAM,TIKTOK,WHATSAPP,FACEBOOK,GOOGLE,DIRECT,OTHER'],
            'utm_source' => ['nullable', 'string', 'max:120'],
            'utm_medium' => ['nullable', 'string', 'max:120'],
            'utm_campaign' => ['nullable', 'string', 'max:191'],
        ]);

        $email = RegistrationReference::normalizeEmail($data['email']);
        $existing = Registration::query()->where('email', $email)->first();

        if ($existing?->isPaid()) {
            return back()->withErrors([
                'email' => 'This email is already registered and paid.',
            ]);
        }

        $registration = DB::transaction(function () use ($data, $email, $existing) {
            $payload = [
                'full_name' => trim($data['full_name']),
                'email' => $email,
                'phone' => $data['phone'] ?: null,
                'whatsapp' => $data['whatsapp'],
                'location' => $data['location'],
                'experience_level' => $data['experience_level'],
                'schedule' => $data['schedule'],
                'amount' => config('masterclass.fee.amount'),
                'marketing_source' => $data['marketing_source'] ?? null,
                'utm_source' => $data['utm_source'] ?? null,
                'utm_medium' => $data['utm_medium'] ?? null,
                'utm_campaign' => $data['utm_campaign'] ?? null,
            ];

            if ($existing) {
                if (in_array($existing->payment_status, ['FAILED', 'PAYMENT_REJECTED'], true)) {
                    $payload['payment_status'] = 'PENDING';
                }
                $existing->update($payload);

                return $existing->fresh();
            }

            return Registration::query()->create([
                ...$payload,
                'registration_reference' => RegistrationReference::generate(),
                'payment_access_token' => RegistrationReference::paymentToken(),
                'payment_status' => 'PENDING',
            ]);
        });

        return redirect()->route('payment.success', [
            'token' => $registration->payment_access_token,
        ]);
    }
}
