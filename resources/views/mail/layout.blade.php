<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $subject ?? config('masterclass.name') }}</title>
</head>
<body style="margin:0;padding:0;background:#0b0b0c;font-family:Arial,Helvetica,sans-serif;color:#f5f5f5;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0b0c;padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#151517;border:1px solid #2a2a2e;border-radius:16px;overflow:hidden;">
                    <tr>
                        <td style="padding:24px 28px 8px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#e8ff47;font-weight:700;">
                            {{ config('masterclass.brand') }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px 28px 24px;">
                            @yield('content')
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:18px 28px 24px;border-top:1px solid #2a2a2e;font-size:12px;line-height:1.6;color:#9ca3af;">
                            {{ config('masterclass.brand_full') }} · {{ config('masterclass.name') }}<br>
                            Course: {{ config('masterclass.course_period.display') }}<br>
                            @foreach(config('masterclass.contact.phones') as $phone)
                                {{ $phone['label'] }}@if(!$loop->last) · @endif
                            @endforeach
                            <br>
                            <a href="{{ config('masterclass.contact.instagram.href') }}" style="color:#e8ff47;text-decoration:none;">{{ config('masterclass.contact.instagram.handle') }}</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
