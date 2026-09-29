"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">

        {/* Section Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-[#173b24] sm:text-4xl">
            {t("हमारे बारे में", "About Us")}
          </h2>

          <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#f5c842]" />
        </div>


        {/* About Content */}
        <div className="grid items-center gap-10 lg:grid-cols-2">

          {/* Text */}
          <div>
            <p className="text-base leading-8 text-gray-700">
              {t(
                "यह संस्था आदरणीय स्वर्गीय श्री ब्रह्मानंद महाराज जी की प्रेरणा एवं मार्गदर्शन से सामाजिक सेवा के क्षेत्र में निरंतर कार्य कर रही है। संस्था का उद्देश्य समाज के वंचित एवं निम्न वर्गों तक बुनियादी सुविधाएँ पहुँचाना, जरूरतमंद लोगों की सहायता करना तथा प्रकृति एवं पर्यावरण की सेवा और संरक्षण के लिए कार्य करना है।",
                "Inspired by the vision and guidance of the revered Late Shri Brahmanand Maharaj Ji, this organization is dedicated to serving society and working for the welfare of underprivileged and marginalized communities. Its aim is to provide basic facilities to those in need, support the underprivileged, and contribute towards the service, protection, and preservation of nature and the environment."
              )}
            </p>

            <p className="mt-4 text-base leading-8 text-gray-700">
              {t(
                "हमारा प्रयास है कि सेवा का लाभ समाज के अंतिम व्यक्ति तक पहुँचे और प्रत्येक परिवार को सम्मानजनक जीवन जीने के अवसर मिलें।",
                "Our aim is to take the benefits of service to the last person in society and create opportunities for every family to live with dignity."
              )}
            </p>

            <Link
              href="/about"
              className="mt-6 inline-flex rounded-md bg-[#17653a] px-6 py-3 font-bold text-white transition hover:bg-[#0e4d2b]"
            >
              {t("और जानें", "Read More")}
            </Link>
          </div>


          {/* Image */}
          <div className="relative min-h-[310px]">

            <div className="relative h-[310px] overflow-hidden rounded-xl sm:h-[360px]">
              <Image
                src="/images/About2.png"
                alt={t(
                  "आनंदपुर श्री राधा रमण सेवा समिति",
                  "Anandpur Shri Radha Raman Seva Samiti"
                )}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Mission Card */}
            <div className="absolute -bottom-5 left-4 max-w-sm rounded-xl bg-[#173b24] p-6 text-white shadow-xl sm:left-8">
              <h3 className="font-bold">
                {t(
                  "हमारा लक्ष्य",
                  "Our Mission"
                )}
              </h3>

              <p className="mt-2 text-sm leading-6">
                {t(
                  "हर व्यक्ति तक सहायता पहुँचाना और समाज को बेहतर बनाना।",
                  "To reach help to every person and make society better."
                )}
              </p>
            </div>

          </div>
        </div>


        {/* Statistics */}
        <div className="mt-14 grid overflow-hidden rounded-xl bg-[#f6f8ee] sm:grid-cols-2 lg:grid-cols-4">

          {[
            ["स्थापना वर्ष", "Year Founded", "2025"],
            ["सेवा क्षेत्र", "Service Area", "संपूर्ण भारत"],
            ["लाभान्वित लोग", "People Benefited", "500+"],
            ["सेवा प्रकल्प", "Service Projects", "10+"],
          ].map(([hi, en, value], index) => (
            <div
              key={en}
              className={`p-6 text-center ${
                index !== 3
                  ? "lg:border-r lg:border-[#dce5d5]"
                  : ""
              }`}
            >
              <p className="text-sm font-semibold text-gray-600">
                {t(hi, en)}
              </p>

              <p className="mt-1 text-2xl font-extrabold text-[#173b24]">
                {value}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}