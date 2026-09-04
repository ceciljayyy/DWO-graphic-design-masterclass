<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminCommand extends Command
{
    protected $signature = 'admin:create {--email=} {--password=} {--name=DWO Admin}';

    protected $description = 'Create or update an admin user';

    public function handle(): int
    {
        $email = $this->option('email') ?: $this->ask('Email');
        $password = $this->option('password') ?: $this->secret('Password');
        $name = $this->option('name') ?: 'DWO Admin';

        if (! $email || ! $password || strlen($password) < 10) {
            $this->error('Email required and password must be at least 10 characters.');

            return self::FAILURE;
        }

        $user = User::query()->updateOrCreate(
            ['email' => strtolower(trim($email))],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]
        );

        $this->info("Admin ready: {$user->email}");

        return self::SUCCESS;
    }
}
