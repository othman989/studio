// src/app/support/page.tsx

export default function SupportPage() {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Support
        </h1>
  
        <section className="space-y-2 text-sm leading-relaxed">
          <p>
            For now, GBReplAi provides support primarily via WhatsApp. If you
            have any issues with:
          </p>
          <ul className="list-disc pl-6">
            <li>Logging in or accessing your dashboard</li>
            <li>Connecting your Google Business Profile</li>
            <li>Syncing or replying to reviews</li>
            <li>Plans, credits, or billing questions</li>
          </ul>
          <p>
            please send us a message on WhatsApp:
          </p>
          <p className="font-semibold">
            WhatsApp:&nbsp;
            <a
              href="https://wa.me/212696974422"
              className="text-primary underline"
            >
              +212 6 96 97 44 22
            </a>
          </p>
        </section>
  
        <section className="space-y-2 text-sm leading-relaxed">
          <p>
            Typical response times depend on volume, but we aim to respond as
            quickly as possible during business hours.
          </p>
        </section>
      </main>
    );
  }
  