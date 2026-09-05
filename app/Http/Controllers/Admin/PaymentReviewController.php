<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\PaymentRejected;
use App\Mail\RegistrationPaymentConfirmed;
use App\Models\AdminAuditLog;
use App\Models\Registration;
use App\Support\SafeMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PaymentReviewController extends Controller
{
    public function index(): Response
    {
        $items = Registration::query()
            ->with('activeManualPaymentSubmission')
            ->where('payment_status', 'PAYMENT_SUBMITTED')
            ->latest('updated_at')
            ->paginate(20)
            ->through(fn (Registration $r) => [
                'id' => $r->id,
                'full_name' => $r->full_name,
                'email' => $r->email,
                'whatsapp' => $r->whatsapp,
                'reference' => $r->registration_reference,
                'amount' => (float) $r->amount,
                'fee_display' => config('masterclass.fee.display'),
                'submission' => $r->activeManualPaymentSubmission ? [
                    'method' => $r->activeManualPaymentSubmission->method,
                    'sender_name' => $r->activeManualPaymentSubmission->sender_name,
                    'sender_phone' => $r->activeManualPaymentSubmission->sender_phone,
                    'transaction_reference' => $r->activeManualPaymentSubmission->transaction_reference,
                    'payment_date_time' => $r->activeManualPaymentSubmission->payment_date_time?->toIso8601String(),
                    'submitted_at' => $r->activeManualPaymentSubmission->submitted_at?->toIso8601String(),
                ] : null,
            ]);

        return Inertia::render('Admin/Payments', [
            'items' => $items,
            'masterclass' => config('masterclass'),
        ]);
    }

    public function verify(string $id): RedirectResponse
    {
        $shouldSendConfirmation = false;
        $registrationForMail = null;
        $error = null;

        DB::transaction(function () use ($id, &$shouldSendConfirmation, &$registrationForMail, &$error) {
            $registration = Registration::query()
                ->with('activeManualPaymentSubmission')
                ->whereKey($id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($registration->payment_status === 'PAID') {
                return;
            }

            if ($registration->payment_status !== 'PAYMENT_SUBMITTED') {
                $error = 'Registration is not awaiting verification.';

                return;
            }

            $registration->update([
                'payment_status' => 'PAID',
                'paid_at' => $registration->paid_at ?? now(),
            ]);

            $registration->activeManualPaymentSubmission?->update([
                'reviewed_at' => now(),
                'reviewed_by_admin_id' => Auth::id(),
            ]);

            AdminAuditLog::record((string) Auth::id(), 'MANUAL_PAYMENT_VERIFIED', [
                'registration_id' => $registration->id,
            ]);

            if ($registration->confirmation_email_sent_at === null) {
                $shouldSendConfirmation = true;
                $registrationForMail = $registration->fresh();
            }
        });

        if ($error) {
            return back()->with('error', $error);
        }

        if ($shouldSendConfirmation && $registrationForMail) {
            if (SafeMail::send($registrationForMail->email, new RegistrationPaymentConfirmed($registrationForMail))) {
                Registration::query()->whereKey($registrationForMail->id)->whereNull('confirmation_email_sent_at')->update([
                    'confirmation_email_sent_at' => now(),
                ]);
            }
        }

        return back()->with('success', 'Payment verified.');
    }

    public function reject(Request $request, string $id): RedirectResponse
    {
        $data = $request->validate([
            'admin_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $error = null;
        $registrationForMail = null;
        $adminNote = $data['admin_note'] ?? null;

        DB::transaction(function () use ($id, $data, &$error, &$registrationForMail) {
            $registration = Registration::query()
                ->with('activeManualPaymentSubmission')
                ->whereKey($id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($registration->payment_status !== 'PAYMENT_SUBMITTED') {
                $error = 'Registration is not awaiting verification.';

                return;
            }

            $registration->update([
                'payment_status' => 'PAYMENT_REJECTED',
            ]);

            $registration->activeManualPaymentSubmission?->update([
                'reviewed_at' => now(),
                'reviewed_by_admin_id' => Auth::id(),
                'admin_note' => $data['admin_note'] ?? null,
                'is_active' => false,
            ]);

            AdminAuditLog::record((string) Auth::id(), 'MANUAL_PAYMENT_REJECTED', [
                'registration_id' => $registration->id,
            ]);

            $registrationForMail = $registration->fresh();
        });

        if ($error) {
            return back()->with('error', $error);
        }

        if ($registrationForMail) {
            SafeMail::send(
                $registrationForMail->email,
                new PaymentRejected($registrationForMail, $adminNote)
            );
        }

        return back()->with('success', 'Payment rejected.');
    }
}
