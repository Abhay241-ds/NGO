"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";

import { supabase } from "@/lib/supabase/client";

type Volunteer = {
  id: string;
  volunteer_id: string | null;
  name: string;
  phone: string;
  interest: string;
  status: string;
  created_at: string;
};

type Activity = {
  id: string;
  title_en: string;
  title_hi: string;
  category: string;
  activity_date: string | null;
  created_at: string;
};

export default function AdminPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      /* -----------------------------
         TOTAL VOLUNTEERS
      ----------------------------- */

      const { count: volunteerCount, error: volunteerCountError } =
        await supabase
          .from("volunteers")
          .select("*", {
            count: "exact",
            head: true,
          });

      if (volunteerCountError) {
        throw volunteerCountError;
      }

      setTotalVolunteers(volunteerCount ?? 0);

      /* -----------------------------
         PENDING VOLUNTEERS
      ----------------------------- */

      const { count: pendingCount, error: pendingError } =
        await supabase
          .from("volunteers")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("status", "pending");

      if (pendingError) {
        throw pendingError;
      }

      setPendingApplications(pendingCount ?? 0);

      /* -----------------------------
         RECENT VOLUNTEERS
      ----------------------------- */

      const { data: recentVolunteerData, error: recentVolunteerError } =
        await supabase
          .from("volunteers")
          .select(
            `
              id,
              volunteer_id,
              name,
              phone,
              interest,
              status,
              created_at
            `
          )
          .order("created_at", {
            ascending: false,
          })
          .limit(4);

      if (recentVolunteerError) {
        throw recentVolunteerError;
      }

      setVolunteers(recentVolunteerData ?? []);

      /* -----------------------------
         TOTAL ACTIVITIES
      ----------------------------- */

      const { count: activityCount, error: activityCountError } =
        await supabase
          .from("activities")
          .select("*", {
            count: "exact",
            head: true,
          });

      if (activityCountError) {
        throw activityCountError;
      }

      setTotalActivities(activityCount ?? 0);

      /* -----------------------------
         RECENT ACTIVITIES
      ----------------------------- */

      const { data: recentActivityData, error: recentActivityError } =
        await supabase
          .from("activities")
          .select(
            `
              id,
              title_en,
              title_hi,
              category,
              activity_date,
              created_at
            `
          )
          .order("activity_date", {
            ascending: false,
            nullsFirst: false,
          })
          .order("created_at", {
            ascending: false,
          })
          .limit(3);

      if (recentActivityError) {
        throw recentActivityError;
      }

      setActivities(recentActivityData ?? []);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  /* -----------------------------
     DATE FORMATTER
  ----------------------------- */

  function formatDate(date: string | null) {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  /* -----------------------------
     STATUS
  ----------------------------- */

  function getStatusLabel(status: string) {
    if (status === "approved") {
      return "Approved";
    }

    if (status === "pending") {
      return "Pending";
    }

    if (status === "rejected") {
      return "Rejected";
    }

    return status;
  }

  function getStatusClass(status: string) {
    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  }

  return (
    <div className="min-h-screen bg-[#f6f8f5]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <AdminHeader />

          <main className="p-5 lg:p-8">

            {/* =========================
                PAGE HEADING
            ========================== */}

            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-[#173b24]">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your NGO website and activities.
              </p>
            </div>

            {/* =========================
                ERROR
            ========================== */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold">
                      Failed to load dashboard
                    </p>

                    <p className="mt-1">
                      {error}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={loadDashboard}
                    className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* =========================
                STATS
            ========================== */}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Total Volunteers"
                value={loading ? "..." : totalVolunteers.toString()}
                icon="fa-solid fa-users"
                description="Registered volunteers"
              />

              <StatCard
                title="Total Activities"
                value={loading ? "..." : totalActivities.toString()}
                icon="fa-solid fa-hand-holding-heart"
                description="Activities published"
              />

              <StatCard
                title="Approved Volunteers"
                value={
                  loading
                    ? "..."
                    : Math.max(
                        totalVolunteers - pendingApplications,
                        0
                      ).toString()
                }
                icon="fa-solid fa-circle-check"
                description="Approved applications"
              />

              <StatCard
                title="Pending Applications"
                value={
                  loading
                    ? "..."
                    : pendingApplications.toString().padStart(2, "0")
                }
                icon="fa-solid fa-clock"
                description="Applications waiting"
              />

            </div>

            {/* =========================
                MAIN CONTENT
            ========================== */}

            <div className="mt-7 grid gap-6 xl:grid-cols-3">

              {/* =========================
                  RECENT VOLUNTEERS
              ========================== */}

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm xl:col-span-2">

                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                  <div>
                    <h2 className="font-bold text-[#173b24]">
                      Recent Volunteers
                    </h2>

                    <p className="text-xs text-gray-500">
                      Latest volunteer applications
                    </p>
                  </div>

                  <Link
                    href="/admin/volunteers"
                    className="text-sm font-bold text-[#17653a] hover:underline"
                  >
                    View All
                  </Link>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-5 py-3">
                          Volunteer
                        </th>

                        <th className="px-5 py-3">
                          ID
                        </th>

                        <th className="px-5 py-3">
                          Interest
                        </th>

                        <th className="px-5 py-3">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">

                      {loading ? (

                        <tr>
                          <td
                            colSpan={4}
                            className="px-5 py-10 text-center text-sm text-gray-500"
                          >
                            Loading volunteers...
                          </td>
                        </tr>

                      ) : volunteers.length === 0 ? (

                        <tr>
                          <td
                            colSpan={4}
                            className="px-5 py-10 text-center text-sm text-gray-500"
                          >
                            No volunteers found.
                          </td>
                        </tr>

                      ) : (

                        volunteers.map((volunteer) => (

                          <tr
                            key={volunteer.id}
                            className="hover:bg-gray-50"
                          >

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf4ed] font-bold text-[#17653a]">
                                  {volunteer.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-gray-800">
                                    {volunteer.name}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {volunteer.phone}
                                  </p>
                                </div>

                              </div>

                            </td>

                            <td className="px-5 py-4 text-xs font-medium text-gray-600">
                              {volunteer.volunteer_id || "—"}
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-600">
                              {volunteer.interest}
                            </td>

                            <td className="px-5 py-4">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                  volunteer.status
                                )}`}
                              >
                                {getStatusLabel(
                                  volunteer.status
                                )}
                              </span>

                            </td>

                          </tr>

                        ))

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* =========================
                  RECENT ACTIVITIES
              ========================== */}

              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                  <div>
                    <h2 className="font-bold text-[#173b24]">
                      Recent Activities
                    </h2>

                    <p className="text-xs text-gray-500">
                      Recently added activities
                    </p>
                  </div>

                  <Link
                    href="/admin/activities"
                    className="text-sm font-bold text-[#17653a] hover:underline"
                  >
                    View All
                  </Link>

                </div>

                <div className="divide-y divide-gray-100">

                  {loading ? (

                    <div className="px-5 py-10 text-center text-sm text-gray-500">
                      Loading activities...
                    </div>

                  ) : activities.length === 0 ? (

                    <div className="px-5 py-10 text-center text-sm text-gray-500">
                      No activities found.
                    </div>

                  ) : (

                    activities.map((activity) => (

                      <div
                        key={activity.id}
                        className="flex items-center justify-between gap-4 px-5 py-4"
                      >

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-gray-800">
                            {activity.title_en ||
                              activity.title_hi}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {activity.category}
                          </p>

                        </div>

                        <span className="shrink-0 text-xs text-gray-400">
                          {formatDate(
                            activity.activity_date
                          )}
                        </span>

                      </div>

                    ))

                  )}

                </div>

                <div className="p-5">

                  <Link
                    href="/admin/activities"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#17653a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0e4d2b]"
                  >
                    <i className="fa-solid fa-plus" />
                    Add Activity
                  </Link>

                </div>

              </div>

            </div>

            {/* =========================
                QUICK ACTIONS
            ========================== */}

            <div className="mt-7">

              <h2 className="mb-4 text-lg font-bold text-[#173b24]">
                Quick Actions
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                



                <Link
                  href="/admin/volunteers"
                  className="rounded-xl border text-center border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <i className="fa-solid fa-users text-xl text-[#17653a]" />

                  <h3 className=" font-bold text-gray-800">
                    Volunteers
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

                  <h3 className=" font-bold text-gray-800">
                    Donations
                  </h3>

                </Link>

              </div>

            </div>

          </main>
        </div>
      </div>
    </div>
  );
}