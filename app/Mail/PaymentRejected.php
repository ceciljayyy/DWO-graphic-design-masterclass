<?php

namespace App\Mail;

use App\Models\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentRejected extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Registration $registration,
        public ?string $adminNote = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payment not verified — '.config('masterclass.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'mail.payment-rejected',
            text: 'mail.payment-rejected-text',
            with: [
                'registration' => $this->registration,
                'masterclass' => config('masterclass'),
                'adminNote' => $this->adminNote,
                'paymentUrl' => route('payment.show', $this->registration->payment_access_token),
                'subject' => 'Payment not verified',
            ],
        );
    }
}
