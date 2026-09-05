<?php

namespace App\Mail;

use App\Models\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegistrationPaymentConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Registration $registration) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payment confirmed — '.config('masterclass.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            text: 'mail.registration-payment-confirmed',
            with: [
                'registration' => $this->registration,
                'masterclass' => config('masterclass'),
            ],
        );
    }
}
