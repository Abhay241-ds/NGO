"use client";

import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import CopyButton from "@/components/CopyButton";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#f5f7f3]">

      {/* =====================================================
          HERO
      ====================================================== */}


      {/* =====================================================
          ALL CARDS
      ====================================================== */}
      <section className="px-4 py-8 sm:py-20">

        {/* IMPORTANT:
            All three cards are inside the same container.
            This keeps their width exactly the same.
        */}
        <div className="mx-auto w-full max-w-5xl">

          <div className="flex flex-col gap-10">


            {/* =================================================
                CARD 1 — CONTACT
            ================================================== */}
            <article className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_12px_40px_rgba(20,60,35,0.08)]">


              {/* Header */}
              <div className="relative overflow-hidden bg-[#173b24] px-6 py-8 sm:px-9">

                <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />

                <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-[#f5c842]/5" />


                <div className="relative flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f5c842] text-2xl shadow-lg">
                    <i className="fa-solid fa-phone text-[#17653a]"></i>
                  </div>


                  <div>

                    <p className="text-xs font-bold tracking-[0.18em] text-[#f5c842]">
                      {t(
                        "संपर्क जानकारी",
                        "CONTACT INFORMATION"
                      )}
                    </p>


                    <h2 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                      {t(
                        "हमसे संपर्क करें",
                        "Let's Connect"
                      )}
                    </h2>

                  </div>

                </div>

              </div>


              {/* Body */}
              <div className="p-6 sm:p-9">

                <p className="max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">

                  {t(
                    "किसी भी जानकारी, सुझाव या सेवा कार्य से जुड़ने के लिए हमसे संपर्क करें।",
                    "For any information, suggestions or to get involved with our service activities, feel free to contact us."
                  )}

                </p>


                {/* Contact Details */}
                <div className="mt-7 grid gap-4 sm:grid-cols-2">


                  {/* Address */}
                  <div className="flex rounded-2xl border border-gray-200 bg-[#fbfcfa] p-4 transition hover:border-[#cfe1cc] hover:bg-[#f6faf4]">
                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf3e8] text-xl">
                        <i className="fa-solid fa-location-dot text-[#17653a]"></i>
                      </div>


                      <div className="min-w-0">

                        <p className="text-[10px] font-extrabold tracking-[0.15em] text-gray-600">
                          {t("पता", "ADDRESS")}
                        </p>

                        <p className="mt-2 text-sm font-bold leading-6 text-[#173b24]">

                          {t(
                            "आनंदपुर, तहसील लटेरी, जिला विदिशा, मध्य प्रदेश, 464114",
                            "Anandpur, Lateri, Vidisha, Madhya Pradesh, 464114"
                          )}

                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Phone */}
                  <a
                    className="flex rounded-2xl border border-gray-200 bg-[#fbfcfa] p-4 transition hover:border-[#cfe1cc] hover:bg-[#f6faf4]"
                  >

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf3e8] text-xl">
                        <i className="fa-solid fa-phone text-[#17653a]"></i>
                      </div>


                      <div>

                        <p className="text-[10px] mb-2 font-extrabold tracking-[0.15em] text-gray-600">
                          {t("फोन", "PHONE")}
                        </p>

                        <p className=" text-sm mb-3 font-bold text-[#173b24]">
                          +91 9203602184<CopyButton text="+91 9203602184" />
                        </p>
                        <p className=" text-sm font-bold text-[#173b24]">
                          +91 8517002184<CopyButton text="+91 8517002184" />
                        </p>

                      </div>

                    </div>

                  </a>


                  {/* Email */}

                  <a
                    href="mailto:radharaman.sevasamiti@gmail.com"
                    className="flex rounded-2xl border border-gray-200 bg-[#fbfcfa] p-4 transition hover:border-[#cfe1cc] hover:bg-[#f6faf4]"
                  >

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf3e8] text-xl ">
                        <i className="fa-solid fa-envelope text-[#173b24]"></i>
                      </div>


                      <div className="min-w-0">

                        <p className="text-[10px] font-extrabold tracking-[0.15em] text-gray-600">
                          {t("ईमेल", "EMAIL")}
                        </p>

                        <p className="mt-2 break-all text-sm font-bold text-[#173b24]">
                          radharaman.sevasamiti@gmail.com<span><CopyButton text="radharaman.sevasamiti@gmail.com" /></span>
                        </p>

                      </div>

                    </div>

                  </a>


                  {/* Office Hours */}
                  <div className="flex rounded-2xl border border-gray-200 bg-[#fbfcfa] p-4 transition hover:border-[#cfe1cc] hover:bg-[#f6faf4]">

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf3e8] text-xl">
                        <i className="fa-solid fa-clock text-[#17653a]"></i>
                      </div>


                      <div>

                        <p className="text-[10px] font-extrabold tracking-[0.15em] text-gray-600">
                          {t("समय", "OFFICE HOURS")}
                        </p>

                        <p className="mt-2 text-sm font-bold leading-6 text-[#173b24]">

                          {t(
                            "सोमवार - शनिवार | 10:00 AM - 5:00 PM",
                            "Monday - Saturday | 10:00 AM - 5:00 PM"
                          )}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-4 justify-between" >
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919203602184"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 sm:py-10 flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#20b45a] px-6 font-extrabold text-white shadow-sm transition hover:bg-[#189c4d] hover:shadow-lg"
                  >

                    <span className="text-xl">
                      <i className="fa-brands fa-whatsapp text-white"></i>
                    </span>

                    {t(
                      "WhatsApp पर संपर्क करें  91+ 9203602184",
                      "Contact us on WhatsApp  91+ 9203602184"
                    )}

                  </a>
                  <a
                    href="https://wa.me/918517002184"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 sm:py-10 flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#20b45a] px-6 font-extrabold text-white shadow-sm transition hover:bg-[#189c4d] hover:shadow-lg"
                  >

                    <span className="text-xl">
                      <i className="fa-brands fa-whatsapp text-white"></i>
                    </span>

                    {t(
                      "WhatsApp पर संपर्क करें  91+ 8517002184",
                      "Contact us on WhatsApp  91+ 8517002184"
                    )}

                  </a>
                </div>

                <a
                  href="https://www.facebook.com/share/19tVMzKRVj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#1877F2] px-6 font-extrabold text-white shadow-sm transition duration-300 hover:bg-[#0C63D4] hover:shadow-lg"
                >
                  <span className="text-xl">
                    <i className="fa-brands fa-facebook"></i>
                  </span>

                  {t(
                    "Facebook पर हमसे जुड़ें",
                    "Follow us on Facebook"
                  )}
                </a>



              </div>

            </article>



            {/* =================================================
                CARD 2 — DONATION
            ================================================== */}
            <article
              id="support" className="scroll-mt-28 overflow-hidden rounded-[28px] border border-[#e4dfc8] bg-white shadow-[0_12px_40px_rgba(20,60,35,0.08)]">


              {/* Header */}
              <div className="relative overflow-hidden bg-[#f5c842] px-6 py-8 sm:px-9">

                <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/20" />

                <div className="relative flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#173b24] text-2xl shadow-lg">
                    🙏
                  </div>


                  <div>

                    <p className="text-xs font-extrabold tracking-[0.18em] text-[#173b24]/60">
                      {t(
                        "आपका सहयोग",
                        "YOUR SUPPORT"
                      )}
                    </p>


                    <h2 className="mt-1 text-2xl font-extrabold text-[#173b24] sm:text-3xl">
                      {t(
                        "सहयोग करें",
                        "Support Our Work"
                      )}
                    </h2>

                  </div>

                </div>

              </div>


              {/* Donation Body */}
              {/* =================================================
    DONATION BODY
================================================== */}
              <div className="p-6 sm:p-9">

                <p className="mx-auto max-w-3xl text-center text-sm leading-7 text-gray-600 sm:text-base">
                  {t(
                    "आपका सहयोग शिक्षा, स्वास्थ्य और समाज सेवा के कार्यों को आगे बढ़ाने में मदद करता है।",
                    "Your support helps us continue our work in education, healthcare and community welfare."
                  )}
                </p>


                {/* UPI + BANK — SAME ROW ON MD */}
                <div className="mt-8 grid gap-6 md:grid-cols-2">


                  {/* =================================================
        UPI
    ================================================== */}
                  <div className="rounded-3xl border border-[#dce7d6] bg-[#f7faf5] p-6">

                    <div className="text-center">

                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#173b24] shadow-sm">
                        {t("UPI भुगतान", "UPI PAYMENT")}
                      </span>

                      <h3 className="mt-4 text-xl font-extrabold text-[#173b24]">
                        {t(
                          "QR Code से सहयोग करें",
                          "Scan QR Code to Donate"
                        )}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        {t(
                          "अपने UPI ऐप से QR Code स्कैन करें",
                          "Scan this QR Code using your UPI app"
                        )}
                      </p>

                    </div>


                    {/* QR */}
                    <div className="mx-auto mt-6 flex h-52 w-52 items-center justify-center rounded-3xl border-8 border-white bg-white p-2 shadow-[0_8px_25px_rgba(0,0,0,0.10)]">

                      <Image
                        src="/images/QR.jpeg"
                        alt="UPI QR Code"
                        width={208}
                        height={208}
                        className="h-full w-full object-contain"
                      />

                    </div>


                    {/* UPI ID */}
                    <div className="mt-6 rounded-2xl border border-gray-100 bg-white py-4 text-center">

                      <p className="text-[10px] font-extrabold tracking-[0.2em] text-gray-400">
                        UPI ID
                      </p>

                      <p className="mt-2 text-lg font-extrabold text-[#173b24]">
                        20260346395309-iservuqrsbrp@cbin<span><CopyButton text="20260346395309-iservuqrsbrp@cbin" /></span>

                      </p>

                    </div>

                  </div>



                  {/* =================================================
        BANK DETAILS
    ================================================== */}
                  <div className="rounded-3xl border border-gray-200 bg-white p-6">

                    {/* Heading */}
                    <div className="mb-6 flex items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf3e8] text-xl">
                        <i className="fa-solid fa-building-columns text-[#17653a]"></i>
                      </div>

                      <div>

                        <h3 className="text-xl font-extrabold text-[#173b24]">
                          {t(
                            "बैंक ट्रांसफर",
                            "Bank Transfer"
                          )}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {t(
                            "सीधे हमारे बैंक खाते में",
                            "Directly to our bank account"
                          )}
                        </p>

                      </div>

                    </div>


                    {/* Bank Information */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200">


                      {/* Account Name */}
                      <div className="bg-[#f8faf7] p-4">

                        <p className="text-[10px] font-extrabold tracking-[0.15em] text-gray-400">
                          {t("खाता नाम", "ACCOUNT NAME")}
                        </p>

                        <p className="mt-2 text-sm font-extrabold leading-6 text-[#173b24]">
                          Anandpur Shri Radha Raman Seva Samiti
                        </p>

                      </div>


                      {/* Account Number */}
                      <div className="border-t border-gray-100 p-4">

                        <p className="text-[10px] font-extrabold tracking-[0.15em] text-gray-400">
                          {t("खाता संख्या", "ACCOUNT NUMBER")}
                        </p>

                        <p className="mt-2 text-sm font-extrabold tracking-wider text-[#173b24]">
                          5907605706
                        </p>

                      </div>


                      {/* IFSC + BANK */}
                      <div className="grid border-t border-gray-100 sm:grid-cols-2">

                        <div className="p-4 sm:border-r sm:border-gray-100">

                          <p className="text-[10px] font-extrabold tracking-[0.15em] text-gray-400">
                            IFSC
                          </p>

                          <p className="mt-2 text-sm font-extrabold text-[#173b24]">
                            CBIN0282218
                          </p>

                        </div>


                        <div className="border-t border-gray-100 p-4 sm:border-t-0">

                          <p className="text-[10px] font-extrabold tracking-[0.15em] text-gray-400">
                            {t("बैंक", "BANK")}
                          </p>

                          <p className="mt-2 text-sm font-extrabold text-[#173b24]">
                            Central Bank of India
                          </p>

                        </div>

                      </div>


                      {/* Branch */}
                      <div className="border-t border-gray-100 p-4">

                        <p className="text-[10px] font-extrabold tracking-[0.15em] text-gray-400">
                          {t("शाखा", "BRANCH")}
                        </p>

                        <p className="mt-2 text-sm font-extrabold text-[#173b24]">
                          Anandpur Branch
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* Trust Message */}

              </div>

            </article>



            {/* =================================================
                CARD 3 — LOCATION / MAP
            ================================================== */}


          </div>

        </div>

      </section>



      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}
      <section className="px-4 pb-16 sm:pb-20">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] bg-[#173b24] px-6 py-10 text-center shadow-lg sm:px-10">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5c842] text-2xl">
            ❤️
          </div>


          <h2 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl">

            {t(
              "आपका सहयोग किसी की उम्मीद बन सकता है",
              "Your Support Can Become Someone's Hope"
            )}

          </h2>


          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/65">

            {t(
              "आइए मिलकर शिक्षा, स्वास्थ्य और समाज सेवा के माध्यम से एक बेहतर समाज का निर्माण करें।",
              "Together, let's build a better society through education, healthcare and community service."
            )}

          </p>

        </div>

      </section>

    </main>
  );
}