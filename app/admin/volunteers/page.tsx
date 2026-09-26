"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

type Volunteer = {
  photo_path: string | null;
  id: string;
  volunteer_id: string | null;
  name: string;
  email: string;
  phone: string;
  city: string;
  interest: string;
  category: string;
  message: string | null;
  status: string;
  created_at: string;
};

const interests = [
  "All Interests",
  "Social Service",
  "Education",
  "Environment",
  "Health",
  "Sports",
  "Other",
];

export default function VolunteersPage() {
  const getVolunteerPhotoUrl = (photoPath: string | null) => {
    if (!photoPath) return null;

    const { data } = supabase.storage
      .from("volunteer-photos")
      .getPublicUrl(photoPath);

    return data.publicUrl;
  };
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [interest, setInterest] = useState("All Interests");

  const [selectedVolunteer, setSelectedVolunteer] =
    useState<Volunteer | null>(null);

  const [idCardVolunteer, setIdCardVolunteer] =
    useState<Volunteer | null>(null);

  const [deleteVolunteer, setDeleteVolunteer] =
    useState<Volunteer | null>(null);

  const [deleting, setDeleting] = useState(false);

  // ============================================================
  // FETCH VOLUNTEERS
  // ============================================================

  const fetchVolunteers = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("volunteers")
      .select(
        "id, volunteer_id,name, photo_path, email, phone, city, interest, category, message, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching volunteers:", error);
      setError("Unable to load volunteer applications.");
      setLoading(false);
      return;
    }

    setVolunteers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const [updating, setUpdating] = useState<string | null>(null);

  const handleApprove = async (volunteer: Volunteer) => {
    setUpdating(volunteer.id);
    setError("");

    const { data, error: approveError } = await supabase.rpc(
      "approve_volunteer",
      {
        volunteer_uuid: volunteer.id,
      }
    );

    if (approveError) {
      console.error(approveError);
      setError(approveError.message);
      setUpdating(null);
      return;
    }

    const generatedVolunteerId = data as string;

    setVolunteers((prev) =>
      prev.map((item) =>
        item.id === volunteer.id
          ? {
            ...item,
            status: "approved",
            volunteer_id: generatedVolunteerId,
          }
          : item
      )
    );

    setSelectedVolunteer((prev) =>
      prev && prev.id === volunteer.id
        ? {
          ...prev,
          status: "approved",
          volunteer_id: generatedVolunteerId,
        }
        : prev
    );

    setUpdating(null);
  };


  // ============================================================
  // FILTER VOLUNTEERS
  // ============================================================

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((volunteer) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        volunteer.name.toLowerCase().includes(searchText) ||
        volunteer.email.toLowerCase().includes(searchText) ||
        volunteer.phone.toLowerCase().includes(searchText) ||
        volunteer.city.toLowerCase().includes(searchText) ||
        volunteer.id.toLowerCase().includes(searchText);

      const matchesInterest =
        interest === "All Interests" ||
        volunteer.interest.toLowerCase() === interest.toLowerCase();

      return matchesSearch && matchesInterest;
    });
  }, [volunteers, search, interest]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalCount = volunteers.length;

  const pendingCount = volunteers.filter(
    (item) => item.status.toLowerCase() === "pending"
  ).length;

  const approvedCount = volunteers.filter(
    (item) => item.status.toLowerCase() === "approved"
  ).length;

  const rejectedCount = volunteers.filter(
    (item) => item.status.toLowerCase() === "rejected"
  ).length;

  // ============================================================
  // DELETE VOLUNTEER
  // ============================================================

  const handleDelete = async () => {
    if (!deleteVolunteer) {
      console.log("No volunteer selected");
      return;
    }

    console.log("DELETE STARTED");
    console.log("Volunteer ID:", deleteVolunteer.id);

    setDeleting(true);
    setError("");

    try {
      // Get photo path
      const { data: volunteer, error: fetchError } = await supabase
        .from("volunteers")
        .select("photo_path")
        .eq("id", deleteVolunteer.id)
        .single();

      console.log("Volunteer data:", volunteer);
      console.log("Fetch error:", fetchError);

      if (fetchError) {
        setError("Unable to find this volunteer.");
        return;
      }

      // Delete photo
      if (volunteer?.photo_path) {
        console.log("PHOTO FOUND:", volunteer.photo_path);

        const { data: files, error: listError } = await supabase.storage
          .from("volunteer-photos")
          .list("", {
            search: volunteer.photo_path,
          });

        console.log("FILES FOUND:", files);
        console.log("LIST ERROR:", listError);

        const { data: storageData, error: photoError } =
          await supabase.storage
            .from("volunteer-photos")
            .remove([volunteer.photo_path]);

        console.log("STORAGE RESULT:", storageData);
        console.log("STORAGE ERROR:", photoError);
      }

      // Delete volunteer
      const { error: deleteError } = await supabase
        .from("volunteers")
        .delete()
        .eq("id", deleteVolunteer.id);

      console.log("DATABASE DELETE ERROR:", deleteError);

      if (deleteError) {
        setError("Unable to delete this volunteer.");
        return;
      }

      console.log("DELETE SUCCESS");

      setVolunteers((prev) =>
        prev.filter((item) => item.id !== deleteVolunteer.id)
      );

      setDeleteVolunteer(null);
      setSelectedVolunteer(null);

    } catch (error) {
      console.error("DELETE EXCEPTION:", error);
      setError("Something went wrong while deleting this volunteer.");
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f8f5]">

      {/* =====================================================
          ADMIN CONTENT
      ====================================================== */}

      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <AdminSidebar />

        {/* RIGHT SIDE */}
        <div className="min-w-0 flex-1">

          {/* ADMIN HEADER */}
          <AdminHeader />

          {/* PAGE CONTENT */}
          <main className="p-5 lg:p-8">

            {/* =================================================
                HEADING
            ================================================= */}

            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-[#173b24]">
                Volunteers
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage volunteer registrations and applications.
              </p>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                <span>{error}</span>

                <button
                  type="button"
                  onClick={fetchVolunteers}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <VolunteerStat
                title="Total Volunteers"
                value={totalCount.toString()}
                icon="fa-solid fa-users"
                iconBg="bg-[#eaf4ed]"
                iconColor="text-[#17653a]"
              />

              <VolunteerStat
                title="Pending"
                value={pendingCount.toString()}
                icon="fa-solid fa-clock"
                iconBg="bg-yellow-50"
                iconColor="text-yellow-600"
              />

              <VolunteerStat
                title="Approved"
                value={approvedCount.toString()}
                icon="fa-solid fa-circle-check"
                iconBg="bg-green-50"
                iconColor="text-green-600"
              />

              <VolunteerStat
                title="Rejected"
                value={rejectedCount.toString()}
                icon="fa-solid fa-circle-xmark"
                iconBg="bg-red-50"
                iconColor="text-red-600"
              />

            </div>

            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="mt-7 rounded-xl border border-gray-200 bg-white p-4">

              <div className="flex flex-col gap-3 lg:flex-row">

                {/* Search */}
                <div className="relative flex-1">

                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, phone, email, city or volunteer ID..."
                    className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#17653a] focus:bg-white focus:ring-2 focus:ring-[#17653a]/10"
                  />

                </div>

                {/* Interest */}
                <div className="relative lg:w-52">

                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 pr-10 text-sm outline-none focus:border-[#17653a] focus:bg-white"
                  >
                    {interests.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400" />

                </div>

              </div>

              {/* Results */}
              <div className="mt-3 text-xs text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-700">
                  {filteredVolunteers.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-700">
                  {volunteers.length}
                </span>{" "}
                volunteers
              </div>

            </div>

            {/* =================================================
                VOLUNTEERS TABLE
            ================================================= */}

            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

              {loading ? (
                /* Loading */
                <div className="flex min-h-60 flex-col items-center justify-center">

                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#17653a]" />

                  <p className="mt-4 text-sm font-semibold text-gray-500">
                    Loading volunteers...
                  </p>

                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-400 text-center">

                    <thead className="border-b border-gray-200 bg-gray-50">

                      <tr>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide  text-gray-500">
                          Volunteer
                        </th>
                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Volunteer ID
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Phone
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          City
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Interest
                        </th>
                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Category
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Status
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Registered
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-100">

                      {filteredVolunteers.map((volunteer) => (

                        <tr
                          key={volunteer.id}
                          className="transition hover:bg-gray-50"
                        >

                          {/* Volunteer */}
                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#eaf4ed]">
                                {volunteer.photo_path ? (
                                  <img
                                    src={getVolunteerPhotoUrl(volunteer.photo_path) || ""}
                                    alt={volunteer.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-[#eaf4ed] font-bold uppercase text-[#17653a]">
                                    {volunteer.name.charAt(0)}
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-bold text-gray-800">
                                  {volunteer.name}
                                </p>

                                <p className="mt-0.5 truncate text-xs text-gray-500">
                                  {volunteer.email}
                                </p>

                              </div>

                            </div>

                          </td>


                          <td className="px-5 py-4">
                            {volunteer.volunteer_id ? (
                              <span className="inline-flex rounded-lg  px-3 py-1.5 text-xs font-bold text-gray-700 bg-[#eaf4ed]">
                                {volunteer.volunteer_id}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                —
                              </span>
                            )}
                          </td>
                          {/* Phone */}
                          <td className="px-5 py-4">

                            <span className="text-sm text-gray-600">
                              {volunteer.phone}
                            </span>

                          </td>

                          {/* City */}
                          <td className="px-5 py-4">

                            <span className="text-sm text-gray-600">
                              {volunteer.city}
                            </span>

                          </td>

                          {/* Interest */}
                          <td className="px-5 py-4">

                            <span className="text-sm text-gray-600">
                              {formatInterest(volunteer.interest)}
                            </span>

                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                              {volunteer.category}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">

                            <StatusBadge
                              status={volunteer.status}
                            />

                          </td>

                          {/* Date */}
                          <td className="px-5 py-4">

                            <span className="text-sm text-gray-500">
                              {formatDate(volunteer.created_at)}
                            </span>

                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 text-center">

                            <div className="flex justify-end gap-2">

                              {volunteer.status.toLowerCase() === "pending" && (
                                <button
                                  type="button"
                                  onClick={() => handleApprove(volunteer)}
                                  disabled={updating === volunteer.id}
                                  title="Approve Volunteer"
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-green-600 transition hover:border-green-500 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {updating === volunteer.id ? (
                                    <i className="fa-solid fa-spinner fa-spin text-sm" />
                                  ) : (
                                    <i className="fa-solid fa-check text-sm" />
                                  )}
                                </button>
                              )}

                              {/* ID Card */}
                              {volunteer.status.toLowerCase() === "approved" &&
                                volunteer.volunteer_id && (
                                  <button
                                    type="button"
                                    onClick={() => setIdCardVolunteer(volunteer)}
                                    title="Generate ID Card"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-[#17653a] transition hover:border-[#17653a] hover:bg-[#eaf4ed]"
                                  >
                                    <i className="fa-solid fa-id-card text-sm" />
                                  </button>
                                )}

                              {/* View */}
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedVolunteer(volunteer)
                                }
                                title="View Details"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-[#17653a] hover:text-[#17653a]"
                              >
                                <i className="fa-solid fa-eye text-sm" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteVolunteer(volunteer)
                                }
                                title="Delete"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border transition border-red-200 text-red-500 hover:border-red-900 hover:text-red-900"
                              >
                                <i className="fa-solid fa-trash text-sm" />
                              </button>



                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>
              )}

              {/* Empty State */}
              {!loading && filteredVolunteers.length === 0 && (

                <div className="py-16 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf4ed] text-xl text-[#17653a]">
                    <i className="fa-solid fa-users-slash" />
                  </div>

                  <h3 className="mt-4 font-bold text-gray-800">
                    No volunteers found
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {volunteers.length === 0
                      ? "No volunteer applications have been submitted yet."
                      : "Try changing your search or filter."}
                  </p>

                </div>

              )}

            </div>

            <div className="mt-7">

              <h2 className="mb-4 text-lg font-bold text-[#173b24]">
                Quick Actions
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/admin/"
                  className="rounded-xl border text-center border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <i className="fa-solid fa-chart-line text-xl text-[#17653a]" />

                  <h3 className=" font-bold text-gray-800">
                    Dashboard
                  </h3>

                </Link>



                <Link
                  href="/admin/activities"
                  className="rounded-xl border text-center border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <i className="fa-solid fa-hand-holding-heart text-xl text-[#17653a]" />

                  <h3 className=" font-bold text-gray-800">
                    Activities
                  </h3>


                </Link>

                <Link
                  href="/admin/donations"
                  className="rounded-xl border text-center border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <i className="fa-solid fa-indian-rupee-sign text-xl text-[#17653a]" />

                  <h3 className="font-bold text-gray-800 ">
                    Donations
                  </h3>


                </Link>

              </div>

            </div>

          </main>

        </div>

      </div>

      {/* =====================================================
    ID CARD MODAL
====================================================== */}

      {idCardVolunteer && (
        <VolunteerIdCardModal
          volunteer={idCardVolunteer}
          onClose={() => setIdCardVolunteer(null)}
        />
      )}

      {/* =====================================================
          DETAILS MODAL
      ====================================================== */}

      {selectedVolunteer && (
        <VolunteerDetailsModal
          volunteer={selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
          formatDate={formatDate}
        />
      )}

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      {deleteVolunteer && (
        <DeleteVolunteerModal
          volunteer={deleteVolunteer}
          deleting={deleting}
          onCancel={() => setDeleteVolunteer(null)}
          onConfirm={handleDelete}
        />
      )}

    </div>
  );
}

/* ============================================================
   FORMAT INTEREST
============================================================ */

function formatInterest(interest: string) {
  const interests: Record<string, string> = {
    social: "Social Service",
    education: "Education",
    environment: "Environment",
    health: "Health",
    sports: "Sports",
    other: "Other",
  };

  return interests[interest.toLowerCase()] || interest;
}

/* ============================================================
   STAT CARD
============================================================ */

function VolunteerStat({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-extrabold text-[#173b24]">
            {value}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
        >
          <i className={icon} />
        </div>

      </div>

    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalizedStatus = status.toLowerCase();

  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const icons: Record<string, string> = {
    pending: "fa-solid fa-clock",
    approved: "fa-solid fa-check",
    rejected: "fa-solid fa-xmark",
  };

  const style =
    styles[normalizedStatus] || "bg-gray-100 text-gray-600";

  const icon =
    icons[normalizedStatus] || "fa-solid fa-circle";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${style}`}
    >
      <i className={icon} />

      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}




/* ============================================================
   DETAILS MODAL
============================================================ */

function VolunteerDetailsModal({
  volunteer,
  onClose,
  formatDate,
}: {
  volunteer: Volunteer;
  onClose: () => void;
  formatDate: (date: string) => string;
}) {

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >

      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

          <div>

            <h2 className="font-extrabold text-[#173b24]">
              Volunteer Details
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              ID: {volunteer.volunteer_id || "N/A"}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <i className="fa-solid fa-xmark" />
          </button>

        </div>

        <div className="p-6">

          {/* Profile */}
          <div className="flex items-center gap-4 rounded-xl bg-[#f6f8f5] p-5">

            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#eaf4ed]">
              {volunteer.photo_path ? (
                <img
                  src={supabase.storage
                    .from("volunteer-photos")
                    .getPublicUrl(volunteer.photo_path).data.publicUrl}
                  alt={volunteer.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#17653a] text-xl font-extrabold uppercase text-white">
                  {volunteer.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="min-w-0">

              <h3 className="truncate text-lg font-extrabold text-[#173b24]">
                {volunteer.name}
              </h3>

              <p className="text-sm text-gray-500">
                {formatInterest(volunteer.interest)}
              </p>

              <div className="mt-2">
                <StatusBadge status={volunteer.status} />
              </div>

            </div>

          </div>

          {/* Information */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <DetailItem
              label="Email Address"
              value={volunteer.email}
              icon="fa-regular fa-envelope"
            />

            <DetailItem
              label="Phone Number"
              value={volunteer.phone}
              icon="fa-solid fa-phone"
            />

            <DetailItem
              label="City / Village"
              value={volunteer.city}
              icon="fa-solid fa-location-dot"
            />

            <DetailItem
              label="Area of Interest"
              value={formatInterest(volunteer.interest)}
              icon="fa-solid fa-heart"
            />

            <DetailItem
              label="Registration Date"
              value={formatDate(volunteer.created_at)}
              icon="fa-regular fa-calendar"
            />

            <DetailItem
              label="Application Status"
              value={
                volunteer.status.charAt(0).toUpperCase() +
                volunteer.status.slice(1)
              }
              icon="fa-solid fa-circle-info"
            />

          </div>

          {/* Message */}
          <div className="mt-6 rounded-xl border border-gray-200 p-5">

            <div className="flex items-center gap-2">

              <i className="fa-solid fa-message text-[#17653a]" />

              <h3 className="font-bold text-[#173b24]">
                Why They Want to Volunteer
              </h3>

            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
              {volunteer.message || "No message provided."}
            </p>

          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   VOLUNTEER ID CARD MODAL
============================================================ */

/* ============================================================
   VOLUNTEER ID CARD MODAL
============================================================ */

function VolunteerIdCardModal({
  volunteer,
  onClose,
}: {
  volunteer: Volunteer;
  onClose: () => void;
}) {
  const [qrCode, setQrCode] = useState("");
  const [generating, setGenerating] = useState(false);

  const photoUrl = volunteer.photo_path
    ? supabase.storage
      .from("volunteer-photos")
      .getPublicUrl(volunteer.photo_path).data.publicUrl
    : null;

  /* ============================================================
     GENERATE QR CODE
  ============================================================ */

  useEffect(() => {
    const generateQR = async () => {
      if (!volunteer.volunteer_id) return;

      try {
        const verificationUrl =
          `${window.location.origin}/verify/${volunteer.volunteer_id}`;

        const qr = await QRCode.toDataURL(verificationUrl, {
          width: 600,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#111111",
            light: "#ffffff",
          },
        });

        setQrCode(qr);
      } catch (error) {
        console.error("QR generation error:", error);
      }
    };

    generateQR();
  }, [volunteer.volunteer_id]);

  /* ============================================================
     LOAD IMAGE
  ============================================================ */

  const loadImage = (
    src: string
  ): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.crossOrigin = "anonymous";

      image.onload = () => resolve(image);

      image.onerror = () => {
        reject(
          new Error(`Unable to load image: ${src}`)
        );
      };

      image.src = src;
    });
  };

  /* ============================================================
     ROUNDED RECTANGLE
  ============================================================ */

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    const r = Math.min(
      radius,
      width / 2,
      height / 2
    );

    ctx.beginPath();

    ctx.moveTo(x + r, y);

    ctx.lineTo(x + width - r, y);

    ctx.quadraticCurveTo(
      x + width,
      y,
      x + width,
      y + r
    );

    ctx.lineTo(
      x + width,
      y + height - r
    );

    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - r,
      y + height
    );

    ctx.lineTo(x + r, y + height);

    ctx.quadraticCurveTo(
      x,
      y + height,
      x,
      y + height - r
    );

    ctx.lineTo(x, y + r);

    ctx.quadraticCurveTo(
      x,
      y,
      x + r,
      y
    );

    ctx.closePath();
  };

  /* ============================================================
     DRAW COVER IMAGE
  ============================================================ */

  const drawCoverImage = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    const imageRatio =
      image.naturalWidth / image.naturalHeight;

    const boxRatio = width / height;

    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;
    let sourceX = 0;
    let sourceY = 0;

    if (imageRatio > boxRatio) {
      sourceWidth =
        image.naturalHeight * boxRatio;

      sourceX =
        (image.naturalWidth - sourceWidth) / 2;
    } else {
      sourceHeight =
        image.naturalWidth / boxRatio;

      sourceY =
        (image.naturalHeight - sourceHeight) / 2;
    }

    ctx.save();

    drawRoundedRect(
      ctx,
      x,
      y,
      width,
      height,
      radius
    );

    ctx.clip();

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      x,
      y,
      width,
      height
    );

    ctx.restore();
  };

  /* ============================================================
     DRAW TEXT
  ============================================================ */

  const drawText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    size: number,
    weight: string,
    color: string,
    align: CanvasTextAlign = "left"
  ) => {
    ctx.font =
      `${weight} ${size}px Arial, Helvetica, sans-serif`;

    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = "alphabetic";

    ctx.fillText(text, x, y);
  };

  /* ============================================================
     DRAW MULTI-LINE TEXT
  ============================================================ */

  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    size: number,
    weight: string,
    color: string,
    maxLines = 2
  ) => {
    ctx.font =
      `${weight} ${size}px Arial, Helvetica, sans-serif`;

    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    const words = text.split(" ");
    let line = "";
    let lineNumber = 0;

    for (let i = 0; i < words.length; i++) {
      const testLine =
        line.length === 0
          ? words[i]
          : `${line} ${words[i]}`;

      const metrics =
        ctx.measureText(testLine);

      if (
        metrics.width > maxWidth &&
        line.length > 0
      ) {
        ctx.fillText(
          line,
          x,
          y + lineNumber * lineHeight
        );

        lineNumber++;

        if (lineNumber >= maxLines - 1) {
          const remaining =
            words.slice(i).join(" ");

          let finalLine = remaining;

          while (
            ctx.measureText(
              `${line} ${finalLine}`
            ).width > maxWidth &&
            finalLine.length > 0
          ) {
            finalLine =
              finalLine.slice(0, -1);
          }

          if (
            finalLine.length <
            remaining.length
          ) {
            finalLine =
              finalLine.trimEnd() + "...";
          }

          line = finalLine;

          break;
        }

        line = words[i];
      } else {
        line = testLine;
      }
    }

    if (
      line.length > 0 &&
      lineNumber < maxLines
    ) {
      ctx.fillText(
        line,
        x,
        y + lineNumber * lineHeight
      );
    }
  };

  /* ============================================================
     DRAW INFO ROW
  ============================================================ */

  const drawInfoRow = (
    ctx: CanvasRenderingContext2D,
    label: string,
    value: string,
    x: number,
    y: number,
    scale: number
  ) => {
    const labelWidth = 125 * scale;

    drawText(
      ctx,
      label,
      x,
      y,
      12 * scale,
      "600",
      "#6b7280"
    );

    drawText(
      ctx,
      ":",
      x + labelWidth,
      y,
      12 * scale,
      "600",
      "#9ca3af"
    );

    drawWrappedText(
      ctx,
      value,
      x + labelWidth + 12 * scale,
      y,
      240 * scale,
      15 * scale,
      13 * scale,
      "800",
      "#1f2937",
      2
    );
  };

  /* ============================================================
     CREATE ID CARD CANVAS
  ============================================================ */

  const createExportCanvas = async () => {
    /*
      Original card size:
      860 × 540

      Export:
      4× = 3440 × 2160

      This gives a high-quality PNG and PDF.
    */

    const CARD_WIDTH = 860;
    const CARD_HEIGHT = 540;

    const SCALE = 4;

    const canvas =
      document.createElement("canvas");

    canvas.width =
      CARD_WIDTH * SCALE;

    canvas.height =
      CARD_HEIGHT * SCALE;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error(
        "Unable to create canvas."
      );
    }

    /*
      Everything below is drawn directly
      using normal HEX/RGB colors.

      No Tailwind styles.
      No html2canvas.
      No lab().
      No oklab().
    */

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    /* ==========================================================
       SCALE CONTEXT
    ========================================================== */

    ctx.scale(SCALE, SCALE);

    /* ==========================================================
       BACKGROUND
    ========================================================== */

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
      0,
      0,
      CARD_WIDTH,
      CARD_HEIGHT
    );

    /* ==========================================================
       CARD CLIPPING
    ========================================================== */

    ctx.save();

    drawRoundedRect(
      ctx,
      0,
      0,
      CARD_WIDTH,
      CARD_HEIGHT,
      22
    );

    ctx.clip();

    /* ==========================================================
       HEADER GRADIENT
    ========================================================== */

    const headerGradient =
      ctx.createLinearGradient(
        0,
        0,
        CARD_WIDTH,
        145
      );

    headerGradient.addColorStop(
      0,
      "#075c35"
    );

    headerGradient.addColorStop(
      0.55,
      "#0d7546"
    );

    headerGradient.addColorStop(
      1,
      "#17653a"
    );

    ctx.fillStyle =
      headerGradient;

    ctx.fillRect(
      0,
      0,
      CARD_WIDTH,
      145
    );

    /* ==========================================================
       DECORATIVE CIRCLES
    ========================================================== */

    ctx.fillStyle =
      "rgba(255,255,255,0.05)";

    ctx.beginPath();

    ctx.arc(
      850,
      -15,
      95,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
      660,
      170,
      95,
      0,
      Math.PI * 2
    );

    ctx.fill();

    /* ==========================================================
       LOGO
    ========================================================== */

    try {
      const logo =
        await loadImage(
          "/images/logo.png"
        );

      ctx.save();

      ctx.beginPath();

      ctx.arc(
        92.5,
        72.5,
        52.5,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "#ffffff";

      ctx.fill();

      ctx.clip();

      ctx.drawImage(
        logo,
        40,
        20,
        105,
        105
      );

      ctx.restore();

      /*
        White border around logo
      */

      ctx.beginPath();

      ctx.arc(
        92.5,
        72.5,
        52.5,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        "#ffffff";

      ctx.lineWidth = 4;

      ctx.stroke();
    } catch (error) {
      console.error(
        "Logo loading error:",
        error
      );

      /*
        Fallback if logo cannot load
      */

      ctx.beginPath();

      ctx.arc(
        92.5,
        72.5,
        52.5,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "#ffffff";

      ctx.fill();

      drawText(
        ctx,
        "A",
        92.5,
        85,
        42,
        "900",
        "#17653a",
        "center"
      );
    }

    /* ==========================================================
       ORGANIZATION NAME
    ========================================================== */

    drawText(
      ctx,
      "Anandpur Shri Radha Raman",
      180,
      61,
      29,
      "900",
      "#ffffff"
    );

    drawText(
      ctx,
      "Seva Samiti",
      180,
      94,
      27,
      "700",
      "#ffffff"
    );

    drawText(
      ctx,
      "SEVA • SAHYOG • SANSKAR • SAMARPAN",
      180,
      121,
      12,
      "600",
      "rgba(255,255,255,0.90)"
    );

    /* ==========================================================
       BODY
    ========================================================== */

    ctx.fillStyle =
      "#ffffff";

    ctx.fillRect(
      0,
      145,
      CARD_WIDTH,
      395
    );

    /* ==========================================================
       VOLUNTEER PHOTO
    ========================================================== */

    const photoX = 40;
    const photoY = 172;
    const photoWidth = 175;
    const photoHeight = 220;

    ctx.fillStyle =
      "#eaf4ed";

    drawRoundedRect(
      ctx,
      photoX,
      photoY,
      photoWidth,
      photoHeight,
      16
    );

    ctx.fill();

    try {
      if (photoUrl) {
        const photo =
          await loadImage(
            photoUrl
          );

        drawCoverImage(
          ctx,
          photo,
          photoX,
          photoY,
          photoWidth,
          photoHeight,
          16
        );
      } else {
        throw new Error(
          "No volunteer photo"
        );
      }
    } catch (error) {
      console.warn(
        "Volunteer photo could not be loaded:",
        error
      );

      /*
        Initial fallback
      */

      ctx.fillStyle =
        "#17653a";

      drawRoundedRect(
        ctx,
        photoX,
        photoY,
        photoWidth,
        photoHeight,
        16
      );

      ctx.fill();

      drawText(
        ctx,
        volunteer.name
          .charAt(0)
          .toUpperCase(),
        photoX +
        photoWidth / 2,
        photoY +
        photoHeight / 2 +
        25,
        60,
        "900",
        "#ffffff",
        "center"
      );
    }

    /* ==========================================================
       PHOTO BORDER
    ========================================================== */

    drawRoundedRect(
      ctx,
      photoX,
      photoY,
      photoWidth,
      photoHeight,
      16
    );

    ctx.strokeStyle =
      "#17653a";

    ctx.lineWidth = 3;

    ctx.stroke();

    /* ==========================================================
       APPROVED BADGE
    ========================================================== */

    const badgeText =
      "APPROVED VOLUNTEER";

    ctx.font =
      "800 11px Arial, Helvetica, sans-serif";

    const badgeWidth =
      ctx.measureText(
        badgeText
      ).width + 28;

    const badgeHeight = 27;

    const badgeX =
      photoX +
      (photoWidth - badgeWidth) / 2;

    const badgeY =
      photoY +
      photoHeight +
      12;

    drawRoundedRect(
      ctx,
      badgeX,
      badgeY,
      badgeWidth,
      badgeHeight,
      14
    );

    ctx.fillStyle =
      "#dff2e5";

    ctx.fill();

    drawText(
      ctx,
      badgeText,
      photoX +
      photoWidth / 2,
      badgeY + 18,
      11,
      "800",
      "#17653a",
      "center"
    );

    /* ==========================================================
       VOLUNTEER INFORMATION
    ========================================================== */

    const infoX = 245;
    const infoY = 210;

    drawWrappedText(
      ctx,
      volunteer.name,
      infoX,
      infoY,
      380,
      34,
      30,
      "900",
      "#17653a",
      2
    );

    /* ==========================================================
       INFORMATION ROWS
    ========================================================== */

    const firstRowY = 255;
    const rowGap = 42;

    drawInfoRow(
      ctx,
      "Volunteer ID",
      volunteer.volunteer_id ||
      "N/A",
      infoX,
      firstRowY,
      1
    );

    drawInfoRow(
      ctx,
      "Category",
      volunteer.category
        ?.toUpperCase() ||
      "GENERAL",
      infoX,
      firstRowY +
      rowGap,
      1
    );

    drawInfoRow(
      ctx,
      "Area of Interest",
      formatInterest(
        volunteer.interest
      ),
      infoX,
      firstRowY +
      rowGap * 2,
      1
    );

    drawInfoRow(
      ctx,
      "City / Village",
      volunteer.city ||
      "N/A",
      infoX,
      firstRowY +
      rowGap * 3,
      1
    );

    /* ==========================================================
       QR CODE
    ========================================================== */

    const qrBoxX = 675;
    const qrBoxY = 175;
    const qrBoxSize = 171;

    /*
      White QR container
    */

    drawRoundedRect(
      ctx,
      qrBoxX,
      qrBoxY,
      qrBoxSize,
      qrBoxSize,
      12
    );

    ctx.fillStyle =
      "#ffffff";

    ctx.fill();

    ctx.strokeStyle =
      "#d1d5db";

    ctx.lineWidth = 1;

    ctx.stroke();

    if (qrCode) {
      try {
        const qrImage =
          await loadImage(
            qrCode
          );

        const qrPadding = 13;

        ctx.drawImage(
          qrImage,
          qrBoxX +
          qrPadding,
          qrBoxY +
          qrPadding,
          qrBoxSize -
          qrPadding * 2,
          qrBoxSize -
          qrPadding * 2
        );
      } catch (error) {
        console.error(
          "QR image loading error:",
          error
        );

        drawText(
          ctx,
          "QR",
          qrBoxX +
          qrBoxSize / 2,
          qrBoxY +
          qrBoxSize / 2 +
          10,
          28,
          "900",
          "#17653a",
          "center"
        );
      }
    } else {
      drawText(
        ctx,
        "QR",
        qrBoxX +
        qrBoxSize / 2,
        qrBoxY +
        qrBoxSize / 2 +
        10,
        28,
        "900",
        "#17653a",
        "center"
      );
    }

    /* ==========================================================
       QR TEXT
    ========================================================== */

    drawText(
      ctx,
      "Scan to verify",
      qrBoxX +
      qrBoxSize / 2,
      368,
      11,
      "600",
      "#6b7280",
      "center"
    );

    drawText(
      ctx,
      "Volunteer Certificate",
      qrBoxX +
      qrBoxSize / 2,
      386,
      11,
      "700",
      "#374151",
      "center"
    );

    /* ==========================================================
       CARD BORDER
    ========================================================== */

    ctx.restore();

    /*
      Draw outer border after restore
      so the border remains clean.
    */

    drawRoundedRect(
      ctx,
      1,
      1,
      CARD_WIDTH - 2,
      CARD_HEIGHT - 2,
      22
    );

    ctx.strokeStyle =
      "#d1d5db";

    ctx.lineWidth = 2;

    ctx.stroke();

    return canvas;
  };

  /* ============================================================
     DOWNLOAD PNG
  ============================================================ */

  const downloadPNG = async () => {
    setGenerating(true);

    try {
      const canvas =
        await createExportCanvas();

      const image =
        canvas.toDataURL(
          "image/png",
          1.0
        );

      const link =
        document.createElement("a");

      link.download =
        `${volunteer.volunteer_id}-ID-Card.png`;

      link.href = image;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();
    } catch (error) {
      console.error(
        "PNG generation error:",
        error
      );

      alert(
        error instanceof Error
          ? `Unable to generate PNG: ${error.message}`
          : "Unable to generate ID card PNG."
      );
    } finally {
      setGenerating(false);
    }
  };

  /* ============================================================
     DOWNLOAD PDF
  ============================================================ */

  const downloadPDF = async () => {
    setGenerating(true);

    try {
      const canvas =
        await createExportCanvas();

      const image =
        canvas.toDataURL(
          "image/png",
          1.0
        );

      /*
        Standard CR80 ID card:

        86mm × 54mm
      */

      const pdf =
        new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [86, 54],
          compress: true,
        });

      pdf.addImage(
        image,
        "PNG",
        0,
        0,
        86,
        54,
        undefined,
        "FAST"
      );

      pdf.save(
        `${volunteer.volunteer_id}-ID-Card.pdf`
      );
    } catch (error) {
      console.error(
        "PDF generation error:",
        error
      );

      alert(
        error instanceof Error
          ? `Unable to generate PDF: ${error.message}`
          : "Unable to generate ID card PDF."
      );
    } finally {
      setGenerating(false);
    }
  };

  /* ============================================================
     PRINT CARD
  ============================================================ */

  const printCard = async () => {
    setGenerating(true);

    try {
      const canvas =
        await createExportCanvas();

      const image =
        canvas.toDataURL(
          "image/png",
          1.0
        );

      const printWindow =
        window.open(
          "",
          "_blank"
        );

      if (!printWindow) {
        alert(
          "Please allow popups to print the ID card."
        );

        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>

        <html>
          <head>
            <title>
              ${volunteer.volunteer_id} - ID Card
            </title>

            <style>
              @page {
                size: 86mm 54mm;
                margin: 0;
              }

              * {
                box-sizing: border-box;
              }

              html,
              body {
                margin: 0;
                padding: 0;
                width: 86mm;
                height: 54mm;
                background: #ffffff;
              }

              body {
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .card {
                width: 86mm;
                height: 54mm;
              }

              .card img {
                display: block;
                width: 86mm;
                height: 54mm;
                object-fit: contain;
              }
            </style>
          </head>

          <body>
            <div class="card">
              <img
                src="${image}"
                alt="Volunteer ID Card"
              />
            </div>

            <script>
              window.onload = function () {
                setTimeout(function () {
                  window.print();
                }, 500);

                window.onafterprint = function () {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
    } catch (error) {
      console.error(
        "Print error:",
        error
      );

      alert(
        error instanceof Error
          ? `Unable to print ID card: ${error.message}`
          : "Unable to print ID card."
      );
    } finally {
      setGenerating(false);
    }
  };

  /* ============================================================
     MODAL
  ============================================================ */

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-extrabold text-[#173b24]">
              Volunteer ID Card
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {volunteer.name} •{" "}
              {volunteer.volunteer_id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* =====================================================
            CARD PREVIEW
        ====================================================== */}

        <div className="overflow-x-auto bg-[#f6f8f5] p-5 sm:p-8">
          <div className="mx-auto w-fit">
            <div
              id="volunteer-id-card"
              className="relative overflow-hidden rounded-[22px] bg-white shadow-xl"
              style={{
                width: "860px",
                height: "540px",
              }}
            >
              {/* =================================================
                  HEADER
              ================================================= */}

              <div
                className="relative flex h-36.25 items-center px-10"
                style={{
                  background:
                    "linear-gradient(135deg, #075c35 0%, #0d7546 55%, #17653a 100%)",
                }}
              >
                {/* Decorative circles */}

                <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/5" />

                <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-white/5" />

                {/* Logo */}

                <div className="relative z-10 flex h-26.25 w-26.25 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
                  <img
                    src="/images/logo.png"
                    alt="Anandpur Shri Radha Raman Seva Samiti"
                    className="h-full w-full object-contain"
                    crossOrigin="anonymous"
                  />
                </div>

                {/* Organization */}

                <div className="relative z-10 ml-7 text-white">
                  <h1 className="text-[29px] font-black leading-tight">
                    Anandpur Shri Radha Raman
                  </h1>

                  <h2 className="mt-1 text-[27px] font-bold leading-tight">
                    Seva Samiti
                  </h2>

                  <p className="mt-4 text-[12px] font-semibold uppercase tracking-[5px] text-white/90">
                    SEVA • SAHYOG • SANSKAR • SAMARPAN
                  </p>
                </div>
              </div>

              {/* =================================================
                  BODY
              ================================================= */}

              <div className="relative h-98.75 bg-white px-10 pt-7 pb-0">
                {/* PHOTO */}

                <div className="absolute left-10 top-7">
                  <div className="h-55 w-43.75 overflow-hidden rounded-2xl border-[3px] border-[#17653a] bg-[#eaf4ed] shadow-md">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={volunteer.name}
                        crossOrigin="anonymous"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#17653a] text-6xl font-black uppercase text-white">
                        {volunteer.name.charAt(
                          0
                        )}
                      </div>
                    )}
                  </div>

                  {/* Approved */}

                  <div className="mt-3 text-center">
                    <span className="inline-flex rounded-full bg-[#dff2e5] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[#17653a]">
                      Approved Volunteer
                    </span>
                  </div>
                </div>

                {/* VOLUNTEER INFORMATION */}

                <div className="absolute left-61.25 top-7 w-95">
                  <h3 className="text-[30px] font-black leading-tight text-[#17653a]">
                    {volunteer.name}
                  </h3>

                  <div className="mt-5 space-y-4">
                    <IdCardRow
                      label="Volunteer ID"
                      value={
                        volunteer.volunteer_id ||
                        "N/A"
                      }
                    />

                    <IdCardRow
                      label="Category"
                      value={
                        volunteer.category?.toUpperCase() ||
                        "GENERAL"
                      }
                    />

                    <IdCardRow
                      label="Area of Interest"
                      value={formatInterest(
                        volunteer.interest
                      )}
                    />

                    <IdCardRow
                      label="City / Village"
                      value={
                        volunteer.city
                      }
                    />

                    <IdCardRow
                      label="Phone"
                      value={
                        volunteer.phone
                      }
                    />
                  </div>
                </div>

                {/* QR CODE */}

                <div className="absolute right-10 top-8 flex flex-col items-center">
                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    {qrCode ? (
                      <img
                        src={qrCode}
                        alt="Volunteer verification QR"
                        className="h-36.25 w-36.25"
                      />
                    ) : (
                      <div className="flex h-36.25 w-36.25 items-center justify-center">
                        <i className="fa-solid fa-spinner fa-spin text-2xl text-[#17653a]" />
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-[11px] font-semibold text-gray-500">
                    Scan to verify
                  </p>

                  <p className="text-[11px] font-bold text-gray-700">
                    Volunteer Certificate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            ACTION BUTTONS
        ====================================================== */}

        <div className="flex flex-col gap-3 border-t border-gray-200 p-5 sm:flex-row">
          {/* PNG */}

          <button
            type="button"
            onClick={downloadPNG}
            disabled={generating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-bold text-gray-700 transition hover:border-[#17653a] hover:bg-[#f6f8f5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? (
              <i className="fa-solid fa-spinner fa-spin" />
            ) : (
              <i className="fa-regular fa-image" />
            )}

            Download PNG
          </button>

          {/* PDF */}

          <button
            type="button"
            onClick={downloadPDF}
            disabled={generating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-bold text-gray-700 transition hover:border-[#17653a] hover:bg-[#f6f8f5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? (
              <i className="fa-solid fa-spinner fa-spin" />
            ) : (
              <i className="fa-regular fa-file-pdf" />
            )}

            Download PDF
          </button>

          {/* PRINT */}

          <button
            type="button"
            onClick={printCard}
            disabled={generating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#17653a] px-5 py-3 font-bold text-white transition hover:bg-[#12532f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <i className="fa-solid fa-print" />

            Print Card
          </button>
        </div>

        {/* CLOSE */}

        <div className="flex justify-end px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
/* ============================================================
   ID CARD ROW
============================================================ */

/* ============================================================
   ID CARD ROW
============================================================ */

function IdCardRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start">
      <div className="w-31.25 shrink-0 text-[12px] font-semibold text-gray-500">
        {label}
      </div>

      <div className="mr-2 text-[12px] font-semibold text-gray-400">
        :
      </div>

      <div className="min-w-0 truncate text-[13px] font-extrabold text-gray-800">
        {value}
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL ITEM
============================================================ */

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">

      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">

        <i className={icon} />

        {label}

      </div>

      <p className="mt-2 wrap-break-word text-sm font-bold text-gray-800">
        {value}
      </p>

    </div>
  );
}

/* ============================================================
   DELETE MODAL
============================================================ */

function DeleteVolunteerModal({
  volunteer,
  deleting,
  onCancel,
  onConfirm,
}: {
  volunteer: Volunteer;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >

      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <i className="fa-solid fa-trash" />
        </div>

        <h2 className="mt-4 text-lg font-extrabold text-gray-800">
          Delete Volunteer?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-bold text-gray-700">
            {volunteer.name}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}