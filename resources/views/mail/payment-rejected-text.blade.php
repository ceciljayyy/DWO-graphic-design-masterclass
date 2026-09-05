Hi {{ $registration->full_name }},

We couldn’t verify the payment details submitted for {{ $masterclass['name'] }} ({{ $registration->registration_reference }}).

@if(!empty($adminNote))
Note: {{ $adminNote }}
@endif

Resubmit payment details:
{{ $paymentUrl }}

— {{ $masterclass['brand_full'] }}
