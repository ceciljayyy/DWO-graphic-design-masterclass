<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class AdminAuditLog extends Model
{
    use HasUlids;

    public $timestamps = false;

    protected $fillable = [
        'admin_id',
        'action',
        'metadata',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public static function record(?string $adminId, string $action, ?array $metadata = null): void
    {
        static::query()->create([
            'admin_id' => $adminId,
            'action' => $action,
            'metadata' => $metadata ? json_encode($metadata) : null,
            'created_at' => now(),
        ]);
    }
}
