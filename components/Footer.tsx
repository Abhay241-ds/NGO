"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "./LanguageProvider";
import CopyButton from "./CopyButton";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0b2817] text-white">
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-10 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <h3 className="font-extrabold">{t("आनंदपुर श्री राधा रमण सेवा समिति", "Anandpur Shri Radha Raman Seva Samiti")}</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/70">
            {t("सेवा, सहयोग और समाज के उत्थान के लिए समर्पित।", "Dedicated to service, support and social upliftment.")}
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#f5c842]">{t("त्वरित लिंक", "Quick Links")}</h4>
          <div className="mt-4 flex flex-col gap-4 text-sm text-white/75">
            <Link href="/"> {t("होम", "Home")} </Link>
            <Link href="/about"> {t("हमारे बारे में", "About Us")} </Link>
            <Link href="/activities"> {t("गतिविधियाँ", "Activities")} </Link>
            <Link href="/contact"> {t("संपर्क करें", "Contact Us")} </Link>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-[#f5c842]">{t("हमसे संपर्क करें", "Contact Us")}</h4>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <p><i className="fa-solid fa-location-dot"></i> {t("आनंदपुर, जिला विदिशा, मध्य प्रदेश,  464114", "Anandpur, Vidisha, Madhya Pradesh, 464114")}</p>
            <p><i className="fa-solid fa-phone"></i> +91 9203602184 <span className="hover:text-[#f5c842]"><CopyButton text="+91 9203602184" /></span></p>
            <p><i className="fa-solid fa-phone"></i> +91 8517002184 <span className="hover:text-[#f5c842]"><CopyButton text="+91 8517002184" /></span></p>
            <p><i className="fa-solid fa-envelope"></i> radharaman.sevasamiti@gmail.com</p>
            <p><i className="fa-brands fa-facebook"></i> <Link href="https://www.facebook.com/share/19tVMzKRVj/" target="_blank" rel="noopener noreferrer"> {t("Facebook पर हमसे जुड़ें", "Follow us on Facebook")} </Link></p>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-[#f5c842]">{t("सहयोग करें", "Support Us")}</h4>
          <p className="mt-4 text-sm leading-6 text-white/70">
            {t("आपका सहयोग हमारी सेवा गतिविधियों को आगे बढ़ाने में मदद करता है।", "Your support helps us continue our service activities.")}
          </p>
          <Link href="/contact#support" className="mt-4 inline-flex rounded-md bg-[#f5c842] px-5 py-2.5 font-bold text-[#173b24]">
            {t("Donate करें", "Donate")}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-3 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {t("आनंदपुर श्री राधा रमण सेवा समिति। सर्वाधिकार सुरक्षित।", "Anandpur Shri Radha Raman Seva Samiti. All rights reserved.")}
      </div>
      <Link
        href="/admin/login"
        className="flex flex-col pb-5 gap-4 text-white/75 text-1xl font-bold justify-center items-center hover:text-[#f5c842]   "
      >
        Admin Login
      </Link>
    </footer>
  );
}
