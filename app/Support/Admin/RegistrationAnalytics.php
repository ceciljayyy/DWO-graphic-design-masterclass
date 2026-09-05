<?php

namespace App\Support\Admin;

use App\Models\Registration;
use Carbon\Carbon;
use InvalidArgumentException;

class RegistrationAnalytics
{
    public const TIMEZONE = 'Africa/Accra';

    public const DEFAULT_RANGE = '14d';

    /**
     * @var array<string, array{label: string, short: string, seconds: int, bucket: string, step: int}>
     */
    public const RANGES = [
        '6h' => ['label' => '6 hours', 'short' => '6H', 'seconds' => 6 * 3600, 'bucket' => 'hour', 'step' => 1],
        '12h' => ['label' => '12 hours', 'short' => '12H', 'seconds' => 12 * 3600, 'bucket' => 'hour', 'step' => 1],
        '24h' => ['label' => '24 hours', 'short' => '24H', 'seconds' => 24 * 3600, 'bucket' => 'hour', 'step' => 1],
        '48h' => ['label' => '48 hours', 'short' => '48H', 'seconds' => 48 * 3600, 'bucket' => 'hour', 'step' => 3],
        '7d' => ['label' => '1 week', 'short' => '1W', 'seconds' => 7 * 86400, 'bucket' => 'day', 'step' => 1],
        '14d' => ['label' => '14 days', 'short' => '14D', 'seconds' => 14 * 86400, 'bucket' => 'day', 'step' => 1],
        '30d' => ['label' => '1 month', 'short' => '1M', 'seconds' => 30 * 86400, 'bucket' => 'day', 'step' => 1],
    ];

    /**
     * @return list<array{value: string, label: string, short: string}>
     */
    public static function rangeOptions(): array
    {
        $options = [];

        foreach (self::RANGES as $value => $meta) {
            $options[] = [
                'value' => $value,
                'label' => $meta['label'],
                'short' => $meta['short'],
            ];
        }

        return $options;
    }

    public static function normalizeRange(?string $range): string
    {
        if ($range !== null && isset(self::RANGES[$range])) {
            return $range;
        }

        return self::DEFAULT_RANGE;
    }

    /**
     * @return array{
     *     range: string,
     *     startDate: string,
     *     endDate: string,
     *     timezone: string,
     *     summary: array{
     *         registrations: int,
     *         paid: int,
     *         pending: int,
     *         failed: int,
     *         revenue: float,
     *         conversionRate: float|null
     *     },
     *     series: list<array{
     *         key: string,
     *         label: string,
     *         fullLabel: string,
     *         registrations: int,
     *         paid: int,
     *         pending: int,
     *         failed: int,
     *         revenue: float
     *     }>,
     *     ranges: list<array{value: string, label: string, short: string}>,
     *     generatedAt: string
     * }
     */
    public static function forRange(?string $range = null): array
    {
        $range = self::normalizeRange($range);
        $meta = self::RANGES[$range];

        $end = Carbon::now(self::TIMEZONE);
        $start = $end->copy()->subSeconds($meta['seconds']);

        $buckets = self::buildBuckets($start, $end, $meta['bucket'], $meta['step'], $range);

        $rows = Registration::query()
            ->where('created_at', '>=', $start->clone()->utc())
            ->where('created_at', '<=', $end->clone()->utc())
            ->get(['payment_status', 'amount', 'created_at']);

        foreach ($rows as $row) {
            $createdLocal = $row->created_at?->copy()->timezone(self::TIMEZONE);
            if ($createdLocal === null) {
                continue;
            }

            $key = self::bucketKey($createdLocal, $meta['bucket'], $meta['step']);
            if (! isset($buckets[$key])) {
                continue;
            }

            $status = (string) $row->payment_status;
            $buckets[$key]['registrations']++;

            if ($status === 'PAID') {
                $buckets[$key]['paid']++;
                $buckets[$key]['revenue'] += (float) $row->amount;
            } elseif (in_array($status, ['PENDING', 'PAYMENT_SUBMITTED'], true)) {
                $buckets[$key]['pending']++;
            } elseif (in_array($status, ['FAILED', 'PAYMENT_REJECTED'], true)) {
                $buckets[$key]['failed']++;
            }
        }

        $series = array_values($buckets);

        $registrations = array_sum(array_column($series, 'registrations'));
        $paid = array_sum(array_column($series, 'paid'));
        $pending = array_sum(array_column($series, 'pending'));
        $failed = array_sum(array_column($series, 'failed'));
        $revenue = array_sum(array_column($series, 'revenue'));

        return [
            'range' => $range,
            'startDate' => $start->toIso8601String(),
            'endDate' => $end->toIso8601String(),
            'timezone' => self::TIMEZONE,
            'summary' => [
                'registrations' => $registrations,
                'paid' => $paid,
                'pending' => $pending,
                'failed' => $failed,
                'revenue' => round($revenue, 2),
                'conversionRate' => $registrations > 0
                    ? round(($paid / $registrations) * 100, 1)
                    : null,
            ],
            'series' => $series,
            'ranges' => self::rangeOptions(),
            'generatedAt' => Carbon::now(self::TIMEZONE)->toIso8601String(),
        ];
    }

    /**
     * @return array<string, array{
     *     key: string,
     *     label: string,
     *     fullLabel: string,
     *     registrations: int,
     *     paid: int,
     *     pending: int,
     *     failed: int,
     *     revenue: float
     * }>
     */
    private static function buildBuckets(Carbon $start, Carbon $end, string $bucket, int $step, string $range): array
    {
        $cursor = self::alignBucketStart($start->copy(), $bucket, $step);
        $buckets = [];

        while ($cursor->lte($end)) {
            $key = self::bucketKey($cursor, $bucket, $step);
            $buckets[$key] = [
                'key' => $key,
                'label' => self::formatLabel($cursor, $range),
                'fullLabel' => self::formatFullLabel($cursor, $range),
                'registrations' => 0,
                'paid' => 0,
                'pending' => 0,
                'failed' => 0,
                'revenue' => 0.0,
            ];

            if ($bucket === 'day') {
                $cursor->addDays($step);
            } else {
                $cursor->addHours($step);
            }
        }

        return $buckets;
    }

    private static function alignBucketStart(Carbon $moment, string $bucket, int $step): Carbon
    {
        $aligned = $moment->copy()->second(0)->microsecond(0);

        if ($bucket === 'day') {
            return $aligned->startOfDay();
        }

        $aligned->minute(0);
        if ($step > 1) {
            $hour = intdiv($aligned->hour, $step) * $step;
            $aligned->hour($hour);
        }

        return $aligned;
    }

    private static function bucketKey(Carbon $moment, string $bucket, int $step): string
    {
        $aligned = self::alignBucketStart($moment, $bucket, $step);

        return $bucket === 'day'
            ? $aligned->format('Y-m-d')
            : $aligned->format('Y-m-d H:00');
    }

    private static function formatLabel(Carbon $moment, string $range): string
    {
        return match (true) {
            in_array($range, ['6h', '12h'], true) => $moment->format('H:i'),
            in_array($range, ['24h', '48h'], true) => $moment->format('g A'),
            default => $moment->format('M j'),
        };
    }

    private static function formatFullLabel(Carbon $moment, string $range): string
    {
        return match (true) {
            in_array($range, ['6h', '12h', '24h', '48h'], true) => $moment->format('j M Y · g:i A'),
            default => $moment->format('j M Y'),
        };
    }

    public static function assertValidRange(string $range): void
    {
        if (! isset(self::RANGES[$range])) {
            throw new InvalidArgumentException('Invalid analytics range.');
        }
    }
}
