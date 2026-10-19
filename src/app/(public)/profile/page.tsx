"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Calendar,
  Save,
  Eye,
  EyeOff,
  ArrowLeft,
  LogOut,
  Camera,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState<"personal" | "security">(
    "personal",
  );

  // Personal info form
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { totalItems } = useCart();
  const [signingOut, setSigningOut] = useState(false);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const initial =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setNameError("");
    setNameSuccess(false);

    if (!displayName.trim()) {
      setNameError("Name cannot be empty.");
      return;
    }

    setSavingName(true);
    try {
      await authClient.$fetch("/update-user", {
        method: "POST",
        body: { name: displayName.trim() },
      });
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch {
      setNameError("Failed to update name. Please try again.");
    } finally {
      setSavingName(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword) {
      setPasswordError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await authClient.$fetch("/change-password", {
        method: "POST",
        body: {
          currentPassword,
          newPassword,
        },
      });

      if (res.error) {
        setPasswordError(res.error.message || "Current password is incorrect.");
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      setPasswordError("Failed to change password. Please try again.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6B7268] transition-colors hover:text-[#0E1B1B]"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to shop
        </Link>

        {/* Profile Header Card */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#DEDACE] bg-white shadow-sm">
          {/* Banner accent */}
          <div className="h-28 bg-gradient-to-r from-[#0E1B1B] via-[#1a3330] to-[#0E1B1B]">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#C08A3E]/10 blur-3xl" />
          </div>

          <div className="relative -mt-14 px-6 pb-6 sm:px-8">
            {/* Avatar */}
            <div className="relative mb-4 inline-block">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#0E1B1B] text-3xl font-bold text-white shadow-lg">
                {initial}
              </div>
              <button
                type="button"
                aria-label="Change avatar"
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#C08A3E] text-white shadow-md transition hover:bg-[#a87732]"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#0E1B1B]">
                  {user?.name || "VenRaz User"}
                </h1>
                <p className="mt-0.5 text-sm text-[#6B7268]">{user?.email}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0E1B1B]/5 px-3 py-1 text-xs font-semibold text-[#0E1B1B]">
                    <ShieldCheck size={12} />
                    Verified member
                  </span>
                  {memberSince && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#9A9E96]">
                      <Calendar size={12} />
                      Member since {memberSince}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-500/10 disabled:opacity-50"
              >
                <LogOut size={16} />
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-[#DEDACE] bg-white p-1 shadow-sm">
          {(
            [
              { key: "personal", label: "Personal Information", icon: User },
              { key: "security", label: "Password & Security", icon: Lock },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#ff594d] text-white shadow-sm"
                    : "text-[#6B7268] hover:bg-[#F4F2EC] hover:text-[#0E1B1B]"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            {/* Name Form */}
            <form
              onSubmit={handleSaveName}
              className="rounded-2xl border border-[#DEDACE] bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="mb-1 text-lg font-bold text-[#0E1B1B]">
                Personal details
              </h2>
              <p className="mb-6 text-sm text-[#6B7268]">
                Update your name and how others see you on VenRaz.
              </p>

              {nameError && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#E3B9A6] bg-[#FBEEE8] px-4 py-3 text-sm text-[#9B4A2D]">
                  <AlertCircle size={16} />
                  {nameError}
                </div>
              )}

              {nameSuccess && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 size={16} />
                  Profile updated successfully.
                </div>
              )}

              <div className="space-y-5">
                {/* Display Name */}
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-sm font-medium text-[#2A2E2B]"
                  >
                    Display name
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9E96]">
                      <User size={16} />
                    </span>
                    <input
                      id="profile-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-xl border border-[#DEDACE] bg-[#FAF9F6] py-3 pl-10 pr-4 text-[15px] text-[#14181B] outline-none transition placeholder:text-[#A6A196] focus:border-[#C08A3E] focus:ring-4 focus:ring-[#C08A3E]/15"
                      placeholder="Your display name"
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-2 block text-sm font-medium text-[#2A2E2B]"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9E96]">
                      <Mail size={16} />
                    </span>
                    <input
                      id="profile-email"
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-[#DEDACE] bg-gray-50 py-3 pl-10 pr-4 text-[15px] text-[#6B7268] outline-none"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-[#9A9E96]">
                    Contact support to change your email address.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={savingName}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0E1B1B] px-6 py-3 text-sm font-semibold text-[#FBFAF7] transition hover:bg-[#16302E] focus:outline-none focus:ring-4 focus:ring-[#0E1B1B]/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />
                  {savingName ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>

            {/* Account Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Total Orders",
                  value: `${totalItems}`,
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  label: "Wishlist Items",
                  value: "5",
                  color: "bg-rose-50 text-rose-600",
                },
                {
                  label: "Reviews Given",
                  value: "8",
                  color: "bg-amber-50 text-amber-600",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#DEDACE] bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-medium text-[#6B7268]">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#0E1B1B]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="rounded-2xl border border-[#DEDACE] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-1 text-lg font-bold text-[#0E1B1B]">
              Change password
            </h2>
            <p className="mb-6 text-sm text-[#6B7268]">
              Ensure your account stays secure by using a strong, unique
              password.
            </p>

            {passwordError && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#E3B9A6] bg-[#FBEEE8] px-4 py-3 text-sm text-[#9B4A2D]">
                <AlertCircle size={16} />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 size={16} />
                Password changed successfully.
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-5">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="current-password"
                  className="mb-2 block text-sm font-medium text-[#2A2E2B]"
                >
                  Current password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9E96]">
                    <Lock size={16} />
                  </span>
                  <input
                    id="current-password"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#DEDACE] bg-[#FAF9F6] py-3 pl-10 pr-12 text-[15px] text-[#14181B] outline-none transition placeholder:text-[#A6A196] focus:border-[#C08A3E] focus:ring-4 focus:ring-[#C08A3E]/15"
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9E96] transition hover:text-[#0E1B1B]"
                    aria-label={showCurrent ? "Hide password" : "Show password"}
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-medium text-[#2A2E2B]"
                >
                  New password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9E96]">
                    <Lock size={16} />
                  </span>
                  <input
                    id="new-password"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#DEDACE] bg-[#FAF9F6] py-3 pl-10 pr-12 text-[15px] text-[#14181B] outline-none transition placeholder:text-[#A6A196] focus:border-[#C08A3E] focus:ring-4 focus:ring-[#C08A3E]/15"
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9E96] transition hover:text-[#0E1B1B]"
                    aria-label={showNew ? "Hide password" : "Show password"}
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {newPassword.length > 0 && newPassword.length < 8 && (
                  <p className="mt-1.5 text-xs text-amber-600">
                    Must be at least 8 characters.
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="mb-2 block text-sm font-medium text-[#2A2E2B]"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9E96]">
                    <Lock size={16} />
                  </span>
                  <input
                    id="confirm-new-password"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#DEDACE] bg-[#FAF9F6] py-3 pl-10 pr-4 text-[15px] text-[#14181B] outline-none transition placeholder:text-[#A6A196] focus:border-[#C08A3E] focus:ring-4 focus:ring-[#C08A3E]/15"
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                  />
                </div>
                {confirmNewPassword.length > 0 &&
                  newPassword !== confirmNewPassword && (
                    <p className="mt-1.5 text-xs text-amber-600">
                      Passwords do not match.
                    </p>
                  )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0E1B1B] px-6 py-3 text-sm font-semibold text-[#FBFAF7] transition hover:bg-[#16302E] focus:outline-none focus:ring-4 focus:ring-[#0E1B1B]/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Lock size={16} />
                  {savingPassword ? "Updating..." : "Update password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
