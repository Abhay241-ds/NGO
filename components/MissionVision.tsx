"use client";

import { useLanguage } from "./LanguageProvider";

export default function MissionVision() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 md:grid-cols-2 lg:px-6">
      <div className="rounded-xl bg-[#173b24] p-7 text-white shadow-lg transition duration-300 hover:-translate-y-2">
        <p className="mb-2 text-sm font-bold text-[#f5c842]">{t("हमारा मिशन", "Our Mission")}</p>
        <h2 className="text-2xl font-extrabold">{t("हर व्यक्ति तक सहायता पहुँचाना और समाज को बेहतर बनाना।", "To reach help to every person and make society better.")}</h2>
      </div>
      <div className="rounded-xl border border-[#dfe8df] bg-[#f7faf4] p-7 text-[#173b24] shadow-sm transition duration-300 hover:-translate-y-1">
        <p className="mb-2 text-sm font-bold text-[#17653a]">{t("हमारा विजन", "Our Vision")}</p>
        <h2 className="text-2xl font-extrabold">{t("दूर-दराज़ क्षेत्रों के घरों तक बुनियादी सुविधाएँ पहुँचाना तथा पृथ्वी और प्रकृति की रक्षा एवं संरक्षण करना।", "Providing basic facilities to households in remote and underserved areas and protecting the Earth and nature.")}</h2>
      </div>
    </section>
  );
}
