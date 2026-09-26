"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

export default function FounderCard() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="w-full bg-[#f7f9f5] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1600px]">

        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#17653a]">
            {t("संस्थापक सदस्य", "FOUNDING MEMBER")}
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-[#173b24] sm:text-4xl">
            {t("नितिन भार्गव", "Nitin Bhargava")}
          </h2>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#f5c842]" />
        </div>


        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-[#dfe7dc] bg-white shadow-[0_15px_50px_rgba(20,60,35,0.08)]">

          <div className="lg:grid lg:grid-cols-[380px_1fr] lg:items-start">

            {/* Image */}
            <div className="relative h-87.5 bg-[#173b24] lg:h-115">

              <Image
                src="/images/Founder.jpeg"
                alt={t(
                  "नितिन भार्गव",
                  "Nitin Bhargava"
                )}
                fill
                sizes="(max-width: 1024px) 100vw, 380px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#092d1a]/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-semibold text-[#f5c842]">
                  {t(
                    "संस्थापक सदस्य",
                    "FOUNDING MEMBER"
                  )}
                </p>

                <h3 className="mt-1 text-2xl font-extrabold">
                  {t(
                    "नितिन भार्गव",
                    "Nitin Bhargava"
                  )}
                </h3>
              </div>

            </div>


            {/* Content */}
            <div className="p-7 sm:p-9 lg:p-12">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eef5ed] px-4 py-2 text-sm font-bold text-[#17653a]">
                <span>🌿</span>
                {t(
                  "समाज सेवा के प्रति समर्पण",
                  "Dedicated to Social Service"
                )}
              </div>


              {/* Introduction */}
              <p className="mt-6 text-base leading-8 text-gray-700 sm:text-lg">
                {t(
                  "नितिन भार्गव आनंदपुर श्री राधा रमन सेवा समिति के संस्थापक सदस्यों में से एक हैं। उन्होंने समिति के माध्यम से समाज सेवा, जरूरतमंदों की सहायता और जनकल्याण के कार्यों को आगे बढ़ाने में महत्वपूर्ण भूमिका निभाई है।",
                  "Nitin Bhargava is one of the founding members of Anandpur Shri Radha Raman Seva Samiti. Through the Samiti, he has played an important role in advancing social service, helping people in need and contributing to community welfare."
                )}
              </p>


              {/* Expanded Content */}
              <div
                className="grid transition-all duration-500 ease-in-out ">
                <div className="min-h-0 overflow-hidden">

                  <div className="mt-6 border-t border-gray-200 pt-6">

                    <p className="text-base leading-8 text-gray-700 sm:text-lg">
                      {t(
                        "श्री नितिन भार्गव का उद्देश्य समाज के जरूरतमंद वर्गों तक सहायता पहुँचाना और सेवा की भावना को निरंतर आगे बढ़ाना है। समिति के विभिन्न सामाजिक एवं जनकल्याणकारी कार्यों में उनका योगदान संस्था के उद्देश्यों को मजबूत करता है।",
                        "His aim is to ensure that support reaches people and families who need it most, while continuing the spirit of service. His contribution to the Samiti's social and welfare initiatives strengthens its mission and objectives."
                      )}
                    </p>

                  </div>

                </div>
              </div>


              {/* Read More */}
             

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}