"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ------------------------------------------------
  // Check recovery session
  // ------------------------------------------------

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);

          setError(
            "Unable to verify your reset session. Please request a new link."
          );

          setChecking(false);
          return;
        }

        console.log("Current session:", !!session);

        if (!session) {
          setError(
            "This password reset link is invalid or has expired. Please request a new link."
          );

          setChecking(false);
          return;
        }

        console.log("Password reset session found.");

        setChecking(false);
      } catch (err) {
        console.error("Password recovery error:", err);

        setError(
          "This password reset link is invalid or has expired. Please request a new link."
        );

        setChecking(false);
      }
    };

    checkSession();
  }, []);

  // ------------------------------------------------
  // Update password
  // ------------------------------------------------

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Check session before updating password
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Your reset session has expired. Please request a new password reset link."
        );

        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        console.error(
          "Password update error:",
          updateError
        );

        setError(updateError.message);
        setLoading(false);
        return;
      }

      setMessage(
        "Password updated successfully!"
      );

      // Give the user time to see success message
      setTimeout(async () => {
        await supabase.auth.signOut();

        router.replace("/admin/login");
      }, 1500);
    } catch (err) {
      console.error(
        "Unexpected password update error:",
        err
      );

      setError(
        "Unable to update password. Please try again."
      );

      setLoading(false);
    }
  };

  // ------------------------------------------------
  // Verifying screen
  // ------------------------------------------------

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f5] px-4">
        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf4ed] text-[#17653a]">
            <i className="fa-solid fa-spinner fa-spin text-xl" />
          </div>

          <p className="mt-4 text-sm font-semibold text-gray-600">
            Verifying Reset Link...
          </p>

        </div>
      </main>
    );
  }

  // ------------------------------------------------
  // Invalid link
  // ------------------------------------------------

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f5] px-4">

        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">

          {/* Error Icon */}

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <i className="fa-solid fa-circle-exclamation text-xl" />
          </div>

          {/* Heading */}

          <h1 className="text-xl font-bold text-[#173b24]">
            Reset Link Invalid
          </h1>

          {/* Message */}

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error}
          </p>

          {/* Request new link */}

          <button
            type="button"
            onClick={() =>
              router.replace(
                "/admin/forgot-password"
              )
            }
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#17653a] text-sm font-bold text-white transition hover:bg-[#0e4d2b]"
          >
            <i className="fa-solid fa-paper-plane" />
            Request New Link
          </button>

          {/* Back to login */}

          <button
            type="button"
            onClick={() =>
              router.replace("/admin/login")
            }
            className="mt-4 text-sm font-semibold text-gray-500 transition hover:text-[#17653a]"
          >
            ← Back to Login
          </button>

        </div>

      </main>
    );
  }

  // ------------------------------------------------
  // Reset password form
  // ------------------------------------------------

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
            Reset Password
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter your new password below.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* New Password */}

          <div>

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              New Password
            </label>

            <div className="relative">

              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter new password"
                required
                minLength={6}
                autoComplete="new-password"
                className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-12 text-sm text-gray-800 outline-none transition focus:border-[#17653a] focus:bg-white focus:ring-2 focus:ring-[#17653a]/10"
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#17653a]"
              >
                <i
                  className={
                    showPassword
                      ? "fa-regular fa-eye-slash"
                      : "fa-regular fa-eye"
                  }
                />
              </button>

            </div>

          </div>

          {/* Confirm Password */}

          <div>

            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Confirm Password
            </label>

            <div className="relative">

              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm new password"
                required
                minLength={6}
                autoComplete="new-password"
                className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-12 text-sm text-gray-800 outline-none transition focus:border-[#17653a] focus:bg-white focus:ring-2 focus:ring-[#17653a]/10"
              />

              <button
                type="button"
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#17653a]"
              >
                <i
                  className={
                    showConfirmPassword
                      ? "fa-regular fa-eye-slash"
                      : "fa-regular fa-eye"
                  }
                />
              </button>

            </div>

          </div>

          {/* Success */}

          {message && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
              <i className="fa-solid fa-circle-check" />
              <span>{message}</span>
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
              <i className="fa-solid fa-circle-exclamation" />
              <span>{error}</span>
            </div>
          )}

          {/* Update Password */}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#17653a] text-sm font-bold text-white transition hover:bg-[#0e4d2b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />
                Updating...
              </>
            ) : (
              <>
                <i className="fa-solid fa-key" />
                Update Password
              </>
            )}
          </button>

        </form>

        {/* Back to Login */}

        <div className="mt-6 text-center">

          <button
            type="button"
            onClick={() =>
              router.replace("/admin/login")
            }
            className="text-sm font-semibold text-gray-500 transition hover:text-[#17653a]"
          >
            ← Back to Login
          </button>

        </div>

      </div>

    </main>
  );
}