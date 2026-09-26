"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

type ActivityImage = {
  url: string;
  publicId: string;
};

type Activity = {
  id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  category: string;
  activity_date: string | null;
  images: ActivityImage[];
  created_at: string;
  updated_at: string;
};

type FormData = {
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  category: string;
  activity_date: string;
};

const categories = [
  "Education",
  "Health",
  "Tree Plantation",
  "Sports",
  "Food Distribution",
  "Women Empowerment",
  "Animal Welfare",
  "Other",
];

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/* ============================================================
   MAIN PAGE
============================================================ */

export default function ActivitiesAdminPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingActivity, setEditingActivity] =
    useState<Activity | null>(null);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title_en: "",
    title_hi: "",
    description_en: "",
    description_hi: "",
    category: "Social Service",
    activity_date: "",
  });

  const [selectedFiles, setSelectedFiles] =
    useState<File[]>([]);

  const [previewUrls, setPreviewUrls] =
    useState<string[]>([]);

  const [existingImages, setExistingImages] =
    useState<ActivityImage[]>([]);

  const [error, setError] = useState("");

  const [deleteActivity, setDeleteActivity] =
    useState<Activity | null>(null);

  const [deleting, setDeleting] = useState(false);

  /* ============================================================
     FETCH ACTIVITIES
  ============================================================ */

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("activity_date", {
          ascending: false,
        })
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Fetch activities error:",
          error
        );

        setError(
          "Unable to load activities."
        );

        return;
      }

      const formatted = (data || []).map(
        (activity) => ({
          ...activity,
          images: Array.isArray(activity.images)
            ? activity.images
            : [],
        })
      ) as Activity[];

      setActivities(formatted);
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong while loading activities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  /* ============================================================
     OPEN ADD MODAL
  ============================================================ */

  const openAddModal = () => {
    setEditingActivity(null);

    setFormData({
      title_en: "",
      title_hi: "",
      description_en: "",
      description_hi: "",
      category: "Social Service",
      activity_date: "",
    });

    setSelectedFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);
    setError("");

    setShowModal(true);
  };

  /* ============================================================
     OPEN EDIT MODAL
  ============================================================ */

  const openEditModal = (
    activity: Activity
  ) => {
    setEditingActivity(activity);

    setFormData({
      title_en: activity.title_en,
      title_hi: activity.title_hi,
      description_en:
        activity.description_en,
      description_hi:
        activity.description_hi,
      category: activity.category,
      activity_date:
        activity.activity_date || "",
    });

    setSelectedFiles([]);
    setPreviewUrls([]);

    setExistingImages(
      activity.images || []
    );

    setError("");
    setShowModal(true);
  };

  /* ============================================================
     CLOSE MODAL
  ============================================================ */

  const closeModal = () => {
    if (saving) return;

    previewUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setShowModal(false);
    setEditingActivity(null);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);
    setError("");
  };

  /* ============================================================
     FORM CHANGE
  ============================================================ */

  const handleInputChange = (
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================================
     IMAGE SELECTION
  ============================================================ */

  const handleImageSelect = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) return;

    setError("");

    const currentImageCount =
      existingImages.length +
      selectedFiles.length;

    const remainingSlots =
      MAX_IMAGES - currentImageCount;

    if (remainingSlots <= 0) {
      setError(
        `Maximum ${MAX_IMAGES} images are allowed per activity.`
      );

      e.target.value = "";
      return;
    }

    const filesToProcess =
      files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setError(
        `Only ${remainingSlots} more image(s) can be added. Maximum is ${MAX_IMAGES}.`
      );
    }

    const validFiles: File[] = [];

    for (const file of filesToProcess) {
      if (!file.type.startsWith("image/")) {
        setError(
          `${file.name} is not a valid image.`
        );
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          `${file.name} is larger than 5 MB.`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (!validFiles.length) {
      e.target.value = "";
      return;
    }

    const urls = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setSelectedFiles((prev) => [
      ...prev,
      ...validFiles,
    ]);

    setPreviewUrls((prev) => [
      ...prev,
      ...urls,
    ]);

    e.target.value = "";
  };

  /* ============================================================
     REMOVE NEW IMAGE
  ============================================================ */

  const removeSelectedImage = (
    index: number
  ) => {
    const url = previewUrls[index];

    if (url) {
      URL.revokeObjectURL(url);
    }

    setPreviewUrls((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setSelectedFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* ============================================================
     REMOVE EXISTING IMAGE
  ============================================================ */

  const removeExistingImage = (
    index: number
  ) => {
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* ============================================================
     UPLOAD IMAGE TO CLOUDINARY
  ============================================================ */

  const uploadImageToCloudinary = async (
    file: File
  ): Promise<ActivityImage> => {
    const uploadData = new FormData();

    uploadData.append("file", file);

    const response = await fetch(
      "/api/activity-upload",
      {
        method: "POST",
        body: uploadData,
      }
    );

    const text = await response.text();

    console.log(
      "Cloudinary upload status:",
      response.status
    );

    console.log(
      "Cloudinary upload response:",
      text
    );

    let result: any;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(
        `Upload API returned an invalid response (${response.status}).`
      );
    }

    if (!response.ok) {
      throw new Error(
        result?.error ||
        `Upload failed with status ${response.status}.`
      );
    }

    if (
      !result?.url ||
      !result?.publicId
    ) {
      throw new Error(
        "Cloudinary upload succeeded but URL/publicId was not returned."
      );
    }

    return {
      url: result.url,
      publicId: result.publicId,
    };
  };

  /* ============================================================
     DELETE CLOUDINARY IMAGE
  ============================================================ */

  const deleteCloudinaryImage = async (
    publicId: string
  ) => {
    console.log(
      "Deleting Cloudinary image:",
      publicId
    );

    const response = await fetch(
      "/api/activity-delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId,
        }),
      }
    );

    const text = await response.text();

    console.log(
      "Delete API status:",
      response.status
    );

    console.log(
      "Delete API response:",
      text
    );

    let result: any;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(
        `Delete API returned an invalid response (${response.status}).`
      );
    }

    if (!response.ok) {
      throw new Error(
        result?.error ||
        `Failed to delete image (${response.status}).`
      );
    }

    if (!result?.success) {
      throw new Error(
        result?.error ||
        "Cloudinary image deletion failed."
      );
    }

    console.log(
      "Cloudinary image deleted successfully:",
      publicId
    );

    return result;
  };


  /* ============================================================
     SAVE ACTIVITY
  ============================================================ */

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");

    /* ----------------------------------------------------------
       VALIDATION
    ---------------------------------------------------------- */

    if (
      !formData.title_en.trim() ||
      !formData.title_hi.trim()
    ) {
      setError(
        "Please enter both English and Hindi titles."
      );

      return;
    }

    if (
      !formData.description_en.trim() ||
      !formData.description_hi.trim()
    ) {
      setError(
        "Please enter both English and Hindi descriptions."
      );

      return;
    }

    if (!formData.category) {
      setError(
        "Please select a category."
      );

      return;
    }

    if (
      existingImages.length +
      selectedFiles.length >
      MAX_IMAGES
    ) {
      setError(
        `Maximum ${MAX_IMAGES} images are allowed per activity.`
      );

      return;
    }

    setSaving(true);

    try {
      /* --------------------------------------------------------
         UPLOAD NEW IMAGES
      -------------------------------------------------------- */

      const uploadedImages: ActivityImage[] =
        [];

      if (selectedFiles.length > 0) {
        for (
          let i = 0;
          i < selectedFiles.length;
          i++
        ) {
          const uploaded =
            await uploadImageToCloudinary(
              selectedFiles[i]
            );

          uploadedImages.push(
            uploaded
          );
        }
      }

      /* --------------------------------------------------------
         FINAL IMAGE ARRAY
      -------------------------------------------------------- */

      const finalImages: ActivityImage[] =
        [
          ...existingImages,
          ...uploadedImages,
        ];

      /* ========================================================
         ADD ACTIVITY
      ======================================================== */

      if (!editingActivity) {
        const { error } =
          await supabase
            .from("activities")
            .insert({
              title_en:
                formData.title_en.trim(),

              title_hi:
                formData.title_hi.trim(),

              description_en:
                formData.description_en.trim(),

              description_hi:
                formData.description_hi.trim(),

              category:
                formData.category,

              activity_date:
                formData.activity_date ||
                null,

              images:
                finalImages,
            });

        /* ------------------------------------------------------
           ROLLBACK CLOUDINARY UPLOADS
        ------------------------------------------------------ */

        if (error) {
          console.error(
            "Add activity error:",
            error
          );

          for (
            const image of uploadedImages
          ) {
            try {
              await deleteCloudinaryImage(
                image.publicId
              );
            } catch (rollbackError) {
              console.error(
                "Cloudinary rollback failed:",
                rollbackError
              );
            }
          }

          throw new Error(
            error.message
          );
        }
      }

      /* ========================================================
         UPDATE ACTIVITY
      ======================================================== */

      else {
        const { error } =
          await supabase
            .from("activities")
            .update({
              title_en:
                formData.title_en.trim(),

              title_hi:
                formData.title_hi.trim(),

              description_en:
                formData.description_en.trim(),

              description_hi:
                formData.description_hi.trim(),

              category:
                formData.category,

              activity_date:
                formData.activity_date ||
                null,

              images:
                finalImages,
            })
            .eq(
              "id",
              editingActivity.id
            );

        /* ------------------------------------------------------
           UPDATE FAILED
        ------------------------------------------------------ */

        if (error) {
          console.error(
            "Update activity error:",
            error
          );

          /*
            Delete only images uploaded
            during this save attempt.
          */

          for (
            const image of uploadedImages
          ) {
            try {
              await deleteCloudinaryImage(
                image.publicId
              );
            } catch (rollbackError) {
              console.error(
                "Cloudinary rollback failed:",
                rollbackError
              );
            }
          }

          throw new Error(
            error.message
          );
        }

        /* ------------------------------------------------------
           FIND REMOVED OLD IMAGES
        ------------------------------------------------------ */

        const removedImages =
          editingActivity.images.filter(
            (oldImage) =>
              !existingImages.some(
                (currentImage) =>
                  currentImage.publicId ===
                  oldImage.publicId
              )
          );

        /* ------------------------------------------------------
           DELETE REMOVED IMAGES FROM CLOUDINARY
        ------------------------------------------------------ */

        for (
          const image of removedImages
        ) {
          try {
            await deleteCloudinaryImage(
              image.publicId
            );
          } catch (deleteError) {
            console.error(
              "Cloudinary image delete error:",
              deleteError
            );
          }
        }
      }

      /* ========================================================
         REFRESH
      ======================================================== */

      await fetchActivities();

      closeModal();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save activity."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     DELETE ACTIVITY
  ============================================================ */

  const handleDelete = async () => {
    if (!deleteActivity) return;

    setDeleting(true);
    setError("");

    try {
      /* --------------------------------------------------------
         DELETE CLOUDINARY IMAGES
      -------------------------------------------------------- */

      for (
        const image of
        deleteActivity.images || []
      ) {
        try {
          await deleteCloudinaryImage(
            image.publicId
          );
        } catch (error) {
          console.error(
            "Cloudinary delete error:",
            error
          );
        }
      }

      /* --------------------------------------------------------
         DELETE SUPABASE RECORD
      -------------------------------------------------------- */

      const { error } =
        await supabase
          .from("activities")
          .delete()
          .eq(
            "id",
            deleteActivity.id
          );

      if (error) {
        throw new Error(
          error.message
        );
      }

      setDeleteActivity(null);

      await fetchActivities();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete activity."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ============================================================
     FORMAT DATE
  ============================================================ */

  const formatDate = (
    date: string | null
  ) => {
    if (!date) return "No date";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ============================================================
     PREVIEW URL CLEANUP
  ============================================================ */

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [previewUrls]);

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#f6f8f5]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <AdminHeader />

          <main className="p-5 lg:p-8">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-black text-[#173b24]">
                  Activities
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage NGO activities,
                  images and descriptions.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17653a] px-5 py-3 font-bold text-white shadow-sm transition hover:bg-[#12532f]"
              >
                <i className="fa-solid fa-plus" />
                Add Activity
              </button>
            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error &&
              !showModal && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

            {/* ==================================================
                LOADING
            ================================================== */}

            {loading ? (
              <div className="flex min-h-75 items-center justify-center">
                <div className="text-center">
                  <i className="fa-solid fa-spinner fa-spin text-3xl text-[#17653a]" />

                  <p className="mt-3 text-sm text-gray-500">
                    Loading activities...
                  </p>
                </div>
              </div>
            ) : activities.length === 0 ? (
              /* ==================================================
                 EMPTY
              ================================================== */

              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4ed] text-[#17653a]">
                  <i className="fa-solid fa-images text-2xl" />
                </div>

                <h2 className="mt-5 text-lg font-extrabold text-[#173b24]">
                  No activities yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  Add your first NGO activity
                  with multiple photos.
                </p>

                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-6 rounded-xl bg-[#17653a] px-5 py-3 font-bold text-white transition hover:bg-[#12532f]"
                >
                  <i className="fa-solid fa-plus mr-2" />
                  Add First Activity
                </button>
              </div>
            ) : (
              /* ==================================================
                 ACTIVITY GRID
              ================================================== */

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {activities.map(
                  (activity) => (
                    <div
                      key={activity.id}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                    >
                      {/* IMAGE */}

                      <div className="relative h-56 bg-gray-100">
                        {activity.images.length >
                          0 ? (
                          <img
                            src={
                              activity
                                .images[0]
                                .url
                            }
                            alt={
                              activity.title_en
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400">
                            <i className="fa-regular fa-image text-4xl" />
                          </div>
                        )}

                        {/* IMAGE COUNT */}

                        {activity.images.length >
                          1 && (
                            <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                              <i className="fa-solid fa-images mr-1" />
                              {activity.images.length}
                            </div>
                          )}

                        {/* CATEGORY */}

                        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-[#17653a] shadow-sm">
                          {activity.category}
                        </div>
                      </div>

                      {/* CONTENT */}

                      <div className="p-5">
                        <h2 className="line-clamp-1 text-lg font-black text-[#173b24]">
                          {activity.title_en}
                        </h2>

                        <p className="mt-1 line-clamp-1 text-sm font-semibold text-[#17653a]">
                          {activity.title_hi}
                        </p>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                          {
                            activity.description_en
                          }
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-gray-500">
                          <i className="fa-regular fa-calendar" />

                          {formatDate(
                            activity.activity_date
                          )}
                        </div>

                        {/* ACTIONS */}

                        <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                activity
                              )
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-bold text-gray-700 transition hover:border-[#17653a] hover:bg-[#f6f8f5]"
                          >
                            <i className="fa-solid fa-pen-to-square" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteActivity(
                                activity
                              )
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                          >
                            <i className="fa-solid fa-trash" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

            )}
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

      {/* ========================================================
          ADD / EDIT MODAL
      ========================================================= */}

      {showModal && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-black text-[#173b24]">
                  {editingActivity
                    ? "Edit Activity"
                    : "Add Activity"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Add activity details and
                  multiple images.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
              >
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-7 p-6"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {/* ==================================================
                  TITLES
              ================================================== */}

              <div>
                <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-[#17653a]">
                  Activity Title
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      English Title *
                    </label>

                    <input
                      type="text"
                      name="title_en"
                      value={
                        formData.title_en
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Tree Plantation Drive"
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Hindi Title *
                    </label>

                    <input
                      type="text"
                      name="title_hi"
                      value={
                        formData.title_hi
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="वृक्षारोपण अभियान"
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                    />
                  </div>
                </div>
              </div>

              {/* ==================================================
                  DESCRIPTIONS
              ================================================== */}

              <div>
                <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-[#17653a]">
                  Description
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      English Description *
                    </label>

                    <textarea
                      name="description_en"
                      value={
                        formData.description_en
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Write activity description..."
                      rows={5}
                      required
                      className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Hindi Description *
                    </label>

                    <textarea
                      name="description_hi"
                      value={
                        formData.description_hi
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="गतिविधि का विवरण लिखें..."
                      rows={5}
                      required
                      className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                    />
                  </div>
                </div>
              </div>

              {/* ==================================================
                  CATEGORY / DATE
              ================================================== */}

              <div>
                <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-[#17653a]">
                  Activity Information
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Category *
                    </label>

                    <select
                      name="category"
                      value={
                        formData.category
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                    >
                      {categories.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Activity Date
                    </label>

                    <input
                      type="date"
                      name="activity_date"
                      value={
                        formData.activity_date
                      }
                      onChange={
                        handleInputChange
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                    />
                  </div>
                </div>
              </div>

              {/* ==================================================
                  IMAGES
              ================================================== */}

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wide text-[#17653a]">
                      Activity Images
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Maximum {MAX_IMAGES} images.
                      Maximum 5 MB per image.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#eaf4ed] px-3 py-1 text-xs font-bold text-[#17653a]">
                    {existingImages.length +
                      selectedFiles.length}{" "}
                    / {MAX_IMAGES}
                  </span>
                </div>

                {/* UPLOAD */}

                <label
                  className={`flex min-h-37.5 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition ${existingImages.length +
                    selectedFiles.length >=
                    MAX_IMAGES
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-60"
                    : "cursor-pointer border-gray-300 bg-[#f9fbf9] hover:border-[#17653a] hover:bg-[#f3f8f4]"
                    }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf4ed] text-[#17653a]">
                    <i className="fa-solid fa-cloud-arrow-up text-xl" />
                  </div>

                  <p className="mt-3 text-sm font-extrabold text-gray-700">
                    {existingImages.length +
                      selectedFiles.length >=
                      MAX_IMAGES
                      ? "Maximum images reached"
                      : "Click to select images"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG, WEBP • Max 5 MB
                    each
                  </p>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={
                      handleImageSelect
                    }
                    disabled={
                      existingImages.length +
                      selectedFiles.length >=
                      MAX_IMAGES
                    }
                    className="hidden"
                  />
                </label>

                {/* EXISTING IMAGES */}

                {existingImages.length >
                  0 && (
                    <div className="mt-5">
                      <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-gray-500">
                        Existing Images
                      </p>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {existingImages.map(
                          (
                            image,
                            index
                          ) => (
                            <div
                              key={
                                image.publicId
                              }
                              className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                            >
                              <img
                                src={
                                  image.url
                                }
                                alt={`Activity image ${index + 1
                                  }`}
                                className="h-full w-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeExistingImage(
                                    index
                                  )
                                }
                                disabled={saving}
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <i className="fa-solid fa-xmark text-xs" />
                              </button>

                              {index ===
                                0 && (
                                  <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold text-white">
                                    Main Image
                                  </span>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* NEW IMAGES */}

                {previewUrls.length >
                  0 && (
                    <div className="mt-5">
                      <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-gray-500">
                        New Images
                      </p>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {previewUrls.map(
                          (
                            url,
                            index
                          ) => (
                            <div
                              key={`${url}-${index}`}
                              className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                            >
                              <img
                                src={url}
                                alt={`New image ${index + 1
                                  }`}
                                className="h-full w-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeSelectedImage(
                                    index
                                  )
                                }
                                disabled={saving}
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <i className="fa-solid fa-xmark text-xs" />
                              </button>

                              <span className="absolute bottom-2 left-2 rounded-full bg-[#17653a] px-2 py-1 text-[10px] font-bold text-white">
                                New
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* ==================================================
                  ACTIONS
              ================================================== */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl bg-gray-100 px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#17653a] px-7 py-3 font-bold text-white transition hover:bg-[#12532f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2" />

                      {editingActivity
                        ? "Updating..."
                        : "Saving..."}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk mr-2" />

                      {editingActivity
                        ? "Update Activity"
                        : "Save Activity"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE MODAL
      ========================================================= */}

      {deleteActivity && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() =>
            !deleting &&
            setDeleteActivity(null)
          }
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <i className="fa-solid fa-trash text-xl" />
            </div>

            <h2 className="mt-5 text-xl font-black text-gray-900">
              Delete Activity?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to
              delete{" "}
              <strong>
                {deleteActivity.title_en}
              </strong>
              ? This will also delete its
              Cloudinary images.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setDeleteActivity(
                    null
                  )
                }
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-bold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-trash mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      )}

    </div>

  );
}