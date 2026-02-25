"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { useLocale } from "@/contexts/locale-context";

const loginCopy = {
  en: {
    backHome: "Back to home",
    title: "GBReplAi",
    subtitle: "AI‑Powered Google Review Responses",
    description: "Respond to all your Google Business reviews in seconds.",
    signIn: "Sign in with Google",
    freeTrial: "Free trial: 10 AI responses included.",
    errorFallback: "Failed to sign in with Google",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    consentLabel:
      "I have read and agree to the Terms of Service and Privacy Policy.",
    consentError:
      "You must agree to the Terms of Service and Privacy Policy to continue.",
  },
  fr: {
    backHome: "Retour à l’accueil",
    title: "GBReplAi",
    subtitle: "Réponses IA aux avis Google",
    description:
      "Répondez à tous vos avis Google Business en quelques secondes.",
    signIn: "Se connecter avec Google",
    freeTrial: "Essai gratuit : 10 réponses IA incluses.",
    errorFallback: "Échec de la connexion avec Google",
    terms: "Conditions d'utilisation",
    privacy: "Politique de confidentialité",
    consentLabel:
      "J’ai lu et j’accepte les Conditions d’utilisation et la Politique de confidentialité.",
    consentError:
      "Vous devez accepter les Conditions d’utilisation et la Politique de confidentialité pour continuer.",
  },
  ar: {
    backHome: "العودة إلى الصفحة الرئيسية",
    title: "GBReplAi",
    subtitle: "ردود ذكية على مراجعات جوجل",
    description: "رد على كل مراجعاتك على Google Business خلال ثوانٍ.",
    signIn: "تسجيل الدخول بحساب Google",
    freeTrial: "تجربة مجانية: 10 ردود بالذكاء الاصطناعي.",
    errorFallback: "فشل تسجيل الدخول بحساب Google",
    terms: "شروط الخدمة",
    privacy: "سياسة الخصوصية",
    consentLabel:
      "لقد قرأت ووافقت على شروط الخدمة وسياسة الخصوصية.",
    consentError:
      "يجب أن توافق على شروط الخدمة وسياسة الخصوصية للمتابعة.",
  },
} as const;

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
        c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
        C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20
        C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
        c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4
        C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
        C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025
        C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
        l6.19,5.238C42.012,36.45,44,30.651,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );
}

export default function LoginPage() {
  const { locale } = useLocale();
  const t = loginCopy[locale];

  const { signInWithGoogle, loading, user } = useAuth();
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();

  const [error, setError] = useState<string | null>(null);
  const [clicking, setClicking] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // 1) As soon as auth is ready and user exists, go to dashboard.
  //    Don't block on adminLoading, otherwise you can get stuck on /login.
  useEffect(() => {
    if (loading) return;
    if (user) router.replace("/dashboard");
  }, [user, loading, router]);

  // 2) If/when admin status resolves true, upgrade to /admin.
  useEffect(() => {
    if (!user) return;
    if (adminLoading) return;
    if (isAdmin) router.replace("/admin");
  }, [user, isAdmin, adminLoading, router]);

  const handleGoogleLogin = async () => {
    setError(null);

    if (!accepted) {
      setError(t.consentError);
      return;
    }

    setClicking(true);
    try {
      // With redirect sign-in, this triggers a navigation away.
      // It's OK to await; the page unloads anyway.
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || t.errorFallback);
      setClicking(false);
    }
  };

  const effectiveLoading = loading || clicking;

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#e8f3ff] via-[#f4f8ff] to-[#f7fbff] text-slate-900">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          {t.backHome}
        </Link>
        <div className="text-lg font-bold tracking-tight">GBReplAi</div>
      </header>

      <section className="flex flex-1 items-center justify-center px-4 pb-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 text-center shadow-xl">
          <h1 className="mb-2 text-3xl font-bold tracking-tighter">{t.title}</h1>
          <p className="mb-1 text-sm text-slate-600">{t.subtitle}</p>
          <p className="mb-4 text-xs text-slate-500">{t.description}</p>

          {error && (
            <div className="mb-3 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700 text-left">
              {error}
            </div>
          )}

          <label className="mt-2 mb-4 flex items-start gap-2 text-xs text-left">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span className="text-slate-600">
              {t.consentLabel}{" "}
              <span>
                (
                <Link href="/terms" className="text-primary underline">
                  {t.terms}
                </Link>{" "}
                ·{" "}
                <Link href="/privacy" className="text-primary underline">
                  {t.privacy}
                </Link>
                )
              </span>
            </span>
          </label>

          <Button
            className="w-full max-w-xs bg-white text-gray-800 font-medium hover:bg-gray-50 hover:shadow-md transition-shadow mx-auto border border-slate-300"
            onClick={handleGoogleLogin}
            disabled={effectiveLoading || !accepted}
            variant="outline"
          >
            {effectiveLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon className="mr-3" />
            )}
            {t.signIn}
          </Button>

          <p className="mt-4 text-xs text-slate-500">{t.freeTrial}</p>

          <footer className="mt-6 text-[11px] text-slate-500">
            <Link href="/terms" className="hover:underline">
              {t.terms}
            </Link>
            <span className="mx-2">|</span>
            <Link href="/privacy" className="hover:underline">
              {t.privacy}
            </Link>
          </footer>
        </div>
      </section>
    </main>
  );
}
