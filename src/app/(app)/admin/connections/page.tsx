// src/app/(app)/admin/connections/page.tsx

"use client";

import { useEffect, useState, useMemo, useCallback } from "react";

import { useAuth } from "@/contexts/auth-context";
import { useLocale } from "@/contexts/locale-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Mail,
  MessageSquare,
  Wifi,
  WifiOff,
  Users,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

// Traductions
const connectionsCopy = {
  en: {
    title: "Google Connections Monitor",
    subtitle: "Monitor client Google Business Profile connections and identify issues.",
    searchPlaceholder: "Search by business name or email...",
    refreshButton: "Refresh",
    refreshing: "Refreshing...",
    statusConnected: "Connected",
    statusDisconnected: "Disconnected",
    statusError: "Error",
    statusUnknown: "Unknown",
    lastSync: "Last sync",
    never: "Never",
    errorLabel: "Error",
    noError: "No error",
    contactClient: "Contact",
    viewDetails: "View Details",
    sendEmail: "Send Email",
    sendWhatsApp: "WhatsApp",
    totalClients: "Total Clients",
    connectedClients: "Connected",
    disconnectedClients: "Disconnected",
    errorClients: "With Errors",
    brokenConnectionsTitle: "Broken Connections",
    brokenConnectionsDesc: "These clients need immediate attention to restore service.",
    healthyConnectionsTitle: "Healthy Connections",
    healthyConnectionsDesc: "These clients are properly synced with Google.",
    noBrokenConnections: "All connections are healthy!",
    noBrokenConnectionsDesc: "No disconnected or error-state clients found.",
    noClientsFound: "No clients found",
    loading: "Loading connections...",
    notAdmin: "Access Denied",
    notAdminDesc: "You must be an admin to view this page.",
    unknownBusiness: "Unknown Business",
    unknownEmail: "No email",
  },
  fr: {
    title: "Moniteur des connexions Google",
    subtitle: "Surveillez les connexions Google Business Profile des clients et identifiez les problèmes.",
    searchPlaceholder: "Rechercher par nom ou email...",
    refreshButton: "Actualiser",
    refreshing: "Actualisation...",
    statusConnected: "Connecté",
    statusDisconnected: "Déconnecté",
    statusError: "Erreur",
    statusUnknown: "Inconnu",
    lastSync: "Dernière sync",
    never: "Jamais",
    errorLabel: "Erreur",
    noError: "Aucune erreur",
    contactClient: "Contacter",
    viewDetails: "Voir détails",
    sendEmail: "Envoyer email",
    sendWhatsApp: "WhatsApp",
    totalClients: "Total clients",
    connectedClients: "Connectés",
    disconnectedClients: "Déconnectés",
    errorClients: "Avec erreurs",
    brokenConnectionsTitle: "Connexions rompues",
    brokenConnectionsDesc: "Ces clients nécessitent une attention immédiate pour rétablir le service.",
    healthyConnectionsTitle: "Connexions saines",
    healthyConnectionsDesc: "Ces clients sont correctement synchronisés avec Google.",
    noBrokenConnections: "Toutes les connexions sont saines !",
    noBrokenConnectionsDesc: "Aucun client déconnecté ou en erreur n'a été trouvé.",
    noClientsFound: "Aucun client trouvé",
    loading: "Chargement des connexions...",
    notAdmin: "Accès refusé",
    notAdminDesc: "Vous devez être administrateur pour voir cette page.",
    unknownBusiness: "Entreprise inconnue",
    unknownEmail: "Pas d'email",
  },
  ar: {
    title: "مراقب اتصالات Google",
    subtitle: "راقب اتصالات Google Business Profile للعملاء وحدد المشاكل.",
    searchPlaceholder: "البحث بالاسم أو البريد الإلكتروني...",
    refreshButton: "تحديث",
    refreshing: "جاري التحديث...",
    statusConnected: "متصل",
    statusDisconnected: "غير متصل",
    statusError: "خطأ",
    statusUnknown: "غير معروف",
    lastSync: "آخر مزامنة",
    never: "أبدًا",
    errorLabel: "خطأ",
    noError: "لا يوجد خطأ",
    contactClient: "اتصال",
    viewDetails: "عرض التفاصيل",
    sendEmail: "إرسال بريد",
    sendWhatsApp: "واتساب",
    totalClients: "إجمالي العملاء",
    connectedClients: "متصلون",
    disconnectedClients: "غير متصلين",
    errorClients: "مع أخطاء",
    brokenConnectionsTitle: "الاتصالات المعطلة",
    brokenConnectionsDesc: "يحتاج هؤلاء العملاء إلى اهتمام فوري لاستعادة الخدمة.",
    healthyConnectionsTitle: "الاتصالات السليمة",
    healthyConnectionsDesc: "هؤلاء العملاء متزامنون بشكل صحيح مع Google.",
    noBrokenConnections: "جميع الاتصالات سليمة!",
    noBrokenConnectionsDesc: "لم يتم العثور على عملاء غير متصلين أو في حالة خطأ.",
    noClientsFound: "لم يتم العثور على عملاء",
    loading: "جاري تحميل الاتصالات...",
    notAdmin: "الوصول مرفوض",
    notAdminDesc: "يجب أن تكون مسؤولاً لعرض هذه الصفحة.",
    unknownBusiness: "نشاط غير معروف",
    unknownEmail: "لا يوجد بريد",
  },
} as const;


interface ClientConnection {
  id: string;
  businessName: string;
  email: string;
  googleConnectionStatus: "connected" | "disconnected" | "error" | null;
  googleLastSyncAt: any;
  googleLastSyncError: string | null;
  googleRefreshToken: string | null;
  createdAt: any;
  plan: string;
}

interface ConnectionStats {
  total: number;
  connected: number;
  disconnected: number;
  error: number;
}

type ConnectionsCopy = (typeof connectionsCopy)[keyof typeof connectionsCopy];

const ClientRow = ({ client, t }: { client: ClientConnection; t: ConnectionsCopy }) => {

    const formatDate = (timestamp: any): string => {
    if (!timestamp) return t.never;
    try {
      const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp.seconds * 1000);
      return format(date, "PPp");
    } catch {
      return t.never;
    }
  };

  const getStatusBadge = (client: ClientConnection) => {
    const status = client.googleConnectionStatus;
    const hasToken = !!client.googleRefreshToken;

    if (status === "connected" && hasToken) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          <CheckCircle className="mr-1 h-3 w-3" />
          {t.statusConnected}
        </Badge>
      );
    } else if (status === "error") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
          <AlertCircle className="mr-1 h-3 w-3" />
          {t.statusError}
        </Badge>
      );
    } else if (status === "disconnected" || !hasToken) {
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          {t.statusDisconnected}
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary">
          {t.statusUnknown}
        </Badge>
      );
    }
  };

  return (
    <div
      className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium">
            {client.businessName || t.unknownBusiness}
          </p>
          {getStatusBadge(client)}
          <Badge variant="outline" className="text-xs">
            {client.plan}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {client.email || t.unknownEmail}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            {t.lastSync}: {formatDate(client.googleLastSyncAt)}
          </span>
          {client.googleLastSyncError && (
            <span className="text-red-600">
              {t.errorLabel}: {client.googleLastSyncError.slice(0, 50)}
              {client.googleLastSyncError.length > 50 ? "..." : ""}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {client.email && (
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href={`mailto:${client.email}`}>
              <Mail className="mr-1 h-3 w-3" />
              {t.sendEmail}
            </a>
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <a
            href={`https://wa.me/?text=Hello, we noticed your Google Business connection needs attention. Please reconnect at https://gbreplai.greotech.com/settings`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare className="mr-1 h-3 w-3" />
            {t.sendWhatsApp}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default function AdminConnectionsPage() {
  const { locale } = useLocale();
  const t = connectionsCopy[locale];
  const { user, isAdmin } = useAuth();

  const [clients, setClients] = useState<ClientConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClients = useCallback(async () => {
    if (!user || !isAdmin) return;

    try {
      setLoading(true);

      const token = await user.getIdToken();

      const res = await fetch("/api/admin/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch clients via API:", res.status);
        setClients([]);
        return;
      }

      const data = await res.json();
      const clientsData: ClientConnection[] = data.clients || [];
      setClients(clientsData);
    } catch (error) {
      console.error("Failed to fetch clients via API:", error);
      setClients([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, isAdmin]);


  useEffect(() => {
    if (isAdmin === true) {
      fetchClients();
    } else if (isAdmin === false) {
      setLoading(false);
    }
  }, [fetchClients, isAdmin]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClients();
  };

  const { brokenClients, healthyClients, stats } = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    const filtered = clients.filter(c => 
        searchTerm === "" ||
        c.businessName.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower)
    );

    const broken = filtered.filter(c => c.googleConnectionStatus === 'disconnected' || c.googleConnectionStatus === 'error' || !c.googleRefreshToken);
    const healthy = filtered.filter(c => c.googleConnectionStatus === 'connected' && !!c.googleRefreshToken);
    
    const stats: ConnectionStats = {
        total: clients.length,
        connected: clients.filter((c) => c.googleConnectionStatus === "connected" && !!c.googleRefreshToken).length,
        disconnected: clients.filter(
          (c) =>
            c.googleConnectionStatus === "disconnected" ||
            (!c.googleRefreshToken && c.googleConnectionStatus !== "connected")
        ).length,
        error: clients.filter((c) => c.googleConnectionStatus === "error").length,
    };

    return { brokenClients: broken, healthyClients: healthy, stats };
  }, [clients, searchTerm]);


  if (loading || isAdmin === null) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold">{t.notAdmin}</h1>
        <p className="text-muted-foreground mt-2">{t.notAdminDesc}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? t.refreshing : t.refreshButton}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.totalClients}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.connectedClients}
            </CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.connected}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.disconnectedClients}
            </CardTitle>
            <WifiOff className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.disconnected}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.errorClients}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.error}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
      </div>

      {/* Broken Connections */}
      <Card className="border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-600">{t.brokenConnectionsTitle}</CardTitle>
          <CardDescription>{t.brokenConnectionsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {brokenClients.length === 0 ? (
            <div className="py-10 text-center">
                 <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <p className="text-lg font-medium">{t.noBrokenConnections}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.noBrokenConnectionsDesc}
                  </p>
            </div>
          ) : (
            <div className="divide-y rounded-lg border">
                {brokenClients.map(client => <ClientRow key={client.id} client={client} t={t} />)}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Healthy Connections */}
       <Card>
        <CardHeader>
          <CardTitle>{t.healthyConnectionsTitle}</CardTitle>
          <CardDescription>{t.healthyConnectionsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {healthyClients.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">{t.noClientsFound}</div>
          ) : (
             <div className="divide-y rounded-lg border">
                {healthyClients.map(client => <ClientRow key={client.id} client={client} t={t} />)}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
