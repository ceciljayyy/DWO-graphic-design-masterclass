@extends('mail.layout')

@section('content')
    <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#ffffff;">Registration received</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#d4d4d8;">
        Hi {{ $registration->full_name }},
    </p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#d4d4d8;">
        Thanks for registering for <strong style="color:#ffffff;">{{ $masterclass['name'] }}</strong>. Your seat is reserved once payment is completed and verified.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;background:#0b0b0c;border:1px solid #2a2a2e;border-radius:12px;">
        <tr>
            <td style="padding:16px 18px;font-size:14px;line-height:1.7;color:#d4d4d8;">
                <strong style="color:#ffffff;">Reference:</strong> {{ $registration->registration_reference }}<br>
                <strong style="color:#ffffff;">Amount due:</strong> {{ $masterclass['fee']['display'] }}<br>
                <strong style="color:#ffffff;">MoMo number:</strong> {{ $masterclass['momo']['number'] }}<br>
                <strong style="color:#ffffff;">Account name:</strong> {{ $masterclass['momo']['account_name'] }}
            </td>
        </tr>
    </table>

    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#d4d4d8;">
        Complete payment and submit your payment details using the button below.
    </p>

    <p style="margin:0 0 18px;">
        <a href="{{ $paymentUrl }}" style="display:inline-block;background:#e8ff47;color:#111111;text-decoration:none;font-weight:700;font-size:14px;padding:12px 18px;border-radius:999px;">
            Continue to payment
        </a>
    </p>

    <p style="margin:0;font-size:13px;line-height:1.6;color:#9ca3af;">
        If the button doesn’t work, open this link:<br>
        <a href="{{ $paymentUrl }}" style="color:#e8ff47;word-break:break-all;">{{ $paymentUrl }}</a>
    </p>
@endsection
