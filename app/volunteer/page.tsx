"use client";

import { FormEvent, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabase/client";

const NGO_UPI_ID = "20260346395309-iservuqrsbrp@cbin";
const REGISTRATION_FEE = 100;
const MAX_PHOTO_SIZE = 1024 * 1024;

export default function VolunteerPage() {
  const { t } = useLanguage("hi");

  const formRef = useRef<HTMLFormElement>(null);
  const stepOneRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [paymentUpiId, setPaymentUpiId] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // =====================================================
  // STEP 1 VALIDATION
  // =====================================================

  const handleNext = () => {
    setError("");

    const container = stepOneRef.current;

    if (!container) return;

    const fields = container.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea");

    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return;
      }
    }

    const photoInput = container.querySelector<HTMLInputElement>(
      'input[name="photo"]'
    );

    const photo = photoInput?.files?.[0];

    if (!photo) {
      setError(
        t(
          "कृपया अपनी फोटो अपलोड करें।",
          "Please upload your photo."
        )
      );
      return;
    }

    if (photo.size > MAX_PHOTO_SIZE) {
      setError(
        t(
          "फोटो का आकार 1 MB से अधिक नहीं होना चाहिए।",
          "Photo size must not exceed 1 MB."
        )
      );
      return;
    }

    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // FINAL SUBMISSION
  // =====================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSubmitted(false);

    if (step !== 2) return;

    const form = formRef.current;

    if (!form) return;

    setLoading(true);

    let photoPath: string | null = null;

    try {
      const formData = new FormData(form);

      // -----------------------------------------------
      // VOLUNTEER DETAILS
      // -----------------------------------------------

      const name = String(
        formData.get("name") || ""
      ).trim();

      const email = String(
        formData.get("email") || ""
      ).trim();

      const phone = String(
        formData.get("phone") || ""
      ).trim();

      const city = String(
        formData.get("city") || ""
      ).trim();

      const interest = String(
        formData.get("interest") || ""
      ).trim();

      const category = String(
        formData.get("category") || ""
      ).trim();

      const message = String(
        formData.get("message") || ""
      ).trim();

      const blood_group = String(
        formData.get("blood_group") || ""
      ).trim();

      const photo = formData.get("photo") as File | null;

      // -----------------------------------------------
      // PAYMENT DETAILS
      // -----------------------------------------------

      const payment_upi_id = paymentUpiId.trim();

      const payment_transaction_id =
        transactionId.trim();

      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (
        !name ||
        !email ||
        !phone ||
        !city ||
        !interest ||
        !category ||
        !blood_group ||
        !photo ||
        photo.size === 0
      ) {
        setStep(1);

        setError(
          t(
            "कृपया स्वयंसेवक फॉर्म की सभी आवश्यक जानकारी भरें।",
            "Please complete all required volunteer fields."
          )
        );

        return;
      }

      if (photo.size > MAX_PHOTO_SIZE) {
        setStep(1);

        setError(
          t(
            "फोटो का आकार 1 MB से अधिक नहीं होना चाहिए।",
            "Photo size must not exceed 1 MB."
          )
        );

        return;
      }

      if (!payment_upi_id || !payment_transaction_id) {
        setError(
          t(
            "कृपया अपनी UPI ID और ट्रांजैक्शन ID दर्ज करें।",
            "Please enter your UPI ID and transaction ID."
          )
        );

        return;
      }

      if (
        payment_upi_id.length > 100 ||
        payment_transaction_id.length > 100
      ) {
        setError(
          t(
            "UPI ID और ट्रांजैक्शन ID अधिकतम 100 अक्षरों की हो सकती हैं।",
            "UPI ID and transaction ID must not exceed 100 characters."
          )
        );

        return;
      }

      // -----------------------------------------------
      // SUPABASE CLIENT
      // -----------------------------------------------

      const supabaseClient = await supabase;

      // -----------------------------------------------
      // UPLOAD VOLUNTEER PHOTO
      // -----------------------------------------------

      const fileExt =
        photo.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } =
        await supabaseClient.storage
          .from("volunteer-photos")
          .upload(fileName, photo, {
            contentType: photo.type,
            upsert: false,
          });

      if (uploadError) {
        console.error(
          "Volunteer photo upload error:",
          uploadError
        );

        setError(
          t(
            "फोटो अपलोड नहीं हो सकी। कृपया दोबारा प्रयास करें।",
            "Photo upload failed. Please try again."
          )
        );

        return;
      }

      photoPath = fileName;

      // -----------------------------------------------
      // INSERT VOLUNTEER AND PAYMENT DETAILS
      // -----------------------------------------------

      const { data, error: insertError } =
        await supabaseClient
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
            blood_group,

            // Payment information
            payment_upi_id,
            payment_transaction_id,
            payment_amount: REGISTRATION_FEE,
            payment_status: "Pending Verification",
          })
          .select()
          .single();

      // -----------------------------------------------
      // DATABASE ERROR
      // -----------------------------------------------

      if (insertError) {
        console.error("Volunteer submission error:", {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        });

        // Delete uploaded photo if insertion fails
        const { error: cleanupError } =
          await supabaseClient.storage
            .from("volunteer-photos")
            .remove([photoPath]);

        if (cleanupError) {
          console.error("Photo cleanup error:", cleanupError);
        }

        photoPath = null;

        setError(
          `आवेदन जमा नहीं हो सका: ${insertError.message}`
        );

        return;
      }

      // -----------------------------------------------
      // SUCCESS
      // -----------------------------------------------

      console.log(
        "Volunteer application submitted:",
        data
      );

      setSubmitted(true);
      setStep(1);

      setPaymentUpiId("");
      setTransactionId("");
      setCopied(false);

      form.reset();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err: unknown) {
      console.error("Unexpected volunteer submission error:", err);

      const message =
        err instanceof Error
          ? err.message
          : String(err);

      setError(
        `कुछ गलत हो गया: ${message}`
      );
    } finally {
      setLoading(false);
    }

    
};

// =====================================================
// COPY NGO UPI ID
// =====================================================

const handleCopyUpi = async () => {
  try {
    await navigator.clipboard.writeText(NGO_UPI_ID);

    setCopied(true);
    setError("");

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch {
    setError(
      t(
        "UPI ID कॉपी नहीं हो सकी। कृपया इसे मैन्युअल कॉपी करें।",
        "Could not copy UPI ID. Please copy it manually."
      )
    );
  }
};

// =====================================================
// UI
// =====================================================

return (
  <main className="min-h-screen bg-[#f6f8ee]">
    <section className="px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">

          {/* HEADER */}
          <div className="border-b border-gray-100 bg-[#f5c842] px-6 py-6 sm:px-8">
            <h2 className="text-xl font-extrabold text-[#173b24] sm:text-2xl">
              {t(
                "स्वयंसेवक आवेदन",
                "Volunteer Application"
              )}
            </h2>

            <p className="mt-2 text-sm text-gray-700">
              {t(
                "कृपया नीचे दी गई जानकारी भरें।",
                "Please fill in the information below."
              )}
            </p>

            {/* STEP INDICATOR */}
            <div className="mt-5 flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${step === 1
                  ? "bg-[#17653a] text-white"
                  : "bg-white text-[#17653a]"
                  }`}
              >
                1
              </div>

              <div className="h-1 flex-1 rounded-full bg-white/70">
                <div
                  className={`h-full rounded-full bg-[#17653a] transition-all ${step === 2 ? "w-full" : "w-0"
                    }`}
                />
              </div>

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${step === 2
                  ? "bg-[#17653a] text-white"
                  : "bg-white text-[#173b24]"
                  }`}
              >
                2
              </div>
            </div>

            <div className="mt-2 flex justify-between text-xs font-semibold text-[#173b24]">
              <span>
                {t("व्यक्तिगत जानकारी", "Your Details")}
              </span>

              <span>
                {t("भुगतान", "Payment")}
              </span>
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          {submitted && (
            <div className="mx-6 mt-6 rounded-xl border border-green-200 bg-green-50 p-5 text-center sm:mx-8">
              <i className="fa-solid fa-circle-check text-3xl text-green-700" />

              <h3 className="mt-3 font-extrabold text-green-800">
                {t(
                  "आवेदन सफलतापूर्वक जमा हो गया!",
                  "Application Submitted Successfully!"
                )}
              </h3>

              <p className="mt-2 text-sm leading-6 text-green-700">
                {t(
                  "आपका आवेदन प्राप्त हो गया है। ₹100 के भुगतान का सत्यापन होने के बाद आवेदन पर आगे कार्रवाई की जाएगी।",
                  "Your application has been received. It will be processed after your ₹100 payment is verified."
                )}
              </p>

              <p className="mt-3 text-sm font-bold text-green-800">
                {t(
                  "भुगतान की स्थिति: सत्यापन लंबित",
                  "Payment Status: Pending Verification"
                )}
              </p>
            </div>
          )}

          {/* FORM */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6 p-6 sm:p-8"
          >
            {/* ================================================= */}
            {/* STEP 1: VOLUNTEER DETAILS */}
            {/* Keep mounted so FormData retains all values */}
            {/* ================================================= */}

            <div
              ref={stepOneRef}
              className={
                step === 1 ? "space-y-6" : "hidden"
              }
            >
              {/* NAME */}
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
                  maxLength={100}
                  autoComplete="name"
                  placeholder={t(
                    "अपना नाम दर्ज करें",
                    "Enter your full name"
                  )}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                />
              </div>

              {/* EMAIL + PHONE */}
              <div className="grid gap-6 md:grid-cols-2">
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
                    maxLength={254}
                    autoComplete="email"
                    placeholder="example@gmail.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                  />
                </div>

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
                    maxLength={20}
                    autoComplete="tel"
                    placeholder="XXXXX XXXXX"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                  />
                </div>
              </div>

              {/* INTEREST + CATEGORY */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="interest"
                    className="mb-2 block text-sm font-bold text-[#173b24]"
                  >
                    {t(
                      "रुचि का क्षेत्र*",
                      "Area of Interest*"
                    )}
                  </label>

                  <select
                    id="interest"
                    name="interest"
                    required
                    defaultValue=""
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                  >
                    <option value="" disabled>
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
                      {t(
                        "महिला सशक्तिकरण",
                        "Women Empowerment"
                      )}
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
                    <option value="" disabled>
                      {t("श्रेणी चुनें", "Select Category")}
                    </option>

                    <option value="general">
                      {t("सामान्य", "General")}
                    </option>

                    <option value="obc">
                      {t("अन्य पिछड़ा वर्ग", "OBC")}
                    </option>

                    <option value="sc">
                      {t(
                        "अनुसूचित जाति / अनुसूचित जनजाति",
                        "SC / ST"
                      )}
                    </option>
                  </select>
                </div>
              </div>

              {/* CITY + BLOOD GROUP */}
              <div className="grid gap-6 md:grid-cols-2">
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
                    maxLength={100}
                    autoComplete="address-level2"
                    placeholder={t(
                      "अपना शहर या गाँव",
                      "Enter your city or village"
                    )}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="blood_group"
                    className="mb-2 block text-sm font-bold text-[#173b24]"
                  >
                    {t("ब्लड ग्रुप*", "Blood Group*")}
                  </label>

                  <select
                    id="blood_group"
                    name="blood_group"
                    required
                    defaultValue="Unknown"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                  >
                    <option value="" disabled>
                      {t(
                        "ब्लड ग्रुप चुनें",
                        "Select Blood Group"
                      )}
                    </option>

                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>

                    <option value="Unknown">
                      {t("पता नहीं", "Don't Know")}
                    </option>
                  </select>
                </div>
              </div>

              {/* VOLUNTEER PHOTO */}
              <div>
                <label
                  htmlFor="photo"
                  className="mb-2 block text-sm font-bold text-[#173b24]"
                >
                  {t(
                    "स्वयंसेवक का फोटो*",
                    "Volunteer Photo*"
                  )}
                </label>

                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  className="w-full cursor-pointer rounded-lg border border-gray-300 bg-green-700 px-4 py-3 text-sm font-bold text-white outline-none transition hover:bg-green-900 focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10 sm:w-[70%]"
                />

                <p className="mt-2 text-xs text-gray-500">
                  {t(
                    "JPG, PNG या WebP फोटो अपलोड करें। अधिकतम आकार: 1 MB।",
                    "Upload a JPG, PNG or WebP photo. Maximum size: 1 MB."
                  )}
                </p>
              </div>

              {/* MESSAGE */}
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
                  maxLength={2000}
                  placeholder={t(
                    "अपने बारे में और सेवा से जुड़ने की इच्छा के बारे में बताएं...",
                    "Tell us about yourself and why you would like to volunteer..."
                  )}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                />
              </div>

              {/* STEP 1 ERROR */}
              {step === 1 && error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700"
                >
                  {error}
                </div>
              )}

              {/* NEXT BUTTON */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#17653a] px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-[#F5C842] hover:text-[#173b24] hover:shadow-lg"
                >
                  {t("आगे बढ़ें", "Next")}

                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>

            {/* ================================================= */}
            {/* STEP 2: PAYMENT */}
            {/* ================================================= */}

            <div
              className={
                step === 2 ? "space-y-6" : "hidden"
              }
            >
              {/* PAYMENT HEADER */}
              <div className="text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#eef5eb] text-2xl text-[#17653a]">
                  <i className="fa-solid fa-hand-holding-heart" />
                </div>

                <h3 className="text-xl font-extrabold text-[#173b24] sm:text-2xl">
                  {t(
                    "पंजीकरण शुल्क का भुगतान करें",
                    "Volunteer Registration Payment"
                  )}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {t(
                    "नीचे दिए गए QR कोड को स्कैन करके भुगतान करें।",
                    "Scan the QR code below to make your payment."
                  )}
                </p>
              </div>

              {/* REGISTRATION AMOUNT */}
              <div className="rounded-xl border border-[#dce7d6] bg-[#eef5eb] p-5 text-center">
                <p className="text-sm font-semibold text-gray-600">
                  {t(
                    "स्वयंसेवक पंजीकरण शुल्क",
                    "Volunteer Registration Fee"
                  )}
                </p>

                <p className="mt-2 text-4xl font-extrabold text-[#17653a]">
                  ₹{REGISTRATION_FEE}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {t(
                    "एक बार का पंजीकरण शुल्क",
                    "One-time registration fee"
                  )}
                </p>
              </div>

              {/* NGO QR CODE */}
              <div className="rounded-2xl border border-[#dce7d6] bg-[#f9fbf6] p-5 text-center">
                <img
                  src="/images/QR.jpeg"
                  alt="NGO UPI Payment QR Code"
                  className="mx-auto h-56 w-56 rounded-xl border border-gray-200 bg-white object-contain p-2"
                />

                <p className="mt-4 text-sm font-semibold text-gray-600">
                  {t("NGO की UPI ID", "NGO UPI ID")}
                </p>

                <p className="mt-2 break-all font-bold text-[#17653a]">
                  {NGO_UPI_ID}
                </p>

                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="mt-3 rounded-lg border border-[#17653a] px-4 py-2 text-sm font-bold text-[#17653a] transition hover:bg-[#17653a] hover:text-white"
                >
                  <i
                    className={`${copied
                      ? "fa-solid fa-check"
                      : "fa-regular fa-copy"
                      } mr-2`}
                  />

                  {copied
                    ? t("कॉपी हो गया!", "Copied!")
                    : t("UPI ID कॉपी करें", "Copy UPI ID")}
                </button>
              </div>

              {/* VOLUNTEER UPI ID */}
              <div>
                <label
                  htmlFor="payment_upi_id"
                  className="mb-2 block text-sm font-bold text-[#173b24]"
                >
                  {t("आपकी UPI ID*", "Your UPI ID*")}
                </label>

                <input
                  id="payment_upi_id"
                  name="payment_upi_id"
                  type="text"
                  required
                  maxLength={100}
                  autoComplete="off"
                  value={paymentUpiId}
                  onChange={(e) =>
                    setPaymentUpiId(e.target.value)
                  }
                  placeholder="yourname@okaxis"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                />
              </div>

              {/* TRANSACTION ID */}
              <div>
                <label
                  htmlFor="transaction_id"
                  className="mb-2 block text-sm font-bold text-[#173b24]"
                >
                  {t(
                    "ट्रांजैक्शन ID / UTR नंबर*",
                    "Transaction ID / UTR Number*"
                  )}
                </label>

                <input
                  id="transaction_id"
                  name="transaction_id"
                  type="text"
                  required
                  maxLength={100}
                  autoComplete="off"
                  value={transactionId}
                  onChange={(e) =>
                    setTransactionId(e.target.value)
                  }
                  placeholder={t(
                    "भुगतान के बाद मिला UTR नंबर दर्ज करें",
                    "Enter the UTR number received after payment"
                  )}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#17653a] focus:ring-2 focus:ring-[#17653a]/10"
                />

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {t(
                    "भुगतान करने के बाद अपने UPI ऐप से ट्रांजैक्शन ID या UTR नंबर दर्ज करें।",
                    "After paying, enter the transaction ID or UTR number shown in your UPI app."
                  )}
                </p>
              </div>

              {/* VERIFICATION NOTICE */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                <i className="fa-solid fa-circle-info mr-2" />

                {t(
                  "आपका आवेदन भुगतान सत्यापन के लिए भेजा जाएगा। NGO भुगतान की जाँच करने के बाद आवेदन पर आगे कार्रवाई करेगा।",
                  "Your application will be submitted for payment verification. The NGO will review the payment before processing your application."
                )}
              </div>

              {/* STEP 2 ERROR */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700"
                >
                  {error}
                </div>
              )}

              {/* BACK + SUBMIT */}
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep(1);

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#17653a] px-6 py-3.5 font-bold text-[#17653a] transition hover:bg-[#eef5eb] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <i className="fa-solid fa-arrow-left" />

                  {t("वापस जाएँ", "Back")}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#17653a] px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-[#0e4d2b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" />

                      {t(
                        "जमा किया जा रहा है...",
                        "Submitting..."
                      )}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check" />

                      {t(
                        "आवेदन जमा करें",
                        "Submit Application"
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>
);
}