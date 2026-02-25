
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { httpsCallable, getFunctions } from "firebase/functions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/locale-context";
import { redeemCoupon } from "@/lib/firebase-functions";

type PlanId = "starter" | "pro" | "enterprise";

interface PlanDefinition {
  id: PlanId;
  name: string;
  price: number; // MAD per month
  description: string;
  features: string[];
  highlight?: boolean;
}

const PLANS: PlanDefinition[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    description: "For small local businesses getting started.",
    features: [
      "50 AI responses / month",
      "1 Google Business location",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: 299,
    description: "For serious growth and multi-location businesses.",
    features: [
      "200 AI responses / month",
      "Up to 3 locations",
      "Priority email support",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 599,
    description: "For agencies and large multi-location brands.",
    features: [
      "500 AI responses / month",
      "Up to 10 locations",
      "Onboarding & success manager",
    ],
  },
];

const billingCopy = {
  en: {
    title: "Billing",
    subtitle:
      "Choose a plan that fits your business. You start for free with 10 AI responses. Payment is handled directly with us via WhatsApp.",
    recommended: "Recommended",
    planBillingNote: "Billed monthly. No long-term contracts.",
    continueOnWhatsapp: "Continue on WhatsApp",
    manualNote:
      "For now, we finalize subscriptions manually by WhatsApp. Later, a secure payment provider (Stripe, etc.) will be integrated so you can pay directly inside the app.",
    notSignedInTitle: "Not signed in",
    notSignedInDesc: "Please sign in before choosing a plan.",
    invalidCouponTitle: "Invalid coupon",
    invalidCouponDesc:
      "This coupon code is invalid or has already been used.",
    genericErrorTitle: "Error",
    genericErrorDesc:
      "Something went wrong while preparing your WhatsApp message. Please try again.",
    confirmTitle: "Confirm your plan",
    confirmDesc:
      "Review your information, optionally add a coupon, then we’ll open WhatsApp with a pre-filled message.",
    selectedPlanLabel: "Selected plan",
    ownerNameLabel: "Business owner’s name",
    ownerNamePlaceholder: "Your name",
    businessNameLabel: "Business name",
    businessNamePlaceholder: "Your business name",
    couponLabel: "Coupon (optional)",
    couponPlaceholder: "PARTNER10",
    couponHelp:
      "If you have a coupon code, enter it here. Coupons are limited to one use per client.",
    cancel: "Cancel",
    confirmButton: "Confirm & open WhatsApp",
    preparing: "Preparing...",
    // WhatsApp message lines
    waGreeting: "Hello, I’d like to subscribe to GBReplAi.",
    waOwner: "Owner name",
    waBusiness: "Business name",
    waPlan: "Chosen plan",
    waCouponWith: "Coupon code",
    waCouponNone: "Coupon code: None",
    waThanks: "Please send me the payment instructions. Thank you.",
  },
  fr: {
    title: "Facturation",
    subtitle:
      "Choisissez une offre adaptée à votre entreprise. Vous commencez gratuitement avec 10 réponses IA. Le paiement se fait directement avec nous sur WhatsApp.",
    recommended: "Recommandé",
    planBillingNote:
      "Facturé mensuellement. Aucun engagement à long terme.",
    continueOnWhatsapp: "Continuer sur WhatsApp",
    manualNote:
      "Pour le moment, nous finalisons les abonnements manuellement sur WhatsApp. Plus tard, un prestataire de paiement sécurisé (Stripe, etc.) sera intégré pour payer directement dans l’application.",
    notSignedInTitle: "Non connecté",
    notSignedInDesc:
      "Veuillez vous connecter avant de choisir une offre.",
    invalidCouponTitle: "Coupon invalide",
    invalidCouponDesc:
      "Ce code promo est invalide ou a déjà été utilisé.",
    genericErrorTitle: "Erreur",
    genericErrorDesc:
      "Une erreur s’est produite lors de la préparation du message WhatsApp. Veuillez réessayer.",
    confirmTitle: "Confirmez votre offre",
    confirmDesc:
      "Vérifiez vos informations, ajoutez éventuellement un code promo, puis nous ouvrirons WhatsApp avec un message pré-rempli.",
    selectedPlanLabel: "Offre choisie",
    ownerNameLabel: "Nom du propriétaire",
    ownerNamePlaceholder: "Votre nom",
    businessNameLabel: "Nom de l’entreprise",
    businessNamePlaceholder: "Nom de votre entreprise",
    couponLabel: "Code promo (optionnel)",
    couponPlaceholder: "PARTNER10",
    couponHelp:
      "Si vous avez un code promo, saisissez-le ici. Un seul usage par client.",
    cancel: "Annuler",
    confirmButton: "Confirmer et ouvrir WhatsApp",
    preparing: "Préparation...",
    // WhatsApp message lines
    waGreeting: "Bonjour, je souhaite m’abonner à GBReplAi.",
    waOwner: "Nom du propriétaire",
    waBusiness: "Nom de l’entreprise",
    waPlan: "Offre choisie",
    waCouponWith: "Code promo",
    waCouponNone: "Code promo : Aucun",
    waThanks:
      "Merci de m’envoyer les instructions de paiement.",
  },
  ar: {
    title: "الفوترة",
    subtitle:
      "اختر الخطة المناسبة لنشاطك. تبدأ مجانًا مع 10 ردود بالذكاء الاصطناعي. الدفعات تتم معنا مباشرة عبر واتساب.",
    recommended: "موصى بها",
    planBillingNote:
      "يتم الفوترة شهريًا. لا توجد التزامات طويلة الأجل.",
    continueOnWhatsapp: "المتابعة عبر واتساب",
    manualNote:
      "حاليًا نقوم بإتمام الاشتراكات يدويًا عبر واتساب. لاحقًا سيتم دمج مزود دفع آمن (مثل Stripe) للدفع مباشرة داخل التطبيق.",
    notSignedInTitle: "لم يتم تسجيل الدخول",
    notSignedInDesc: "يرجى تسجيل الدخول قبل اختيار الخطة.",
    invalidCouponTitle: "كود الخصم غير صالح",
    invalidCouponDesc:
      "كود الخصم هذا غير صالح أو تم استخدامه مسبقًا.",
    genericErrorTitle: "خطأ",
    genericErrorDesc:
      "حدث خطأ أثناء تحضير رسالة واتساب. يرجى المحاولة مرة أخرى.",
    confirmTitle: "تأكيد الخطة",
    confirmDesc:
      "راجع بياناتك، أضف كود خصم (إن وجد)، ثم سنفتح واتساب برسالة جاهزة للإرسال.",
    selectedPlanLabel: "الخطة المختارة",
    ownerNameLabel: "اسم صاحب النشاط",
    ownerNamePlaceholder: "اسمك",
    businessNameLabel: "اسم النشاط التجاري",
    businessNamePlaceholder: "اسم نشاطك التجاري",
    couponLabel: "كود الخصم (اختياري)",
    couponPlaceholder: "PARTNER10",
    couponHelp:
      "إذا كان لديك كود خصم فأدخله هنا. كل عميل يمكنه استخدامه مرة واحدة فقط.",
    cancel: "إلغاء",
    confirmButton: "تأكيد وفتح واتساب",
    preparing: "جاري التحضير...",
    // WhatsApp message lines
    waGreeting: "مرحبًا، أود الاشتراك في خدمة GBReplAi.",
    waOwner: "اسم صاحب النشاط",
    waBusiness: "اسم النشاط",
    waPlan: "الخطة المختارة",
    waCouponWith: "كود الخصم",
    waCouponNone: "كود الخصم: لا يوجد",
    waThanks: "يرجى إرسال تعليمات الدفع. شكرًا لك.",
  },
} as const;

export default function BillingPage() {
  const { locale } = useLocale();
  const t = billingCopy[locale];

  const { client, user } = useAuth();
  const { toast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState<PlanDefinition | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [ownerName, setOwnerName] = useState(user?.displayName || "");
  const [businessName, setBusinessName] = useState(
    client?.businessName || "",
  );
  const [submitting, setSubmitting] = useState(false);

  const handleOpenDialog = (plan: PlanDefinition) => {
    setSelectedPlan(plan);
    setCouponCode("");
    setOwnerName(user?.displayName || "");
    setBusinessName(client?.businessName || "");
    setDialogOpen(true);
  };

  const handleConfirmWhatsapp = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: t.notSignedInTitle,
        description: t.notSignedInDesc,
      });
      return;
    }
    if (!selectedPlan) return;

    setSubmitting(true);

    try {
      const trimmedCode = couponCode.trim().toUpperCase();

      if (trimmedCode) {
        try {
          // Note: The `redeemCoupon` function is designed to be called from the server,
          // but for this manual flow, we call it on the client to pre-validate.
          // In a real automated system, this would be part of a server-side transaction.
          const result = await redeemCoupon(trimmedCode, selectedPlan.id);
          if (!result || !result.ok) {
            throw new Error(t.invalidCouponDesc);
          }
        } catch (err: any) {
          console.error("Coupon validation failed", err);
          toast({
            variant: "destructive",
            title: t.invalidCouponTitle,
            description: err?.message || t.invalidCouponDesc,
          });
          setSubmitting(false);
          return;
        }
      }

      // Localized plan/coupon lines for WhatsApp message
      const planLine = `${selectedPlan.name} (${selectedPlan.price} MAD / mois)`;
      const couponLine = trimmedCode
        ? `${t.waCouponWith}: ${trimmedCode}`
        : t.waCouponNone;

      const msgLines = [
        t.waGreeting,
        "",
        `- ${t.waOwner}: ${
          ownerName || (locale === "fr"
            ? "Non renseigné"
            : locale === "ar"
            ? "غير مذكور"
            : "Not provided")
        }`,
        `- ${t.waBusiness}: ${
          businessName || (locale === "fr"
            ? "Non renseigné"
            : locale === "ar"
            ? "غير مذكور"
            : "Not provided")
        }`,
        `- ${t.waPlan}: ${planLine}`,
        `- ${couponLine}`,
        "",
        t.waThanks,
      ];

      const msg = msgLines.join("\n");

      const whatsappNumber = "212696974422"; // no '+' in URL
      const url =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(msg);

      window.location.href = url;
      setDialogOpen(false);
    } catch (err) {
      console.error("Failed to prepare WhatsApp message", err);
      toast({
        variant: "destructive",
        title: t.genericErrorTitle,
        description: t.genericErrorDesc,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t.title}
        </h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={plan.highlight ? "border-primary shadow-lg" : ""}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.highlight && (
                  <Badge variant="outline" className="text-xs">
                    {t.recommended}
                  </Badge>
                )}
              </div>
              <CardDescription>
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-2xl font-bold">
                  {plan.price} MAD / month
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.planBillingNote}
                </p>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {plan.features.map((feat) => (
                  <li key={feat}>• {feat}</li>
                ))}
              </ul>
              <Button
                className="w-full mt-2"
                variant={plan.highlight ? "default" : "outline"}
                onClick={() => handleOpenDialog(plan)}
              >
                {t.continueOnWhatsapp}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {t.manualNote}
      </p>

      {/* Simple dialog replacement: using a custom centered panel */}
      {dialogOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-background p-4 shadow-lg">
            <h2 className="mb-1 text-lg font-semibold">
              {t.confirmTitle}
            </h2>
            <p className="mb-3 text-xs text-muted-foreground">
              {t.confirmDesc}
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {t.selectedPlanLabel}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan.name} ({selectedPlan.price} MAD / mois)
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {t.ownerNameLabel}
                </label>
                <Input
                  value={ownerName}
                  onChange={(e) =>
                    setOwnerName(e.target.value)
                  }
                  placeholder={t.ownerNamePlaceholder}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {t.businessNameLabel}
                </label>
                <Input
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(e.target.value)
                  }
                  placeholder={t.businessNamePlaceholder}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {t.couponLabel}
                </label>
                <Input
                  value={couponCode}
                  onChange={(e) =>
                    setCouponCode(e.target.value.toUpperCase())
                  }
                  placeholder={t.couponPlaceholder}
                />
                <p className="text-xs text-muted-foreground">
                  {t.couponHelp}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleConfirmWhatsapp}
                disabled={submitting}
              >
                {submitting ? t.preparing : t.confirmButton}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

    