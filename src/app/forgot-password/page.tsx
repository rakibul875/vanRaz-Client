"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import AuthFormShell from "@/components/auth/auth-form-shell";
import { ErrorBanner, Field, PrimaryButton, TextInput } from "@/components/auth/fields";



export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError("");
  setSuccessMessage("");
  setLoading(true);

  try {
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      setError(
        error.message || "Failed to send reset link. Please check your email."
      );
      return;
    }

    setSuccessMessage(
      "Password reset instructions have been sent to your email."
    );
  } catch {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <AuthFormShell
      eyebrow="Account recovery"
      headline="Don't worry, we've got you covered."
      body="Enter your registered email address to receive a secure password reset link."
      title="Forgot password"
      subtitle="We will email you recovery instructions."
      footer={
        <p className="text-sm text-[#6B7268]">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-[#0E1B1B] hover:text-[#C08A3E]">
            Back to sign in
          </Link>
        </p>
      }
    >
      {error && <ErrorBanner message={error} />}

      {successMessage ? (
        <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200 text-sm text-emerald-800">
          {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Field label="Email address" htmlFor="email" />
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <PrimaryButton type="submit" loading={loading} loadingText="Sending link…">
            Send Reset Link
          </PrimaryButton>
        </form>
      )}
    </AuthFormShell>
  );
}