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
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-6">

          <div>
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
                "हप्रकृति की सेवा — पर्यावरण एवं प्रकृति के संरक्षण और संवर्धन के लिए कार्य करना।",
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

          <div className="relative">
            <div className="relative h-87.5 overflow-hidden rounded-2xl">
              <Image
                src="/images/About2.png"
                alt="Community service"
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-7 left-5 right-5 rounded-xl bg-[#173b24] p-6 text-white shadow-xl sm:left-10 sm:right-10">
              <p className="text-sm font-bold text-[#f5c842]">
                {t("हमारा विश्वास", "Our Belief")}
              </p>

              <h3 className="mt-2 text-xl font-extrabold">
                {t(
                  "हर व्यक्ति सम्मान और सहायता का हकदार है।",
                  "Every person deserves dignity and support."
                )}
              </h3>
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
                className={`p-7 text-center ${
                  index !== 3 ? "border-b border-white/10 lg:border-b-0 lg:border-r" : ""
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