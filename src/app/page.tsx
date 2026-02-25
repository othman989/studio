
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, type Locale } from "@/contexts/locale-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


type Lang = "en" | "fr" | "ar";

const copy = {
  en: {
    heroTag: "NEVER MANUALLY REPLY TO A GOOGLE REVIEW AGAIN",
    heroTitle: "Save 5+ Hours a Week on Your Google Reviews",
    heroSubtitle:
      "Stop manually replying to reviews. GBReplAi uses AI to write on-brand, personalized responses for all your Google Business locations, turning happy customers into repeat business—on autopilot.",
    signInLabel: "Sign in with Google",
    freeTrialLine:
      "Free trial: 10 AI responses included. No credit card required.",
    benefitsTitle: "Designed for busy local businesses",
    benefitsSubtitle:
      "Whether you run a salon, clinic, restaurant, or agency, GBReplAi keeps your Google reviews answered quickly and professionally, using your tone and language.",
    benefit1Title: "On-brand replies",
    benefit1Body:
      "Set your tone, language, and custom instructions once. Every reply follows your style and mentions what matters to you.",
    benefit2Title: "Save hours weekly",
    benefit2Body:
      "Reviews appear in one dashboard. GBReplAi drafts replies in seconds, so you can approve them in a couple of clicks.",
    benefit3Title: "You control bad reviews",
    benefit3Body:
      "Positive reviews can be auto‑replied. 1–3★ reviews stay as drafts so you always approve sensitive responses.",
    howTitle: "How GBReplAi works",
    step1Title: "Connect Google in 30 Seconds",
    step1Body:
      "Sign in with Google and link your Business Profile. We import your locations and past reviews securely.",
    step2Title: "Teach the AI Your Style",
    step2Body:
      "Choose tone (professional, friendly, casual) and default language. Add any custom instructions for the AI.",
    step3Title: "Run Your Business, Not Your Reviews",
    step3Body:
      "4–5★ reviews can be replied automatically. For 1–3★ reviews we save AI drafts so you can edit and approve.",
    faqTitle: "Common questions",
    faq1Q: "Will GBReplAi reply to bad reviews automatically?",
    faq1A:
      "By default, only 4–5★ reviews are auto‑replied if you turn off 'Approve all replies'. For 1–3★ reviews, we always generate a draft that you must review and publish manually.",
    faq2Q: "Can I try it for free?",
    faq2A:
      "Yes. Your account starts with 10 free AI responses. No credit card is required to start.",
    faq3Q: "Is my Google account safe?",
    faq3A:
      "We use secure OAuth to connect to your Google Business Profile and store only the data needed to generate and post replies.",
    faq4Q: "Who is GBReplAi for?",
    faq4A:
      "Local businesses, agencies, and anyone who receives regular Google reviews and wants to reply faster without losing quality.",
    bottomCta: "Start with 10 free replies",
    bottomWhatsapp: "Prefer WhatsApp?",
    bottomWhatsappLink: "Chat with us and we’ll set everything up for you.",
    trustedBy: "TRUSTED BY HUNDREDS OF LOCAL BUSINESSES",
    testimonial1Quote: "This is a game-changer. I used to spend my evenings replying to reviews. Now it's all handled, and the replies sound just like me. I finally have my weekends back!",
    testimonial1Name: "Sarah K.",
    testimonial1Role: "Owner, The Urban Petal",
    testimonial2Quote: "As an agency managing 20+ clients, GBReplAi is essential. It saves us countless hours and our clients are thrilled with the consistent, professional responses.",
    testimonial2Name: "David L.",
    testimonial2Role: "Director, LocalVantage Agency",
    testimonial3Quote: "I was skeptical about AI, but this is incredible. It captured my friendly-but-professional tone perfectly. It's one of the best investments I've made for my clinic.",
    testimonial3Name: "Dr. Jessica M.",
    testimonial3Role: "Founder, Serene Dental Clinic",
  },
  fr: {
    heroTag: "NE RÉPONDEZ PLUS JAMAIS MANUELLEMENT À UN AVIS GOOGLE",
    heroTitle: "Économisez 5+ heures par semaine sur vos avis Google",
    heroSubtitle:
      "Arrêtez de répondre manuellement aux avis. GBReplAi utilise l'IA pour rédiger des réponses personnalisées et fidèles à votre marque pour toutes vos fiches Google Business, fidélisant ainsi vos clients—en pilote automatique.",
    signInLabel: "Se connecter avec Google",
    freeTrialLine:
      "Essai gratuit : 10 réponses IA incluses. Aucune carte bancaire requise.",
    benefitsTitle: "Pensé pour les entreprises locales",
    benefitsSubtitle:
      "Salon, clinique, restaurant ou agence : GBReplAi répond à vos avis Google rapidement et avec votre style.",
    benefit1Title: "Réponses à votre image",
    benefit1Body:
      "Choisissez le ton, la langue et vos consignes. Chaque réponse respecte votre style et vos messages clés.",
    benefit2Title: "Gagnez plusieurs heures par semaine",
    benefit2Body:
      "Tous vos avis sont regroupés dans un tableau de bord. GBReplAi propose des réponses en quelques secondes.",
    benefit3Title: "Vous gardez la main sur les avis négatifs",
    benefit3Body:
      "Les avis positifs peuvent être répondus automatiquement si vous désactivez l'option 'Approuver toutes les réponses'. Les avis 1–3★ restent toujours en brouillon pour validation.",
    howTitle: "Comment fonctionne GBReplAi",
    step1Title: "Connectez Google en 30 secondes",
    step1Body:
      "Connectez‑vous avec Google et liez votre fiche. Nous importons vos lieux et vos anciens avis en toute sécurité.",
    step2Title: "Apprenez à l'IA votre style",
    step2Body:
      "Définissez le ton (professionnel, amical, décontracté) et la langue. Ajoutez des consignes spéciales pour l’IA.",
    step3Title: "Gérez votre business, pas vos avis",
    step3Body:
      "Les avis 4–5★ peuvent être répondus automatiquement. Pour les avis 1–3★, nous créons des brouillons à valider.",
    faqTitle: "Questions fréquentes",
    faq1Q: "GBReplAi répond‑il automatiquement aux mauvais avis ?",
    faq1A:
      "Par défaut, seuls les avis 4–5★ sont répondus automatiquement (si vous désactivez l'option 'Approuver toutes les réponses'). Pour les avis 1–3★, nous générons un brouillon que vous validez.",
    faq2Q: "Puis‑je tester gratuitement ?",
    faq2A:
      "Oui. Votre compte commence avec 10 réponses IA gratuites. Aucune carte bancaire n’est nécessaire.",
    faq3Q: "Mon compte Google est‑il en sécurité ?",
    faq3A:
      "Nous utilisons OAuth sécurisé pour nous connecter à votre fiche Google Business et stockons seulement le strict nécessaire.",
    faq4Q: "Pour qui est GBReplAi ?",
    faq4A:
      "Pour les commerces de proximité, agences et toute entreprise recevant régulièrement des avis Google.",
    bottomCta: "Commencer avec 10 réponses gratuites",
    bottomWhatsapp: "Vous préférez WhatsApp ?",
    bottomWhatsappLink:
      "Écrivez‑nous et nous configurons tout pour vous.",
    trustedBy: "APPROUVÉ PAR DES CENTAINES D'ENTREPRISES LOCALES",
    testimonial1Quote: "Ça change la vie. Je passais mes soirées à répondre aux avis. Maintenant, tout est géré, et les réponses me ressemblent. J'ai enfin retrouvé mes week-ends !",
    testimonial1Name: "Sarah K.",
    testimonial1Role: "Gérante, The Urban Petal",
    testimonial2Quote: "En tant qu'agence gérant plus de 20 clients, GBReplAi est essentiel. Il nous fait gagner un temps fou et nos clients sont ravis des réponses cohérentes.",
    testimonial2Name: "David L.",
    testimonial2Role: "Directeur, Agence LocalVantage",
    testimonial3Quote: "J'étais sceptique face à l'IA, mais c'est incroyable. Il a parfaitement saisi mon ton amical mais professionnel. C'est l'un de mes meilleurs investissements.",
    testimonial3Name: "Dr. Jessica M.",
    testimonial3Role: "Fondatrice, Clinique Dentaire Sereine",
  },
  ar: {
    heroTag: "لا ترد يدويًا على مراجعات جوجل بعد الآن",
    heroTitle: "وفّر أكثر من 5 ساعات أسبوعيًا على مراجعات جوجل",
    heroSubtitle:
      "توقف عن الرد اليدوي على المراجعات. يستخدم GBReplAi الذكاء الاصطناعي لكتابة ردود مخصصة ومطابقة لعلامتك التجارية لجميع مواقعك على Google Business، مما يحول العملاء السعداء إلى عملاء دائمين - بشكل تلقائي.",
    signInLabel: "تسجيل الدخول بحساب Google",
    freeTrialLine:
      "تجربة مجانية: 10 ردود بالذكاء الاصطناعي بدون بطاقة بنكية.",
    benefitsTitle: "مصمَّم لأصحاب الأنشطة المحلية",
    benefitsSubtitle:
      "صالون، عيادة، مطعم أو وكالة – GBReplAi يجيب على مراجعاتك بسرعة وبنفس أسلوبك.",
    benefit1Title: "ردود بأسلوب علامتك",
    benefit1Body:
      "اختر النبرة، اللغة والتعليمات الخاصة. كل رد يلتزم بأسلوب نشاطك وما تريد التأكيد عليه.",
    benefit2Title: "توفير الوقت",
    benefit2Body:
      "تظهر جميع المراجعات في لوحة تحكم واحدة. GBReplAi يقترح ردودًا خلال ثوانٍ لتوافق عليها.",
    benefit3Title: "تحكّم في المراجعات السلبية",
    benefit3Body:
      "يمكن الرد تلقائيًا على المراجعات الإيجابية إذا قمت بتعطيل خيار 'الموافقة على كل الردود'. المراجعات من 1 إلى 3 نجوم تبقى دائمًا كمسودات لموافقتك.",
    howTitle: "كيف يعمل GBReplAi",
    step1Title: "اربط حساب Google Business خلال 30 ثانية",
    step1Body:
      "سجّل الدخول بحساب Google واربط نشاطك التجاري. نستورد المواقع والمراجعات بأمان.",
    step2Title: "علّم الذكاء الاصطناعي أسلوبك",
    step2Body:
      "اختر النبرة (رسمية، ودّية،…)، واللغة الافتراضية. أضف تعليمات خاصة للذكاء الاصطناعي.",
    step3Title: "أَدِرْ عملك، وليس مراجعاتك",
    step3Body:
      "يتم الرد تلقائيًا على المراجعات 4–5 نجوم. المراجعات 1–3 نجوم نحفظ لها ردًا آليًا كمسودة لتعديله واعتماده.",
    faqTitle: "أسئلة شائعة",
    faq1Q: "هل يرد GBReplAi تلقائيًا على المراجعات السيئة؟",
    faq1A:
      "افتراضيًا، يتم الرد تلقائيًا فقط على المراجعات 4–5 نجوم (إذا عطلت خيار 'الموافقة على كل الردود'). للمراجعات 1–3 نجوم نولّد ردًا كمسودة لتوافق عليه.",
    faq2Q: "هل أستطيع التجربة مجانًا؟",
    faq2A:
      "نعم، يبدأ حسابك مع 10 ردود مجانية بالذكاء الاصطناعي بدون بطاقة بنكية.",
    faq3Q: "هل حساب Google الخاص بي آمن؟",
    faq3A:
      "نستخدم OAuth الآمن للاتصال بحسابك ونخزّن فقط البيانات اللازمة لإنشاء ونشر الردود.",
    faq4Q: "لمن تم تطوير GBReplAi؟",
    faq4A:
      "لأصحاب الأنشطة المحلية والوكالات وكل من يتلقى مراجعات على Google ويريد الرد بسرعة وبجودة عالية.",
    bottomCta: "ابدأ مع 10 ردود مجانية",
    bottomWhatsapp: "تفضّل التواصل عبر واتساب؟",
    bottomWhatsappLink:
      "راسلنا لنقوم بإعداد كل شيء لك.",
    trustedBy: "موثوق به من قبل مئات الشركات المحلية",
    testimonial1Quote: "هذا يغير قواعد اللعبة. كنت أقضي أمسياتي في الرد على المراجعات. الآن كل شيء يتم تلقائيًا، والردود تبدو كأنني كتبتها بنفسي. استعدت عطلاتي الأسبوعية!",
    testimonial1Name: "سارة ك.",
    testimonial1Role: "مالكة، The Urban Petal",
    testimonial2Quote: "بصفتنا وكالة تدير أكثر من 20 عميلاً، فإن GBReplAi أداة أساسية. إنه يوفر لنا ساعات لا تحصى وعملاؤنا سعداء بالردود الاحترافية والمتسقة.",
    testimonial2Name: "ديفيد ل.",
    testimonial2Role: "مدير، وكالة LocalVantage",
    testimonial3Quote: "كنت متشككًا بشأن الذكاء الاصطناعي، لكن هذا مذهل. لقد التقط أسلوبي الودي والاحترافي بشكل مثالي. إنه أحد أفضل الاستثمارات التي قمت بها لعيادتي.",
    testimonial3Name: "د. جيسيكا م.",
    testimonial3Role: "مؤسسة، عيادة سرين لطب الأسنان",
  },
};

// Google icon used inside the button
function GoogleIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.23 9.21 3.26l6.85-6.85C35.9 2.38 30.37 0 24 0 14.64 0 6.51 5.38 2.56 13.22l7.98 6.19C12.24 13.02 17.62 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.5 24.5c0-1.63-.15-3.2-.43-4.72H24v9.02h12.7c-.55 2.96-2.2 5.47-4.7 7.16l7.58 5.88C43.9 37.93 46.5 31.66 46.5 24.5z"
      />
      <path
        fill="#4A90E2"
        d="M10.54 28.41A14.5 14.5 0 0 1 9.5 24c0-1.52.26-2.98.74-4.35l-7.98-6.19A23.876 23.876 0 0 0 0 24c0 3.9.93 7.58 2.56 10.86l7.98-6.45z"
      />
      <path
        fill="#FBBC05"
        d="M24 48c6.37 0 11.73-2.1 15.64-5.7l-7.58-5.88C29.96 37.91 27.19 38.5 24 38.5c-6.38 0-11.77-3.52-14.46-8.7l-7.98 6.45C6.51 42.62 14.64 48 24 48z"
      />
    </svg>
  );
}

function GoogleSignInButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Button
      asChild
      size="sm"
      className={cn(
        "bg-white text-slate-900 border border-slate-300 shadow-sm hover:bg-slate-100 hover:text-slate-900 font-medium px-3 py-2",
        className,
      )}
    >
      <Link href="/login" className="flex items-center gap-2">
        <span className="rounded-full bg-white p-1">
          <GoogleIcon />
        </span>
        <span className="text-xs sm:text-sm">{label}</span>
      </Link>
    </Button>
  );
}

export default function LandingPage() {
  const { locale, setLocale } = useLocale();
  const lang = locale as Lang;
  const t = copy[lang];

  const flagFor: Record<Lang, string> = {
    en: "🇬🇧",
    fr: "🇫🇷",
    ar: "🇲🇦",
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-b from-[#e8f3ff] via-[#f4f8ff] to-[#f7fbff] text-slate-900"
    >
      {/* NAVBAR */}
      <header className="border-b border-slate-200/60 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              GBReplAi
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Language switch with flags */}
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-600">
              {(["en", "fr", "ar"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-slate-100",
                    lang === l &&
                      "bg-slate-900 text-white hover:bg-slate-900",
                  )}
                >
                  <span>{flagFor[l]}</span>
                </button>
              ))}
            </div>
            <GoogleSignInButton label={t.signInLabel} />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto flex max-w-5xl flex-col gap-16 px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        {/* HERO */}
        <section className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100">
              <Sparkles className="h-3 w-3" />
              <span>{t.heroTag}</span>
            </div>

            <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl">
              {t.heroTitle}
            </h1>

            <p className="max-w-xl text-sm text-slate-600 sm:text-base">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-center">
              <GoogleSignInButton
                label={t.signInLabel}
                className="w-full justify-center sm:w-auto"
              />
              <p className="text-xs text-slate-500 sm:text-sm">
                {t.freeTrialLine}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 sm:text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>
                  {lang === "ar"
                    ? "يدعم جميع مواقع نشاطك"
                    : "Works with all your locations"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-sky-500" />
                <span>
                  {lang === "fr"
                    ? "Réponses en quelques secondes"
                    : lang === "ar"
                    ? "ردود في ثوانٍ معدودة"
                    : "Replies in under 5 seconds"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-slate-500" />
                <span>
                  {lang === "fr"
                    ? "Vous validez les avis sensibles"
                    : lang === "ar"
                    ? "أنت من يوافق على الردود الحساسة"
                    : "You approve critical reviews"}
                </span>
              </div>
            </div>
          </div>

          {/* Mockup */}
          <div className="mt-10 flex flex-1 justify-center lg:mt-0 lg:justify-end">
            <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    {lang === "fr"
                      ? "Avis en direct"
                      : lang === "ar"
                      ? "مراجعات مباشرة"
                      : "Live reviews"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {lang === "fr"
                      ? "L’IA rédige des réponses approuvables en un clic."
                      : lang === "ar"
                      ? "الذكاء الاصطناعي يكتب ردودًا جاهزة للموافقة."
                      : "AI writes replies you can approve in one click."}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  +3 {lang === "ar" ? "اليوم" : "new today"}
                </span>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-left"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-800">
                        5.0 ★{" "}
                        {lang === "fr"
                          ? "Avis client"
                          : lang === "ar"
                          ? "تقييم عميل"
                          : "Customer review"}
                      </p>
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                        {lang === "fr"
                          ? "Réponse IA prête"
                          : lang === "ar"
                          ? "رد آلي جاهز"
                          : "AI reply ready"}
                      </span>
                    </div>
                    <p className="mb-2 text-xs text-slate-600 line-clamp-2">
                      “Fantastic service! The team was super friendly and the
                      booking process was smooth.”
                    </p>
                    <p className="rounded-lg bg-white p-2 text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">
                        GBReplAi:
                      </span>{" "}
                      {lang === "fr"
                        ? "Merci beaucoup pour votre avis ! Nous sommes ravis que votre expérience se soit bien passée."
                        : lang === "ar"
                        ? "شكرًا جزيلاً على رأيك! يسعدنا أنك استمتعت بتجربتك ونتطلع لرؤيتك مرة أخرى."
                        : "Thank you so much for your kind words! We’re glad you enjoyed your experience and hope to see you again soon."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF / TESTIMONIALS */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600">
              {t.trustedBy}
            </h2>
            <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-base font-semibold text-slate-400">
              <p>TechToday</p>
              <p>LocalBiz Pro</p>
              <p>The Agency Journal</p>
              <p>Startup Weekly</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="mb-4 text-sm text-slate-700">“{t.testimonial1Quote}”</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10" data-ai-hint="woman portrait">
                  <AvatarImage src="https://images.unsplash.com/photo-1557053910-d9eadeed1c58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2NTAxNzM4OHww&ixlib=rb-4.1.0&q=80&w=1080" />
                  <AvatarFallback>SK</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-900">{t.testimonial1Name}</p>
                  <p className="text-xs text-slate-500">{t.testimonial1Role}</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="mb-4 text-sm text-slate-700">“{t.testimonial2Quote}”</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10" data-ai-hint="man portrait">
                  <AvatarImage src="https://images.unsplash.com/photo-1594672830234-ba4cfe1202dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8bWFuJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzY0OTc2OTkzfDA&ixlib=rb-4.1.0&q=80&w=1080" />
                  <AvatarFallback>DL</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-900">{t.testimonial2Name}</p>
                  <p className="text-xs text-slate-500">{t.testimonial2Role}</p>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2 lg:row-start-1 lg:col-start-2 xl:col-span-1">
              <p className="mb-4 text-sm text-slate-700">“{t.testimonial3Quote}”</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10" data-ai-hint="doctor portrait">
                  <AvatarImage src="https://images.unsplash.com/photo-1550831107-1553da8c8464?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxkb2N0b3IlMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjUwMTE4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080" />
                  <AvatarFallback>JM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-900">{t.testimonial3Name}</p>
                  <p className="text-xs text-slate-500">{t.testimonial3Role}</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Benefits */}
        <section className="space-y-6">
          <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
            {t.benefitsTitle}
          </h2>
          <p className="mx-auto max-w-2xl text-center text-sm text-slate-600 sm:text-base">
            {t.benefitsSubtitle}
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-sky-500" />
                <h3 className="text-sm font-semibold">
                  {t.benefit1Title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 sm:text-sm">
                {t.benefit1Body}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-semibold">
                  {t.benefit2Title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 sm:text-sm">
                {t.benefit2Body}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                <h3 className="text-sm font-semibold">
                  {t.benefit3Title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 sm:text-sm">
                {t.benefit3Body}
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-6">
          <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
            {t.howTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-1 text-xs font-semibold uppercase text-sky-600">
                Step 1
              </p>
              <h3 className="mb-2 text-sm font-semibold">
                {t.step1Title}
              </h3>
              <p className="text-xs text-slate-600 sm:text-sm">
                {t.step1Body}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-1 text-xs font-semibold uppercase text-sky-600">
                Step 2
              </p>
              <h3 className="mb-2 text-sm font-semibold">
                {t.step2Title}
              </h3>
              <p className="text-xs text-slate-600 sm:text-sm">
                {t.step2Body}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-1 text-xs font-semibold uppercase text-sky-600">
                Step 3
              </p>
              <h3 className="mb-2 text-sm font-semibold" >
                {t.step3Title}
              </h3 >
              <p className="text-xs text-slate-600 sm:text-sm">
                {t.step3Body}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4 border-t border-slate-200 pt-8">
          <h2 className="text-center text-lg font-semibold tracking-tight sm:text-xl">
            {t.faqTitle}
          </h2>
          <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="mb-1 text-sm font-semibold">{t.faq1Q}</h3>
              <p className="text-xs text-slate-600 sm:text-sm">
                {t.faq1A}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="mb-1 text-sm font-semibold">{t.faq2Q}</h3>
              <p className="text-xs text-slate-600 sm:text-sm">
                {t.faq2A}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="mb-1 text-sm font-semibold">{t.faq3Q}</h3>
              <p className="text-xs text-slate-600 sm:text-sm">
                {t.faq3A}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="mb-1 text-sm font-semibold">{t.faq4Q}</h3>
              <p className="text-xs text-slate-600 sm:text-sm">
                {t.faq4A}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center gap-3 text-center">
            <Button asChild size="lg">
              <Link href="/login" className="flex items-center gap-2">
                {t.bottomCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-slate-500">
              {t.bottomWhatsapp}{" "}
              <a
                href="https://wa.me/212696974422"
                className="font-medium text-sky-600 hover:underline"
              >
                {t.bottomWhatsappLink}
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} GBReplAi. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-slate-700">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-slate-700">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
