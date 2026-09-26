"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import ActivityCard from "@/components/ActivityCard";
import { supabase } from "@/lib/supabase/client";



type ActivityImage = {
  url: string;
  publicId: string;
};

type Activity = {
  id: string;
  images: ActivityImage[];
  category: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  activity_date: string | null;
  created_at: string;
};

export default function ActivitiesPage() {
  
  const { t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState("all");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categories = [
    {
      id: "all",
      hi: "सभी गतिविधियाँ",
      en: "All Activities",
    },
    {
      id: "education",
      hi: "शिक्षा",
      en: "Education",
    },
    {
      id: "health",
      hi: "स्वास्थ्य",
      en: "Health",
    },
    {
      id: "tree-plantation",
      hi: "वृक्षारोपण",
      en: "Tree Plantation",
    },
    {
      id: "sports",
      hi: "खेलकूद",
      en: "Sports",
    },
    {
      id: "food-distribution",
      hi: "भोजन वितरण",
      en: "Food Distribution",
    },
    {
      id: "women-empowerment",
      hi: "महिला सशक्तिकरण",
      en: "Women Empowerment",
    },
    {
      id: "animal-welfare",
      hi: "पशु कल्याण",
      en: "Animal Welfare",
    },
    {
      id: "other",
      hi: "अन्य",
      en: "Other",
    },
  ];


  /*
  |--------------------------------------------------------------------------
  | Fetch Activities
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("activities")
          .select(
            `
              id,
              title_en,
              title_hi,
              description_en,
              description_hi,
              category,
              activity_date,
              images,
              created_at
            `
          )
          .order("activity_date", {
            ascending: false,
            nullsFirst: false,
          })
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error("Activities fetch error:", error);
          throw error;
        }

        setActivities((data as Activity[]) || []);
      } catch (err) {
        console.error("Failed to load activities:", err);

        setError(
          t(
            "गतिविधियाँ लोड नहीं हो सकीं। कृपया बाद में पुनः प्रयास करें।",
            "Unable to load activities. Please try again later."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [t]);

  /*
  |--------------------------------------------------------------------------
  | Filter Activities
  |--------------------------------------------------------------------------
  */

  const filteredActivities = useMemo(() => {
    if (activeCategory === "all") {
      return activities;
    }

    return activities.filter((activity) => {
      const dbCategory = activity.category
        ?.toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

      return dbCategory === activeCategory;
    });
  }, [activities, activeCategory]);

  /*
  |--------------------------------------------------------------------------
  | Convert DB activity to ActivityCard format
  |--------------------------------------------------------------------------
  */

  const activityCards = useMemo(() => {
    return filteredActivities.map((activity) => ({
      ...activity,

      images: Array.isArray(activity.images)
        ? activity.images
          .filter(
            (image): image is ActivityImage =>
              typeof image === "object" &&
              image !== null &&
              typeof image.url === "string"
          )
          .map((image) => image.url)
        : [],

      hiTitle: activity.title_hi,
      enTitle: activity.title_en,

      hiDescription: activity.description_hi,
      enDescription: activity.description_en,
    }));
  }, [filteredActivities]);

  return (
    <main className="bg-white">

      {/* =========================================
          PAGE HERO
      ========================================== */}

      {/* =========================================
          INTRODUCTION
      ========================================== */}



      {/* =========================================
          CATEGORY FILTER
      ========================================== */}

      <section className="bg-[#f7faf4] py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">

          <div className="flex flex-wrap justify-center gap-3">

            {categories.map((category) => {
              const active = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 rounded-md px-5 py-3 text-sm font-bold transition ${active
                    ? "bg-[#17653a] text-white shadow-md"
                    : "bg-white text-[#173b24] ring-1 ring-gray-200 hover:bg-[#edf5eb]"
                    }`}
                >
                  {t(category.hi, category.en)}
                </button>
              );
            })}

          </div>

        </div>
      </section>

      {/* =========================================
          ACTIVITIES
      ========================================== */}

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">

          <div className="mb-10 flex items-end justify-between gap-4">

            <div>

              <p className="text-sm font-bold text-[#17653a]">
                {t("हमारी पहल", "Our Initiatives")}
              </p>

              <h2 className="mt-1 text-3xl font-extrabold text-[#173b24]">
                {t(
                  "सेवा गतिविधियाँ",
                  "Service Activities"
                )}
              </h2>

            </div>

            <p className="hidden text-sm text-gray-500 sm:block">
              {filteredActivities.length}{" "}
              {t("गतिविधियाँ", "activities")}
            </p>

          </div>

          {/* Loading */}

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-xl bg-gray-100"
                />
              ))}

            </div>
          ) : error ? (

            /* Error */

            <div className="rounded-xl border border-red-200 bg-red-50 py-16 text-center">

              <div className="text-4xl">⚠️</div>

              <h3 className="mt-4 text-xl font-bold text-red-700">
                {error}
              </h3>

              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-md bg-[#17653a] px-5 py-3 font-bold text-white hover:bg-[#12512e]"
              >
                {t("पुनः प्रयास करें", "Try Again")}
              </button>

            </div>
          ) : activityCards.length > 0 ? (

            /* Activities */

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {activityCards.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  images={activity.images}
                  hiTitle={activity.hiTitle}
                  enTitle={activity.enTitle}
                  hiDescription={activity.hiDescription}
                  enDescription={activity.enDescription}
                />
              ))}

            </div>

          ) : (

            /* No Activities */

            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">

              <div className="text-4xl">📋</div>

              <h3 className="mt-4 text-xl font-bold text-[#173b24]">
                {t(
                  "अभी कोई गतिविधि उपलब्ध नहीं है",
                  "No activities available"
                )}
              </h3>

            </div>
          )}

        </div>
      </section>

      {/* =========================================
          IMPACT SECTION
      ========================================== */}

      <section className="bg-[#f6f8ef] py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">

          <div className="mb-10 text-center">

            <h2 className="text-3xl font-extrabold text-[#173b24]">
              {t(
                "हमारे प्रयासों का प्रभाव",
                "Impact of Our Efforts"
              )}
            </h2>

            <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#f5c842]" />

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-white p-7 text-center shadow-sm">
              <div className="text-4xl font-extrabold text-[#17653a]">
                500+
              </div>

              <p className="mt-2 font-semibold text-gray-700">
                {t("लाभान्वित लोग", "People Benefited")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-7 text-center shadow-sm">
              <div className="text-4xl font-extrabold text-[#17653a]">
                10+
              </div>

              <p className="mt-2 font-semibold text-gray-700">
                {t("सेवा प्रकल्प", "Service Projects")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-7 text-center shadow-sm">
              <div className="text-4xl font-extrabold text-[#17653a]">
                5+
              </div>

              <p className="mt-2 font-semibold text-gray-700">
                {t("सेवा क्षेत्र", "Service Areas")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-7 text-center shadow-sm">
              <div className="text-4xl font-extrabold text-[#17653a]">
                2025
              </div>

              <p className="mt-2 font-semibold text-gray-700">
                {t("स्थापना वर्ष", "Year Founded")}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================
          JOIN US CTA
      ========================================== */}

      <section className="bg-[#173b24] py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">

          <h2 className="text-3xl font-extrabold sm:text-4xl">
            {t(
              "आप भी इस सेवा अभियान से जुड़ें",
              "Join Our Service Initiative"
            )}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/80">
            {t(
              "आपका समय, सहयोग और योगदान किसी जरूरतमंद व्यक्ति के जीवन में बड़ा बदलाव ला सकता है।",
              "Your time, support and contribution can make a meaningful difference in the life of someone in need."
            )}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4">

            <Link
              href="/contact"
              className="rounded-md bg-[#f5c842] px-7 py-3 font-bold text-[#173b24] hover:bg-[#ffd85d]"
            >
              {t(
                "सहयोग करें / Donate",
                "Donate / Support Us"
              )}
            </Link>

            <Link
              href="/contact"
              className="rounded-md border border-white/40 bg-white/10 px-7 py-3 font-bold text-white hover:bg-white/20"
            >
              {t(
                "हमसे संपर्क करें",
                "Contact Us"
              )}
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}