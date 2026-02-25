// src/app/(app)/dashboard/page.tsx
"use client";

import { useLocale } from "@/contexts/locale-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import type { Review } from "@/lib/types";
import { useMemo, useState, useCallback, useEffect } from "react";
import {
  CreditCard,
  MessageSquare,
  Clock,
  CheckCircle,
  RefreshCw,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ReviewsDataTable } from "@/components/dashboard/reviews-data-table";
import { getColumns } from "@/components/dashboard/columns";
import Link from "next/link";
import { ReviewModal } from "@/components/reviews/review-modal";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Nombre d'avis par page (pagination)
const REVIEWS_PER_PAGE = 5;

// Traductions intégrées pour le dashboard
const dashboardCopy = {
  en: {
    title: "Dashboard",
    subtitle: "See how GBReplAi is handling your Google reviews.",
    creditsLabel: "Credits remaining",
    creditsDescription: "Used for AI-generated replies.",
    creditsLow: "Your credits are running low. Top up soon!",
    totalReviewsLabel: "Total reviews",
    totalReviewsDesc: "From your Google Business Profile.",
    pendingLabel: "Pending reviews",
    pendingDesc: "Awaiting your approval to publish.",
    approvalRateLabel: "Approval rate",
    approvalRateDesc: "Of all AI-generated replies.",
    autoRepliesLabel: "Auto replies this month",
    autoRepliesDesc: "AI replies posted automatically.",
    manualRepliesLabel: "Manual replies this month",
    manualRepliesDesc: "Replies you generated or edited manually.",
    lowDraftsLabel: "Low-rating AI drafts",
    lowDraftsDesc: "AI replies awaiting approval for 1–3★ reviews.",
    welcomeFallbackName: "User",
    summaryLine: "Here's a summary of your business profile.",
    allLocations: "All locations",
    allStatuses: "All statuses",
    filterByLocation: "Filter by location",
    filterByStatus: "Filter by status",
    recentReviewsTitle: "Recent Reviews",
    recentReviewsDesc: "Manage and respond to your latest customer reviews.",
    viewAll: "View all",
    goToReviews: "Go to Reviews",
    freePlanTitle: "You are on the free plan.",
    freePlanDesc:
      "Upgrade to unlock more AI responses and multi-location features.",
    lowCreditsTitle: "Your credits are running low.",
    lowCreditsDesc:
      "Upgrade or top up your credits to keep automatic replies active.",
    viewPlans: "View plans",
    contactWhatsApp: "Contact us on WhatsApp",
    errorTitle: "Failed to load reviews",
    errorDesc:
      "There was an issue fetching your reviews. Please check your connection and try again.",
    previousPage: "Previous",
    nextPage: "Next",
    reviews: "reviews",
    statusNew: "New",
    statusPending: "Pending",
    statusPosted: "Posted",
    statusFailed: "Failed",
    statusUnreplied: "Unreplied",
    syncReviews: "Sync Reviews",
    syncing: "Syncing...",
    syncSuccess: "Review sync started.",
    syncError: "Failed to start sync.",
    connectGoogleTitle: "Connect your Google Business Profile",
    connectGoogleDesc:
      "Connect now to sync your reviews automatically and reply with AI.",
    connectGoogleButton: "Connect Google Business",
  },
  fr: {
    title: "Tableau de bord",
    subtitle: "Suivez comment GBReplAi gère vos avis Google.",
    creditsLabel: "Crédits restants",
    creditsDescription: "Utilisés pour les réponses générées par l'IA.",
    creditsLow: "Vos crédits sont bientôt épuisés. Rechargez bientôt !",
    totalReviewsLabel: "Avis au total",
    totalReviewsDesc: "Depuis votre profil Google Business.",
    pendingLabel: "Avis en attente",
    pendingDesc: "En attente de votre approbation pour publication.",
    approvalRateLabel: "Taux d'approbation",
    approvalRateDesc: "De toutes les réponses générées par l'IA.",
    autoRepliesLabel: "Réponses auto ce mois-ci",
    autoRepliesDesc: "Réponses IA publiées automatiquement.",
    manualRepliesLabel: "Réponses manuelles ce mois-ci",
    manualRepliesDesc:
      "Réponses que vous avez générées ou modifiées manuellement.",
    lowDraftsLabel: "Brouillons IA (avis 1–3★)",
    lowDraftsDesc:
      "Réponses IA en attente d'approbation pour les avis 1–3★.",
    welcomeFallbackName: "Utilisateur",
    summaryLine: "Voici un aperçu de votre profil d'établissement.",
    allLocations: "Tous les lieux",
    allStatuses: "Tous les statuts",
    filterByLocation: "Filtrer par lieu",
    filterByStatus: "Filtrer par statut",
    recentReviewsTitle: "Avis récents",
    recentReviewsDesc: "Gérez et répondez à vos derniers avis clients.",
    viewAll: "Voir tout",
    goToReviews: "Aller aux avis",
    freePlanTitle: "Vous êtes sur le plan gratuit.",
    freePlanDesc:
      "Passez à un plan supérieur pour débloquer plus de réponses IA et les fonctionnalités multi-établissements.",
    lowCreditsTitle: "Vos crédits sont bientôt épuisés.",
    lowCreditsDesc:
      "Passez à un plan supérieur ou rechargez vos crédits pour maintenir les réponses automatiques actives.",
    viewPlans: "Voir les plans",
    contactWhatsApp: "Contactez-nous sur WhatsApp",
    errorTitle: "Échec du chargement des avis",
    errorDesc:
      "Un problème est survenu lors de la récupération de vos avis. Veuillez vérifier votre connexion et réessayer.",
    previousPage: "Précédent",
    nextPage: "Suivant",
    reviews: "avis",
    statusNew: "Nouveau",
    statusPending: "En attente",
    statusPosted: "Publié",
    statusFailed: "Échoué",
    statusUnreplied: "Sans réponse",
    syncReviews: "Synchroniser les avis",
    syncing: "Synchronisation...",
    syncSuccess: "La synchronisation des avis a commencé.",
    syncError: "Échec du démarrage de la synchronisation.",
    connectGoogleTitle: "Connectez votre fiche Google Business",
    connectGoogleDesc:
      "Connectez-vous maintenant pour synchroniser automatiquement vos avis et répondre avec l’IA.",
    connectGoogleButton: "Connecter Google Business",
  },
  ar: {
    title: "لوحة التحكم",
    subtitle: "شاهد كيف يتعامل GBReplAi مع مراجعات Google الخاصة بك.",
    creditsLabel: "الأرصدة المتبقية",
    creditsDescription: "تُستخدم للردود المُنشأة بالذكاء الاصطناعي.",
    creditsLow: "أرصدتك على وشك النفاد. قم بالشحن قريباً!",
    totalReviewsLabel: "إجمالي المراجعات",
    totalReviewsDesc: "من ملفك التجاري على Google.",
    pendingLabel: "مراجعات قيد الانتظار",
    pendingDesc: "في انتظار موافقتك للنشر.",
    approvalRateLabel: "معدل الموافقة",
    approvalRateDesc: "من جميع الردود المُنشأة بالذكاء الاصطناعي.",
    autoRepliesLabel: "الردود التلقائية هذا الشهر",
    autoRepliesDesc: "ردود الذكاء الاصطناعي المنشورة تلقائياً.",
    manualRepliesLabel: "الردود اليدوية هذا الشهر",
    manualRepliesDesc: "الردود التي أنشأتها أو عدلتها يدوياً.",
    lowDraftsLabel: "مسودات آلية (مراجعات 1–3 نجوم)",
    lowDraftsDesc:
      "ردود الذكاء الاصطناعي في انتظار الموافقة للمراجعات 1–3 نجوم.",
    welcomeFallbackName: "مستخدم",
    summaryLine: "إليك ملخص عن ملف نشاطك التجاري.",
    allLocations: "كل المواقع",
    allStatuses: "كل الحالات",
    filterByLocation: "تصفية حسب الموقع",
    filterByStatus: "تصفية حسب الحالة",
    recentReviewsTitle: "أحدث المراجعات",
    recentReviewsDesc:
      "قم بإدارة والرد على أحدث مراجعات عملائك.",
    viewAll: "عرض الكل",
    goToReviews: "الانتقال إلى المراجعات",
    freePlanTitle: "أنت على الخطة المجانية.",
    freePlanDesc:
      "قم بالترقية لفتح المزيد من ردود الذكاء الاصطناعي وميزات المواقع المتعددة.",
    lowCreditsTitle: "أرصدتك على وشك النفاد.",
    lowCreditsDesc:
      "قم بالترقية أو اشحن أرصدتك للحفاظ على الردود التلقائية نشطة.",
    viewPlans: "عرض الخطط",
    contactWhatsApp: "تواصل معنا على WhatsApp",
    errorTitle: "فشل في تحميل المراجعات",
    errorDesc:
      "حدثت مشكلة في جلب مراجعاتك. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
    previousPage: "السابق",
    nextPage: "التالي",
    reviews: "مراجعات",
    statusNew: "جديد",
    statusPending: "قيد الانتظار",
    statusPosted: "منشور",
    statusFailed: "فشل",
    statusUnreplied: "بدون رد",
    syncReviews: "مزامنة المراجعات",
    syncing: "جاري المزامنة...",
    syncSuccess: "بدأت مزامنة المراجعات.",
    syncError: "فشل بدء المزامنة.",
    connectGoogleTitle: "اربط حساب نشاطك التجاري على Google",
    connectGoogleDesc:
      "اتصل الآن لمزامنة المراجعات تلقائيًا والرد عليها باستخدام الذكاء الاصطناعي.",
    connectGoogleButton: "ربط Google Business",
  },
} as const;

interface ClientStats {
  totalReviews: number;
  pendingReviews: number;
  postedReviews: number;
  averageRating: number;
  approvalRate: number;
  autoRepliesThisMonth: number;
  manualRepliesThisMonth: number;
  lowRatingDraftsThisMonth: number;
  updatedAt?: any;
}

export default function Dashboard() {
  const { locale } = useLocale();
  const t = dashboardCopy[locale];
  const { client, user, loading } = useAuth();
  const { toast } = useToast();

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSyncDone, setAutoSyncDone] = useState(false);

  const [selectedLocationId, setSelectedLocationId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // API pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCursors, setPageCursors] = useState<Record<number, string | null>>({ 1: null });
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Data
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [locations, setLocations] = useState<any[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  // Auto-sync once
  useEffect(() => {
    if (!user || autoSyncDone) return;

    setAutoSyncDone(true);

    (async () => {
      setIsSyncing(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/client/reviews/sync", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const msg = data.error || "Sync failed.";
          if (!msg.toLowerCase().includes("recently synced")) {
            toast({ variant: "destructive", title: t.syncError, description: msg });
          }
        }
      } catch (err) {
        console.error("Auto-sync failed:", err);
        toast({
          variant: "destructive",
          title: t.syncError,
          description: (err as Error).message,
        });
      } finally {
        setIsSyncing(false);
      }
    })();
  }, [user, autoSyncDone, toast, t.syncError]);

  // Fetch locations
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    (async () => {
      try {
        setLocationsLoading(true);
        const token = await user.getIdToken();
        const res = await fetch("/api/client/locations", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "Failed to load locations");
        if (!cancelled) setLocations(json.locations || []);
      } catch (e) {
        console.error("Failed to load locations:", e);
        if (!cancelled) setLocations([]);
      } finally {
        if (!cancelled) setLocationsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const fetchReviewsPage = useCallback(
    async (page: number) => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const token = await user.getIdToken();

        const params = new URLSearchParams();
        params.set("limit", String(REVIEWS_PER_PAGE));
        params.set("locationId", selectedLocationId);
        params.set("status", selectedStatus);

        const cursor = pageCursors[page] ?? null;
        if (cursor) params.set("cursor", cursor);

        const res = await fetch(`/api/client/reviews?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "Failed to load reviews");

        const pageReviews = (json.reviews || []) as Review[];
        const newNextCursor = (json.nextCursor || null) as string | null;

        setReviews(pageReviews);
        setNextCursor(newNextCursor);

        // Store cursor for next page
        setPageCursors((prev) => ({ ...prev, [page + 1]: newNextCursor }));
      } catch (e: any) {
        const err = e instanceof Error ? e : new Error(e?.message || "Failed to load reviews");
        setError(err);
        setReviews([]);
        setNextCursor(null);
      } finally {
        setIsLoading(false);
      }
    },
    [user, selectedLocationId, selectedStatus, pageCursors]
  );

  useEffect(() => {
    if (!user) return;
    fetchReviewsPage(currentPage);
  }, [user, currentPage, fetchReviewsPage]);

  const handleOpenModal = useCallback((review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedReview(null);
  }, []);

  const handleSyncReviews = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/client/reviews/sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Sync failed.");
      }

      toast({ title: t.syncSuccess });

      // Reset pagination and refetch page 1
      setCurrentPage(1);
      setPageCursors({ 1: null });
      setNextCursor(null);
      await fetchReviewsPage(1);
    } catch (err) {
      toast({
        variant: "destructive",
        title: t.syncError,
        description: (err as Error).message,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConnectGoogle = () => {
    if (!user) return;

    const clientId = process.env.GBP_CLIENT_ID; // recommended (server-only)

    if (!clientId) {
      toast({
        variant: "destructive",
        title: "Google connection not configured",
        description:
          "The Google Business client ID is missing. Please contact support.",
      });
      return;
    }

    const redirectUri =
      "https://gbreplai.greotech.com/api/google-business/callback";

    const scopes = [
      "https://www.googleapis.com/auth/business.manage",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "openid",
    ].join(" ");

    const state = btoa(JSON.stringify({ uid: user.uid }));

    const authUrl =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: scopes,
        access_type: "offline",
        include_granted_scopes: "true",
        prompt: "consent",
        state,
      }).toString();

    window.location.href = authUrl;
  };

  const handleFilterChange = useCallback(
    (filterType: "location" | "status", value: string) => {
      // Reset API pagination
      setCurrentPage(1);
      setPageCursors({ 1: null });
      setNextCursor(null);

      if (filterType === "location") setSelectedLocationId(value);
      else setSelectedStatus(value);
    },
    []
  );

  const handleNextPage = useCallback(() => {
    if (nextCursor) setCurrentPage((prev) => prev + 1);
  }, [nextCursor]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const columns = useMemo(() => getColumns(handleOpenModal), [handleOpenModal]);

  const stats: ClientStats = useMemo(() => {
    return (client as any)?.stats || {
      totalReviews: 0,
      pendingReviews: 0,
      postedReviews: 0,
      averageRating: 0,
      approvalRate: 0,
      autoRepliesThisMonth: 0,
      manualRepliesThisMonth: 0,
      lowRatingDraftsThisMonth: 0,
    };
  }, [client]);

  const credits = client?.credits ?? 0;
  const plan = (client as any)?.plan ?? "free";
  const lowCredits = credits < 10;
  const showBanner = plan === "free" || lowCredits;

  const isPageLoading = loading || !client;
  const hasMoreReviews = Boolean(nextCursor);
  const canGoPrevious = currentPage > 1;

  const isGoogleConnected = Boolean(
    (client as any)?.googleConnectionStatus === "connected" ||
      (client as any)?.googleRefreshToken
  );

  if (isPageLoading) return <DashboardSkeleton />;

  const firstName =
    user?.displayName?.split(" ")[0] || t.welcomeFallbackName;

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t.title}, {firstName}!
            </h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
          <Button onClick={handleSyncReviews} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? t.syncing : t.syncReviews}
          </Button>
        </div>

        {showBanner && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs sm:text-sm dark:bg-amber-900/20 dark:border-amber-800">
            <p className="font-medium text-amber-800 dark:text-amber-200">
              {plan === "free" ? t.freePlanTitle : t.lowCreditsTitle}
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              {plan === "free" ? t.freePlanDesc : t.lowCreditsDesc}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" asChild>
                <a href="/billing">{t.viewPlans}</a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href="https://wa.me/212696974422">{t.contactWhatsApp}</a>
              </Button>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t.errorTitle}</AlertTitle>
            <AlertDescription>{t.errorDesc}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card
            className={
              credits < 10
                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900"
                : ""
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.creditsLabel}</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{credits}</div>
              <p className="text-xs text-muted-foreground">
                {credits < 10 ? t.creditsLow : t.creditsDescription}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.totalReviewsLabel}</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <p className="text-xs text-muted-foreground">{t.totalReviewsDesc}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.pendingLabel}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
              <p className="text-xs text-muted-foreground">{t.pendingDesc}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.approvalRateLabel}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${stats.approvalRate >= 75 ? "text-green-600" : "text-red-600"}`}
              >
                {stats.approvalRate.toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground">{t.approvalRateDesc}</p>
            </CardContent>
          </Card>
        </div>

        {!isGoogleConnected && (
          <Card className="border-dashed border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle>{t.connectGoogleTitle}</CardTitle>
              <CardDescription>{t.connectGoogleDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleConnectGoogle}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {t.connectGoogleButton}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{t.recentReviewsTitle}</CardTitle>
              <CardDescription>{t.recentReviewsDesc}</CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={selectedLocationId}
                onValueChange={(val) => handleFilterChange("location", val)}
                disabled={locationsLoading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t.filterByLocation} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allLocations}</SelectItem>
                  {locations.map((loc: any) => {
                    const label =
                      loc.name ||
                      loc.locationName ||
                      loc.displayName ||
                      loc.title ||
                      loc.googleLocationName ||
                      loc.id ||
                      "Unnamed location";
                    return (
                      <SelectItem key={loc.id} value={loc.id}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select
                value={selectedStatus}
                onValueChange={(val) => handleFilterChange("status", val)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t.filterByStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatuses}</SelectItem>
                  <SelectItem value="new">{t.statusNew}</SelectItem>
                  <SelectItem value="pending">{t.statusPending}</SelectItem>
                  <SelectItem value="posted">{t.statusPosted}</SelectItem>
                  <SelectItem value="post_failed">{t.statusFailed}</SelectItem>
                  <SelectItem value="unreplied">{t.statusUnreplied}</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/reviews">
                    <Eye className="mr-2 h-4 w-4" />
                    {t.viewAll}
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/reviews">{t.goToReviews}</Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ReviewsDataTable columns={columns} data={reviews} isLoading={isLoading} />

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {reviews.length} {t.reviews}
                {currentPage > 1 ? ` (Page ${currentPage})` : ""}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={!canGoPrevious}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t.previousPage}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!hasMoreReviews}
                >
                  {t.nextPage}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ReviewModal review={selectedReview} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
