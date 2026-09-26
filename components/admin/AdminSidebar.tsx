"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: "fa-solid fa-chart-line",
  },
  {
    name: "Volunteers",
    href: "/admin/volunteers",
    icon: "fa-solid fa-users",
  },
  {
    name: "Activities",
    href: "/admin/activities",
    icon: "fa-solid fa-hand-holding-heart",
  },
  {
    name: "Donations",
    href: "/admin/donations",
    icon: "fa-solid fa-indian-rupee-sign",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* =========================
          MOBILE TOP BAR
      ========================== */}


      {/* =========================
          MOBILE MENU
      ========================== */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          />

          {/* Drawer */}
          <aside className="fixed left-0 top-0 z-50 flex h-screen w-70 flex-col bg-white shadow-2xl lg:hidden">
            {/* Drawer Header */}
            <div className="flex h-20 items-center justify-between border-b border-gray-200 px-5">
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#17653a] p-1.5">
                  <Image
                    src="/logo.png"
                    alt="Anandpur Shri Radha Raman Seva Samiti"
                    width={44}
                    height={44}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <h1 className="text-xs font-extrabold leading-tight text-gray-800">
                    Anandpur Shri Radha
                  </h1>

                  <p className="text-[11px] text-gray-500">
                    Raman Seva Samiti
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-5">
              <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-400">
                Main Menu
              </p>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${active
                        ? "bg-[#eaf4ed] text-[#17653a]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#17653a]"
                        }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${active
                          ? "bg-[#17653a] text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-[#eaf4ed] group-hover:text-[#17653a]"
                          }`}
                      >
                        <i className={`${item.icon} text-sm`} />
                      </span>

                      <span className="flex-1">{item.name}</span>

                      {active && (
                        <i className="fa-solid fa-chevron-right text-[10px]" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Bottom */}
            <div className="border-t border-gray-200 p-3">
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#f6f8f5] p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17653a] text-white">
                  <i className="fa-solid fa-user text-sm" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-gray-800">
                    Administrator
                  </p>

                  <p className="text-[10px] text-gray-500">
                    Admin Account
                  </p>
                </div>
              </div>

              <LogoutButton />
            </div>
          </aside>
        </>
      )}

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 self-start border-r border-gray-200 bg-white lg:flex lg:flex-col">
        {/* Logo */}


        {/* Menu */}
        <div className="px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-400">
            Main Menu
          </p>

          <nav className="">
            {menuItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active
                    ? "bg-[#eaf4ed] text-[#17653a]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#17653a]"
                    }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-[#17653a]" />
                  )}

                  {/* Icon */}
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${active
                      ? "bg-[#17653a] text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 group-hover:bg-[#eaf4ed] group-hover:text-[#17653a]"
                      }`}
                  >
                    <i className={`${item.icon} text-sm`} />
                  </span>

                  {/* Name */}
                  <span className="flex-1">
                    {item.name}
                  </span>

                  {/* Arrow */}
                  {active && (
                    <i className="fa-solid fa-chevron-right text-[10px] text-[#17653a]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        {/* Bottom */}
        <div className="shrink-0 border-t border-gray-200 p-3">
          {/* Admin profile */}
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#f6f8f5] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#17653a] text-white">
              <i className="fa-solid fa-user text-sm" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-gray-800">
                Administrator
              </p>

              <p className="text-[10px] text-gray-500">
                Admin Account
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
