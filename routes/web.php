<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PaymentReviewController;
use App\Http\Controllers\Admin\RegistrationAdminController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/register', [RegistrationController::class, 'create'])->name('register.create');
Route::post('/register', [RegistrationController::class, 'store'])->name('register.store');

Route::get('/payment/{token}', [PaymentController::class, 'show'])->name('payment.show');
Route::get('/payment/{token}/submit', [PaymentController::class, 'createSubmit'])->name('payment.submit');
Route::post('/payment/{token}/submit', [PaymentController::class, 'storeSubmit'])->name('payment.submit.store');
Route::get('/payment/{token}/submitted', [PaymentController::class, 'submitted'])->name('payment.submitted');

Route::redirect('/admin', '/admin/dashboard');

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/payments', [PaymentReviewController::class, 'index'])->name('payments.index');
    Route::post('/payments/{id}/verify', [PaymentReviewController::class, 'verify'])->name('payments.verify');
    Route::post('/payments/{id}/reject', [PaymentReviewController::class, 'reject'])->name('payments.reject');
    Route::get('/registrations', [RegistrationAdminController::class, 'index'])->name('registrations.index');
    Route::get('/registrations/{id}', [RegistrationAdminController::class, 'show'])->name('registrations.show');
});

Route::get('/dashboard', fn () => redirect()->route('admin.dashboard'))
    ->middleware(['auth'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
