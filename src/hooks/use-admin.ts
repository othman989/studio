"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

interface AdminDoc {
  role?: string;
  email?: string;
}

export function useAdmin() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAdmin() {
      if (!user) {
        if (!cancelled) {
          setIsAdmin(false);
          setRole(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const ref = doc(firestore, "admins", user.uid);
        const snap = await getDoc(ref);
        if (cancelled) return;

        if (snap.exists()) {
          const data = snap.data() as AdminDoc;
          setIsAdmin(true);
          setRole(data.role ?? null);
        } else {
          setIsAdmin(false);
          setRole(null);
        }
      } catch (err) {
        console.error("Failed to load admin doc", err);
        if (!cancelled) {
          setIsAdmin(false);
          setRole(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAdmin();
    return () => {
      cancelled = true;
    };
  }, [user, firestore]);

  return { isAdmin, role, loading };
}
