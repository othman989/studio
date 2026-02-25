// src/contexts/auth-context.tsx
"use client";

import type { User } from "firebase/auth";
import { GoogleAuthProvider, signInWithRedirect, AuthError } from "firebase/auth";
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useFirebase } from "@/firebase";
import type { Client } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  client: Client | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, firestore, user: firebaseUser, isUserLoading } = useFirebase();

  const [client, setClient] = useState<Client | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const uid = firebaseUser?.uid ?? null;

  // Ensure client doc exists, then subscribe to it
  useEffect(() => {
    if (isUserLoading) return;

    if (!uid) {
      setClient(null);
      setLoading(false);
      return;
    }

    let unsub: (() => void) | null = null;
    let cancelled = false;

    const ensureAndSubscribe = async () => {
      try {
        setLoading(true);

        const clientRef = doc(firestore, "clients", uid);

        const snap = await getDoc(clientRef);
        if (!snap.exists()) {
          const newClientData = {
            id: uid,
            businessName: firebaseUser?.displayName || "My Business",
            email: firebaseUser?.email || "",
            credits: 10,
            createdAt: serverTimestamp(),
            approveAllReplies: false,
            responseTone: "professional",
            language: "autodetect",
          };
          await setDoc(clientRef, newClientData, { merge: true });
        }

        unsub = onSnapshot(
          clientRef,
          (docSnap) => {
            if (cancelled) return;
            if (docSnap.exists()) {
              setClient({ id: docSnap.id, ...docSnap.data() } as Client);
            } else {
              setClient(null);
            }
            setLoading(false);
          },
          (err) => {
            console.error("Client onSnapshot error:", err);
            if (cancelled) return;
            setClient(null);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Failed to ensure/subscribe client doc:", err);
        if (!cancelled) {
          setClient(null);
          setLoading(false);
        }
      }
    };

    ensureAndSubscribe();

    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, [uid, isUserLoading, firestore, firebaseUser]);

  // Subscribe to admin doc
  useEffect(() => {
    if (isUserLoading) return;

    if (!uid) {
      setIsAdmin(false);
      return;
    }

    const adminRef = doc(firestore, "admins", uid);
    const unsub = onSnapshot(
      adminRef,
      (snap) => setIsAdmin(snap.exists()),
      (err) => {
        console.error("Admin onSnapshot error:", err);
        setIsAdmin(false);
      }
    );

    return () => unsub();
  }, [uid, isUserLoading, firestore]);

  // Redirect-only Google sign-in
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      setLoading(true);
      await signInWithRedirect(auth, provider);
      // navigation happens, so function won't "finish" in the same session
    } catch (error: any) {
      const err = error as AuthError;
      console.error("Error initiating Google redirect sign-in:", err.code, err.message);
      setLoading(false);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setClient(null);
      setIsAdmin(false);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const combinedLoading = isUserLoading || loading;

  const value: AuthContextType = useMemo(
    () => ({
      user: firebaseUser,
      client,
      loading: combinedLoading,
      isAdmin,
      signInWithGoogle,
      signOut,
    }),
    [firebaseUser, client, combinedLoading, isAdmin, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
