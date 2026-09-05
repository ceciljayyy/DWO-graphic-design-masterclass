@extends('mail.layout')

@section('content')
    <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#ffffff;">Payment details received</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#d4d4d8;">
        Hi {{ $registration->full_name }},
    </p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#d4d4d8;">
        We received your Mobile Money payment details for <strong style="color:#ffffff;">{{ $masterclass['name'] }}</strong>. An admin will verify it shortly.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;background:#0b0b0c;border:1px solid #2a2a2e;border-radius:12px;">
        <tr>
            <td style="padding:16px 18px;font-size:14px;line-height:1.7;color:#d4d4d8;">
                <strong style="color:#ffffff;">Reference:</strong> {{ $registration->registration_reference }}<br>
                <strong style="color:#ffffff;">Status:</strong> Awaiting verification
            </td>
        </tr>
    </table>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#d4d4d8;">
        You’ll get another email once your payment is confirmed.
    </p>
@endsection
