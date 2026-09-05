<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Registration extends Model
{
    use HasUlids;

    protected $fillable = [
        'registration_reference',
        'payment_access_token',
        'full_name',
        'email',
        'phone',
        'whatsapp',
        'location',
        'experience_level',
        'schedule',
        'payment_status',
        'amount',
        'paystack_reference',
        'payment_authorization_url',
        'paid_at',
        'confirmation_email_sent_at',
        'welcome_email_sent_at',
        'payment_reminder_email_sent_at',
        'marketing_source',
        'utm_source',
        'utm_medium',
        'utm_campaign',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'confirmation_email_sent_at' => 'datetime',
            'welcome_email_sent_at' => 'datetime',
            'payment_reminder_email_sent_at' => 'datetime',
        ];
    }

    public function manualPaymentSubmissions(): HasMany
    {
        return $this->hasMany(ManualPaymentSubmission::class);
    }

    public function activeManualPaymentSubmission(): HasOne
    {
        return $this->hasOne(ManualPaymentSubmission::class)->ofMany(
            ['submitted_at' => 'max', 'id' => 'max'],
            function ($query) {
                $query->where('is_active', true);
            }
        );
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'PAID';
    }

    public function canSubmitManualPayment(): bool
    {
        return in_array($this->payment_status, ['PENDING', 'PAYMENT_REJECTED', 'FAILED'], true);
    }
}
