<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Active payment mode
    |--------------------------------------------------------------------------
    |
    | MANUAL  — MTN Mobile Money instructions + admin verification (current launch)
    | PAYSTACK — reserved for the existing/future Paystack checkout (kept intact)
    |
    */
    'mode' => env('PAYMENT_MODE', 'MANUAL'),
];
