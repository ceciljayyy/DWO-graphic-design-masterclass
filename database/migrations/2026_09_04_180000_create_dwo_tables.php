<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('registration_reference', 32)->unique();
            $table->string('payment_access_token', 64)->unique();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone', 30)->nullable();
            $table->string('whatsapp', 30);
            $table->string('location');
            $table->string('experience_level', 32);
            $table->string('payment_status', 32)->default('PENDING')->index();
            $table->decimal('amount', 10, 2);
            $table->string('paystack_reference', 120)->nullable()->unique();
            $table->string('payment_authorization_url', 512)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('confirmation_email_sent_at')->nullable();
            $table->timestamp('welcome_email_sent_at')->nullable();
            $table->timestamp('payment_reminder_email_sent_at')->nullable();
            $table->string('marketing_source', 32)->nullable()->index();
            $table->string('utm_source', 120)->nullable();
            $table->string('utm_medium', 120)->nullable();
            $table->string('utm_campaign', 191)->nullable();
            $table->timestamps();

            $table->index('created_at');
            $table->index('phone');
            $table->index('full_name');
            $table->index(['payment_status', 'payment_reminder_email_sent_at', 'created_at'], 'registrations_reminder_idx');
        });

        Schema::create('manual_payment_submissions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('registration_id')->constrained('registrations')->cascadeOnDelete();
            $table->string('method', 32)->default('MTN_MOBILE_MONEY');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 8)->default('GHS');
            $table->string('sender_name');
            $table->string('sender_phone', 30);
            $table->string('transaction_reference', 120)->nullable();
            $table->timestamp('payment_date_time');
            $table->boolean('is_active')->default(true);
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('reviewed_at')->nullable();
            $table->ulid('reviewed_by_admin_id')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamps();

            $table->index('registration_id');
            $table->index(['registration_id', 'is_active']);
            $table->index('submitted_at');
        });

        Schema::create('admin_audit_logs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('admin_id')->nullable()->index();
            $table->string('action', 64)->index();
            $table->text('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent()->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_audit_logs');
        Schema::dropIfExists('manual_payment_submissions');
        Schema::dropIfExists('registrations');
    }
};
