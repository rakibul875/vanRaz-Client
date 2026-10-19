"use client";

import { Field, PrimaryButton, TextInput } from "@/components/auth/fields";
import { authClient } from "@/lib/auth-client";
import { User, KeyRound, Shield, Bell } from "lucide-react";

export default function Profile() {
  const { data: session } = authClient.useSession();

  const name = session?.user?.name || "User Name";
  const email = session?.user?.email || "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl space-y-8 mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account details, security settings, and profile
          preferences.
        </p>
      </div>

      {/* User Overview Card */}
      <div className="flex items-center gap-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-2xl font-bold text-white shadow-sm shadow-purple-600/30">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-gray-900">{name}</h3>
          <p className="truncate text-sm text-gray-500">{email}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-100">
            Verified Account
          </span>
        </div>
      </div>

      {/* Section 1: Personal Details */}
      <div className="rounded-2xl border border-purple-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-purple-100 p-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <User size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Personal Details</h3>
            <p className="text-xs text-gray-500">
              Update your account display information
            </p>
          </div>
        </div>

        <form className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Field label="Full name" htmlFor="name" />
              <TextInput
                id="name"
                type="text"
                defaultValue={name}
                className="mt-1.5 focus:border-purple-600 focus:ring-purple-600/20"
              />
            </div>

            <div>
              <Field label="Email address" htmlFor="email" />
              <TextInput
                id="email"
                type="email"
                defaultValue={email}
                disabled
                className="mt-1.5 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2">
            <PrimaryButton
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/20"
            >
              Save Changes
            </PrimaryButton>
          </div>
        </form>
      </div>

      {/* Section 2: Password & Security */}
      <div className="rounded-2xl border border-purple-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-purple-100 p-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <KeyRound size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Password & Security</h3>
            <p className="text-xs text-gray-500">
              Change your password to keep your account secure
            </p>
          </div>
        </div>

        <form className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Field label="Current Password" htmlFor="currentPassword" />
              <TextInput
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                className="mt-1.5"
              />
            </div>

            <div>
              <Field label="New Password" htmlFor="newPassword" />
              <TextInput
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="mt-1.5"
              />
            </div>

            <div>
              <Field label="Confirm Password" htmlFor="confirmPassword" />
              <TextInput
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="pt-2">
            <PrimaryButton
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/20"
            >
              Update Password
            </PrimaryButton>
          </div>
        </form>
      </div>

      {/* Section 3: Preferences */}
      <div className="rounded-2xl border border-purple-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-purple-100 p-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Bell size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Notifications & Communications
            </h3>
            <p className="text-xs text-gray-500">
              Manage your email notification settings
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between cursor-pointer rounded-xl border border-purple-100 p-4 hover:bg-purple-50/30 transition-colors">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Order Updates
              </p>
              <p className="text-xs text-gray-500">
                Receive email alerts for order status changes
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-600/30"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer rounded-xl border border-purple-100 p-4 hover:bg-purple-50/30 transition-colors">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Promotions & Vendor Announcements
              </p>
              <p className="text-xs text-gray-500">
                Get updates about special offers and new marketplace features
              </p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-600/30"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
