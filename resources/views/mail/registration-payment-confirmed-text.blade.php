Hi {{ $registration->full_name }},

Your payment for {{ $masterclass['name'] }} has been verified. You are confirmed for the class.

Reference: {{ $registration->registration_reference }}
Amount: {{ $masterclass['fee']['display'] }}
Course period: {{ $masterclass['course_period']['display'] }}
@if(!empty($registration->schedule))
Schedule: {{ $registration->schedule === 'WEEKENDS' ? 'Weekends (Saturday & Sunday)' : 'Weekdays (Monday – Friday)' }}
@endif

Keep this email for your records. We’ll share class joining details closer to the start date.

Welcome to the class.
— {{ $masterclass['brand_full'] }}
