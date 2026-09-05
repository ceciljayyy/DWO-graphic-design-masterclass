Hi {{ $registration->full_name }},

Thanks for registering for {{ $masterclass['name'] }}. Your seat is reserved once payment is completed and verified.

Reference: {{ $registration->registration_reference }}
Amount due: {{ $masterclass['fee']['display'] }}
MoMo number: {{ $masterclass['momo']['number'] }}
Account name: {{ $masterclass['momo']['account_name'] }}

Continue to payment:
{{ $paymentUrl }}

— {{ $masterclass['brand_full'] }}
