<?php

namespace Tests\Feature;

use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomeCountdownTest extends TestCase
{
    public function test_home_page_receives_countdown_timestamps_from_laravel(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-09-05 12:00:00', config('app.timezone')));

        try {
            $response = $this->get('/');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->where('countdown.courseStartsAt', Carbon::parse(config('masterclass.course_starts_at'), config('app.timezone'))->toIso8601String())
                ->where('countdown.serverNow', now()->toIso8601String())
                ->where('countdown.timezone', config('app.timezone'))
                ->etc()
            );
        } finally {
            Carbon::setTestNow();
        }
    }
}
