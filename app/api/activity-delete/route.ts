import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_current_user_admin");

    if (adminError) {
      console.error("Admin check error:", adminError);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify admin access.",
        },
        { status: 500 }
      );
    }

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin access required.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const publicId = body?.publicId;

    console.log("Cloudinary public ID:", publicId);

    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "publicId is required.",
        },
        { status: 400 }
      );
    }

    if (!publicId.startsWith("anandpur/activities/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid activity image.",
        },
        { status: 403 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      type: "upload",
      invalidate: true,
    });

    console.log("Cloudinary delete result:", result);

    if (result.result !== "ok") {
      return NextResponse.json(
        {
          success: false,
          error: `Cloudinary returned: ${result.result}`,
          result: result.result,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully.",
      publicId,
      result: result.result,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete image.",
      },
      { status: 500 }
    );
  }
}