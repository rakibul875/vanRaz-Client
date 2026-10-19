"use client";
// register section are commit
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import AuthFormShell from "@/components/auth/auth-form-shell";
import {
  ErrorBanner,
  Field,
  PasswordInput,
  PrimaryButton,
  TextInput,
} from "@/components/auth/fields";
import { GoogleButton } from "@/components/auth/google-button";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setGoogleLoading(false);
      setError("Unable to sign in with Google. Please try again.");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Determine user role dynamically based on email
    // const role =
    //   email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
    //     ? "admin"
    //     : "customer";

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
        role: "user",
      });

      if (error) {
        setError(
          error.message || "Unable to create your account. Please try again.",
        );
        return;
      }

      if (data) {
        router.push("/");
        router.refresh();
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/sync-guest-orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="md:mt-10">
      <AuthFormShell
        eyebrow="Get started"
        headline="Build your next deal with a clear head."
        body="VenRaz keeps every relationship, term sheet, and follow-up in one calm, organized place."
        title="Create your account"
        subtitle="Join VenRaz and get set up in a couple of minutes."
        footer={
          <p className="text-sm text-[#6B7268]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#0E1B1B] hover:text-[#C08A3E]"
            >
              Sign in
            </Link>
          </p>
        }
      >
        {error && <ErrorBanner message={error} />}

        <div className="space-y-3 ">
          <GoogleButton
            loading={googleLoading}
            loadingText="Signing up with Google…"
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </GoogleButton>

          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-[#E4E1D8]" />
            <span className="text-xs font-medium uppercase tracking-wide text-[#9A9488]">
              or
            </span>
            <span className="h-px flex-1 bg-[#E4E1D8]" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Field label="Full name" htmlFor="name" />
            <TextInput
              id="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Field label="Email address" htmlFor="email" />
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Field label="Password" htmlFor="password" />
            <PasswordInput
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
            />
            <p className="mt-2 text-xs text-[#9A9488]">
              Use at least 8 characters.
            </p>
          </div>

          <div>
            <Field label="Confirm password" htmlFor="confirmPassword" />
            <PasswordInput
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
            />
          </div>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 rounded border-[#DEDACE] text-[#0E1B1B] focus:ring-[#C08A3E]"
            />
            <span className="text-xs leading-5 text-[#6B7268]">
              I agree to the VenRaz{" "}
              <Link
                href="/terms"
                className="font-medium text-[#0E1B1B] hover:text-[#C08A3E]"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-[#0E1B1B] hover:text-[#C08A3E]"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <PrimaryButton
            type="submit"
            loading={loading}
            loadingText="Creating account…"
          >
            Create account
          </PrimaryButton>
        </form>
      </AuthFormShell>
    </div>
  );
}
