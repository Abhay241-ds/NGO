"use client";

import { useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import Link from "next/link";

type Donation = {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  paymentId: string;
  orderId: string;
  paymentMethod: string;
  status: "Successful" | "Pending" | "Failed";
  date: string;
};

const initialDonations: Donation[] = [
  {
    id: "DON-2026-0001",
    donorName: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    amount: 5000,
    paymentId: "pay_RP8X21ABC",
    orderId: "order_RP8X21XYZ",
    paymentMethod: "UPI",
    status: "Successful",
    date: "05 Sep 2026, 10:42 AM",
  },
  {
    id: "DON-2026-0002",
    donorName: "Amit Verma",
    email: "amit@example.com",
    phone: "+91 9123456789",
    amount: 2500,
    paymentId: "pay_RP7A12DEF",
    orderId: "order_RP7A12UVW",
    paymentMethod: "Card",
    status: "Successful",
    date: "04 Sep 2026, 04:15 PM",
  },
  {
    id: "DON-2026-0003",
    donorName: "Neha Singh",
    email: "neha@example.com",
    phone: "+91 9988776655",
    amount: 1000,
    paymentId: "pay_RP6B34GHI",
    orderId: "order_RP6B34RST",
    paymentMethod: "UPI",
    status: "Pending",
    date: "04 Sep 2026, 01:25 PM",
  },
  {
    id: "DON-2026-0004",
    donorName: "Pooja Sharma",
    email: "pooja@example.com",
    phone: "+91 9876123456",
    amount: 11000,
    paymentId: "pay_RP5C56JKL",
    orderId: "order_RP5C56OPQ",
    paymentMethod: "Net Banking",
    status: "Successful",
    date: "03 Sep 2026, 11:30 AM",
  },
  {
    id: "DON-2026-0005",
    donorName: "Ravi Patel",
    email: "ravi@example.com",
    phone: "+91 9765432109",
    amount: 1500,
    paymentId: "pay_RP4D78MNO",
    orderId: "order_RP4D78LMN",
    paymentMethod: "UPI",
    status: "Failed",
    date: "02 Sep 2026, 06:20 PM",
  },
  {
    id: "DON-2026-0006",
    donorName: "Kavita Joshi",
    email: "kavita@example.com",
    phone: "+91 9654321098",
    amount: 2100,
    paymentId: "pay_RP3E90PQR",
    orderId: "order_RP3E90GHI",
    paymentMethod: "UPI",
    status: "Successful",
    date: "01 Sep 2026, 09:45 AM",
  },
];

const statusFilters = [
  "All Status",
  "Successful",
  "Pending",
  "Failed",
];

export default function DonationsPage() {
  const [donations, setDonations] =
    useState<Donation[]>(initialDonations);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const [selectedDonation, setSelectedDonation] =
    useState<Donation | null>(null);

  const [deleteDonation, setDeleteDonation] =
    useState<Donation | null>(null);

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        donation.donorName
          .toLowerCase()
          .includes(searchText) ||
        donation.email
          .toLowerCase()
          .includes(searchText) ||
        donation.phone
          .toLowerCase()
          .includes(searchText) ||
        donation.id
          .toLowerCase()
          .includes(searchText) ||
        donation.paymentId
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        status === "All Status" ||
        donation.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [donations, search, status]);

  const successfulDonations = donations.filter(
    (item) => item.status === "Successful"
  );

  const pendingDonations = donations.filter(
    (item) => item.status === "Pending"
  );

  const failedDonations = donations.filter(
    (item) => item.status === "Failed"
  );

  const totalAmount = successfulDonations.reduce(
    (total, donation) => total + donation.amount,
    0
  );

  const handleDelete = () => {
    if (!deleteDonation) return;

    setDonations((prev) =>
      prev.filter((item) => item.id !== deleteDonation.id)
    );

    setDeleteDonation(null);
    setSelectedDonation(null);
  };

  return (
    <div className="min-h-screen bg-[#f6f8f5]">
      {/* ADMIN LAYOUT */}
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <AdminHeader />

          <main className="p-5 lg:p-8">
            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-[#173b24]">
                Donations
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View and manage donation payments.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DonationStat
                title="Total Donations"
                value={`₹${totalAmount.toLocaleString("en-IN")}`}
                icon="fa-solid fa-indian-rupee-sign"
                iconBg="bg-[#eaf4ed]"
                iconColor="text-[#17653a]"
              />

              <DonationStat
                title="Successful"
                value={successfulDonations.length.toString()}
                icon="fa-solid fa-circle-check"
                iconBg="bg-green-50"
                iconColor="text-green-600"
              />

              <DonationStat
                title="Pending"
                value={pendingDonations.length.toString()}
                icon="fa-solid fa-clock"
                iconBg="bg-yellow-50"
                iconColor="text-yellow-600"
              />

              <DonationStat
                title="Failed"
                value={failedDonations.length.toString()}
                icon="fa-solid fa-circle-xmark"
                iconBg="bg-red-50"
                iconColor="text-red-600"
              />
            </div>

            {/* Filters */}
            <div className="mt-7 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex flex-col gap-3 md:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search donor, phone, email, donation ID or payment ID..."
                    className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#17653a] focus:bg-white focus:ring-2 focus:ring-[#17653a]/10"
                  />
                </div>

                {/* Status */}
                <div className="relative md:w-52">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 pr-10 text-sm outline-none focus:border-[#17653a] focus:bg-white"
                  >
                    {statusFilters.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-700">
                  {filteredDonations.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-700">
                  {donations.length}
                </span>{" "}
                donations
              </div>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Donor
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Donation ID
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Amount
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Method
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Date
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredDonations.map((donation) => (
                      <tr
                        key={donation.id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* Donor */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf4ed] font-bold text-[#17653a]">
                              {donation.donorName.charAt(0)}
                            </div>

                            <div>
                              <p className="text-sm font-bold text-gray-800">
                                {donation.donorName}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-500">
                                {donation.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Donation ID */}
                        <td className="px-5 py-4">
                          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                            {donation.id}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-extrabold text-[#173b24]">
                            ₹{donation.amount.toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* Method */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <i
                              className={
                                donation.paymentMethod === "UPI"
                                  ? "fa-solid fa-mobile-screen-button text-[#17653a]"
                                  : donation.paymentMethod === "Card"
                                    ? "fa-regular fa-credit-card text-[#17653a]"
                                    : "fa-solid fa-building-columns text-[#17653a]"
                              }
                            />

                            {donation.paymentMethod}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <DonationStatusBadge
                            status={donation.status}
                          />
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-500">
                            {donation.date}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                setSelectedDonation(donation)
                              }
                              title="View Details"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-[#17653a] hover:text-[#17653a]"
                            >
                              <i className="fa-solid fa-eye text-sm" />
                            </button>

                            <button
                              onClick={() =>
                                setDeleteDonation(donation)
                              }
                              title="Delete"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-red-500 hover:text-red-500"
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

              {/* Empty State */}
              {filteredDonations.length === 0 && (
                <div className="py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf4ed] text-xl text-[#17653a]">
                    <i className="fa-solid fa-receipt" />
                  </div>

                  <h3 className="mt-4 font-bold text-gray-800">
                    No donations found
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your search or filter.
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

              </div>

            </div>
          </main>
        </div>
      </div>

      {/* Details Modal */}
      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
        />
      )}

      {/* Delete Modal */}
      {deleteDonation && (
        <DeleteDonationModal
          donation={deleteDonation}
          onCancel={() => setDeleteDonation(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function DonationStat({
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

function DonationStatusBadge({
  status,
}: {
  status: Donation["status"];
}) {
  const styles = {
    Successful: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
  };

  const icons = {
    Successful: "fa-solid fa-check",
    Pending: "fa-solid fa-clock",
    Failed: "fa-solid fa-xmark",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      <i className={icons[status]} />
      {status}
    </span>
  );
}

/* ============================================================
   DETAILS MODAL
============================================================ */

function DonationDetailsModal({
  donation,
  onClose,
}: {
  donation: Donation;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="font-extrabold text-[#173b24]">
              Donation Details
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {donation.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="p-6">
          {/* Amount */}
          <div className="rounded-xl bg-[#f6f8f5] p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Donation Amount
            </p>

            <p className="mt-2 text-4xl font-extrabold text-[#17653a]">
              ₹{donation.amount.toLocaleString("en-IN")}
            </p>

            <div className="mt-3">
              <DonationStatusBadge
                status={donation.status}
              />
            </div>
          </div>

          {/* Donor */}
          <div className="mt-6">
            <h3 className="font-bold text-[#173b24]">
              Donor Information
            </h3>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Donor Name"
                value={donation.donorName}
                icon="fa-solid fa-user"
              />

              <DetailItem
                label="Phone Number"
                value={donation.phone}
                icon="fa-solid fa-phone"
              />

              <DetailItem
                label="Email Address"
                value={donation.email}
                icon="fa-regular fa-envelope"
              />

              <DetailItem
                label="Payment Method"
                value={donation.paymentMethod}
                icon="fa-solid fa-credit-card"
              />
            </div>
          </div>

          {/* Transaction */}
          <div className="mt-6">
            <h3 className="font-bold text-[#173b24]">
              Transaction Information
            </h3>

            <div className="mt-3 grid gap-4">
              <DetailItem
                label="Donation ID"
                value={donation.id}
                icon="fa-solid fa-receipt"
              />

              <DetailItem
                label="Razorpay Payment ID"
                value={donation.paymentId}
                icon="fa-solid fa-money-check"
              />

              <DetailItem
                label="Razorpay Order ID"
                value={donation.orderId}
                icon="fa-solid fa-file-invoice"
              />

              <DetailItem
                label="Payment Date"
                value={donation.date}
                icon="fa-regular fa-calendar"
              />
            </div>
          </div>

          {/* Close */}
          <div className="mt-6 flex justify-end">
            <button
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

      <p className="mt-2 break-all text-sm font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   DELETE MODAL
============================================================ */

function DeleteDonationModal({
  donation,
  onCancel,
  onConfirm,
}: {
  donation: Donation;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <i className="fa-solid fa-trash" />
        </div>

        <h2 className="mt-4 text-lg font-extrabold text-gray-800">
          Delete Donation?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Are you sure you want to delete the donation from{" "}
          <span className="font-bold text-gray-700">
            {donation.donorName}
          </span>
          ?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}