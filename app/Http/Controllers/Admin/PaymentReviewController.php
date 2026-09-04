<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\Registration;
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
                'submission' => $r->activeManualPaymentSubmission ? [
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
        $registration = Registration::query()->with('activeManualPaymentSubmission')->findOrFail($id);

        if ($registration->payment_status !== 'PAYMENT_SUBMITTED') {
            return back()->with('error', 'Registration is not awaiting verification.');
        }

        DB::transaction(function () use ($registration) {
            $registration->update([
                'payment_status' => 'PAID',
                'paid_at' => now(),
            ]);

            $registration->activeManualPaymentSubmission?->update([
                'reviewed_at' => now(),
                'reviewed_by_admin_id' => Auth::id(),
            ]);

            AdminAuditLog::record((string) Auth::id(), 'MANUAL_PAYMENT_VERIFIED', [
                'registration_id' => $registration->id,
            ]);
        });

        return back()->with('success', 'Payment verified.');
    }

    public function reject(Request $request, string $id): RedirectResponse
    {
        $registration = Registration::query()->with('activeManualPaymentSubmission')->findOrFail($id);

        if ($registration->payment_status !== 'PAYMENT_SUBMITTED') {
            return back()->with('error', 'Registration is not awaiting verification.');
        }

        $data = $request->validate([
            'admin_note' => ['nullable', 'string', 'max:2000'],
        ]);

        DB::transaction(function () use ($registration, $data) {
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
        });

        return back()->with('success', 'Payment rejected.');
    }
}
