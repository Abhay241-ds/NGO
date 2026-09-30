import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    volunteerId: string;
  }>;
};

export default async function VerifyVolunteer({ params }: Props) {
  const { volunteerId } = await params;

  const supabase = await createClient();

  const { data: volunteer, error } = await supabase
    .from("volunteer_verification")
    .select(
      "volunteer_id, name, photo_path, city, category, status, created_at"
    )
    .eq("volunteer_id", volunteerId)
    .maybeSingle();

  console.log("Verification ID:", volunteerId);
  console.log("Verification volunteer:", volunteer);
  console.log("Verification error:", error);

  // Volunteer not found
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
              {volunteerId}
            </p>
          </div>

        </div>
      </main>
    );
  }

  const isApproved =
    volunteer.status?.toLowerCase() === "approved";

  return (
    <main className="min-h-screen bg-[#f6f8f4] px-4 py-12">
      <div className="mx-auto max-w-md">

        {/* Header */}
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

        {/* Verification Card */}
        <div className="rounded-b-2xl bg-white p-6 shadow-xl">

          {/* Status */}
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

          {/* Volunteer Details */}
          <div className="mt-7 space-y-4">

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">
                Volunteer ID
              </span>

              <span className="text-sm font-bold text-[#173b24]">
                {volunteer.volunteer_id}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">
                Name
              </span>

              <span className="text-sm font-bold text-[#173b24]">
                {volunteer.name}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">
                City
              </span>

              <span className="text-sm font-bold text-[#173b24]">
                {volunteer.city || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">
                Category
              </span>

              <span className="text-sm font-bold text-[#173b24]">
                {volunteer.category || "General"}
              </span>
            </div>

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

          {/* Verification Notice */}
          <div className="mt-7 rounded-xl bg-[#f6f8f4] p-4 text-center">
            <p className="text-xs leading-5 text-gray-500">
              This volunteer ID has been verified against the
              official records of Anandpur Shri Radha Raman Seva Samiti.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}