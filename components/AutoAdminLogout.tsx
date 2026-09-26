"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AutoAdminLogout() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Optional: don't use this approach for navigation
    };

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
}