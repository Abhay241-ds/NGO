"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { createClient } from "@/lib/supabase/server";

const supabase = createClient();

export default function VolunteerPage() {
  const { t } = useLanguage();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitted(false);
    setError("");
    setLoading(true);

    // Save the form reference BEFORE any await
    const form = e.currentTarget;

    try {
      const formData = new FormData(form);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const city = String(formData.get("city") || "").trim();
      const interest = String(formData.get("interest") || "").trim();
      const category = String(formData.get("category") || "").trim();
      const message = String(formData.get("message") || "").trim();

      const photo = formData.get("photo") as File | null;

      // -----------------------------
      // VALIDATION
      // -----------------------------

      if (photo && photo.size > 1 * 1024 * 1024) {
        setError(
          t(
            "फोटो का आकार 1 MB से अधिक नहीं होना चाहिए।",
            "Photo size must not exceed 1 MB."
          )
        );

        return;
      }

      if (
        !name ||
        !email ||
        !phone ||
        !city ||
        !interest ||
        !category ||
        !photo
      ) {
        setError(
          t(
            "कृपया सभी आवश्यक फ़ील्ड भरें।",
            "Please fill in all required fields."
          )
        );

        return;
      }

      // -----------------------------
      // UPLOAD PHOTO
      // -----------------------------

      let photoPath: string | null = null;

      if (photo && photo.size > 0) {
        const fileExt =
          photo.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await (await supabase).storage
          .from("volunteer-photos")
          .upload(fileName, photo, {
            contentType: photo.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("Photo upload error:", uploadError);
          return;
        }

        photoPath = fileName;
      }
      // -----------------------------
      // INSERT VOLUNTEER
      // -----------------------------

      const { data, error: insertError } = await (await supabase)
        .from("volunteers")
        .insert({
          name,
          email,
          phone,
          city,
          interest,
          category,
          message,
          photo_path: photoPath,
        })

      // -----------------------------
      // DATABASE ERROR
      // -----------------------------

      if (insertError) {
        console.error("================================");
        console.error("VOLUNTEER SUBMISSION ERROR");
        console.error("MESSAGE:", insertError.message);
        console.error("DETAILS:", insertError.details);
        console.error("HINT:", insertError.hint);
        console.error("CODE:", insertError.code);
        console.error("FULL ERROR:", insertError);
        console.error("================================");

        // Delete uploaded photo if database insert failed
        if (photoPath) {
          const { error: cleanupError } = await (await supabase).storage
            .from("volunteer-photos")
            .remove([photoPath]);

          if (cleanupError) {
            console.error(
              "Photo cleanup error:",
              cleanupError
            );
          }
        }

        setError(
          t(
            "आवेदन भेजने में समस्या हुई। कृपया पुनः प्रयास करें।",
            "Something went wrong while submitting your application. Please try again."
          )
        );

        return;
      }

      // -----------------------------
      // SUCCESS
      // -----------------------------

      console.log("VOLUNTEER CREATED:", data);

      setSubmitted(true);

      // Reset the form using the saved reference
      form.reset();

    } catch (err) {
      console.error("Unexpected volunteer submission error:", err);

      setError(
        t(
          "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
          "Something went wrong. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#f6f8ee]">

      {/* Form Section */}
      <section className="px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-4xl">

          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">

            {/* Form Header */}
            <div className="border-b border-gray-100 bg-[#fbfcf7] px-6 py-6 sm:px-8">
              <h2 className="text-xl font-extrabold text-[#173b24] sm:text-2xl">
                {t(
                  "स्वयंसेवक आवेदन",
                  "Volunteer Application"
                )}
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                {t(
                  "कृपया नीचे दी गई जानकारी भरें।",
                  "Please fill in the information below."
                )}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6 sm:p-8"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-[#173b24]"
                >
                  {t("पूरा नाम*", "Full Name*")}
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder={t(
                    "अपना नाम दर्ज करें",
                    "Enter your full name"
                  )}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                />
              </div>

              {/* Email + Phone */}
              <div className="grid gap-6 md:grid-cols-2">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-[#173b24]"
                  >
                    {t("ईमेल*", "Email*")}
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-[#173b24]"
                  >
                    {t("मोबाइल नंबर*", "Phone Number*")}
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="XXXXX XXXXX"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                  />
                </div>

              </div>




              {/* Interest */}
              <div className="grid gap-6 md:grid-cols-2 ">
                <div>
                  <label
                    htmlFor="interest"
                    className="mb-2 block text-sm font-bold text-[#173b24]"
                  >
                    {t("रुचि का क्षेत्र*", "Area of Interest*")}
                  </label>

                  <select
                    id="interest"
                    name="interest"
                    required
                    defaultValue=""
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                  >
                    <option value="">
                      {t("क्षेत्र चुनें", "Select an area")}
                    </option>

                    <option value="education">
                      {t("शिक्षा", "Education")}
                    </option>

                    <option value="health">
                      {t("स्वास्थ्य", "Health")}
                    </option>

                    <option value="tree-plantation">
                      {t("वृक्षारोपण", "Tree Plantation")}
                    </option>

                    <option value="sports">
                      {t("खेलकूद", "Sports")}
                    </option>

                    <option value="food-distribution">
                      {t("भोजन वितरण", "Food Distribution")}
                    </option>

                    <option value="women-empowerment">
                      {t("महिला सशक्तिकरण", "Women Empowerment")}
                    </option>

                    <option value="child-protection">
                      {t("बाल संरक्षण", "Child Protection")}
                    </option>

                    <option value="animal-welfare">
                      {t("पशु कल्याण", "Animal Welfare")}
                    </option>

                    <option value="bird-welfare">
                      {t("पक्षी सेवा", "Bird Welfare")}
                    </option>

                    <option value="other">
                      {t("अन्य", "Other")}
                    </option>
                  </select>
                </div>
                <div>

                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-bold text-[#173b24]"
                  >
                    {t("श्रेणी*", "Category*")}
                  </label>

                  <select
                    id="category"
                    name="category"
                    required
                    defaultValue=""
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                  >
                    <option value="">
                      {t("श्रेणी चुनें", "Select Category")}
                    </option>

                    <option value="general">
                      {t("सामान्य", "General")}
                    </option>

                    <option value="obc">
                      {t("अन्य पिछड़ा वर्ग", "OBC")}
                    </option>

                    <option value="sc">
                      {t("अनुसूचित जाति / अनुसूचित जनजाति", "SC / ST")}
                    </option>


                  </select>
                </div>

              </div>


              <div className="grid gap-6 md:grid-cols-2">
                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-bold text-[#173b24]"
                  >
                    {t("शहर / गाँव*", "City / Village*")}
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    placeholder={t(
                      "अपना शहर या गाँव",
                      "Enter your city or village"
                    )}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                  />
                </div>


                {/* Volunteer Photo */}
                <div>
                  <label
                    htmlFor="photo"
                    className="mb-2 block text-sm font-bold text-[#173b24]"
                  >
                    {t("स्वयंसेवक का फोटो*", "Volunteer Photo*")}
                  </label>

                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    className="w-[55%] font-bold rounded-lg border cursor-pointer border-gray-300 bg-green-700 hover:bg-green-900 text-white px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    {t(
                      "कृपया फोटो अपलोड करें (JPG, PNG या WebP)। [1MB] ",
                      "Please upload a photo (JPG, PNG or WebP). [1MB]"
                    )}
                  </p>
                </div>

              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-bold text-[#173b24]"
                >
                  {t(
                    "आप स्वयंसेवक क्यों बनना चाहते हैं?",
                    "Why do you want to volunteer?"
                  )}
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder={t(
                    "अपने बारे में और सेवा से जुड़ने की इच्छा के बारे में बताएं...",
                    "Tell us a little about yourself and why you would like to volunteer..."
                  )}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-center text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-lg bg-[#17653a] px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-[#0e4d2b] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? t("भेजा जा रहा है...", "Submitting...")
                    : t(
                      "स्वयंसेवक आवेदन भेजें",
                      "Submit Volunteer Application"
                    )}
                </button>
              </div>

              {/* Success */}
              {submitted && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-center text-sm font-semibold text-green-700">
                  {t(
                    "आपका आवेदन सफलतापूर्वक भेज दिया गया है। धन्यवाद!",
                    "Your application has been submitted successfully. Thank you!"
                  )}
                </div>
              )}

            </form>
          </div>
        </div>
      </section>

    </main>
  );
}