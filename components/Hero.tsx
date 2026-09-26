"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Hero() {
  const { t } = useLanguage();

  const features = [
    { icon: "🤝", hi: "हमारा उद्देश्य", en: "Our Purpose", subHi: "समाज सेवा, शिक्षा, स्वास्थ्य और मानव कल्याण", subEn: "Social service, education, health & welfare" },
    { icon: "👥", hi: "हमारी पहुँच", en: "Our Reach", subHi: "गरीब और जरूरतमंदों तक निरंतर सेवा", subEn: "Continuous support for people in need" },
    { icon: "🫶", hi: "आपका सहयोग", en: "Your Support", subHi: "आपका छोटा सहयोग किसी का जीवन बदल सकता है", subEn: "Your small contribution can change a life" },
    { icon: "🛡️", hi: "पारदर्शिता", en: "Transparency", subHi: "पूरी पारदर्शिता और विश्वास के साथ सेवा", subEn: "Serving with complete transparency and trust" },
  ];

  return (
    <section className="relative">
      <div className="relative min-h-100 overflow-hidden sm:min-h-117.5">
        <Image
          src="/images/hero.png"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          alt="Hero background"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#092d1a]/95 via-[#0b3a22]/70 to-black/10" />

        <div className="relative mx-auto flex min-h-100 max-w-7xl items-center px-4 py-10 sm:min-h-117.5 sm:py-16 lg:px-6 lg:py-20">          <div className="max-w-2xl text-white">
          <h1 className="max-w-full text-[30px] font-extrabold leading-[1.2] sm:text-4xl lg:text-5xl">
            {t(
              <>सेवा ही धर्म है,<br />संकल्प हमारा समाज का उत्थान करना</>,
              <>Service is our duty,<br />Upliftment of society is our mission.</>
            )}
          </h1>

          <p className="mt-5 max-w-full text-base font-semibold leading-7 sm:text-xl">
            {t(
              <>समाज के हर व्यक्ति तक सहायता पहुँचाना<br />और एक बेहतर समाज का निर्माण करना।</>,
              <>Reaching help to every person<br />and building a better society.</>
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/about" className="rounded-md bg-[#f5c842] px-6 py-3 font-bold text-[#173b24] shadow-lg hover:bg-[#ffd85d]">
              {t("हमारे बारे में जानें", "Learn About Us")}
            </Link>
            <Link href="/activities" className="rounded-md bg-white px-6 py-3 font-bold text-[#173b24] shadow-lg hover:bg-gray-100">
              {t("हमारा कार्य देखें", "View Our Work")}
            </Link>
          </div>
        </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-10 w-[calc(100%-2rem)] max-w-6xl">
        <div className="grid overflow-hidden rounded-xl border border-white bg-[#fffdf7] shadow-xl sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => (
            <div key={item.en} className="flex gap-3 border-b border-gray-100 p-5 last:border-b-0 sm:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef5ed] text-xl">
                {item.icon}
              </span>
              <div>
                <h3 className="font-bold text-[#173b24]">{t(item.hi, item.en)}</h3>
                <p className="mt-1 text-xs leading-5 text-gray-600">{t(item.subHi, item.subEn)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
