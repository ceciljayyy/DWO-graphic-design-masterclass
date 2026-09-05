<?php

namespace App\Mail;

use App\Models\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegistrationWelcome extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Registration $registration) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Complete your payment — '.config('masterclass.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'mail.registration-welcome',
            text: 'mail.registration-welcome-text',
            with: [
                'registration' => $this->registration,
                'masterclass' => config('masterclass'),
                'paymentUrl' => route('payment.show', $this->registration->payment_access_token),
                'subject' => 'Registration received',
            ],
        );
    }
}
