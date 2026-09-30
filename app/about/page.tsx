"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import Inspiration from "@/components/Inspiration";
import FounderCard from "@/components/FounderCard";

export default function AboutPage() {
  const { t } = useLanguage();

  const objectives = [
    {
      icon: "🎓",
      hi: "शिक्षा का विकास",
      en: "Education Development",
      hiText:
        "जरूरतमंद बच्चों को शिक्षा, किताबें, कॉपियाँ और अन्य अध्ययन सामग्री उपलब्ध कराना।",
      enText:
        "Providing education, books, notebooks and learning materials to children in need.",
    },
    {
      icon: "❤️",
      hi: "स्वास्थ्य सेवा",
      en: "Healthcare",
      hiText:
        "स्वास्थ्य शिविरों, जागरूकता कार्यक्रमों और आवश्यक चिकित्सा सहायता के माध्यम से लोगों की मदद करना।",
      enText:
        "Helping people through health camps, awareness programs and necessary medical support.",
    },
    {
      icon: "🌱",
      hi: "पर्यावरण संरक्षण",
      en: "Environment Protection",
      hiText:
        "वृक्षारोपण, स्वच्छता और पर्यावरण संरक्षण के प्रति लोगों को जागरूक करना।",
      enText:
        "Promoting tree plantation, cleanliness and awareness about environmental protection.",
    },
    {
      icon: "🤲",
      hi: "जरूरतमंदों की सहायता",
      en: "Help to Needy",
      hiText:
        "गरीब, असहाय और जरूरतमंद परिवारों को भोजन, कपड़े और आवश्यक सामग्री उपलब्ध कराना।",
      enText:
        "Providing food, clothes and essential items to poor, vulnerable and needy families.",
    },
    {
      icon: "🎭",
      hi: "संस्कृति एवं जागरूकता",
      en: "Culture & Awareness",
      hiText:
        "भारतीय संस्कृति, सामाजिक मूल्यों और जन-जागरूकता को बढ़ावा देना।",
      enText:
        "Promoting Indian culture, social values and public awareness.",
    },
    {
      icon: "👥",
      hi: "सामाजिक विकास",
      en: "Social Development",
      hiText:
        "समाज के कमजोर वर्गों को आत्मनिर्भर बनाने और उनके जीवन स्तर को बेहतर बनाने का प्रयास।",
      enText:
        "Working to empower vulnerable communities and improve their quality of life.",
    },
  ];

  return (
    <main className="bg-white">

      {/* =========================================
          PAGE BANNER
      ========================================== */}
      <section className="relative overflow-hidden">
        <div className="relative h-70 sm:h-80">
          <Image
            src="/images/About.png"
            alt={t("हमारे बारे में", "About Us")}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#092d1a]/75" />

          <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 lg:px-6">
            <div className="text-white">
              <p className="mb-3 text-sm font-semibold text-[#f5c842]">
                {t(
                  "सेवा • सहयोग • संस्कार • समर्पण",
                  "Service • Support • Values • Dedication"
                )}
              </p>

              <h1 className="text-4xl font-extrabold sm:text-5xl">
                {t("हमारे बारे में", "About Us")}
              </h1>

              <p className="mt-4 max-w-2xl font-bold text-sm leading-6 text-white/85 sm:text-base">
                {t(
                  "यह संस्था आदरणीय स्वर्गीय श्री ब्रह्मानंद महाराज जी की प्रेरणा एवं मार्गदर्शन से सामाजिक सेवा के क्षेत्र में निरंतर कार्य कर रही है। संस्था का उद्देश्य समाज के वंचित एवं निम्न वर्गों तक बुनियादी सुविधाएँ पहुँचाना, जरूरतमंद लोगों की सहायता करना तथा प्रकृति एवं पर्यावरण की सेवा और संरक्षण के लिए कार्य करना है।",

                  "Inspired by the vision and guidance of the revered Late Shri Brahmanand Maharaj Ji, this organization is dedicated to serving society and working for the welfare of underprivileged and marginalized communities. Its aim is to provide basic facilities to those in need, support the underprivileged, and contribute towards the service, protection, and preservation of nature and the environment."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>


      <Inspiration />

      <FounderCard />

      {/* =========================================
          INTRODUCTION
      ========================================== */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto grid max-w-7xl items-stretch gap-12 px-4 lg:grid-cols-2 lg:px-6">

          {/* Left - About / Identity */}
          <div className="flex flex-col justify-center">

            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#17653a]">
              {t("हमारी पहचान", "Who We Are")}
            </p>

            <h2 className="text-3xl font-extrabold leading-tight text-[#173b24] sm:text-4xl">
              {t(
                "समाज सेवा ही हमारा संकल्प है",
                "Service to society is our commitment"
              )}
            </h2>

            <div className="mt-4 h-1 w-16 rounded bg-[#f5c842]" />

            <p className="mt-7 leading-8 text-gray-700">
              {t(
                "सामाजिक गतिविधियाँ — समाज के कल्याण एवं विकास के लिए विभिन्न सामाजिक गतिविधियों का संचालन करना।",
                "Social Activities — To undertake various social initiatives for the welfare and development of society."
              )}
            </p>

            <p className="mt-4 leading-8 text-gray-700">
              {t(
                "प्रकृति की सेवा — पर्यावरण एवं प्रकृति के संरक्षण और संवर्धन के लिए कार्य करना।",
                "Service to Nature — To work towards the protection, preservation, and betterment of nature and the environment."
              )}
            </p>

            <p className="mt-4 leading-8 text-gray-700">
              {t(
                "जरूरतमंदों की सेवा — असहाय, वंचित एवं जरूरतमंद लोगों की सहायता और सेवा करना।",
                "Serving the Needy — To support and serve helpless, underprivileged, and needy people."
              )}
            </p>

          </div>


          {/* Right - Registration Certificate */}
          <div className="relative flex items-center justify-center">

            <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">

              <Image
                src="/images/Registration-Certificate.png"
                alt="Society Registration Certificate"
                width={1200}
                height={1700}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto max-h-[650px] w-full rounded-xl object-contain"
              />

            </div>

           

          </div>

        </div>
      </section>

      {/* =========================================
          MISSION & VISION
      ========================================== */}


      {/* =========================================
          OUR VALUES
      ========================================== */}


      {/* =========================================
          OBJECTIVES
      ========================================== */}
      <section className="bg-[#f7faf4] py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">

          <div className="mb-10">
            <p className="text-center text-sm font-bold uppercase tracking-wider text-[#17653a]">
              {t("हम क्या करना चाहते हैं", "What We Aim To Do")}
            </p>

            <h2 className="mt-2 text-center text-3xl font-extrabold text-[#173b24] sm:text-4xl">
              {t("हमारे प्रमुख उद्देश्य", "Our Main Objectives")}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {objectives.map((item) => (
              <article
                key={item.en}
                className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef5eb] text-xl">
                  {item.icon}
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-[#173b24]">
                  {t(item.hi, item.en)}
                </h3>

                <p className="mt-2 text-sm leading-7 text-gray-600">
                  {t(item.hiText, item.enText)}
                </p>
              </article>
            ))}

          </div>
        </div>
      </section>


      {/* Documents / Information Available */}
      <div className=" border border-gray-200 bg-[#fbfcfa] p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-xl font-extrabold text-[#173b24]">
            {t(
              "संस्था से संबंधित जानकारी",
              "Organization Information"
            )}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {t(
              "संस्था से संबंधित प्रमुख दस्तावेज़ एवं जानकारी",
              "Key documents and information related to the organization"
            )}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Society Registration Certificate", "सोसायटी पंजीकरण प्रमाण पत्र"],
            ["Organization PAN", "संस्था का PAN"],
            ["12AB Certificate", "12AB प्रमाण पत्र"],
            ["80G Certificate", "80G प्रमाण पत्र"],
            ["NGO Darpan ID", "NGO Darpan ID"],
            ["CSR-1 Number", "CSR-1 नंबर"],
            ["Organization Objectives", "संस्था के उद्देश्य"],
            ["Bank Account / IFSC", "बैंक खाता / IFSC"],
            ["Social Work Reports", "सामाजिक कार्यों की रिपोर्ट"],
            ["Annual Income & Expenditure Report", "वार्षिक आय-व्यय रिपोर्ट"],
            ["CSR Project / Amount Details", "CSR प्रोजेक्ट / राशि का विवरण"],
            ["Office Bearers Information", "पदाधिकारियों की जानकारी"],
          ].map(([en, hi]) => (
            <div
              key={en}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm">
                ✅
              </span>

              <span className="text-sm font-semibold text-[#173b24]">
                {t(hi, en)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          STATS
      ========================================== */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">

          <div className="grid overflow-hidden rounded-2xl bg-[#173b24] text-white sm:grid-cols-2 lg:grid-cols-4">

            {[
              ["2025", "स्थापना वर्ष", "Year Founded"],
              ["500+", "लाभान्वित लोग", "People Benefited"],
              ["10+", "सेवा प्रकल्प", "Service Projects"],
              ["संपूर्ण भारत", "सेवा क्षेत्र", "Service Area"],
            ].map(([value, hi, en], index) => (
              <div
                key={en}
                className={`p-7 text-center ${index !== 3 ? "border-b border-white/10 lg:border-b-0 lg:border-r" : ""
                  }`}
              >
                <div className="text-3xl font-extrabold text-[#f5c842]">
                  {value}
                </div>

                <div className="mt-2 font-bold">
                  {t(hi, en)}
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================================
          CTA
      ========================================== */}

    </main>
  );
}