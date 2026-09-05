<?php

namespace App\Mail;

use App\Models\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Registration $registration) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payment details received — '.config('masterclass.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'mail.payment-submitted',
            text: 'mail.payment-submitted-text',
            with: [
                'registration' => $this->registration,
                'masterclass' => config('masterclass'),
                'subject' => 'Payment details received',
            ],
        );
    }
}
