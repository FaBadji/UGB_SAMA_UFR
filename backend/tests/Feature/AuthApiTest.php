<?php

namespace Tests\Feature;

use App\Mail\PasswordResetCodeMail;
use App\Mail\VerificationCodeMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_creates_an_account_and_returns_an_api_token(): void
    {
        $response = $this->postJson('/api/register', [
            'email' => 'student@example.test',
            'password' => 'StrongPassword123',
            'password_confirmation' => 'StrongPassword123',
            'filiere' => 'informatique',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.email', 'student@example.test')
            ->assertJsonPath('user.filiere', 'informatique')
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']]);

        $this->assertDatabaseHas('users', [
            'email' => 'student@example.test',
            'filiere' => 'informatique',
        ]);
        $this->assertTrue(Hash::check(
            'StrongPassword123',
            User::where('email', 'student@example.test')->value('password'),
        ));
    }

    public function test_login_profile_and_logout_routes_work_with_the_issued_token(): void
    {
        User::factory()->create([
            'email' => 'student@example.test',
            'password' => Hash::make('StrongPassword123'),
        ]);

        $login = $this->postJson('/api/login', [
            'email' => 'student@example.test',
            'password' => 'StrongPassword123',
        ])->assertOk();

        $token = $login->json('token');

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('email', 'student@example.test');

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'token' => hash('sha256', $token),
        ]);
    }

    public function test_registration_email_verification_route_accepts_the_sent_code(): void
    {
        config(['app.require_email_verification' => true]);
        Mail::fake();

        $this->postJson('/api/auth/register', [
            'email' => 'unverified@example.test',
            'password' => 'StrongPassword123',
            'password_confirmation' => 'StrongPassword123',
        ])->assertCreated();

        $code = null;
        Mail::assertSent(VerificationCodeMail::class, function (VerificationCodeMail $mail) use (&$code): bool {
            $code = $mail->code;

            return true;
        });

        $this->postJson('/api/email/verify', [
            'email' => 'unverified@example.test',
            'code' => $code,
        ])
            ->assertOk()
            ->assertJsonPath('verified', true);

        $this->assertNotNull(User::where('email', 'unverified@example.test')->firstOrFail()->email_verified_at);
    }

    public function test_password_reset_routes_send_and_accept_a_reset_code(): void
    {
        Mail::fake();
        User::factory()->create(['email' => 'student@example.test']);

        $this->postJson('/api/forgot-password', [
            'email' => 'student@example.test',
        ])->assertOk();

        $code = null;
        Mail::assertSent(PasswordResetCodeMail::class, function (PasswordResetCodeMail $mail) use (&$code): bool {
            $code = $mail->code;

            return true;
        });

        $this->postJson('/api/reset-password', [
            'email' => 'student@example.test',
            'code' => $code,
            'password' => 'NewStrongPassword123',
            'password_confirmation' => 'NewStrongPassword123',
        ])->assertOk();

        $this->assertTrue(Hash::check(
            'NewStrongPassword123',
            User::where('email', 'student@example.test')->value('password'),
        ));
    }
}
