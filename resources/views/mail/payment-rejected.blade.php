@extends('mail.layout')

@section('content')
    <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#ffffff;">Payment not verified</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#d4d4d8;">
        Hi {{ $registration->full_name }},
    </p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#d4d4d8;">
        We couldn’t verify the payment details submitted for <strong style="color:#ffffff;">{{ $masterclass['name'] }}</strong> ({{ $registration->registration_reference }}).
    </p>
    @if(!empty($adminNote))
        <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#d4d4d8;">
            <strong style="color:#ffffff;">Note:</strong> {{ $adminNote }}
        </p>
    @endif
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#d4d4d8;">
        You can submit payment details again using the link below.
    </p>
    <p style="margin:0 0 18px;">
        <a href="{{ $paymentUrl }}" style="display:inline-block;background:#e8ff47;color:#111111;text-decoration:none;font-weight:700;font-size:14px;padding:12px 18px;border-radius:999px;">
            Resubmit payment details
        </a>
    </p>
@endsection
