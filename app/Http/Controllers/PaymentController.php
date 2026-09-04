<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function show(string $token): Response|RedirectResponse
    {
        $registration = $this->findByToken($token);

        if ($registration->payment_status === 'PAYMENT_SUBMITTED') {
            return redirect()->route('payment.submitted', ['token' => $token]);
        }

        if ($registration->isPaid()) {
            return Inertia::render('Payment/Paid', [
                'registration' => $this->publicRegistration($registration),
                'masterclass' => config('masterclass'),
            ]);
        }

        return Inertia::render('Payment/Instructions', [
            'registration' => $this->publicRegistration($registration),
            'masterclass' => config('masterclass'),
            'momo' => config('masterclass.momo'),
        ]);
    }

    public function createSubmit(string $token): Response|RedirectResponse
    {
        $registration = $this->findByToken($token);

        if (! $registration->canSubmitManualPayment()) {
            return redirect()->route('payment.show', ['token' => $token]);
        }

        return Inertia::render('Payment/Submit', [
            'registration' => $this->publicRegistration($registration),
            'masterclass' => config('masterclass'),
            'momo' => config('masterclass.momo'),
        ]);
    }

    public function storeSubmit(Request $request, string $token): RedirectResponse
    {
        $registration = $this->findByToken($token);

        if (! $registration->canSubmitManualPayment()) {
            return redirect()->route('payment.show', ['token' => $token]);
        }

        $data = $request->validate([
            'sender_name' => ['required', 'string', 'max:191'],
            'sender_phone' => ['required', 'string', 'max:30'],
            'transaction_reference' => ['nullable', 'string', 'max:120'],
            'payment_date' => ['required', 'date_format:Y-m-d'],
            'payment_time' => ['required', 'date_format:H:i'],
        ]);

        $paymentDateTime = now()->parse($data['payment_date'].' '.$data['payment_time']);
        $min = now()->subDays(90);
        $max = now()->addMinutes(15);

        if ($paymentDateTime->lt($min) || $paymentDateTime->gt($max)) {
            return back()->withErrors([
                'payment_date' => 'Payment date/time must be within the last 90 days and not far in the future.',
            ]);
        }

        DB::transaction(function () use ($registration, $data, $paymentDateTime) {
            $registration->manualPaymentSubmissions()
                ->where('is_active', true)
                ->update(['is_active' => false]);

            $registration->manualPaymentSubmissions()->create([
                'method' => 'MTN_MOBILE_MONEY',
                'amount' => $registration->amount,
                'currency' => config('masterclass.fee.currency'),
                'sender_name' => $data['sender_name'],
                'sender_phone' => $data['sender_phone'],
                'transaction_reference' => $data['transaction_reference'] ?: null,
                'payment_date_time' => $paymentDateTime,
                'is_active' => true,
                'submitted_at' => now(),
            ]);

            $registration->update(['payment_status' => 'PAYMENT_SUBMITTED']);
        });

        return redirect()->route('payment.submitted', ['token' => $token]);
    }

    public function submitted(string $token): Response
    {
        $registration = $this->findByToken($token);

        return Inertia::render('Payment/Submitted', [
            'registration' => $this->publicRegistration($registration),
            'masterclass' => config('masterclass'),
        ]);
    }

    private function findByToken(string $token): Registration
    {
        return Registration::query()
            ->where('payment_access_token', $token)
            ->firstOrFail();
    }

    private function publicRegistration(Registration $registration): array
    {
        return [
            'reference' => $registration->registration_reference,
            'full_name' => $registration->full_name,
            'email' => $registration->email,
            'amount' => (float) $registration->amount,
            'currency' => config('masterclass.fee.currency'),
            'payment_status' => $registration->payment_status,
            'token' => $registration->payment_access_token,
        ];
    }
}
