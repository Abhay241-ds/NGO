import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/admin/reset-password?error=missing_code",
        request.url
      )
    );
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error);

    return NextResponse.redirect(
      new URL(
        "/admin/reset-password?error=invalid_code",
        request.url
      )
    );
  }

  return NextResponse.redirect(
    new URL("/admin/reset-password", request.url)
  );
}