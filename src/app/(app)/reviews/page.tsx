"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useFirebase } from "@/firebase";
import type { Review } from "@/lib/types";
import { ReviewList } from "@/components/reviews/review-list";
import { ReviewModal } from "@/components/reviews/review-modal";

type LocationItem = {
  id: string;
  name?: string;
  googleLocationName?: string;
};

export default function ReviewsPage() {
  const { user } = useAuth();
  const { auth } = useFirebase();

  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [locationId, setLocationId] = useState<string>("all");

  const [status, setStatus] = useState<string>("all");
  const [rating, setRating] = useState<string>("all");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canQuery = !!user;

  const queryKey = useMemo(
    () => JSON.stringify({ locationId, status, rating }),
    [locationId, status, rating]
  );

  async function getIdTokenOrThrow() {
    const current = auth.currentUser;
    if (!current) throw new Error("Not signed in");
    return await current.getIdToken();
  }

  // Load locations
  useEffect(() => {
    if (!canQuery) return;
    let cancelled = false;

    (async () => {
      try {
        setError(null);
        setLoadingLocations(true);

        const token = await getIdTokenOrThrow();
        const res = await fetch("/api/client/locations", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load locations");

        if (!cancelled) setLocations(json.locations || []);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load locations");
      } finally {
        if (!cancelled) setLoadingLocations(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [canQuery, auth]);

  async function loadFirstPage() {
    setError(null);
    setLoadingReviews(true);
    setReviews([]);
    setNextCursor(null);

    const token = await getIdTokenOrThrow();
    const params = new URLSearchParams();
    params.set("limit", "20");
    params.set("locationId", locationId);
    params.set("status", status);
    params.set("rating", rating);

    const res = await fetch(`/api/client/reviews?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Failed to load reviews");

    setReviews(json.reviews || []);
    setNextCursor(json.nextCursor || null);
    setLoadingReviews(false);
  }

  // Load reviews on filter change
  useEffect(() => {
    if (!canQuery) return;
    let cancelled = false;

    (async () => {
      try {
        if (cancelled) return;
        await loadFirstPage();
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load reviews");
        if (!cancelled) setLoadingReviews(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canQuery, auth, queryKey]);

  async function loadMore() {
    if (!nextCursor || loadingReviews || !canQuery) return;

    try {
      setError(null);
      setLoadingReviews(true);

      const token = await getIdTokenOrThrow();
      const params = new URLSearchParams();
      params.set("limit", "20");
      params.set("locationId", locationId);
      params.set("status", status);
      params.set("rating", rating);
      params.set("cursor", nextCursor);

      const res = await fetch(`/api/client/reviews?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load more reviews");

      setReviews((prev) => [...prev, ...(json.reviews || [])]);
      setNextCursor(json.nextCursor || null);
    } catch (e: any) {
      setError(e.message || "Failed to load more reviews");
    } finally {
      setLoadingReviews(false);
    }
  }

  async function syncNow() {
    try {
      setError(null);
      setSyncing(true);

      const token = await getIdTokenOrThrow();
      const res = await fetch("/api/client/reviews/sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json?.error || "Sync failed");

      await loadFirstPage();
    } catch (e: any) {
      setError(e.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  function openReview(review: Review) {
    setSelectedReview(review);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedReview(null);
  }

  function applyReviewPatch(patch: Partial<Review> & { id: string }) {
    setReviews((prev) =>
      prev.map((r) => (r.id === patch.id ? ({ ...r, ...patch } as Review) : r))
    );
    // keep modal in sync too
    if (selectedReview?.id === patch.id) {
      setSelectedReview((prev) => (prev ? ({ ...prev, ...patch } as Review) : prev));
    }
  }

  if (!user) return <div className="p-6">Please sign in.</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Reviews</h1>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-sm">
          Location{" "}
          <select
            className="ml-2 border rounded px-2 py-1"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            disabled={loadingLocations}
          >
            <option value="all">All</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name || loc.googleLocationName || loc.id}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Status{" "}
          <select
            className="ml-2 border rounded px-2 py-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="new">new</option>
            <option value="pending">pending</option>
            <option value="posted">posted</option>
            <option value="post_failed">post_failed</option>
            <option value="declined">declined</option>
            <option value="unreplied">unreplied</option>
            <option value="error">error</option>
          </select>
        </label>

        <label className="text-sm">
          Rating{" "}
          <select
            className="ml-2 border rounded px-2 py-1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="all">All</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </label>
      </div>

      <ReviewList
        reviews={reviews}
        isLoading={loadingReviews}
        onReviewClick={openReview}
        onSync={syncNow}
        syncing={syncing}
      />

      <div>
        <button
          className="border rounded px-3 py-2 text-sm disabled:opacity-50"
          onClick={loadMore}
          disabled={!nextCursor || loadingReviews}
        >
          {nextCursor ? (loadingReviews ? "Loading…" : "Load more") : "No more"}
        </button>
      </div>

      <ReviewModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={closeModal}
        onReviewUpdated={applyReviewPatch}
      />
    </div>
  );
}
