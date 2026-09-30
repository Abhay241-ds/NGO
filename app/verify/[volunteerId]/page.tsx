"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
    params: Promise<{
        volunteerId: string;
    }>;
};

type Volunteer = {
    volunteer_id: string;
    name: string;
    city: string | null;
    category: string | null;
    status: string;
    photo_path?: string | null;
};

export default function VerifyVolunteer({ params }: Props) {
    const [volunteerId, setVolunteerId] = useState("");
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let mounted = true;

        async function verifyVolunteer() {
            try {
                // Get ID from URL
                const resolvedParams = await params;
                const id = resolvedParams.volunteerId;

                if (!mounted) return;

                setVolunteerId(id);

                // Browser Supabase client
                const supabase = createClient();

                // Check verification table
                const { data, error } = await supabase
                    .from("volunteer_verification")
                    .select(
                        "volunteer_id, name, city, category, status, photo_path"
                    )
                    .eq("volunteer_id", id)
                    .maybeSingle();

                console.log("VERIFY ID:", id);
                console.log("VOLUNTEER:", data);
                console.log("ERROR:", error);

                if (!mounted) return;

                if (error) {
                    setErrorMessage(error.message);
                    setVolunteer(null);
                } else {
                    setVolunteer(data);
                }

            } catch (error) {
                console.error("Verification error:", error);

                if (!mounted) return;

                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Unable to verify volunteer"
                );

                setVolunteer(null);

            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        verifyVolunteer();

        return () => {
            mounted = false;
        };
    }, [params]);


    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

                <div className="text-center">

                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#17653a]" />

                    <p className="mt-4 text-sm font-medium text-gray-600">
                        Verifying volunteer...
                    </p>

                </div>

            </main>
        );
    }


    /* =========================
       INVALID VOLUNTEER
    ========================= */

    if (!volunteer) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">

                        <span className="text-4xl font-bold text-red-600">
                            ×
                        </span>

                    </div>


                    <h1 className="mt-5 text-2xl font-extrabold text-red-600">
                        Invalid Volunteer
                    </h1>


                    <p className="mt-3 text-sm text-gray-500">
                        This volunteer ID could not be verified.
                    </p>


                    <div className="mt-5 rounded-xl bg-gray-100 p-4">

                        <p className="text-xs text-gray-500">
                            Volunteer ID
                        </p>

                        <p className="mt-1 font-bold text-[#173b24]">
                            {volunteerId || "Unknown"}
                        </p>

                    </div>


                    {errorMessage && (
                        <div className="mt-4 rounded-xl bg-red-50 p-3">

                            <p className="break-words text-xs text-red-600">
                                {errorMessage}
                            </p>

                        </div>
                    )}

                </div>

            </main>
        );
    }


    /* =========================
       STATUS
    ========================= */

    const isApproved =
        volunteer.status?.trim().toLowerCase() === "approved";


    /* =========================
       VERIFICATION PAGE
    ========================= */

    return (
        <main className="min-h-screen bg-[#f6f8f4] px-4 py-12">

            <div className="mx-auto max-w-md">


                {/* ================= HEADER ================= */}

                <div className="rounded-t-2xl bg-[#173b24] p-6 text-center text-white">

                    <img
                        src="/images/logo.png"
                        alt="Anandpur Shri Radha Raman Seva Samiti"
                        className="mx-auto h-16 w-16 rounded-full bg-white p-2 object-contain"
                    />


                    <h1 className="mt-4 text-lg font-extrabold">
                        Anandpur Shri Radha Raman
                        <br />
                        Seva Samiti
                    </h1>


                    <p className="mt-2 text-sm text-white/80">
                        Volunteer Verification
                    </p>

                </div>


                {/* ================= CARD ================= */}

                <div className="rounded-b-2xl bg-white p-6 shadow-xl">


                    {/* ================= STATUS ================= */}

                    <div className="text-center">

                        <div
                            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                                isApproved
                                    ? "bg-green-100"
                                    : "bg-red-100"
                            }`}
                        >

                            <span
                                className={`text-4xl font-bold ${
                                    isApproved
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {isApproved ? "✓" : "×"}
                            </span>

                        </div>


                        <h2
                            className={`mt-4 text-2xl font-extrabold ${
                                isApproved
                                    ? "text-green-700"
                                    : "text-red-700"
                            }`}
                        >
                            {isApproved
                                ? "Valid Volunteer"
                                : "Inactive Volunteer"}
                        </h2>


                        <p className="mt-2 text-sm text-gray-500">
                            {isApproved
                                ? "This volunteer ID is registered and approved."
                                : "This volunteer ID is not currently active."}
                        </p>

                    </div>


                    {/* ================= DETAILS ================= */}

                    <div className="mt-7 space-y-4">


                        {/* Volunteer ID */}

                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">

                            <span className="text-sm text-gray-500">
                                Volunteer ID
                            </span>

                            <span className="text-sm font-bold text-[#173b24]">
                                {volunteer.volunteer_id}
                            </span>

                        </div>


                        {/* Name */}

                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">

                            <span className="text-sm text-gray-500">
                                Name
                            </span>

                            <span className="ml-4 text-right text-sm font-bold text-[#173b24]">
                                {volunteer.name}
                            </span>

                        </div>


                        {/* City */}

                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">

                            <span className="text-sm text-gray-500">
                                City
                            </span>

                            <span className="text-sm font-bold text-[#173b24]">
                                {volunteer.city || "—"}
                            </span>

                        </div>


                        {/* Category */}

                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">

                            <span className="text-sm text-gray-500">
                                Category
                            </span>

                            <span className="text-sm font-bold text-[#173b24]">
                                {volunteer.category || "General"}
                            </span>

                        </div>


                        {/* Status */}

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-gray-500">
                                Status
                            </span>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                    isApproved
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {volunteer.status}
                            </span>

                        </div>

                    </div>


                    {/* ================= NOTICE ================= */}

                    <div className="mt-7 rounded-xl bg-[#f6f8f4] p-4 text-center">

                        <p className="text-xs leading-5 text-gray-500">
                            This volunteer ID has been verified against the
                            official records of Anandpur Shri Radha Raman
                            Seva Samiti.
                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
}