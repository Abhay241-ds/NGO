"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { supabase } from "@/lib/supabase/client";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  const [mobileMenu, setMobileMenu] = useState(false);

  // Sign out admin when leaving the admin area through the logo
  const handleAdminExit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.auth.signOut();
    }
  };

  const navItems = [
    {
      hi: "होम",
      en: "Home",
      href: "/",
    },
    {
      hi: "हमारे बारे में",
      en: "About Us",
      href: "/about",
    },
    {
      hi: "गतिविधियाँ",
      en: "Activities",
      href: "/activities",
    },
    {
      hi: "संपर्क करें",
      en: "Contact Us",
      href: "/contact",
    },
    {
      hi: "वॉलंटियर बनें",
      en: "Become a Volunteer",
      href: "/volunteer",
    },
  ];

  // Check active page
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* =====================================================
          MAIN HEADER
      ====================================================== */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex min-h-19 max-w-7xl items-center px-4 lg:min-h-20.5 lg:px-6">
          {/* =================================================
              LOGO + ORGANIZATION NAME
          ================================================== */}
          <Link
            href="/"
            onClick={async (e) => {
              e.preventDefault();

              await handleAdminExit();
              closeMobileMenu();

              window.location.href = "/";
            }}
            className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
          >
            {/* Logo */}
            <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
              <Image
                src="/images/logo.png"
                fill
                priority
                sizes="56px"
                className="object-contain"
                alt="Anandpur Shri Radha Raman Seva Samiti Logo"
              />
            </div>

            {/* Organization Name */}
            <div className="min-w-0">
              <h1 className="max-w-52.5 text-sm font-extrabold leading-tight text-[#173b24] sm:max-w-65 sm:text-base lg:max-w-70 lg:text-lg">
                {t(
                  "आनंदपुर श्री राधा रमण सेवा समिति",
                  "Anandpur Shri Radha Raman Seva Samiti"
                )}
              </h1>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}
          <nav
            aria-label="Main navigation"
            className="ml-auto hidden h-full items-center lg:flex"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-full items-center px-3.5 text-sm font-semibold transition xl:px-4 ${
                    active
                      ? "text-[#17653a]"
                      : "text-gray-700 hover:text-[#17653a]"
                  }`}
                >
                  {t(item.hi, item.en)}

                  {/* Active Page Indicator */}
                  <span
                    className={`absolute bottom-0 left-3.5 right-3.5 h-0.75 rounded-t-full bg-[#17653a] transition-opacity xl:left-4 xl:right-4 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Language Button */}
            <button
              type="button"
              onClick={() =>
                setLanguage(language === "hi" ? "en" : "hi")
              }
              className="ml-4 hidden cursor-pointer rounded-lg border bg-[#17653a] px-4 py-2 text-sm font-bold text-white duration-300 hover:bg-[#F5C842] hover:text-[#17653a] lg:block"
            >
              {language === "hi" ? "English" : "हिंदी"}
            </button>
          </nav>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================== */}
          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label={
              mobileMenu
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenu}
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-[#173b24] transition hover:bg-[#f5f8f3] lg:hidden"
          >
            {mobileMenu ? (
              /* X icon */
              <span className="text-2xl leading-none">×</span>
            ) : (
              /* Hamburger */
              <span className="flex flex-col gap-1.25">
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
              </span>
            )}
          </button>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}
        {mobileMenu && (
          <div className="border-t border-gray-200 bg-white lg:hidden">
            <nav
              aria-label="Mobile navigation"
              className="mx-auto max-w-7xl px-4 py-3"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? "bg-[#eef5eb] text-[#17653a]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#17653a]"
                      }`}
                    >
                      {t(item.hi, item.en)}
                    </Link>
                  );
                })}

                {/* Mobile Language Button */}
                <button
                  type="button"
                  onClick={() =>
                    setLanguage(language === "hi" ? "en" : "hi")
                  }
                  className="mt-2 w-full cursor-pointer rounded-lg border border-[#17653a] bg-[#17653a] px-4 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#F5C842] hover:text-[#17653a]"
                >
                  {language === "hi" ? "English" : "हिंदी"}
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}