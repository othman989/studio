// src/app/terms/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "en" | "fr" | "ar";

const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export default function TermsPage() {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <main
      className="mx-auto max-w-3xl px-4 py-12 space-y-8"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Language Switcher */}
      <div
        className={`mb-4 flex justify-end gap-2 ${
          lang === "ar" ? "flex-row-reverse" : ""
        }`}
      >
        {(["en", "fr", "ar"] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              lang === l
                ? "border-primary bg-primary text-white"
                : "border-muted-foreground/40 text-muted-foreground hover:border-primary/60 hover:text-primary"
            }`}
          >
            {LANG_LABELS[l]}
          </button>
        ))}
      </div>

      {/* Back to home */}
      <div
        className={`mb-6 ${
          lang === "ar" ? "text-right" : "text-left"
        }`}
      >
        <Link
          href="/"
          className="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition"
        >
          {lang === "ar" && "العودة إلى الصفحة الرئيسية"}
          {lang === "fr" && "Retour à la page d’accueil"}
          {lang === "en" && "Back to home"}
        </Link>
      </div>

      {lang === "en" && <EnglishContent />}
      {lang === "fr" && <FrenchContent />}
      {lang === "ar" && <ArabicContent />}
    </main>
  );
}

/* ---------------- ENGLISH ---------------- */

function EnglishContent() {
  return (
    <>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">GBReplAi by Greotech</p>
        <p className="text-xs text-muted-foreground">
          <strong>Effective Date:</strong> 12/12/2025 <br />
          <strong>Last Updated:</strong> 12/12/2025
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and
          use of the GBReplAi Software-as-a-Service platform (&quot;Service&quot;),
          provided by Greotech (&quot;We,&quot; &quot;Us,&quot; or &quot;Our&quot;).
          By registering for, accessing, or using the Service, you agree to be
          bound by these Terms.
        </p>

        {/* 1. Acceptance & Google Compliance */}
        <h2 className="mt-6 text-xl font-semibold">
          1. Acceptance of Terms &amp; Google Compliance
        </h2>

        <h3 className="mt-3 text-base font-semibold">1.1. Acceptance</h3>
        <p>
          You affirm that you are 18 years of age or older and possess the legal
          capacity to enter into this agreement on behalf of the business entity
          listed in your account registration (&quot;Client,&quot; &quot;You,&quot;
          or &quot;Your&quot;).
        </p>

        <h3 className="mt-3 text-base font-semibold">
          1.2. Google Compliance
        </h3>
        <p>
          By connecting your Google Business Profile (&quot;GBP&quot;) to the
          Service, you acknowledge and agree that you must comply with all
          Google Business Profile policies, including the Third-Party Policy and
          the Prohibited and Restricted Content Policy. Your continued use of
          the Service is conditioned on your continued compliance with all
          Google policies.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          1.3. Use of Google APIs and Scopes
        </h3>
        <p>
          Our Service uses Google APIs in accordance with Google&apos;s API
          Services User Data Policy and Google APIs Terms of Service. When you
          connect your Google account and Business Profile, we request the
          following OAuth scopes:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <code>https://www.googleapis.com/auth/business.manage</code> – to
            read your Google Business Profile data (including reviews) and to
            post owner responses on your behalf.
          </li>
          <li>
            <code>openid</code>,{" "}
            <code>https://www.googleapis.com/auth/userinfo.email</code>,{" "}
            <code>https://www.googleapis.com/auth/userinfo.profile</code> – to
            authenticate your Google account and associate it with your GBReplAi
            account.
          </li>
        </ul>
        <p>
          We request only the minimum permissions necessary to provide our
          Service and handle your data securely and responsibly, as further
          described in our{" "}
          <Link href="/privacy" className="text-primary underline">
            Privacy Policy
          </Link>
          .
        </p>

        <h3 className="mt-3 text-base font-semibold">
          1.4. Data Privacy and Security
        </h3>
        <p>
          We commit to protecting your personal data and Google Business Profile
          information in compliance with applicable data protection laws and
          Google&apos;s policies. We implement reasonable technical and
          organizational measures to safeguard your data against unauthorized
          access, disclosure, or misuse, including the use of Google Firebase
          encryption, access controls, and secure development practices.
        </p>

        {/* 2. Service & AI Authorization */}
        <h2 className="mt-6 text-xl font-semibold">
          2. Service Description and AI Authorization
        </h2>

        <h3 className="mt-3 text-base font-semibold">2.1. Service</h3>
        <p>
          GBReplAi is an AI-powered platform that manages, monitors, and
          generates responses to customer reviews on your connected Google
          Business Profile(s).
        </p>

        <h3 className="mt-3 text-base font-semibold">
          2.2. Client Responsibility (Core Liability)
        </h3>
        <p>
          You are solely and fully responsible for the content of all review
          responses posted to your Google Business Profile(s), even if the
          content is generated by the GBReplAi AI. You must ensure all responses
          comply with applicable laws and Google policies.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          2.3. AI Authorization and Consent
        </h3>
        <p>
          During onboarding and in your settings, you grant or decline prior,
          specific, and express consent to the following tiered automation:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>4 &amp; 5-Star Reviews:</strong> You may authorize the
            Service to automatically generate and post responses without manual
            pre-approval.
          </li>
          <li>
            <strong>1, 2, &amp; 3-Star Reviews:</strong> You may select a
            default setting for these higher-risk reviews, either &quot;Draft
            &amp; Queue&quot; for manual approval or &quot;Auto-Post.&quot; By
            selecting Auto-Post, you assume all risk associated with the
            automated posting of responses to sensitive negative feedback.
          </li>
        </ul>
        <p>
          You can update these settings at any time in your account settings.
          Changes apply to future automated responses and do not retroactively
          change previously posted replies.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          2.4. AI Training (Opt-in)
        </h3>
        <p>
          By default, your data is not used to train our models beyond what is
          necessary to provide the Service. If you explicitly opt in and have
          more than 1000 review responses, you authorize us to use your
          historical review responses to train and tune models that generate
          better, more personalized responses for your future reviews. You can
          opt out at any time, in which case your future data will no longer be
          used for this training purpose.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          2.5. Prohibited Content
        </h3>
        <p>
          You agree that you will not use the Service to generate or post
          responses that:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Contain spam or misleading information;</li>
          <li>
            Offer incentives (discounts, refunds, etc.) in exchange for review
            changes;
          </li>
          <li>
            Argue with or harass customers, including abusive or defamatory
            language;
          </li>
          <li>
            Violate any Google content policy, applicable law, or third
            party&apos;s rights.
          </li>
        </ul>

        {/* 3. Ownership & Termination */}
        <h2 className="mt-6 text-xl font-semibold">
          3. Google Business Profile Ownership and Termination
        </h2>

        <h3 className="mt-3 text-base font-semibold">3.1. Ownership</h3>
        <p>
          You retain full ownership and/or co-ownership of your Google Business
          Profile(s) at all times. The Service acts only as a management tool
          with your explicit delegation of authority.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          3.2. Termination by Client
        </h3>
        <p>
          You may terminate your subscription at any time via your account
          settings. Upon termination:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Revocation of Access:</strong> You may immediately revoke
            the Service&apos;s access credentials via your Google Account
            security settings.
          </li>
          <li>
            <strong>Full Control Regained:</strong> We commit to relinquishing
            all management permissions and ensuring you have exclusive control
            of your Google Business Profile account(s) within seven (7) business
            days of receiving your notice of termination.
          </li>
        </ul>

        {/* 4. Payment */}
        <h2 className="mt-6 text-xl font-semibold">4. Payment Terms</h2>

        <h3 className="mt-3 text-base font-semibold">4.1. Billing</h3>
        <p>
          Subscriptions are billed on a recurring{" "}
          <span className="font-semibold">[Monthly/Annual]</span> basis. By
          subscribing, you authorize Us (or our payment processor) to charge
          your designated payment method at the beginning of each billing cycle
          for the applicable subscription fees and any applicable taxes.
        </p>
        <p className="mt-2">
          The Google Business Profile service itself is provided by Google at no
          additional cost beyond any fees you may already pay directly to
          Google. Our subscription fees cover only the GBReplAi review
          management and automation Service built on top of Google&apos;s APIs,
          and do not include or replace any fees charged by Google.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          4.2. Price Changes
        </h3>
        <p>
          We reserve the right to change our subscription fees upon thirty (30)
          days prior notice. Any fee change will become effective at the start
          of the next billing cycle after the notice period. Your continued use
          of the Service after the fee change constitutes your agreement to pay
          the modified amount.
        </p>

        {/* 5. Liability */}
        <h2 className="mt-6 text-xl font-semibold">
          5. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law, in no event shall Greotech,
          its affiliates, directors, officers, employees, agents, or licensors
          be liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits or revenues, whether incurred
          directly or indirectly, or any loss of data, use, goodwill, or other
          intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Your access to or use of or inability to access or use the Service;
          </li>
          <li>
            Any content generated, posted, or otherwise made available through
            the Service, including AI-generated review responses;
          </li>
          <li>
            Any suspension, restriction, or removal of your Google Business
            Profile or reviews resulting from content posted using the Service;
          </li>
          <li>Any unauthorized access, use, or alteration of your data.</li>
        </ul>
        <p>
          Our aggregate liability for all claims relating to the Service shall
          be limited to the amount you paid to us for the Service during the
          three (3) months immediately preceding the event giving rise to the
          claim.
        </p>

        {/* 6. Changes */}
        <h2 className="mt-6 text-xl font-semibold">
          6. Changes to These Terms
        </h2>
        <p>
          We may update these Terms from time to time. When we do, we will
          revise the &quot;Last Updated&quot; date at the top of this page. If
          we make material changes, we will provide notice through the Service
          or by email. Your continued use of the Service after such changes
          become effective constitutes your acceptance of the revised Terms.
        </p>

        {/* 7. Contact */}
        <h2 className="mt-6 text-xl font-semibold">7. Contact</h2>
        <p>
          If you have any questions about these Terms, you can contact us at:
        </p>
        <p className="text-sm">
          <strong>Email:</strong>{" "}
          <a
            href="mailto:support@greotech.com"
            className="text-primary underline"
          >
            support@greotech.com
          </a>
          <br />
          <strong>WhatsApp:</strong>{" "}
          <a
            href="https://wa.me/212696974422"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            0696974422
          </a>
        </p>

        <p className="mt-4 text-xs">
          Also see our{" "}
          <Link href="/privacy" className="text-primary underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </>
  );
}

/* ---------------- FRENCH ---------------- */

function FrenchContent() {
  return (
    <>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Conditions d&apos;utilisation
        </h1>
        <p className="text-sm text-muted-foreground">GBReplAi par Greotech</p>
        <p className="text-xs text-muted-foreground">
          <strong>Date d&apos;entrée en vigueur :</strong> 12/12/2025 <br />
          <strong>Dernière mise à jour :</strong> 12/12/2025
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <p>
          Les présentes conditions d&apos;utilisation (&quot;Conditions&quot;)
          régissent votre accès et votre utilisation de la plateforme GBReplAi,
          fournie par Greotech (&quot;Nous&quot;). En créant un compte ou en
          utilisant le Service, vous acceptez ces Conditions.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          1. Acceptation et conformité Google
        </h2>

        <h3 className="mt-3 text-base font-semibold">1.1. Acceptation</h3>
        <p>
          Vous déclarez avoir au moins 18 ans et la capacité juridique d&apos;engager
          l&apos;entreprise au nom de laquelle vous utilisez le Service.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          1.2. Conformité avec Google
        </h3>
        <p>
          En connectant votre fiche Google Business Profile au Service, vous
          acceptez de respecter toutes les politiques Google Business Profile,
          y compris la politique relative aux tiers et la politique sur les
          contenus interdits.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          1.3. Utilisation des API Google et scopes
        </h3>
        <p>
          Notre Service utilise les API Google conformément à la Google API
          Services User Data Policy. Lorsque vous connectez votre compte
          Google et votre fiche, nous demandons les scopes OAuth suivants :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <code>https://www.googleapis.com/auth/business.manage</code> – pour
            lire les avis et publier des réponses pour votre fiche.
          </li>
          <li>
            <code>openid</code>,{" "}
            <code>https://www.googleapis.com/auth/userinfo.email</code>,{" "}
            <code>https://www.googleapis.com/auth/userinfo.profile</code> – pour
            authentifier votre compte Google et l&apos;associer à votre compte
            GBReplAi.
          </li>
        </ul>
        <p>
          Nous demandons uniquement les autorisations nécessaires à la
          fourniture du Service, comme décrit dans notre{" "}
          <Link href="/privacy" className="text-primary underline">
            Politique de confidentialité
          </Link>
          .
        </p>

        <h3 className="mt-3 text-base font-semibold">
          1.4. Données et sécurité
        </h3>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          raisonnables pour protéger vos données (chiffrement, contrôle
          d&apos;accès, règles de sécurité Firebase).
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          2. Description du Service et IA
        </h2>

        <h3 className="mt-3 text-base font-semibold">2.1. Service</h3>
        <p>
          GBReplAi permet de suivre les avis Google, de générer des réponses
          assistées par IA et, selon vos réglages, de les publier
          automatiquement ou après validation.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          2.2. Responsabilité du Client
        </h3>
        <p>
          Vous êtes entièrement responsable du contenu de toutes les réponses
          publiées sur vos fiches Google, même lorsqu&apos;elles sont générées
          par l&apos;IA. Vous devez vérifier qu&apos;elles respectent la loi et
          les règles de Google.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          2.3. Autorisation et paramètres d&apos;automatisation
        </h3>
        <p>
          Vous pouvez configurer différents niveaux d&apos;automatisation :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Avis 4‑5 étoiles : autoriser la publication automatique des
            réponses.
          </li>
          <li>
            Avis 1‑3 étoiles : choisir entre &quot;Brouillon&quot; (validation
            manuelle) ou &quot;Publication automatique&quot; (à vos risques).
          </li>
        </ul>
        <p>
          Vous pouvez modifier ces réglages à tout moment. Les changements ne
          s&apos;appliquent qu&apos;aux réponses futures.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          2.4. Entraînement de l&apos;IA (opt‑in)
        </h3>
        <p>
          Par défaut, vos données ne sont pas utilisées pour entraîner nos
          modèles au‑delà de ce qui est nécessaire pour fournir le Service.
          Si vous donnez votre accord et disposez de plus de 1000 réponses,
          vous nous autorisez à utiliser vos réponses historiques pour
          améliorer les modèles appliqués à votre compte. Vous pouvez retirer
          votre consentement à tout moment.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          2.5. Contenus interdits
        </h3>
        <p>
          Vous vous engagez à ne pas utiliser le Service pour produire des
          réponses :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>trompeuses ou mensongères ;</li>
          <li>
            offrant des avantages en échange de la modification ou suppression
            d&apos;un avis ;
          </li>
          <li>injurieuses, diffamatoires ou harcelantes ;</li>
          <li>contraires aux politiques de contenu de Google ou à la loi.</li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">
          3. Propriété de la fiche et résiliation
        </h2>

        <h3 className="mt-3 text-base font-semibold">
          3.1. Propriété de la fiche
        </h3>
        <p>
          Vous conservez à tout moment la pleine propriété de vos fiches
          Google Business Profile. GBReplAi agit uniquement comme outil de
          gestion.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          3.2. Résiliation par le Client
        </h3>
        <p>
          Vous pouvez résilier votre abonnement à tout moment. Vous pouvez
          révoquer immédiatement l&apos;accès de GBReplAi via les paramètres de
          sécurité de votre compte Google. Nous cesserons alors de gérer vos
          fiches.
        </p>

        <h2 className="mt-6 text-xl font-semibold">4. Paiement</h2>

        <h3 className="mt-3 text-base font-semibold">4.1. Facturation</h3>
        <p>
          Les abonnements sont facturés de façon récurrente (mensuelle ou
          annuelle). En souscrivant, vous autorisez le débit du moyen de
          paiement enregistré pour les frais d&apos;abonnement et les taxes
          applicables.
        </p>
        <p className="mt-2">
          Les services Google (Google Business Profile) restent fournis par
          Google. Nos frais concernent uniquement l&apos;usage de la plateforme
          GBReplAi.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          4.2. Modification des prix
        </h3>
        <p>
          Nous pouvons modifier nos tarifs avec un préavis de 30 jours. La
          poursuite de l&apos;utilisation du Service après l&apos;entrée en
          vigueur des nouveaux tarifs vaut acceptation de ces tarifs.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          5. Limitation de responsabilité
        </h2>
        <p>
          Dans la limite permise par la loi, Greotech ne pourra être tenu
          responsable des dommages indirects, pertes de profits, de données ou
          de clientèle, ni des conséquences d&apos;une suspension, restriction
          ou suppression de vos fiches ou avis par Google à la suite des
          contenus publiés via le Service.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          6. Modifications des Conditions
        </h2>
        <p>
          Nous pouvons mettre à jour ces Conditions. La date &quot;Dernière
          mise à jour&quot; sera ajustée. En cas de changement important, nous
          pourrons vous en informer par e‑mail ou via l&apos;application. Le
          fait de continuer à utiliser le Service vaut acceptation des
          Conditions modifiées.
        </p>

        <h2 className="mt-6 text-xl font-semibold">7. Contact</h2>
        <p>
          Pour toute question concernant ces Conditions, vous pouvez nous
          contacter :
        </p>
        <p className="text-sm">
          <strong>Email :</strong>{" "}
          <a
            href="mailto:support@greotech.com"
            className="text-primary underline"
          >
            support@greotech.com
          </a>
          <br />
          <strong>WhatsApp :</strong>{" "}
          <a
            href="https://wa.me/212696974422"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            0696974422
          </a>
        </p>

        <p className="mt-4 text-xs">
          Voir aussi notre{" "}
          <Link href="/privacy" className="text-primary underline">
            Politique de confidentialité
          </Link>
          .
        </p>
      </section>
    </>
  );
}

/* ---------------- ARABIC ---------------- */

function ArabicContent() {
  return (
    <>
      <header className="space-y-2 text-right">
        <h1 className="text-3xl font-bold tracking-tight">شروط الاستخدام</h1>
        <p className="text-sm text-muted-foreground">GBReplAi من Greotech</p>
        <p className="text-xs text-muted-foreground">
          <strong>تاريخ السريان:</strong> 12/12/2025 <br />
          <strong>آخر تحديث:</strong> 12/12/2025
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-right">
        <p>
          تحكم هذه الشروط (&quot;شروط الاستخدام&quot;) طريقة استخدامك لخدمة
          GBReplAi المقدّمة من Greotech (&quot;نحن&quot;). باستخدامك للخدمة
          فإنك توافق على هذه الشروط.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          1. القبول والامتثال لسياسات Google
        </h2>
        <p>
          يجب أن يكون عمرك 18 سنة على الأقل وأن تملك الصلاحية القانونية
          لتمثيل نشاطك التجاري. عند ربط ملفك على Google Business Profile،
          فإنك تلتزم بسياسات Google وأحكامها الخاصة بالمحتوى والأطراف
          الثالثة.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          1.1 استخدام واجهات Google API
        </h3>
        <p>
          نستخدم واجهات Google API وفقًا لسياسة Google API Services User Data.
          عند الربط نطلب صلاحيات OAuth التالية:
        </p>
        <ul className="list-disc pr-6 space-y-1">
          <li>
            <code>https://www.googleapis.com/auth/business.manage</code> – لقراءة
            بيانات ملفك التجاري (المراجعات) ونشر ردود المالك نيابة عنك.
          </li>
          <li>
            <code>openid</code>،{" "}
            <code>https://www.googleapis.com/auth/userinfo.email</code>،{" "}
            <code>https://www.googleapis.com/auth/userinfo.profile</code> –
            لمصادقة حسابك وربطه بحساب GBReplAi.
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">
          2. وصف الخدمة والذكاء الاصطناعي
        </h2>
        <p>
          تُستخدم GBReplAi لمتابعة مراجعات Google وإنشاء ردود مدعومة بالذكاء
          الاصطناعي ونشرها تلقائيًا أو بعد مراجعتك، حسب إعداداتك.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          2.1 مسؤوليتك عن المحتوى
        </h3>
        <p>
          أنت المسؤول الوحيد عن جميع الردود المنشورة على ملفك حتى وإن تم
          توليدها تلقائيًا بواسطة الذكاء الاصطناعي. يجب أن تكون الردود
          متوافقة مع القوانين وسياسات Google.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          2.2 إعدادات الأتمتة
        </h3>
        <p>
          يمكنك اختيار:
        </p>
        <ul className="list-disc pr-6 space-y-1">
          <li>نشر تلقائي لردود المراجعات بتقييم 4 أو 5 نجوم.</li>
          <li>
            مراجعات 1–3 نجوم: إما حفظ الرد كمسودة للمراجعة اليدوية أو النشر
            التلقائي (على مسؤوليتك).
          </li>
        </ul>

        <h3 className="mt-3 text-base font-semibold">
          2.3 تدريب النماذج (اختياري)
        </h3>
        <p>
          بشكل افتراضي لا نستخدم بياناتك في تدريب النماذج بشكل موسع. إذا
          وافقت صراحةً وكان لديك أكثر من 1000 رد، يمكن استخدام ردودك السابقة
          لتحسين النماذج الخاصة بحسابك. يمكنك إلغاء هذا الخيار في أي وقت.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          2.4 المحتوى غير المسموح به
        </h3>
        <p>لا يجوز استخدام الخدمة لإنتاج أو نشر ردود:</p>
        <ul className="list-disc pr-6 space-y-1">
          <li>تتضمن معلومات مضللة أو محتوى غير قانوني،</li>
          <li>تقدم حوافز مقابل تغيير أو حذف مراجعات،</li>
          <li>تهين العملاء أو تهاجمهم أو تشهر بهم،</li>
          <li>تخالف سياسات Google أو الأنظمة المعمول بها.</li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">
          3. ملكية ملف النشاط التجاري وإنهاء الخدمة
        </h2>
        <p>
          تظل ملكية ملف Google Business Profile خاصة بك دائمًا، ودور GBReplAi
          يقتصر على كونه أداة إدارة. يمكنك إنهاء اشتراكك في أي وقت وإلغاء
          وصول GBReplAi من إعدادات أمان حساب Google.
        </p>

        <h2 className="mt-6 text-xl font-semibold">4. الدفع</h2>
        <p>
          يتم تحصيل رسوم الاشتراك بشكل دوري (شهري/سنوي). باستخدامك للخدمة
          فإنك تفوّضنا أو مزوّد الدفع بتحصيل الرسوم من وسيلة الدفع المسجّلة.
        </p>
        <p className="mt-2">
          أي رسوم تتعلق بخدمات Google نفسها تتم بينك وبين Google مباشرة،
          ورسومنا تخص خدمة GBReplAi فقط.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          5. حدود المسؤولية
        </h2>
        <p>
          في حدود ما يسمح به القانون، لا تتحمل Greotech المسؤولية عن أي أضرار
          غير مباشرة أو خسارة أرباح أو بيانات، أو عن أي إجراء تتخذه Google
          تجاه ملفك (مثل إزالته أو تعليق المراجعات) نتيجة المحتوى المنشور عبر
          الخدمة.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          6. التعديلات على الشروط
        </h2>
        <p>
          قد نقوم بتحديث هذه الشروط من حين لآخر. عند إجراء تغييرات جوهرية،
          سنخطرك عن طريق البريد الإلكتروني أو داخل التطبيق. استمرارك في استخدام
          الخدمة بعد التعديلات يعني قبولك بالشروط المحدثة.
        </p>

        <h2 className="mt-6 text-xl font-semibold">7. التواصل معنا</h2>
        <p>للاستفسار عن هذه الشروط يمكنك التواصل معنا عبر:</p>
        <p className="text-sm">
          <strong>البريد الإلكتروني:</strong>{" "}
          <a
            href="mailto:support@greotech.com"
            className="text-primary underline"
          >
            support@greotech.com
          </a>
          <br />
          <strong>واتساب:</strong>{" "}
          <a
            href="https://wa.me/212696974422"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            0696974422
          </a>
        </p>

        <p className="mt-4 text-xs">
          راجع أيضًا{" "}
          <Link href="/privacy" className="text-primary underline">
            سياسة الخصوصية
          </Link>
          .
        </p>
      </section>
    </>
  );
}
