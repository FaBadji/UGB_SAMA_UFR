<?php

namespace App\Models;

use App\Mail\PasswordResetCodeMail;
use App\Mail\VerificationCodeMail;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'filiere'])]
#[Hidden(['password', 'remember_token', 'email_verification_code'])]
class User extends Authenticatable implements MustVerifyEmailContract
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, MustVerifyEmailTrait;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'email_verification_expires_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function generateEmailVerificationCode(): string
    {
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $this->forceFill([
            'email_verification_code' => Hash::make($code),
            'email_verification_expires_at' => now()->addMinutes(15),
        ])->save();

        return $code;
    }

    public function verifyEmailCode(string $code): bool
    {
        if ($this->email_verified_at !== null) {
            return true;
        }

        if (!$this->email_verification_code || !$this->email_verification_expires_at || $this->email_verification_expires_at->isPast()) {
            return false;
        }

        if (!Hash::check($code, $this->email_verification_code)) {
            return false;
        }

        $this->forceFill([
            'email_verified_at' => now(),
            'email_verification_code' => null,
            'email_verification_expires_at' => null,
        ])->save();

        return true;
    }

    public function sendEmailVerificationNotification(): void
    {
        $code = $this->generateEmailVerificationCode();
        Mail::to($this->email)->send(new VerificationCodeMail($code, $this->name));
    }

    public function sendPasswordResetCode(): string
    {
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        \DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $this->email],
            [
                'token' => Hash::make($code),
                'created_at' => now(),
            ]
        );

        Mail::to($this->email)->send(new PasswordResetCodeMail($code, $this->name));

        return $code;
    }

    public function resetPasswordWithCode(string $code, string $password): bool
    {
        $record = \DB::table('password_reset_tokens')->where('email', $this->email)->first();

        if (!$record || !$record->created_at) {
            return false;
        }

        if (now()->diffInMinutes($record->created_at) > 15) {
            return false;
        }

        if (!Hash::check($code, $record->token)) {
            return false;
        }

        $this->forceFill([
            'password' => Hash::make($password),
            'remember_token' => \Illuminate\Support\Str::random(60),
        ])->save();

        \DB::table('password_reset_tokens')->where('email', $this->email)->delete();

        $this->tokens()->delete();

        return true;
    }
}
