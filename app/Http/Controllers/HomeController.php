<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;
use SplFileInfo;

class HomeController extends Controller
{
    private const PORTFOLIO_CATEGORIES = [
        'Branding',
        'Campaign Design',
        'Social Media',
        'Event Design',
        'Content Creation',
        'Motion Design',
    ];

    public function __invoke(): Response
    {
        $courseStartsAt = Carbon::parse(config('masterclass.course_starts_at'), config('app.timezone'));

        return Inertia::render('Home', [
            'masterclass' => [
                ...config('masterclass'),
                'instructor' => [
                    ...config('masterclass.instructor'),
                    'image' => asset(config('masterclass.instructor.image', 'instructor/james-baiden-otabil.jpg')),
                ],
            ],
            'countdown' => [
                'courseStartsAt' => $courseStartsAt->toIso8601String(),
                'serverNow' => now()->toIso8601String(),
                'timezone' => config('app.timezone'),
            ],
            'portfolio' => $this->portfolioItems(),
            'studentWork' => [
                'before' => $this->workImages('before'),
                'after' => $this->workImages('after'),
            ],
        ]);
    }

    /**
     * @return list<array{src: string, category: string}>
     */
    private function portfolioItems(): array
    {
        $path = public_path('work');

        if (! File::isDirectory($path)) {
            return [];
        }

        return collect(File::files($path))
            ->filter(function (SplFileInfo $file) {
                return in_array(strtolower($file->getExtension()), ['jpg', 'jpeg', 'png', 'webp', 'gif'], true);
            })
            ->sortBy(fn (SplFileInfo $file) => $this->naturalKey($file->getFilename()), SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->map(function (SplFileInfo $file, int $index) {
                return [
                    'src' => asset('work/'.$file->getFilename()),
                    'category' => self::PORTFOLIO_CATEGORIES[$index % count(self::PORTFOLIO_CATEGORIES)],
                ];
            })
            ->all();
    }

    /**
     * @return list<string>
     */
    private function workImages(string $folder): array
    {
        $path = public_path('work/'.$folder);

        if (! File::isDirectory($path)) {
            return [];
        }

        return collect(File::files($path))
            ->filter(function (SplFileInfo $file) {
                return in_array(strtolower($file->getExtension()), ['jpg', 'jpeg', 'png', 'webp', 'gif'], true);
            })
            ->sortBy(fn (SplFileInfo $file) => strtolower($file->getFilename()))
            ->values()
            ->map(fn (SplFileInfo $file) => asset('work/'.$folder.'/'.$file->getFilename()))
            ->all();
    }

    private function naturalKey(string $filename): string
    {
        return preg_replace_callback('/\d+/', function (array $matches) {
            return str_pad($matches[0], 6, '0', STR_PAD_LEFT);
        }, strtolower($filename)) ?? strtolower($filename);
    }
}
