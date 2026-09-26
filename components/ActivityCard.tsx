"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

type ActivityCardProps = {
  images: string[];
  hiTitle: string;
  enTitle: string;
  hiDescription: string;
  enDescription: string;
};

export default function ActivityCard({
  images,
  hiTitle,
  enTitle,
  hiDescription,
  enDescription,
}: ActivityCardProps) {
  const { t } = useLanguage();
  const [activeImage, setActiveImage] = useState(0);

  // Remove empty image paths
  const validImages = (images ?? []).filter(
    (image) => typeof image === "string" && image.trim() !== ""
  );

  // Don't render the card if there is no valid image
  if (validImages.length === 0) {
    return (
      <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="flex h-52 items-center justify-center bg-[#eef5ed] text-[#17653a]">
          {t("चित्र उपलब्ध नहीं है", "Image unavailable")}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-extrabold text-[#173b24]">
            {t(hiTitle, enTitle)}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {t(hiDescription, enDescription)}
          </p>
        </div>
      </article>
    );
  }

  // Make sure activeImage is always valid
  const currentImage =
    validImages[activeImage] ?? validImages[0];

  const hasMultipleImages = validImages.length > 1;

  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Main Image */}
      <div
        className={`relative overflow-hidden ${
          hasMultipleImages ? "h-64" : "h-52"
        }`}
      >
        <Image
          src={currentImage}
          alt={t(hiTitle, enTitle)}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 hover:scale-105"
        />

        {hasMultipleImages && (
          <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
            📷 {validImages.length}
          </div>
        )}
      </div>

      {/* Additional Images */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto border-b border-gray-100 bg-gray-50 p-3">
          {validImages.slice(1).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(index + 1)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                activeImage === index + 1
                  ? "border-[#17653a]"
                  : "border-transparent"
              }`}
            >
              <Image
                src={image}
                alt={`${t(hiTitle, enTitle)} ${index + 2}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-extrabold text-[#173b24]">
          {t(hiTitle, enTitle)}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          {t(hiDescription, enDescription)}
        </p>
      </div>

    </article>
  );
}