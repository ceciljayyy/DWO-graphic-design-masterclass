<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegistrationAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $query = Registration::query()->latest();
        if ($status !== '') {
            $query->where('payment_status', $status);
        }

        $items = $query->paginate(25)->withQueryString()->through(fn (Registration $r) => [
            'id' => $r->id,
            'full_name' => $r->full_name,
            'email' => $r->email,
            'whatsapp' => $r->whatsapp,
            'location' => $r->location,
            'experience_level' => $r->experience_level,
            'payment_status' => $r->payment_status,
            'reference' => $r->registration_reference,
            'amount' => (float) $r->amount,
            'created_at' => $r->created_at?->toIso8601String(),
        ]);

        return Inertia::render('Admin/Registrations', [
            'items' => $items,
            'filters' => ['status' => $status],
            'masterclass' => config('masterclass'),
        ]);
    }

    public function show(string $id): Response
    {
        $registration = Registration::query()
            ->with(['manualPaymentSubmissions' => fn ($q) => $q->latest()])
            ->findOrFail($id);

        $digits = preg_replace('/\D+/', '', $registration->whatsapp) ?: '';
        $text = rawurlencode(
            "Hi {$registration->full_name}, your DWO Graphic Design & Media Class payment ({$registration->registration_reference}) has been confirmed. Welcome!"
        );

        return Inertia::render('Admin/RegistrationDetail', [
            'registration' => [
                'id' => $registration->id,
                'full_name' => $registration->full_name,
                'email' => $registration->email,
                'phone' => $registration->phone,
                'whatsapp' => $registration->whatsapp,
                'location' => $registration->location,
                'experience_level' => $registration->experience_level,
                'schedule' => $registration->schedule,
                'payment_status' => $registration->payment_status,
                'reference' => $registration->registration_reference,
                'amount' => (float) $registration->amount,
                'paid_at' => $registration->paid_at?->toIso8601String(),
                'created_at' => $registration->created_at?->toIso8601String(),
                'submissions' => $registration->manualPaymentSubmissions->map(fn ($s) => [
                    'id' => $s->id,
                    'sender_name' => $s->sender_name,
                    'sender_phone' => $s->sender_phone,
                    'transaction_reference' => $s->transaction_reference,
                    'payment_date_time' => $s->payment_date_time?->toIso8601String(),
                    'is_active' => $s->is_active,
                    'admin_note' => $s->admin_note,
                    'submitted_at' => $s->submitted_at?->toIso8601String(),
                ]),
            ],
            'whatsappUrl' => "https://wa.me/{$digits}?text={$text}",
            'masterclass' => config('masterclass'),
        ]);
    }
}
