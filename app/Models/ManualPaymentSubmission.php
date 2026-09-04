<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManualPaymentSubmission extends Model
{
    use HasUlids;

    protected $fillable = [
        'registration_id',
        'method',
        'amount',
        'currency',
        'sender_name',
        'sender_phone',
        'transaction_reference',
        'payment_date_time',
        'is_active',
        'submitted_at',
        'reviewed_at',
        'reviewed_by_admin_id',
        'admin_note',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'payment_date_time' => 'datetime',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }
}
