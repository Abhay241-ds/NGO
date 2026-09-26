"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

export default function InspirationSection() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="w-full bg-[#f7f8f4] px-3 py-6 sm:px-5 sm:py-20 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* =====================================================
            SECTION HEADING
        ====================================================== */}
        <div className="mx-auto mb-12 max-w-3xl text-center">

          <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf3e8] px-4 py-2 text-xs font-extrabold tracking-[0.15em] text-[#17653a]">
            <span className="h-2 w-2 rounded-full bg-[#f5c842]" />

            {t(
              "हमारे प्रेरणा स्रोत",
              "OUR INSPIRATION"
            )}
          </span>


          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#173b24] sm:text-4xl lg:text-5xl">
            {t(
              "श्रद्धेय श्री ब्रह्मानंद भार्गव जी",
              "Respected Shri Brahmanand Bhargava Ji"
            )}
          </h2>


          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#f5c842]" />

        </div>



        {/* =====================================================
            MAIN CARD
        ====================================================== */}
        <div className="overflow-hidden rounded-4xl border border-[#dfe7dc] bg-white shadow-[0_15px_50px_rgba(20,60,35,0.08)]">
          <div className="lg:grid lg:grid-cols-[420px_1fr] lg:items-start ">


            {/* =================================================
                IMAGE
            ================================================== */}
            <div className="relative h-80 overflow-hidden bg-[#173b24] lg:sticky lg:top-0 lg:h-115">

              <Image
                src="/images/inspiration.jpeg"
                alt={t(
                  "श्रद्धेय श्री ब्रह्मानंद भार्गव जी",
                  "Respected Shri Brahmanand Bhargava Ji"
                )}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />


              {/* Image Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#092d1a]/90 via-[#092d1a]/10 to-transparent" />


              {/* Image Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-9">

                <p className="text-xs font-bold tracking-[0.2em] text-[#f5c842]">
                  {t(
                    "प्रेरणा एवं मार्गदर्शन",
                    "INSPIRATION & GUIDANCE"
                  )}
                </p>


                <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                  {t(
                    "श्री ब्रह्मानंद भार्गव जी",
                    "Shri Brahmanand Bhargava Ji"
                  )}
                </h3>

              </div>

            </div>



            {/* =================================================
                CONTENT
            ================================================== */}
            <div className="p-6 sm:p-9 lg:p-12">


              {/* Quote */}
              <div className="relative rounded-2xl border border-[#e5dfc6] bg-[#fffdf3] p-6 sm:p-7">

                <span className="absolute -top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#f5c842] text-2xl font-serif text-[#173b24]">
                  “
                </span>


                <p className="pt-2 text-lg font-bold leading-8 text-[#173b24] sm:text-xl">
                  {t(
                    "जनसेवा ही जीवन का सबसे बड़ा धर्म है।",
                    "Serving humanity is the greatest duty of life."
                  )}
                </p>

              </div>



              {/* Introduction */}
              <div className="mt-8">

                <p className="text-base leading-8 text-gray-700 sm:text-lg">

                  {t(
                    <>
                      आनंदपुर श्री राधा रमन सेवा समिति के प्रेरणा स्रोत एवं
                      मार्गदर्शक रहे श्रद्धेय श्री ब्रह्मानंद भार्गव जी का जन्म
                      04 अप्रैल 1965 को मध्यप्रदेश के विदिशा जिले की लटेरी तहसील
                      के छोटे से ग्राम आनंदपुर में एक साधारण ब्राह्मण परिवार में
                      हुआ था।
                    </>,
                    <>
                      Respected Shri Brahmanand Bhargava Ji, the source of
                      inspiration and guide of Anandpur Shri Radha Raman Seva
                      Samiti, was born on 4 April 1965 in Anandpur, a small
                      village in Lateri tehsil of Vidisha district, Madhya
                      Pradesh, in a humble Brahmin family.
                    </>
                  )}

                </p>


                <p className="mt-5 text-base leading-8 text-gray-700 sm:text-lg">

                  {t(
                    <>
                      वे बचपन से ही अत्यंत बुद्धिमान, सरल, मिलनसार और सेवा भाव
                      से ओत-प्रोत थे। साधारण पारिवारिक परिस्थितियों के बावजूद
                      उनके जीवन में मानवता और समाज सेवा के संस्कार गहराई से
                      विकसित हुए।
                    </>,
                    <>
                      From childhood, he was intelligent, humble, sociable and
                      deeply devoted to serving others. Despite modest family
                      circumstances, the values of humanity and social service
                      became deeply rooted in his life.
                    </>
                  )}

                </p>

              </div>



              {/* =================================================
                  READ MORE CONTENT
              ================================================== */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${expanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
                  }`}
              >

                <div className="min-h-0 overflow-hidden">

                  <div className="mt-8 border-t border-gray-200 pt-8">


                    {/* देशसेवा */}
                    <BiographyBlock
                      title={t(
                        "देशसेवा का संकल्प",
                        "A Commitment to Serve the Nation"
                      )}
                    >
                      {t(
                        <>
                          युवावस्था में उनके मन में देशसेवा का गहरा भाव था।
                          इसी भावना से प्रेरित होकर उन्होंने तत्कालीन समय में
                          सूरत में चल रही सेना की भर्ती में शामिल होकर देश की
                          सेवा करने का निर्णय लिया। पारिवारिक परिस्थितियों एवं
                          दादा-दादी के स्नेह के कारण उन्हें वापस आनंदपुर लौटना
                          पड़ा।
                        </>,
                        <>
                          During his youth, he developed a deep desire to serve
                          the nation. Inspired by this feeling, he participated
                          in an army recruitment drive in Surat with the
                          intention of serving the country. Due to family
                          circumstances and the affection of his grandparents,
                          he eventually returned to Anandpur.
                        </>
                      )}

                      {t(
                        <>
                          इसके बाद उन्होंने अपने गांव और ग्रामीण परिवेश में
                          रहकर जनसेवा को ही अपने जीवन का उद्देश्य बना लिया।
                          उन्होंने क्षेत्र की जनता की समस्याओं को समझने और
                          उनके समाधान के लिए कार्य करना प्रारंभ किया।
                        </>,
                        <>
                          After returning, he made public service the purpose
                          of his life while living in his village and rural
                          surroundings. He began working to understand and help
                          resolve the problems faced by people in the region.
                        </>
                      )}
                    </BiographyBlock>



                    {/* जनता का स्नेह */}
                    <BiographyBlock
                      title={t(
                        "जनता ने दिए स्नेह के नाम",
                        "Names Given With Love by the People"
                      )}
                    >
                      {t(
                        <>
                          जनता के प्रति उनके आत्मीय व्यवहार और सेवा भावना ने
                          उन्हें लोगों के बीच विशेष स्थान दिलाया। क्षेत्र के
                          लोगों ने प्रेम और सम्मान से उन्हें “जय भगवान” और
                          “ब्रह्मानंद महाराज” जैसे नामों से पुकारना शुरू किया।
                        </>,
                        <>
                          His affectionate nature and dedication to public
                          service earned him a special place among the people.
                          The people of the region lovingly and respectfully
                          began calling him “Jai Bhagwan” and “Brahmanand
                          Maharaj.”
                        </>
                      )}
                    </BiographyBlock>



                    {/* परिवार */}
                    <BiographyBlock
                      title={t(
                        "विपरीत परिस्थितियों में परिवार की जिम्मेदारी",
                        "Responsibility Towards Family in Difficult Times"
                      )}
                    >
                      {t(
                        <>
                          वर्ष 2004 में उनके जीवन में एक बड़ा व्यक्तिगत संकट
                          आया। उनकी धर्मपत्नी श्रीमती उर्मिला बाई जी का निधन
                          हो गया। वे अपने पीछे चार बच्चों—वर्षा, रितु, नितिन एवं
                          सचिन—को छोड़ गईं।
                        </>,
                        <>
                          In 2004, he faced a major personal loss when his wife,
                          Smt. Urmila Bai Ji, passed away, leaving behind their
                          four children—Varsha, Ritu, Nitin and Sachin.
                        </>
                      )}

                      {t(
                        <>
                          इस कठिन परिस्थिति में उन्होंने अपने बच्चों की
                          जिम्मेदारी पूरी निष्ठा से निभाई और उन्हें सत्यनिष्ठा,
                          सरलता, मिलनसारिता, मानवता तथा जरूरतमंदों की सहायता
                          करने के संस्कार दिए।
                        </>,
                        <>
                          During this difficult period, he devoted himself to
                          raising his children and instilled in them the values
                          of honesty, simplicity, compassion, humanity and
                          helping those in need.
                        </>
                      )}
                    </BiographyBlock>



                    {/* अंतिम समय */}
                    <BiographyBlock
                      title={t(
                        "अंतिम समय तक निभाया परिवार और समाज का दायित्व",
                        "A Lifetime of Responsibility Towards Family and Society"
                      )}
                    >
                      {t(
                        <>
                          श्री ब्रह्मानंद भार्गव जी ने अपने जीवन के अंतिम पड़ाव
                          तक परिवार और समाज के प्रति अपनी जिम्मेदारियों को
                          निभाया। वे जीवनभर लोगों के सुख-दुःख में सहभागी बने
                          रहे।
                        </>,
                        <>
                          Shri Brahmanand Bhargava Ji continued to fulfill his
                          responsibilities towards his family and society until
                          the final phase of his life. Throughout his life, he
                          remained present in people's joys and sorrows.
                        </>
                      )}

                      {t(
                        <>
                          दिनांक 29 अप्रैल 2022 को हृदय गति रुकने से उनका
                          देहावसान हुआ और वे परमात्मा के चरणों में विलीन हो गए।
                        </>,
                        <>
                          He passed away on 29 April 2022 due to cardiac arrest
                          and returned to the divine.
                        </>
                      )}
                    </BiographyBlock>



                    {/* विरासत */}
                    <BiographyBlock
                      title={t(
                        "उनके विचारों को सेवा के रूप में आगे बढ़ाने का संकल्प",
                        "Continuing His Legacy Through Service"
                      )}
                    >
                      {t(
                        <>
                          श्री ब्रह्मानंद भार्गव जी ने अपने जीवन में जो सबसे बड़ी
                          विरासत छोड़ी, वह धन-संपत्ति नहीं, बल्कि जनसेवा की
                          भावना और मानवता के संस्कार हैं।
                        </>,
                        <>
                          The greatest legacy Shri Brahmanand Bhargava Ji left
                          behind was not wealth or possessions, but the spirit
                          of public service and the values of humanity.
                        </>
                      )}

                      {t(
                        <>
                          इन्हीं आदर्शों और उनके सेवा कार्यों से प्रेरणा लेकर
                          उनके पुत्रों ने “आनंदपुर श्री राधा रमन सेवा समिति” की
                          स्थापना की। समिति का उद्देश्य उनके सेवा भाव को आगे
                          बढ़ाते हुए गरीब, जरूरतमंद, वंचित एवं असहाय लोगों की
                          सहायता करना तथा समाजहित और जनकल्याण के कार्यों में
                          निरंतर योगदान देना है।
                        </>,
                        <>
                          Inspired by his ideals and service, his sons
                          established Anandpur Shri Radha Raman Seva Samiti.
                          The committee aims to carry forward his spirit of
                          service by supporting poor, needy, deprived and
                          helpless people and contributing continuously to
                          social welfare.
                        </>
                      )}
                    </BiographyBlock>



                    {/* अंतिम संदेश */}
                    <div className="mt-8 rounded-2xl bg-[#173b24] p-6 text-center sm:p-8">

                      <p className="text-base font-semibold leading-8 text-white sm:text-lg">
                        {t(
                          "जीवन की सच्ची सार्थकता स्वयं के लिए जीने में नहीं, बल्कि समाज और जरूरतमंदों के लिए कुछ करने में है।",
                          "The true meaning of life lies not in living only for oneself, but in doing something for society and those in need."
                        )}
                      </p>

                    </div>



                    {/* Tribute */}
                    <div className="mt-8 text-center">

                      <p className="text-lg font-extrabold text-[#173b24]">
                        {t(
                          "श्रद्धेय श्री ब्रह्मानंद भार्गव जी को शत्-शत् नमन।",
                          "Our heartfelt tribute to Shri Brahmanand Bhargava Ji."
                        )}
                      </p>

                    </div>

                  </div>

                </div>

              </div>



              {/* =================================================
                  READ MORE BUTTON
              ================================================== */}
              <div className="mt-8 border-t border-gray-100 pt-7">

                <button
                  onClick={() => setExpanded(!expanded)}
                  className="group inline-flex items-center gap-3 rounded-xl bg-[#173b24] px-6 py-3.5 text-sm font-extrabold text-white shadow-md transition-all duration-300 hover:bg-[#0c321d] hover:shadow-lg"
                >

                  <span>
                    {expanded
                      ? t("कम पढ़ें", "Read Less")
                      : t("और पढ़ें", "Read More")}
                  </span>


                  <span
                    className={`text-lg transition-transform duration-300 ${expanded ? "rotate-180" : ""
                      }`}
                  >
                    ↓
                  </span>

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}



/* =========================================================
   BIOGRAPHY BLOCK
========================================================= */

function BiographyBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">

      <div className="mb-4 flex items-center gap-3">

        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#f5c842]" />

        <h3 className="text-xl font-extrabold text-[#173b24]">
          {title}
        </h3>

      </div>


      <div className="space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
        {children}
      </div>

    </div>
  );
}