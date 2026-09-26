"use client";

import { useState } from "react";

export default function AdminHeader() {
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-20 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-5 lg:px-8">
        {/* Left */}
        <a href="/admin" className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17653a] font-bold text-white shadow-sm">
              <i className="fa-solid fa-user" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#173b24] sm:text-2xl">
              Admin Panel
            </h1>

            <p className="hidden text-sm text-gray-500 sm:block">
              Manage your NGO website
            </p>
          </div>
        </a>

        {/* Right */}
        <div className="flex items-center gap-3">


          {/* Admin profile */}

        </div>
      </div>
    </header>
  );
}