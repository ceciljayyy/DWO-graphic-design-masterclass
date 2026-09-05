<?php

namespace App\Http\Controllers;

use App\Mail\PaymentSubmitted;
use App\Models\Registration;
use App\Support\SafeMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function success(string $token): Response|RedirectResponse
    {
        $registration = $this->findByToken($token);

        if ($registration->isPaid()) {
            return redirect()->route('payment.show', ['token' => $token]);
        }

        if ($registration->payment_status === 'PAYMENT_SUBMITTED') {
            return redirect()->route('payment.submitted', ['token' => $token]);
        }

        return Inertia::render('Payment/Success', [
            'registration' => $this->publicRegistration($registration),
            'masterclass' => config('masterclass'),
        ]);
    }

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

        if (strtoupper((string) config('payments.mode', 'MANUAL')) === 'PAYSTACK') {
            // Paystack checkout remains available for a future switch.
            // Until wired, fall back to manual MoMo so launches are not blocked.
        }

        return Inertia::render('Payment/Instructions', [
            'registration' => $this->publicRegistration($registration),
            'masterclass' => config('masterclass'),
            'momo' => config('masterclass.momo'),
            'paymentMode' => strtoupper((string) config('payments.mode', 'MANUAL')),
        ]);
    }

    public function createSubmit(string $token): Response|RedirectResponse
    {
        $registration = $this->findByToken($token);

        if (! $registration->canSubmitManualPayment()) {
            return redirect()->route('payment.show', ['token' => $token])
                ->with('error', $this->submissionBlockedMessage($registration));
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

        if ($registration->isPaid()) {
            return redirect()->route('payment.show', ['token' => $token])
                ->with('error', 'Your payment has already been verified.');
        }

        if ($registration->payment_status === 'PAYMENT_SUBMITTED') {
            return redirect()->route('payment.submitted', ['token' => $token])
                ->with('error', 'Your payment details have already been submitted and are awaiting verification.');
        }

        if (! $registration->canSubmitManualPayment()) {
            return redirect()->route('payment.show', ['token' => $token])
                ->with('error', $this->submissionBlockedMessage($registration));
        }

        $data = $request->validate([
            'network' => ['required', 'string', 'in:MTN,TELECEL,AIRTELTIGO'],
            'sender_name' => ['required', 'string', 'max:191'],
            'sender_phone' => ['required', 'string', 'max:30'],
            'transaction_reference' => ['required', 'string', 'max:120'],
            'payment_date' => ['required', 'date_format:Y-m-d'],
            'payment_time' => ['required', 'date_format:H:i'],
        ]);

        if (strcasecmp(trim($data['transaction_reference']), $registration->registration_reference) !== 0) {
            return back()->withErrors([
                'transaction_reference' => 'Enter your exact registration reference ('.$registration->registration_reference.'). This is the payment reference you must use on Mobile Money.',
            ])->withInput();
        }

        $data['transaction_reference'] = $registration->registration_reference;

        $expectedAmount = (float) config('masterclass.fee.amount');
        if ((float) $registration->amount !== $expectedAmount) {
            return back()->withErrors([
                'sender_name' => 'Something went wrong. Your registration has not been deleted. Please try again.',
            ]);
        }

        $paymentDateTime = now()->parse($data['payment_date'].' '.$data['payment_time']);
        $min = now()->subDays(90);
        $max = now()->addMinutes(15);

        if ($paymentDateTime->lt($min) || $paymentDateTime->gt($max)) {
            return back()->withErrors([
                'payment_date' => 'Please enter a valid payment date and time.',
            ]);
        }

        DB::transaction(function () use ($registration, $data, $paymentDateTime, $expectedAmount) {
            $registration->manualPaymentSubmissions()
                ->where('is_active', true)
                ->update(['is_active' => false]);

            $registration->manualPaymentSubmissions()->create([
                'method' => $data['network'],
                'amount' => $expectedAmount,
                'currency' => config('masterclass.fee.currency'),
                'sender_name' => $data['sender_name'],
                'sender_phone' => $data['sender_phone'],
                'transaction_reference' => $data['transaction_reference'],
                'payment_date_time' => $paymentDateTime,
                'is_active' => true,
                'submitted_at' => now(),
            ]);

            $registration->update(['payment_status' => 'PAYMENT_SUBMITTED']);
        });

        $registration = $registration->fresh();
        SafeMail::send($registration->email, new PaymentSubmitted($registration));

        return redirect()->route('payment.submitted', ['token' => $token]);
    }

    public function submitted(string $token): Response|RedirectResponse
    {
        $registration = $this->findByToken($token);

        if ($registration->isPaid()) {
            return redirect()->route('payment.show', ['token' => $token]);
        }

        if ($registration->payment_status !== 'PAYMENT_SUBMITTED') {
            return redirect()->route('payment.show', ['token' => $token]);
        }

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

    private function submissionBlockedMessage(Registration $registration): string
    {
        return match ($registration->payment_status) {
            'PAID' => 'Your payment has already been verified.',
            'PAYMENT_SUBMITTED' => 'Your payment details have already been submitted and are awaiting verification.',
            default => 'We couldn\'t find this registration. Please restart the registration process or contact DWO support.',
        };
    }
}
