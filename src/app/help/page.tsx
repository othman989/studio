// src/app/help/page.tsx

import Link from "next/link";

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Help & FAQ</h1>

      <section className="space-y-2 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">
          How do I connect my Google Business Profile?
        </h2>
        <p>
          After you log in, go to the <Link href="/dashboard" className="text-primary underline">Dashboard</Link> or{" "}
          <Link href="/settings" className="text-primary underline">
            Settings
          </Link>{" "}
          page and click the &quot;Connect Google Business&quot; button. You
          will be redirected to Google to grant permissions, then back to
          GBReplAi.
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">
          How often are my reviews synchronized?
        </h2>
        <p>
          You can trigger a manual sync anytime from your dashboard
          (&quot;Sync Reviews&quot; button). Automatic periodic sync is
          being rolled out and may be enabled on your account depending on
          your plan and configuration.
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">
          How are AI credits consumed?
        </h2>
        <p>
          Each time you generate an AI response draft for a review, GBReplAi
          consumes 1 credit. Editing or publishing an existing draft does
          not consume additional credits.
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">Need more help?</h2>
        <p>
          If you have questions about setup, billing, or how to get the
          most out of GBReplAi, contact us via WhatsApp at{" "}
          <a
            href="https://wa.me/212696974422"
            className="text-primary underline"
          >
            +212 6 96 97 44 22
          </a>
          .
        </p>
      </section>
    </main>
  );
}
