"use client";

import { useLanguage } from "./LanguageProvider";

export default function Objectives() {
  const { t } = useLanguage();

  const objectives = [
    ["🎓", "शिक्षा", "Education", "जरूरतमंद बच्चों को शिक्षा और अध्ययन सामग्री उपलब्ध कराना।", "Providing education and learning materials to children in need."],
    ["❤️", "स्वास्थ्य", "Health", "स्वास्थ्य शिविरों और जागरूकता के माध्यम से बेहतर स्वास्थ्य।", "Improving health through camps and awareness."],
    ["🌱", "पर्यावरण", "Environment", "वृक्षारोपण और पर्यावरण संरक्षण के लिए जागरूकता।", "Tree plantation and environmental awareness."],
    ["🤲", "मानव कल्याण", "Human Welfare", "गरीब, असहाय और जरूरतमंद परिवारों की सहायता।", "Supporting poor, vulnerable and needy families."],
    ["🎭", "संस्कृति", "Culture", "भारतीय संस्कृति और सामाजिक मूल्यों का संरक्षण।", "Preserving Indian culture and social values."],
  ];

  return (
    <section className="bg-[#f7faf4] py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-[#173b24]">{t("हमारे उद्देश्य", "Our Objectives")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            {t("सेवा, सहयोग और सामाजिक विकास के लिए हमारे प्रमुख उद्देश्य।", "Our key objectives for service, support and social development.")}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {objectives.map(([icon, hi, en, descHi, descEn]) => (
            <article key={en} className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf5eb] text-2xl">{icon}</div>
              <h3 className="mt-4 font-extrabold text-[#173b24]">{t(hi, en)}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{t(descHi, descEn)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
