"use client";

import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("1. Submit clicked");

    setError("");
    setLoading(true);

    try {
      console.log("2. Calling Supabase...");

      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("3. Supabase response:", result);

      if (result.error) {
        console.log("4. Login failed:", result.error.message);

        setError(result.error.message);
        setLoading(false);
        return;
      }

      console.log("5. Login successful");

      setLoading(false);

      console.log("Redirecting to admin...");

      window.location.href = "/admin";
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  };



  return (
    <main className="min-h-screen bg-[#f6f8f5]">
      <div className="flex min-h-screen">

        {/* Left Side */}
        <div className="relative hidden overflow-hidden bg-[#173b24] lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-linear-to-br from-[#0c321d] via-[#17653a] to-[#0b2a19]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full bg-white p-1">
                <Image
                  src="/images/logo.png"
                  alt="Anandpur Shri Radha Raman Seva Samiti"
                  fill
                  sizes="64px"
                  className="rounded-full object-contain"
                />
              </div>

              <div className="text-white">
                <h1 className="text-lg font-extrabold leading-tight">
                  Anandpur Shri
                </h1>

                <p className="text-sm text-white/80">
                  Radha Raman Seva Samiti
                </p>
              </div>
            </Link>

            {/* Main Content */}
            <div className="max-w-xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl text-white backdrop-blur">
                <i className="fa-solid fa-shield-halved" />
              </div>

              <h2 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Welcome to the
                <br />
                Admin Panel
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/75">
                Manage volunteers, activities, donations and ID cards
                from one secure dashboard.
              </p>

              <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <i className="fa-solid fa-users text-xl text-[#f5c842]" />

                  <p className="mt-3 text-sm font-bold text-white">
                    Volunteers
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Manage applications
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <i className="fa-solid fa-hand-holding-heart text-xl text-[#f5c842]" />

                  <p className="mt-3 text-sm font-bold text-white">
                    Activities
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Manage NGO work
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-white/50">
              © 2026 Anandpur Shri Radha Raman Seva Samiti
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Link href="/">
                <div className="relative h-20 w-20">
                  <Image
                    src="/images/logo.png"
                    alt="Anandpur Shri Radha Raman Seva Samiti"
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-2 text-sm font-bold text-[#17653a]">
                ADMINISTRATION
              </p>

              <h1 className="text-3xl font-extrabold text-[#173b24]">
                Admin Login
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to access the administration dashboard.
              </p>
            </div>

            {/* Login Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

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
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="admin@example.com"
                      required
                      className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#17653a] focus:bg-white focus:ring-2 focus:ring-[#17653a]/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-bold text-gray-700"
                    >
                      Password
                    </label>
                    <Link
                      href="/admin/forgot-password"
                      className="text-sm font-semibold text-[#17653a] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="relative">
                    <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#17653a] focus:bg-white focus:ring-2 focus:ring-[#17653a]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#17653a]"
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

                {/* Remember */}



                {/* Login */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#17653a] text-sm font-bold text-white shadow-sm transition hover:bg-[#0e4d2b] active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-right-to-bracket" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Security */}
              <div className="mt-6 flex items-start gap-3 rounded-lg bg-[#f6f8f5] p-4">
                <i className="fa-solid fa-lock mt-0.5 text-sm text-[#17653a]" />

                <p className="text-xs leading-5 text-gray-500">
                  This area is restricted to authorized administrators
                  only.
                </p>
              </div>
            </div>

            {/* Back */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#17653a]"
              >
                <i className="fa-solid fa-arrow-left" />
                Back to Website
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}