<?php

namespace App\Support;

use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SafeMail
{
    public static function send(string $to, Mailable $mailable): bool
    {
        try {
            Mail::to($to)->send($mailable);

            return true;
        } catch (Throwable $e) {
            Log::warning('Mail send failed', [
                'to' => $to,
                'mailable' => $mailable::class,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
