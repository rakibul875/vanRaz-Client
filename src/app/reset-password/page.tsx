"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import AuthFormShell from "@/components/auth/auth-form-shell";
import {
  ErrorBanner,
  Field,
  PrimaryButton,
  TextInput,
} from "@/components/auth/fields";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("This password reset link is invalid or has expired.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setError(
          error.message || "Unable to reset your password. Please try again."
        );
        return;
      }

      setSuccessMessage(
        "Your password has been reset successfully. You can now sign in."
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
      headline="Create a new password."
      body="Choose a strong password for your account."
      title="Reset password"
      subtitle="Enter your new password below."
      footer={
        <p className="text-sm text-[#6B7268]">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#0E1B1B] hover:text-[#C08A3E]"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      {error && <ErrorBanner message={error} />}

      {successMessage ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {successMessage}
          </div>

          <Link
            href="/login"
            className="block text-center font-semibold text-[#0E1B1B] hover:text-[#C08A3E]"
          >
            Continue to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Field
              label="New password"
              htmlFor="password"
            />

            <TextInput
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your new password"
            />
          </div>

          <div>
            <Field
              label="Confirm new password"
              htmlFor="confirmPassword"
            />

            <TextInput
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm your new password"
            />
          </div>

          <PrimaryButton
            type="submit"
            loading={loading}
            loadingText="Resetting password…"
          >
            Reset Password
          </PrimaryButton>
        </form>
      )}
    </AuthFormShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading reset form...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}