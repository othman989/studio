// src/app/(app)/admin/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/contexts/auth-context";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Coupon } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type PlanId = "free" | "starter" | "pro" | "enterprise";

type ClientSummary = {
  id: string;
  email?: string;
  businessName?: string;
  credits?: number;
  stats?: {
    totalReviews?: number;
    pendingReviews?: number;
    approvalRate?: number;
  };
  plan?: PlanId;
  subscriptionStatus?: "active" | "canceled" | "past_due" | "trialing";
  subscriptionEndAt?: any;
  createdAt?: any;
};

interface AdminStats {
  totalClients: number;
  activeClients: number;
  totalReviews: number;
  totalPending: number;
  avgApprovalRate: number;
  mrr: number;
  upcomingRenewals: number;
  churnLast30Days: number;
  updatedAt?: any;
}

function formatDate(ts?: any) {
  if (!ts) return "-";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    return d.toLocaleDateString();
  } catch {
    return "-";
  }
}

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading, role } = useAdmin();
  const { toast } = useToast();
  const [showMRRDetails, setShowMRRDetails] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);

  const [clients, setClients] = useState<ClientSummary[] | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);
  const [clientsError, setClientsError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !isAdmin) {
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);
        const token = await user.getIdToken();

        const [clientsRes, statsRes, couponsRes] = await Promise.all([
          fetch("/api/admin/clients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/coupons", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Clients
        if (!clientsRes.ok) {
          console.error("Failed to load clients via API:", clientsRes.status);
          setClientsError("Failed to load clients.");
          setClients([]);
        } else {
          const clientsJson = await clientsRes.json();
          setClients(clientsJson.clients || []);
        }

        // Stats
        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          setAdminStats(statsJson.stats || null);
        } else {
          console.error("Failed to load admin stats via API:", statsRes.status);
        }

        // Coupons
        if (couponsRes.ok) {
          const couponsJson = await couponsRes.json();
          const allCoupons: Coupon[] = couponsJson.coupons || [];
          setActiveCoupons(allCoupons.filter((c) => c.active));
        } else {
          console.error("Failed to load coupons via API:", couponsRes.status);
        }
      } catch (err) {
        console.error("Failed to load admin data via API:", err);
        setClientsError("Failed to load admin data.");
        setClients([]);
      } finally {
        setLoadingData(false);
      }
    };

    if (!adminLoading) {
      loadData();
    }
  }, [user, isAdmin, adminLoading]);

  const isLoading = adminLoading || loadingData;

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading admin data...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="space-y-3 p-4">
        <h1 className="text-xl font-semibold">Not authorized</h1>
        <p className="text-sm text-muted-foreground">
          You do not have access to the admin dashboard.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Go to your dashboard</Link>
        </Button>
      </div>
    );
  }

  // --- Admin actions: plan & credits ---

  const handleAdminChangePlan = async (client: ClientSummary) => {
    if (!user) return;

    const currentPlan = client.plan || "free";
    const input = window.prompt(
      `Enter new plan for ${client.businessName || client.email} (free / starter / pro / enterprise):`,
      currentPlan
    );
    if (!input) return;

    const plan = input.trim() as PlanId;
    const validPlans: PlanId[] = ["free", "starter", "pro", "enterprise"];
    if (!validPlans.includes(plan)) {
      toast({
        variant: "destructive",
        title: "Invalid plan",
        description:
          "Plan must be one of: free, starter, pro, or enterprise.",
      });
      return;
    }

    try {
      const token = await user.getIdToken();

      const res = await fetch(`/api/admin/clients/${client.id}/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to update plan.");
      }

      const data = await res.json();
      const newPlan = data.plan || plan;

      setClients((prev) =>
        prev
          ? prev.map((c) =>
              c.id === client.id ? { ...c, plan: newPlan } : c
            )
          : prev
      );

      toast({
        title: "Plan updated",
        description: `Client plan updated to "${newPlan}".`,
      });
    } catch (err) {
      console.error("Failed to change client plan:", err);
      toast({
        variant: "destructive",
        title: "Failed to change plan",
        description: (err as Error).message,
      });
    }
  };

  const handleAdminAddCredits = async (client: ClientSummary) => {
    if (!user) return;

    const input = window.prompt(
      `Adjust credits for ${client.businessName || client.email}.\n\nEnter a positive number to add, or a negative number to remove:`,
      "10"
    );
    if (!input) return;

    const delta = Number(input);
    if (!Number.isFinite(delta) || delta === 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a non-zero numeric value.",
      });
      return;
    }

    try {
      const token = await user.getIdToken();

      const res = await fetch(
        `/api/admin/clients/${client.id}/credits`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ delta }),
        }
      );

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to update credits.");
      }

      const data = await res.json();
      const newCredits = data.credits ?? (client.credits ?? 0) + delta;

      setClients((prev) =>
        prev
          ? prev.map((c) =>
              c.id === client.id ? { ...c, credits: newCredits } : c
            )
          : prev
      );

      toast({
        title: "Credits updated",
        description: `Client now has ${newCredits} credits.`,
      });
    } catch (err) {
      console.error("Failed to update client credits:", err);
      toast({
        variant: "destructive",
        title: "Failed to update credits",
        description: (err as Error).message,
      });
    }
  };

  // --- Admin action: global sync ---

  const handleAdminSyncAll = async () => {
    if (!user) return;

    if (
      !window.confirm(
        "Start a global sync of Google reviews for all clients? This may take several minutes."
      )
    ) {
      return;
    }

    setSyncingAll(true);
    try {
      const token = await user.getIdToken();

      const res = await fetch("/api/admin/sync-all-reviews", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to start global sync.");
      }

      const data = await res.json();
      const started = data.started ?? 0;
      const total = data.totalClients ?? started;

      toast({
        title: "Global sync started",
        description: `Triggered sync for ${started} of ${total} clients.`,
      });
    } catch (err) {
      console.error("Failed to start global sync:", err);
      toast({
        variant: "destructive",
        title: "Failed to start global sync",
        description: (err as Error).message,
      });
    } finally {
      setSyncingAll(false);
    }
  };

  // --- Render ---

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Admin dashboard
          </h1>
          <p className="text-muted-foreground">
            Logged in as {user.email} ({role || "admin"}). Stats last
            updated:{" "}
            {adminStats?.updatedAt ? formatDate(adminStats.updatedAt) : "N/A"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdminSyncAll}
          disabled={syncingAll}
        >
          {syncingAll ? "Syncing all clients..." : "Sync all clients now"}
        </Button>
      </div>

      {clientsError && (
        <p className="text-sm text-red-500">
          {clientsError}
        </p>
      )}

      {/* Top-level metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* MRR Card */}
        <Card
          className="cursor-pointer hover:bg-accent/40 transition-colors"
          onClick={() => setShowMRRDetails((v) => !v)}
        >
          <CardHeader>
            <CardTitle>MRR</CardTitle>
            <CardDescription>Monthly Recurring Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {adminStats?.mrr ?? 0} MAD
            </div>
            <p className="text-xs text-muted-foreground">
              Click to view growth, churn & renewals details.
            </p>
          </CardContent>
        </Card>

        {/* Total clients */}
        <Card
          className="cursor-pointer hover:bg-accent/40 transition-colors"
          onClick={() => router.push("/admin?view=clients")}
        >
          <CardHeader>
            <CardTitle>Total clients</CardTitle>
            <CardDescription>Number of client accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {adminStats?.totalClients ?? 0}
            </div>
          </CardContent>
        </Card>

        {/* Active clients */}
        <Card
          className="cursor-pointer hover:bg-accent/40 transition-colors"
          onClick={() => router.push("/admin?view=clients")}
        >
          <CardHeader>
            <CardTitle>Active clients</CardTitle>
            <CardDescription>Credits &gt; 0 or paid plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {adminStats?.activeClients ?? 0}
            </div>
          </CardContent>
        </Card>

        {/* Total reviews */}
        <Card
          className="cursor-pointer hover:bg-accent/40 transition-colors"
          onClick={() => router.push("/admin?view=clients")}
        >
          <CardHeader>
            <CardTitle>Total reviews</CardTitle>
            <CardDescription>Across all clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {adminStats?.totalReviews ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending: {adminStats?.totalPending ?? 0}
            </p>
          </CardContent>
        </Card>

        {/* Approval rate */}
        <Card>
          <CardHeader>
            <CardTitle>Average approval rate</CardTitle>
            <CardDescription>Across all clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(adminStats?.avgApprovalRate ?? 0).toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        {/* Upcoming renewals */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming renewals</CardTitle>
            <CardDescription>Subs ending in next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {adminStats?.upcomingRenewals ?? 0}
            </div>
          </CardContent>
        </Card>

        {/* Churn */}
        <Card>
          <CardHeader>
            <CardTitle>Churn (last 30 days)</CardTitle>
            <CardDescription>Canceled subs in last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {adminStats?.churnLast30Days ?? 0}
            </div>
          </CardContent>
        </Card>

        {/* Active coupons */}
        <Card
          className="cursor-pointer hover:bg-accent/40 transition-colors"
          onClick={() => router.push("/admin/coupons")}
        >
          <CardHeader>
            <CardTitle>Active coupons</CardTitle>
            <CardDescription>Currently usable codes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {activeCoupons.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MRR details panel */}
      {showMRRDetails && (
        <Card>
          <CardHeader>
            <CardTitle>MRR details</CardTitle>
            <CardDescription>
              High-level subscription metrics. Real MoM trends will be more
              accurate once billing is fully integrated.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Current MRR (MAD)
              </p>
              <p className="text-2xl font-bold">{adminStats?.mrr ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                MRR growth MoM
              </p>
              <p className="text-2xl font-bold">N/A</p>
              <p className="text-[11px] text-muted-foreground">
                Requires historical billing data; we&apos;ll compute this once
                Billing is live.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Churn (last 30 days)
              </p>
              <p className="text-2xl font-bold">
                {adminStats?.churnLast30Days ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Number of clients whose subscription ended in the last 30 days.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Upcoming renewals (30 days)
              </p>
              <p className="text-2xl font-bold">
                {adminStats?.upcomingRenewals ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Clients with subscriptionEndAt within the next 30 days.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clients overview table with admin actions */}
      <Card>
        <CardHeader>
          <CardTitle>Clients overview</CardTitle>
          <CardDescription>
            Key metrics per client and quick admin actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Total reviews</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ends at</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!clients || clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-sm">
                    No clients yet.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.businessName || "—"}</TableCell>
                    <TableCell className="text-xs">
                      {c.email || "—"}
                    </TableCell>
                    <TableCell>{c.plan || "free"}</TableCell>
                    <TableCell>{c.credits ?? 0}</TableCell>
                    <TableCell>{c.stats?.totalReviews ?? 0}</TableCell>
                    <TableCell>{c.stats?.pendingReviews ?? 0}</TableCell>
                    <TableCell>
                      {typeof c.stats?.approvalRate === "number"
                        ? `${c.stats.approvalRate.toFixed(0)}%`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {c.subscriptionStatus || "active"}
                    </TableCell>
                    <TableCell>
                      {formatDate(c.subscriptionEndAt)}
                    </TableCell>
                    <TableCell className="space-y-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdminChangePlan(c)}
                      >
                        Change plan
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdminAddCredits(c)}
                      >
                        Add credits
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
