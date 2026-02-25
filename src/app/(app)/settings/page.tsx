"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/locale-context";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  useFirestore,
  useMemoFirebase,
  updateDocumentNonBlocking,
} from "@/firebase";
import { doc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------

const settingsCopy = {
  en: {
    title: "Settings",
    subtitle: "Manage your business profile, reply behavior, and integrations.",
    tabs: {
      profile: "Profile",
      response: "Reply behavior",
      google: "Google connection",
      billing: "Billing",
    },
    profile: {
      title: "Business profile",
      description:
        "This information is used to personalize AI replies for your business.",
      businessNameLabel: "Business name",
      businessNameDescription:
        "How GBReplAi should refer to your business in replies.",
      emailLabel: "Email",
      emailDescription:
        "We use this to contact you about your account and support.",
      saveButton: "Save profile",
    },
    response: {
      title: "Reply behavior",
      description:
        "Control how GBReplAi generates and posts replies to your reviews.",
      toneLabel: "Tone of voice",
      toneDescription:
        "Choose the default tone GBReplAi should use in replies.",
      autoHandleLabel: "Automatically handle new reviews",
      autoHandleDescription:
        "When ON, GBReplAi will automatically generate replies during sync: it can auto-post for 4–5 star reviews and create drafts for 1–3 star reviews, depending on your approval setting. When OFF, reviews are only imported and you handle replies manually.",
      approveAllRepliesLabel: "Approve all replies before posting",
      approveAllRepliesDescription:
        "When ON (and automatic handling is enabled), all AI-generated replies for any rating will be saved as drafts for your approval. When OFF, 4–5 star reviews are posted automatically and 1–3 star reviews are saved as drafts.",
      languageLabel: "Reply language",
      languageDescription:
        "Choose a fixed language for replies or let GBReplAi auto-detect from the review.",
      templateLabel: "Custom reply template (optional)",
      templateDescription:
        "You can define a custom structure for replies. The AI will try to follow it.",
      saveButton: "Save reply settings",
    },
    google: {
      title: "Google Business connection",
      description:
        "Connect or manage your Google Business Profile connection.",
      statusConnected: "Connected to Google Business",
      statusDisconnected: "Not connected",
      connectButton: "Connect Google Business",
      reconnectButton: "Reconnect",
      disconnectButton: "Disconnect Google Business",
      disconnectWarning:
        "Disconnecting will stop automatic sync and replies. You can reconnect later.",
      consentLabel:
        "I authorize GBReplAi by Greotech to access my Google Business Profile data and to generate and post review responses on my behalf, according to the automation settings above. I understand I can revoke this access at any time from my Google account or from GBReplAi settings.",
      consentError:
        "You must explicitly authorize GBReplAi to access and manage your Google Business Profile before connecting.",
    },
    billing: {
      title: "Billing & plan",
      description: "View your current plan and manage billing.",
      goToBilling: "Go to Billing",
    },
    toast: {
      profileSaved: "Profile saved",
      responseSaved: "Reply settings saved",
      error: "An error occurred while saving your settings.",
      googleNotConfiguredTitle: "Google connection not configured",
      googleNotConfiguredDesc:
        "Google Business is not configured on the server. Please contact support.",
      googleConnectFailedTitle: "Failed to connect Google Business",
      googleConnectFailedDesc:
        "Please try again or contact support if the problem persists.",
      googleDisconnectedTitle: "Disconnected from Google Business",
      googleDisconnectedDesc: "",
      googleDisconnectFailedTitle: "Failed to disconnect Google Business",
      googleDisconnectFailedDesc:
        "Please try again or contact support if the problem persists.",
    },
  },
  fr: {
    title: "Paramètres",
    subtitle:
      "Gérez votre profil d’établissement, le comportement des réponses et les intégrations.",
    tabs: {
      profile: "Profil",
      response: "Réponses IA",
      google: "Connexion Google",
      billing: "Facturation",
    },
    profile: {
      title: "Profil d’établissement",
      description:
        "Ces informations sont utilisées pour personnaliser les réponses IA à votre image.",
      businessNameLabel: "Nom de l’établissement",
      businessNameDescription:
        "Comment GBReplAi doit parler de votre établissement dans les réponses.",
      emailLabel: "Email",
      emailDescription:
        "Nous utilisons cet email pour vous contacter au sujet de votre compte et de l’assistance.",
      saveButton: "Enregistrer le profil",
    },
    response: {
      title: "Comportement des réponses",
      description:
        "Contrôlez comment GBReplAi génère et publie les réponses à vos avis.",
      toneLabel: "Ton de la réponse",
      toneDescription:
        "Choisissez le ton par défaut que GBReplAi doit utiliser dans les réponses.",
      autoHandleLabel: "Traiter automatiquement les nouveaux avis",
      autoHandleDescription:
        "Si ACTIVÉ, GBReplAi génère automatiquement des réponses lors de la synchronisation : publication auto pour les avis 4–5★ et brouillons pour les avis 1–3★, selon vos préférences d’approbation. Si DÉSACTIVÉ, les avis sont seulement importés et vous gérez les réponses manuellement.",
      approveAllRepliesLabel:
        "Approuver toutes les réponses avant publication",
      approveAllRepliesDescription:
        "Si ACTIVÉ (et si le traitement automatique est activé), toutes les réponses IA, quelle que soit la note, seront sauvegardées comme brouillons pour votre validation. Si DÉSACTIVÉ, les réponses aux avis 4–5★ sont publiées automatiquement et les avis 1–3★ reçoivent des brouillons IA.",
      languageLabel: "Langue des réponses",
      languageDescription:
        "Choisissez une langue fixe pour les réponses ou laissez GBReplAi détecter automatiquement à partir de l’avis.",
      templateLabel: "Modèle de réponse personnalisé (optionnel)",
      templateDescription:
        "Vous pouvez définir une structure personnalisée pour les réponses. L’IA essaiera de la suivre.",
      saveButton: "Enregistrer les paramètres de réponse",
    },
    google: {
      title: "Connexion Google Business",
      description:
        "Connectez ou gérez la connexion à votre fiche Google Business.",
      statusConnected: "Connecté à Google Business",
      statusDisconnected: "Non connecté",
      connectButton: "Connecter Google Business",
      reconnectButton: "Reconnecter",
      disconnectButton: "Déconnecter Google Business",
      disconnectWarning:
        "La déconnexion arrêtera la synchronisation automatique et les réponses. Vous pourrez vous reconnecter plus tard.",
      consentLabel:
        "J’autorise GBReplAi by Greotech à accéder aux données de ma fiche Google Business et à générer et publier des réponses aux avis en mon nom, conformément aux réglages d’automatisation ci‑dessus. Je comprends que je peux révoquer cet accès à tout moment depuis mon compte Google ou les paramètres GBReplAi.",
      consentError:
        "Vous devez autoriser explicitement GBReplAi à accéder et gérer votre fiche Google Business avant de vous connecter.",
    },
    billing: {
      title: "Facturation & offre",
      description: "Consultez votre offre actuelle et gérez la facturation.",
      goToBilling: "Aller à la facturation",
    },
    toast: {
      profileSaved: "Profil enregistré",
      responseSaved: "Paramètres de réponse enregistrés",
      error: "Une erreur s’est produite lors de l’enregistrement.",
      googleNotConfiguredTitle: "Connexion Google non configurée",
      googleNotConfiguredDesc:
        "Google Business n’est pas configuré côté serveur. Veuillez contacter le support.",
      googleConnectFailedTitle: "Échec de la connexion Google Business",
      googleConnectFailedDesc:
        "Veuillez réessayer ou contacter le support si le problème persiste.",
      googleDisconnectedTitle: "Déconnexion de Google Business réussie",
      googleDisconnectedDesc: "",
      googleDisconnectFailedTitle:
        "Échec de la déconnexion de Google Business",
      googleDisconnectFailedDesc:
        "Veuillez réessayer ou contacter le support si le problème persiste.",
    },
  },
  ar: {
    title: "الإعدادات",
    subtitle: "إدارة ملف نشاطك التجاري، وسلوك الردود، والتكاملات.",
    tabs: {
      profile: "الملف الشخصي",
      response: "سلوك الرد",
      google: "اتصال Google",
      billing: "الفوترة",
    },
    profile: {
      title: "ملف نشاطك التجاري",
      description:
        "تُستخدم هذه المعلومات لتخصيص ردود الذكاء الاصطناعي بما يناسب نشاطك.",
      businessNameLabel: "اسم النشاط التجاري",
      businessNameDescription:
        "كيف يجب أن يذكر GBReplAi نشاطك التجاري في الردود.",
      emailLabel: "البريد الإلكتروني",
      emailDescription:
        "نستخدم هذا البريد للتواصل معك بشأن حسابك والدعم.",
      saveButton: "حفظ الملف الشخصي",
    },
    response: {
      title: "سلوك الرد",
      description: "تحكم في كيفية إنشاء ونشر الردود على المراجعات.",
      toneLabel: "نبرة الرد",
      toneDescription:
        "اختر النبرة الافتراضية التي يجب أن يستخدمها GBReplAi في الردود.",
      autoHandleLabel: "معالجة المراجعات الجديدة تلقائيًا",
      autoHandleDescription:
        "عند التفعيل، يقوم GBReplAi تلقائيًا بإنشاء الردود أثناء المزامنة: يمكنه النشر التلقائي لمراجعات 4–5 نجوم وإنشاء مسودات لمراجعات 1–3 نجوم، حسب إعداد الموافقة لديك. عند التعطيل، يتم فقط استيراد المراجعات وتتولى أنت إدارة الردود يدويًا.",
      approveAllRepliesLabel: "الموافقة على جميع الردود قبل النشر",
      approveAllRepliesDescription:
        "عند التفعيل (ومع تفعيل المعالجة التلقائية)، سيتم حفظ جميع الردود التي يولدها الذكاء الاصطناعي لأي تقييم كمسودات لموافقتك. عند التعطيل، يتم نشر ردود التقييمات 4–5 نجوم تلقائيًا، بينما يتم إنشاء مسودات للتقييمات من 1 إلى 3 نجوم.",
      languageLabel: "لغة الردود",
      languageDescription:
        "اختر لغة ثابتة للردود أو دع GBReplAi يكتشف اللغة تلقائيًا من المراجعة.",
      templateLabel: "قالب رد مخصص (اختياري)",
      templateDescription:
        "يمكنك تحديد بنية مخصصة للردود. سيحاول الذكاء الاصطناعي اتباعها.",
      saveButton: "حفظ إعدادات الرد",
    },
    google: {
      title: "اتصال Google Business",
      description:
        "قم بتوصيل أو إدارة اتصالك بملف نشاطك التجاري على Google.",
      statusConnected: "متصل بـ Google Business",
      statusDisconnected: "غير متصل",
      connectButton: "ربط Google Business",
      reconnectButton: "إعادة الربط",
      disconnectButton: "فصل Google Business",
      disconnectWarning:
        "سيؤدي فصل الاتصال إلى إيقاف المزامنة التلقائية والردود. يمكنك إعادة الربط لاحقًا.",
      consentLabel:
        "أفوض GBReplAi by Greotech بالوصول إلى بيانات ملف نشاطي التجاري على Google وإنشاء ونشر ردود على المراجعات نيابةً عني وفق إعدادات الأتمتة أعلاه. أفهم أن بإمكاني إلغاء هذا الوصول في أي وقت من حسابي على Google أو من إعدادات GBReplAi.",
      consentError:
        "يجب أن تُفوض صراحةً GBReplAi للوصول إلى ملف نشاطك التجاري على Google وإدارته قبل الربط.",
    },
    billing: {
      title: "الفوترة والخطة",
      description: "عرض خطتك الحالية وإدارة الفوترة.",
      goToBilling: "الانتقال إلى صفحة الفوترة",
    },
    toast: {
      profileSaved: "تم حفظ الملف الشخصي",
      responseSaved: "تم حفظ إعدادات الرد",
      error: "حدث خطأ أثناء حفظ الإعدادات.",
      googleNotConfiguredTitle: "اتصال Google غير مهيأ",
      googleNotConfiguredDesc:
        "Google Business غير مُعد على الخادم. يرجى التواصل مع الدعم.",
      googleConnectFailedTitle: "فشل ربط Google Business",
      googleConnectFailedDesc:
        "يرجى المحاولة مرة أخرى أو التواصل مع الدعم إذا استمرّت المشكلة.",
      googleDisconnectedTitle: "تم فصل Google Business بنجاح",
      googleDisconnectedDesc: "",
      googleDisconnectFailedTitle: "فشل في فصل Google Business",
      googleDisconnectFailedDesc:
        "يرجى المحاولة مرة أخرى أو التواصل مع الدعم إذا استمرّت المشكلة.",
    },
  },
} as const;

const settingsSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
  email: z.string().email(),
  responseTone: z.enum(["professional", "friendly", "casual", "empathetic"]),
  autoHandleReviews: z.boolean(),
  approveAllReplies: z.boolean(),
  language: z.string(),
  responseTemplate: z.string().optional(),
});

export default function SettingsPage() {
  const { locale } = useLocale();
  const t = settingsCopy[locale] ?? settingsCopy.en;

  const { user, client, loading } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const clientAny = client as any;

  const clientDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "clients", user.uid);
  }, [firestore, user]);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      businessName: clientAny?.businessName || "",
      email: user?.email || "",
      autoHandleReviews: clientAny?.autoHandleReviews ?? true,
      approveAllReplies: clientAny?.approveAllReplies ?? false,
      responseTone: clientAny?.responseTone || "professional",
      language: clientAny?.language || "autodetect",
      responseTemplate: clientAny?.responseTemplate || "",
    },
  });

  // Explicit consent for Google Business profile management
  const [gbpConsent, setGbpConsent] = useState<boolean>(false);

  // Keep consent checkbox in sync (optional)
  useEffect(() => {
    setGbpConsent(Boolean(clientAny?.gbpConsent));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientAny?.gbpConsent]);

  // Keep form in sync when auth client changes
  useEffect(() => {
    if (!user || !clientAny) return;

    form.reset({
      businessName: clientAny.businessName || "",
      email: user.email || "",
      autoHandleReviews:
        typeof clientAny.autoHandleReviews === "boolean"
          ? clientAny.autoHandleReviews
          : true,
      approveAllReplies:
        typeof clientAny.approveAllReplies === "boolean"
          ? clientAny.approveAllReplies
          : false,
      responseTone: clientAny.responseTone || "professional",
      language: clientAny.language || "autodetect",
      responseTemplate: clientAny.responseTemplate || "",
    });
  }, [clientAny, user, form]);

  if (loading || !user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Loading settings...</p>
      </main>
    );
  }

  const handleSaveProfile = async (values: z.infer<typeof settingsSchema>) => {
    if (!clientDocRef) return;

    try {
      await updateDocumentNonBlocking(clientDocRef, {
        businessName: values.businessName,
        email: values.email,
      });

      toast({ title: t.toast.profileSaved });
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast({ variant: "destructive", title: t.toast.error });
    }
  };

  const handleSaveResponse = async (values: z.infer<typeof settingsSchema>) => {
    if (!clientDocRef) return;

    try {
      await updateDocumentNonBlocking(clientDocRef, {
        responseTone: values.responseTone,
        autoHandleReviews: values.autoHandleReviews,
        approveAllReplies: values.approveAllReplies,
        language: values.language,
        responseTemplate: values.responseTemplate || "",
      });

      toast({ title: t.toast.responseSaved });
    } catch (err) {
      console.error("Failed to save response settings:", err);
      toast({ variant: "destructive", title: t.toast.error });
    }
  };

  const handleConnectGoogle = async () => {
    if (!user) return;

    if (!gbpConsent) {
      toast({
        variant: "destructive",
        title: t.toast.googleNotConfiguredTitle,
        description: t.google.consentError,
      });
      return;
    }

    // Record consent + current automation settings before redirecting to Google
    try {
      if (clientDocRef) {
        const current = form.getValues();
        await updateDocumentNonBlocking(clientDocRef, {
          gbpConsent: true,
          gbpConsentAt: serverTimestamp(),
          gbpConsentSettings: {
            autoHandleReviews: current.autoHandleReviews,
            approveAllReplies: current.approveAllReplies,
            responseTone: current.responseTone,
            language: current.language,
          },
        });
      }
    } catch (err) {
      console.error("Failed to record GBP consent:", err);
      // Still allow OAuth; logging error is enough fallback.
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/google-business/auth-url", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json().catch(() => ({} as any));

      if (!res.ok || !json?.authUrl) {
        // If server is missing config, show the dedicated message
        const msg = String(json?.error || "");
        if (msg.toLowerCase().includes("missing")) {
          toast({
            variant: "destructive",
            title: t.toast.googleNotConfiguredTitle,
            description: t.toast.googleNotConfiguredDesc,
          });
          return;
        }
        throw new Error(json?.error || "Failed to start Google connection");
      }

      window.location.assign(json.authUrl);
    } catch (err) {
      console.error("Failed to start Google Business OAuth:", err);
      toast({
        variant: "destructive",
        title: t.toast.googleConnectFailedTitle,
        description: t.toast.googleConnectFailedDesc,
      });
    }
  };

  const handleDisconnectGoogle = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/google-business/disconnect", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to disconnect");

      // Optional: update local doc for immediate UI feedback
      if (clientDocRef) {
        await updateDocumentNonBlocking(clientDocRef, {
          googleConnectionStatus: "disconnected",
          googleDisconnectedAt: serverTimestamp(),
          googleDisconnectReason: "user_disconnect",
        });
      }

      toast({
        title: t.toast.googleDisconnectedTitle,
        description: t.toast.googleDisconnectedDesc,
      });
    } catch (err) {
      console.error("Failed to disconnect Google Business:", err);
      toast({
        variant: "destructive",
        title: t.toast.googleDisconnectFailedTitle,
        description: t.toast.googleDisconnectFailedDesc,
      });
    }
  };

  const googleStatus = clientAny?.googleConnectionStatus || "disconnected";

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </header>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">{t.tabs.profile}</TabsTrigger>
          <TabsTrigger value="response">{t.tabs.response}</TabsTrigger>
          <TabsTrigger value="google">{t.tabs.google}</TabsTrigger>
          <TabsTrigger value="billing">{t.tabs.billing}</TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t.profile.title}</CardTitle>
              <CardDescription>{t.profile.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(handleSaveProfile)}
                >
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.profile.businessNameLabel}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          {t.profile.businessNameDescription}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.profile.emailLabel}</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>{t.profile.emailDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">{t.profile.saveButton}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response behavior tab */}
        <TabsContent value="response">
          <Card>
            <CardHeader>
              <CardTitle>{t.response.title}</CardTitle>
              <CardDescription>{t.response.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(handleSaveResponse)}
                >
                  {/* Tone */}
                  <FormField
                    control={form.control}
                    name="responseTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.response.toneLabel}</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="casual">Casual</option>
                            <option value="empathetic">Empathetic</option>
                          </select>
                        </FormControl>
                        <FormDescription>{t.response.toneDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Auto-handle reviews */}
                  <FormField
                    control={form.control}
                    name="autoHandleReviews"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/50">
                        <div className="space-y-0.5 mb-2 sm:mb-0">
                          <FormLabel className="text-base">
                            {t.response.autoHandleLabel}
                          </FormLabel>
                          <FormDescription>
                            {t.response.autoHandleDescription}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Approve all replies before posting */}
                  <FormField
                    control={form.control}
                    name="approveAllReplies"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
                        <div className="space-y-0.5 mb-2 sm:mb-0">
                          <FormLabel className="text-base">
                            {t.response.approveAllRepliesLabel}
                          </FormLabel>
                          <FormDescription>
                            {t.response.approveAllRepliesDescription}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Language */}
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.response.languageLabel}</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="autodetect">Auto-detect from review</option>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="ar">العربية</option>
                          </select>
                        </FormControl>
                        <FormDescription>{t.response.languageDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Template */}
                  <FormField
                    control={form.control}
                    name="responseTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.response.templateLabel}</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="E.g. Start by thanking the customer, then mention the main point of their review, and end with an invitation to return."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>{t.response.templateDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">{t.response.saveButton}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google connection tab */}
        <TabsContent value="google">
          <Card>
            <CardHeader>
              <CardTitle>{t.google.title}</CardTitle>
              <CardDescription>{t.google.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                {googleStatus === "connected" ? (
                  <span className="text-emerald-600">{t.google.statusConnected}</span>
                ) : (
                  <span className="text-red-600">{t.google.statusDisconnected}</span>
                )}
              </p>

              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4"
                  checked={gbpConsent}
                  onChange={(e) => setGbpConsent(e.target.checked)}
                />
                <span>{t.google.consentLabel}</span>
              </label>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={handleConnectGoogle}
                  disabled={!gbpConsent}
                >
                  {googleStatus === "connected"
                    ? t.google.reconnectButton
                    : t.google.connectButton}
                </Button>

                {googleStatus === "connected" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDisconnectGoogle}
                  >
                    {t.google.disconnectButton}
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {t.google.disconnectWarning}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>{t.billing.title}</CardTitle>
              <CardDescription>{t.billing.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/billing">{t.billing.goToBilling}</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
