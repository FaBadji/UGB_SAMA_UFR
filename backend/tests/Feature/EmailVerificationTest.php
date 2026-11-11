<?php

namespace Tests\Feature;

use App\Mail\VerificationCodeMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use RuntimeException;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Mail::fake();
    }

    public function test_registration_sends_a_verification_code_and_does_not_issue_a_token(): void
    {
        config(['app.require_email_verification' => true]);

        $response = $this->postJson('/api/register', [
            'email' => 'etudiant@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'filiere' => 'informatique',
        ]);

        $response->assertCreated()
            ->assertJsonPath('requires_email_verification', true)
            ->assertJsonPath('verification_email_sent', true)
            ->assertJsonPath('user.email_verified_at', null);

        $this->assertArrayNotHasKey('token', $response->json());
        $this->assertArrayNotHasKey('access_token', $response->json());

        $user = User::where('email', 'etudiant@example.com')->firstOrFail();

        $this->assertFalse($user->hasVerifiedEmail());
        $this->assertNotNull($user->email_verification_code);
        $this->assertNotNull($user->email_verification_expires_at);

        Mail::assertSent(
            VerificationCodeMail::class,
            fn (VerificationCodeMail $mail): bool => $mail->hasTo('etudiant@example.com'),
        );
    }

    public function test_registration_marks_the_account_as_verified_when_verification_is_disabled(): void
    {
        config(['app.require_email_verification' => false]);

        $response = $this->postJson('/api/register', [
            'email' => 'etudiant@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('requires_email_verification', false)
            ->assertJsonPath('verification_email_sent', false)
            ->assertJsonStructure(['token', 'access_token', 'user']);

        $user = User::where('email', 'etudiant@example.com')->firstOrFail();

        $this->assertTrue($user->hasVerifiedEmail());
        Mail::assertNothingSent();
    }

    public function test_registration_still_succeeds_when_the_verification_email_cannot_be_sent(): void
    {
        config(['app.require_email_verification' => true]);

        Mail::shouldReceive('to')
            ->once()
            ->andThrow(new RuntimeException('Mail transport unavailable.'));

        $response = $this->postJson('/api/register', [
            'email' => 'etudiant@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('requires_email_verification', true)
            ->assertJsonPath('verification_email_sent', false);

        $this->assertDatabaseHas('users', [
            'email' => 'etudiant@example.com',
            'email_verified_at' => null,
        ]);
    }

    public function test_a_user_can_verify_their_email_with_the_received_code(): void
    {
        config(['app.require_email_verification' => true]);

        $this->postJson('/api/register', [
            'email' => 'etudiant@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertCreated();

        $code = $this->sentVerificationCode();

        $response = $this->postJson('/api/email/verify', [
            'email' => 'etudiant@example.com',
            'code' => $code,
        ]);

        $response->assertOk()
            ->assertJsonPath('verified', true)
            ->assertJsonPath('user.email', 'etudiant@example.com');

        $user = User::where('email', 'etudiant@example.com')->firstOrFail();

        $this->assertTrue($user->hasVerifiedEmail());
        $this->assertNull($user->email_verification_code);
        $this->assertNull($user->email_verification_expires_at);
    }

    public function test_an_invalid_code_does_not_verify_the_email(): void
    {
        $user = User::factory()->unverified()->create();
        $code = $user->generateEmailVerificationCode();
        $wrongCode = $code === '000000' ? '111111' : '000000';

        $this->postJson('/api/email/verify', [
            'email' => $user->email,
            'code' => $wrongCode,
        ])->assertUnprocessable()
            ->assertJsonPath('verified', false);

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_an_expired_code_does_not_verify_the_email(): void
    {
        $user = User::factory()->unverified()->create();
        $code = $user->generateEmailVerificationCode();

        $user->forceFill(['email_verification_expires_at' => now()->subMinute()])->save();

        $this->postJson('/api/email/verify', [
            'email' => $user->email,
            'code' => $code,
        ])->assertUnprocessable()
            ->assertJsonPath('verified', false);

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_an_unverified_user_cannot_log_in_until_the_email_is_verified(): void
    {
        config(['app.require_email_verification' => true]);

        $user = User::factory()->unverified()->create([
            'email' => 'etudiant@example.com',
            'password' => 'password123',
        ]);

        $this->postJson('/api/login', [
            'email' => 'etudiant@example.com',
            'password' => 'password123',
        ])->assertForbidden()
            ->assertJsonPath('requires_email_verification', true)
            ->assertJsonPath('email_verified', false);

        $code = $user->generateEmailVerificationCode();

        $this->postJson('/api/email/verify', [
            'email' => 'etudiant@example.com',
            'code' => $code,
        ])->assertOk();

        $this->postJson('/api/login', [
            'email' => 'etudiant@example.com',
            'password' => 'password123',
        ])->assertOk()
            ->assertJsonPath('email_verified', true)
            ->assertJsonStructure(['token', 'access_token', 'user']);
    }

    public function test_a_new_code_can_be_requested_for_an_unverified_account(): void
    {
        $user = User::factory()->unverified()->create();
        $user->generateEmailVerificationCode();
        $previousCodeHash = $user->fresh()->email_verification_code;

        $this->postJson('/api/email/verification-notification', [
            'email' => $user->email,
        ])->assertOk()
            ->assertJsonPath('verified', false);

        Mail::assertSent(
            VerificationCodeMail::class,
            fn (VerificationCodeMail $mail): bool => $mail->hasTo($user->email),
        );

        $this->assertNotSame($previousCodeHash, $user->fresh()->email_verification_code);
    }

    public function test_requesting_a_code_for_an_unknown_address_does_not_reveal_whether_the_account_exists(): void
    {
        $this->postJson('/api/email/verification-notification', [
            'email' => 'inconnu@example.com',
        ])->assertOk()
            ->assertJsonPath('verified', false);

        Mail::assertNothingSent();
    }

    private function sentVerificationCode(): string
    {
        $code = null;

        Mail::assertSent(
            VerificationCodeMail::class,
            function (VerificationCodeMail $mail) use (&$code): bool {
                $code = $mail->code;

                return true;
            },
        );

        $this->assertIsString($code);
        $this->assertMatchesRegularExpression('/^\d{6}$/', $code);

        return $code;
    }
}
