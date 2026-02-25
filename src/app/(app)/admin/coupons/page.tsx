// src/app/(app)/admin/coupons/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useAdmin } from "@/hooks/use-admin";
import type { Coupon } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function AdminCouponsPage() {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();

  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number | "">("");
  const [maxUses, setMaxUses] = useState<number | "">("");
  const [partnerId, setPartnerId] = useState("");
  const [active, setActive] = useState(true);
  const [creating, setCreating] = useState(false);

  // Load coupons from backend
  useEffect(() => {
    const load = async () => {
      if (!user || !isAdmin) {
        setLoadingCoupons(false);
        return;
      }
      try {
        setLoadingCoupons(true);
        setLoadError(null);

        const token = await user.getIdToken();

        const res = await fetch("/api/admin/coupons", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to load coupons via API:", res.status);
          setLoadError("Failed to load coupons.");
          setCoupons([]);
          return;
        }

        const json = await res.json();
        setCoupons(json.coupons || []);
      } catch (err) {
        console.error("Error loading coupons via API:", err);
        setLoadError("Failed to load coupons.");
        setCoupons([]);
      } finally {
        setLoadingCoupons(false);
      }
    };

    if (!adminLoading) {
      load();
    }
  }, [user, isAdmin, adminLoading]);

  if (adminLoading) {
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
          You do not have access to the coupons admin page.
        </p>
      </div>
    );
  }

  const handleCreateCoupon = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "Missing code",
        description: "Please enter a coupon code.",
      });
      return;
    }

    if (discountPercent === "" || discountPercent <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid discount",
        description: "Please enter a positive discount percentage.",
      });
      return;
    }

    setCreating(true);
    try {
      const upperCode = code.trim().toUpperCase();
      const token = await user.getIdToken();

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: upperCode,
          discountPercent: Number(discountPercent),
          maxUses: maxUses === "" ? null : Number(maxUses),
          partnerId: partnerId.trim() || null,
          active,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not create coupon.");
      }

      const data = await res.json();
      const newCoupon: Coupon = data.coupon;

      setCoupons((prev) =>
        prev ? [newCoupon, ...prev] : [newCoupon]
      );

      setCode("");
      setDiscountPercent("");
      setMaxUses("");
      setPartnerId("");
      setActive(true);

      toast({
        title: "Coupon created",
        description: `Coupon ${upperCode} has been created successfully.`,
      });
    } catch (err) {
      console.error("Failed to create coupon", err);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (err as Error).message ||
          "Could not create coupon. Please try again.",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const token = await user.getIdToken();
      const newActive = !coupon.active;

      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: coupon.id,
          active: newActive,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not update coupon.");
      }

      const data = await res.json();
      const updated: Coupon = data.coupon;

      setCoupons((prev) =>
        prev
          ? prev.map((c) =>
              c.id === updated.id ? updated : c
            )
          : prev
      );

      toast({
        title: newActive ? "Coupon activated" : "Coupon deactivated",
        description: coupon.code,
      });
    } catch (err) {
      console.error("Failed to toggle coupon", err);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (err as Error).message ||
          "Could not update coupon status.",
      });
    }
  };

  const handleDeleteCoupon = async (coupon: Coupon) => {
    if (!confirm(`Delete coupon ${coupon.code}? This cannot be undone.`)) {
      return;
    }
    try {
      const token = await user.getIdToken();

      const res = await fetch("/api/admin/coupons", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: coupon.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not delete coupon.");
      }

      setCoupons((prev) =>
        prev ? prev.filter((c) => c.id !== coupon.id) : prev
      );

      toast({
        title: "Coupon deleted",
        description: coupon.code,
      });
    } catch (err) {
      console.error("Failed to delete coupon", err);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (err as Error).message ||
          "Could not delete coupon.",
      });
    }
  };

  const handleEditCoupon = async (coupon: Coupon) => {
    const newDiscountStr = window.prompt(
      `New discount % for ${coupon.code} (current: ${coupon.discountPercent})`,
      String(coupon.discountPercent)
    );
    if (!newDiscountStr) return;
    const newDiscount = Number(newDiscountStr);
    if (isNaN(newDiscount) || newDiscount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid discount",
        description: "Please enter a positive number.",
      });
      return;
    }

    const newMaxStr = window.prompt(
      `New max uses for ${coupon.code} (current: ${
        coupon.maxUses ?? "unlimited"
      }, empty for unlimited)`,
      coupon.maxUses != null ? String(coupon.maxUses) : ""
    );
    let newMaxUses: number | null = null;
    if (newMaxStr !== null && newMaxStr !== "") {
      const val = Number(newMaxStr);
      if (isNaN(val) || val <= 0) {
        toast({
          variant: "destructive",
          title: "Invalid max uses",
          description:
            "Please enter a positive number or leave empty.",
        });
        return;
      }
      newMaxUses = val;
    }

    try {
      const token = await user.getIdToken();

      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: coupon.id,
          discountPercent: newDiscount,
          maxUses: newMaxUses,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not update coupon.");
      }

      const data = await res.json();
      const updated: Coupon = data.coupon;

      setCoupons((prev) =>
        prev
          ? prev.map((c) =>
              c.id === updated.id ? updated : c
            )
          : prev
      );

      toast({
        title: "Coupon updated",
        description: coupon.code,
      });
    } catch (err) {
      console.error("Failed to update coupon", err);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (err as Error).message ||
          "Could not update coupon.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
        <p className="text-muted-foreground">
          Create and manage coupon codes for your clients and partners.
        </p>
      </div>

      {/* Create coupon form */}
      <Card>
        <CardHeader>
          <CardTitle>Create a new coupon</CardTitle>
          <CardDescription>
            Generate codes to offer discounts or free credits to clients.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon code</Label>
            <Input
              id="code"
              placeholder="PARTNER10"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use only letters and numbers. It will be stored in UPPERCASE.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              min={1}
              max={100}
              value={discountPercent}
              onChange={(e) =>
                setDiscountPercent(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUses">Max uses (optional)</Label>
            <Input
              id="maxUses"
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) =>
                setMaxUses(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partnerId">
              Partner / Campaign (optional)
            </Label>
            <Input
              id="partnerId"
              placeholder="agency_xyz"
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3 md:col-span-2">
            <div>
              <Label className="text-sm">Active</Label>
              <p className="text-xs text-muted-foreground">
                Inactive coupons can no longer be redeemed.
              </p>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button onClick={handleCreateCoupon} disabled={creating}>
              {creating ? "Creating..." : "Create coupon"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing coupons table */}
      <Card>
        <CardHeader>
          <CardTitle>Existing coupons</CardTitle>
          <CardDescription>
            All coupons created by admins. Usage is updated by backend
            logic when clients redeem them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadError && (
            <p className="mb-2 text-sm text-red-500">
              {loadError} Please refresh the page.
            </p>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingCoupons && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-sm"
                  >
                    Loading coupons...
                  </TableCell>
                </TableRow>
              )}

              {!loadingCoupons &&
                (!coupons || coupons.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-sm"
                    >
                      No coupons yet. Create one above.
                    </TableCell>
                  </TableRow>
                )}

              {coupons?.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono text-xs">
                    {coupon.code}
                  </TableCell>
                  <TableCell>{coupon.discountPercent}%</TableCell>
                  <TableCell>
                    {coupon.uses}{" "}
                    {coupon.maxUses
                      ? `/ ${coupon.maxUses}`
                      : "(unlimited)"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {coupon.partnerId || "-"}
                  </TableCell>
                  <TableCell>
                    {coupon.active ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-xs text-slate-400">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {coupon.createdAt
                      ? new Date(
                          // Firestore Timestamp compat
                          (coupon.createdAt as any).seconds *
                            1000
                        ).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(coupon)}
                    >
                      {coupon.active
                        ? "Deactivate"
                        : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCoupon(coupon)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCoupon(coupon)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
