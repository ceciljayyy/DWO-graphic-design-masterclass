<?php

namespace App\Support;

use App\Models\Registration;
use Illuminate\Support\Str;

class RegistrationReference
{
    private const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    public static function generate(): string
    {
        do {
            $suffix = '';
            for ($i = 0; $i < 6; $i++) {
                $suffix .= self::ALPHABET[random_int(0, strlen(self::ALPHABET) - 1)];
            }
            $reference = 'DWO-'.$suffix;
        } while (Registration::query()->where('registration_reference', $reference)->exists());

        return $reference;
    }

    public static function paymentToken(): string
    {
        do {
            $token = bin2hex(random_bytes(24));
        } while (Registration::query()->where('payment_access_token', $token)->exists());

        return $token;
    }

    public static function normalizeEmail(string $email): string
    {
        return Str::lower(trim($email));
    }
}
