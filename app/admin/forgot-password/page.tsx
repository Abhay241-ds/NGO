"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    // Check whether this email belongs to an active admin
    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_admin_email", {
        check_email: cleanEmail,
      });

    if (adminError) {
      console.error(adminError);
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    if (!isAdmin) {
      setError("This email is not registered as an administrator.");
      setLoading(false);
      return;
    }





    // Send password reset email
    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: "http://localhost:3000/auth/callback",
      });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage(
        "Password reset link has been sent to your email."
      );
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8f5] px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">

        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf4ed] text-xl text-[#17653a]">
            <i className="fa-solid fa-key" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold text-[#173b24]">
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter your administrator email address and we'll
            send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Email Address
            </label>

            <div className="relative">
              <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#17653a] focus:bg-white focus:ring-2 focus:ring-[#17653a]/10"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#17653a] text-sm font-bold text-white transition hover:bg-[#0e4d2b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />
                Checking...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane" />
                Send Reset Link
              </>
            )}
          </button>
        </form>

        {/* Back */}
        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="text-sm font-semibold text-gray-500 transition hover:text-[#17653a]"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}