// src/app/privacy/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "en" | "fr" | "ar";

const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">GBReplAi by Greotech</p>
        <p className="text-xs text-muted-foreground">
          <strong>Effective Date:</strong> 12/12/2025 <br />
          <strong>Last Updated:</strong> 12/12/2025
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <p>
          This Privacy Policy describes how Greotech (&quot;We,&quot;
          &quot;Us,&quot; or &quot;Our&quot;) collects, accesses, uses, stores,
          and shares information when you use our GBReplAi Service
          (&quot;Service&quot;).
        </p>

        {/* 1. DATA ACCESSED */}
        <h2 className="mt-6 text-xl font-semibold">1. Data Accessed</h2>
        <p>
          We only access the minimum data necessary to provide and improve the
          GBReplAi Service.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          1.1 Google User Data Accessed (via Google APIs)
        </h3>
        <p>
          When you connect your Google Business Profile via Google&apos;s OAuth
          process, and only after your explicit consent, we access:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Google Business Profile Reviews:</strong> Public review
            text, star rating, reviewer display name, and timestamps associated
            with your locations.
          </li>
          <li>
            <strong>Google Business Profile Metadata:</strong> Business
            name(s), Business ID(s), categories, primary business address, and
            related configuration needed to identify and manage your locations.
          </li>
          <li>
            <strong>Review Response History:</strong> Existing owner responses,
            reply timestamps, and related review interaction history.
          </li>
          <li>
            <strong>Google Account Identity Data:</strong> Your Google account
            ID, email address, and basic profile information (such as name and
            profile picture URL) used to link your Google account with your
            GBReplAi account.
          </li>
        </ul>

        <p className="mt-3">
          To access this data, our application requests the following Google
          OAuth scopes:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <code>https://www.googleapis.com/auth/business.manage</code> – to
            read your Google Business Profile data (including reviews) and post
            owner responses on your behalf.
          </li>
          <li>
            <code>openid</code>,{" "}
            <code>https://www.googleapis.com/auth/userinfo.email</code>,{" "}
            <code>https://www.googleapis.com/auth/userinfo.profile</code> – to
            authenticate your Google account and associate it with your
            GBReplAi account.
          </li>
        </ul>

        <h3 className="mt-3 text-base font-semibold">
          1.2 Other Data We Collect
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Account Information:</strong> Name, email, company name, and
            other details you provide when registering or updating your profile.
          </li>
          <li>
            <strong>Billing Information:</strong> Information required to
            process your subscription payments (handled via our payment
            processor).
          </li>
          <li>
            <strong>Technical &amp; Usage Data:</strong> IP address, browser and
            device type, pages visited, features used, timestamps, and similar
            log data collected automatically to secure and improve the Service.
          </li>
        </ul>

        {/* 2. DATA USAGE */}
        <h2 className="mt-6 text-xl font-semibold">2. Data Usage</h2>
        <p>
          We use the data we access solely for the purposes described below and
          in accordance with Google&apos;s API Services User Data Policy. We do
          not use Google user data for advertising, profiling, or selling to
          third parties.
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>
            <strong>Provide the Service:</strong> Monitor your Google Business
            Profile reviews; generate, queue, and post AI-assisted owner
            responses according to your chosen settings; and display analytics
            about your reviews and responses.
          </li>
          <li>
            <strong>Account Management &amp; Support:</strong> Create and manage
            your GBReplAi account, authenticate you, provide customer support,
            and communicate about changes, security alerts, or billing.
          </li>
          <li>
            <strong>Service Improvement:</strong> Analyze aggregated or
            de-identified usage patterns (for example, response performance,
            common review topics) to improve the quality, reliability, and
            safety of our features.
          </li>
          <li>
            <strong>Security &amp; Abuse Prevention:</strong> Detect,
            investigate, and prevent fraud, abuse, or security incidents, and
            enforce our Terms of Service.
          </li>
          <li>
            <strong>Google Analytics (planned):</strong> We plan to use Google
            Analytics / Google Analytics for Firebase to measure usage and
            performance (for example, page views, feature usage). You can manage
            your Google Analytics data preferences via your Google account or
            device settings.
          </li>
          <li>
            <strong>AI Training (Opt-in only):</strong> If you explicitly opt in
            and have more than 1000 review responses, we may use your historical
            review responses to train models that generate better, more
            personalized responses for your future reviews. This is never
            enabled by default and only applies to your own model
            customization.
          </li>
        </ul>

        {/* 3. DATA SHARING */}
        <h2 className="mt-6 text-xl font-semibold">3. Data Sharing</h2>
        <p>
          We do not sell, rent, or trade your personally identifiable data,
          including Google user data, to third parties for marketing or
          advertising purposes.
        </p>

        <h3 className="mt-3 text-base font-semibold">3.1 Service Providers</h3>
        <p>
          We may share your data with trusted third-party service providers who
          process data on our behalf and under our instructions, solely to help
          us operate and improve the Service. These may include:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Google Firebase (hosting, database, authentication);</li>
          <li>Cloud infrastructure providers;</li>
          <li>Payment processors;</li>
          <li>Email delivery and customer support tools;</li>
          <li>Analytics providers (e.g., Google Analytics);</li>
          <li>
            AI/LLM providers (for generating review responses and summaries).
          </li>
        </ul>
        <p>
          These providers are contractually required to protect your data and
          may not use it for any purpose other than providing their services to
          us.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          3.2 AI / Large Language Model (LLM) Processing
        </h3>
        <p>
          To generate AI-assisted review responses and summaries, we may send
          review content and related context to external AI providers (for
          example, Google Cloud AI or equivalent). This data is used exclusively
          to generate the requested output and is not used by those providers
          for their own advertising or marketing.
        </p>
        <p>
          Unless you have explicitly opted in to AI training as described above
          (and meet the &gt;1000 responses threshold), we do not allow our
          providers to use your content to train their general models beyond
          what is necessary for providing the Service.
        </p>

        <h3 className="mt-3 text-base font-semibold">3.3 Legal Disclosures</h3>
        <p>
          We may disclose information if required to do so by law or in
          response to valid legal requests, or when we believe in good faith
          that such disclosure is reasonably necessary to:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Comply with applicable laws or legal processes;</li>
          <li>
            Protect and defend our rights, property, or safety, or those of our
            users or the public;
          </li>
          <li>Investigate or prevent fraud or abuse.</li>
        </ul>

        {/* 4. DATA STORAGE & PROTECTION */}
        <h2 className="mt-6 text-xl font-semibold">
          4. Data Storage &amp; Protection
        </h2>
        <p>
          All data collected through the Service is stored on Google Firebase /
          Google Cloud infrastructure. Firebase encrypts data in transit
          (HTTPS/TLS) and at rest by default.
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>
            <strong>Encryption:</strong> Data is encrypted in transit between
            your browser and our servers, and at rest within Firebase databases
            and storage.
          </li>
          <li>
            <strong>Access Controls:</strong> Access to production data is
            limited to authorized personnel who need it to operate, develop, or
            support the Service.
          </li>
          <li>
            <strong>Secrets Management:</strong> Sensitive credentials (such as
            OAuth client secrets and API keys) are stored using secure
            environment configuration and are not exposed in client-side code or
            public repositories.
          </li>
          <li>
            <strong>Security Practices:</strong> We apply secure development
            practices, use Firebase security rules to restrict access, and
            periodically review our systems for vulnerabilities.
          </li>
        </ul>
        <p>
          While we strive to use commercially reasonable measures to protect
          your data, no method of transmission over the internet or electronic
          storage is 100% secure.
        </p>

        {/* 5. DATA RETENTION & DELETION */}
        <h2 className="mt-6 text-xl font-semibold">
          5. Data Retention &amp; Deletion
        </h2>
        <p>
          We retain your Google Business Profile data and account information for
          as long as your account remains active and as necessary to provide the
          Service.
        </p>
        <p className="mt-2">
          After you close your account or request deletion, we will begin
          deleting or anonymizing your data from active systems within{" "}
          <strong>60 days</strong>, except where we are required or permitted by
          law to retain it longer (for example, for billing, accounting, tax,
          security, or dispute resolution purposes).
        </p>
        <p>
          We currently do not provide a self-service data export feature. If you
          would like to know what data we hold about you, you can contact us and
          we will respond in accordance with applicable law.
        </p>

        {/* 6. YOUR RIGHTS & CHOICES */}
        <h2 className="mt-6 text-xl font-semibold">
          6. Your Rights &amp; Choices
        </h2>

        <h3 className="mt-3 text-base font-semibold">
          6.1 Access and Correction
        </h3>
        <p>
          You can view and update most of your account information directly from
          your GBReplAi dashboard. If you believe we hold other personal data
          about you that you cannot access via the Service, you may contact us
          to request access or correction.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          6.2 Deletion and Revocation of Google Access
        </h3>
        <p>
          You may request deletion of your GBReplAi account and related data by
          contacting us at the number below. You may also revoke
          GBReplAi&apos;s access to your Google Business Profile at any time
          through your Google Account security settings.
        </p>
        <p>
          Please note that revoking access or deleting your account will disable
          some or all features of the Service.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          6.3 AI Training Opt-in / Opt-out
        </h3>
        <p>
          AI training on your historical responses is disabled by default. You
          may choose to opt in (if you have more than 1000 review responses) via
          your account settings, and you may opt out at any time. When you opt
          out, your future data will no longer be used for model training as
          described above.
        </p>

        {/* 7. INTERNATIONAL TRANSFERS */}
        <h2 className="mt-6 text-xl font-semibold">
          7. International Data Transfers
        </h2>
        <p>
          Our use of Firebase and cloud service providers may involve
          transferring and processing your data in countries other than your
          own, which may have different data protection laws. Where required, we
          implement appropriate safeguards to protect such transfers.
        </p>

        {/* 8. CHANGES & CONTACT */}
        <h2 className="mt-6 text-xl font-semibold">
          8. Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will revise the &quot;Last Updated&quot; date at the top of this
          page. If we make material changes, we will provide notice through the
          Service or by email where appropriate. Your continued use of the
          Service after such changes become effective constitutes your
          acceptance of the revised Privacy Policy.
        </p>

        <h2 className="mt-6 text-xl font-semibold">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or how we handle
          your data, please contact us:
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
          <Link href="/terms" className="text-primary underline">
            Terms of Service
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
          Politique de confidentialité
        </h1>
        <p className="text-sm text-muted-foreground">GBReplAi par Greotech</p>
        <p className="text-xs text-muted-foreground">
          <strong>Date d&apos;entrée en vigueur :</strong> 12/12/2025 <br />
          <strong>Dernière mise à jour :</strong> 12/12/2025
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <p>
          Cette politique de confidentialité décrit comment Greotech
          (&quot;Nous&quot;) collecte, accède, utilise, stocke et partage vos
          informations lorsque vous utilisez le service GBReplAi
          (&quot;Service&quot;).
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          1. Données auxquelles nous accédons
        </h2>
        <p>
          Nous n&apos;accédons qu&apos;aux données strictement nécessaires pour
          fournir et améliorer le Service.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          1.1 Données Google (via les API Google)
        </h3>
        <p>
          Lorsque vous connectez votre fiche Google Business Profile via le
          processus OAuth de Google, et uniquement après votre consentement
          explicite, nous accédons notamment :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Avis Google :</strong> Texte de l&apos;avis, note,
            pseudonyme public de l&apos;auteur et horodatage.
          </li>
          <li>
            <strong>Métadonnées de la fiche :</strong> Nom de
            l&apos;établissement, identifiants, catégories, adresse principale
            et paramètres nécessaires à la gestion de vos emplacements.
          </li>
          <li>
            <strong>Historique des réponses :</strong> Réponses existantes du
            propriétaire, dates de réponse et historique des interactions.
          </li>
          <li>
            <strong>Identité du compte Google :</strong> Identifiant de compte
            Google, adresse e‑mail et informations de profil de base (nom, photo
            de profil) utilisées pour lier votre compte Google à votre compte
            GBReplAi.
          </li>
        </ul>

        <p className="mt-3">
          Pour cela, notre application demande les autorisations (scopes)
          OAuth suivantes :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <code>https://www.googleapis.com/auth/business.manage</code> – pour
            lire les données de votre fiche Business Profile (y compris les
            avis) et publier des réponses du propriétaire en votre nom.
          </li>
          <li>
            <code>openid</code>,{" "}
            <code>https://www.googleapis.com/auth/userinfo.email</code>,{" "}
            <code>https://www.googleapis.com/auth/userinfo.profile</code> – pour
            authentifier votre compte Google et l&apos;associer à votre compte
            GBReplAi.
          </li>
        </ul>

        <h3 className="mt-3 text-base font-semibold">
          1.2 Autres données collectées
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Informations de compte :</strong> Nom, e‑mail, nom de
            l&apos;entreprise et autres informations fournies lors de
            l&apos;inscription.
          </li>
          <li>
            <strong>Informations de facturation :</strong> Données nécessaires
            au traitement de vos paiements (gérées par notre prestataire de
            paiement).
          </li>
          <li>
            <strong>Données techniques et d&apos;usage :</strong> Adresse IP,
            type d&apos;appareil et de navigateur, pages consultées, fonctionnalités
            utilisées et horodatages, collectés automatiquement pour sécuriser
            et améliorer le Service.
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">2. Utilisation des données</h2>
        <p>
          Nous utilisons les données exclusivement pour les finalités ci‑dessous
          et conformément à la politique Google API Services User Data. Nous
          n&apos;utilisons pas vos données Google à des fins publicitaires ni ne
          les vendons à des tiers.
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>
            <strong>Fourniture du Service :</strong> Suivi des avis, génération
            et publication de réponses assistées par IA selon vos réglages, et
            affichage de tableaux de bord.
          </li>
          <li>
            <strong>Gestion de compte &amp; support :</strong> Création et
            gestion de votre compte, assistance et communication importante.
          </li>
          <li>
            <strong>Amélioration du Service :</strong> Analyse de données
            agrégées ou pseudonymisées pour améliorer la qualité des réponses et
            des fonctionnalités.
          </li>
          <li>
            <strong>Sécurité :</strong> Détection et prévention de la fraude, de
            l&apos;abus ou des incidents de sécurité.
          </li>
          <li>
            <strong>Analyse d&apos;usage (Google Analytics) :</strong> Mesure
            des performances et de l&apos;utilisation de l&apos;application. Vous
            pouvez gérer vos préférences dans votre compte Google ou les
            paramètres de votre appareil.
          </li>
          <li>
            <strong>Entraînement IA (opt‑in) :</strong> Si vous y consentez
            explicitement et disposez de plus de 1000 réponses, vos anciennes
            réponses peuvent être utilisées pour entraîner des modèles afin
            d&apos;améliorer les futures réponses de votre compte uniquement.
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">3. Partage des données</h2>
        <p>
          Nous ne vendons pas vos données personnelles. Nous partageons vos
          données uniquement avec :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Prestataires de services :</strong> Firebase, hébergement
            cloud, processeur de paiement, outils d&apos;e‑mail et de support,
            outils d&apos;analyse, fournisseurs d&apos;IA, agissant pour notre
            compte et tenus à la confidentialité.
          </li>
          <li>
            <strong>Fournisseurs d&apos;IA :</strong> Uniquement pour générer les
            réponses aux avis et résumés, sans usage marketing.
          </li>
          <li>
            <strong>Autorités :</strong> Si la loi l&apos;exige ou pour défendre
            nos droits ou ceux de nos utilisateurs.
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">
          4. Stockage et protection des données
        </h2>
        <p>
          Toutes les données sont stockées dans l&apos;infrastructure Google
          Firebase / Google Cloud, chiffrées en transit (HTTPS/TLS) et au repos.
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>
            <strong>Chiffrement :</strong> Données chiffrées en transit et au
            repos.
          </li>
          <li>
            <strong>Contrôles d&apos;accès :</strong> Accès limité au personnel
            autorisé.
          </li>
          <li>
            <strong>Gestion des secrets :</strong> Identifiants et clés
            sensibles stockés dans des variables d&apos;environnement sécurisées,
            jamais dans le code client.
          </li>
          <li>
            <strong>Règles de sécurité Firebase :</strong> Limitation stricte de
            l&apos;accès aux données utilisateur.
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">
          5. Conservation et suppression des données
        </h2>
        <p>
          Nous conservons vos données tant que votre compte reste actif et aussi
          longtemps que nécessaire pour fournir le Service.
        </p>
        <p className="mt-2">
          Après clôture du compte ou demande de suppression, nous
          commencerons à supprimer ou anonymiser vos données dans un délai de{" "}
          <strong>60 jours</strong>, sauf obligation légale de conservation plus
          longue.
        </p>
        <p>
          Vous pouvez demander des informations sur les données détenues ou
          solliciter leur suppression en nous contactant aux coordonnées
          ci‑dessous.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          6. Vos droits et vos choix
        </h2>
        <p>
          Vous pouvez consulter et mettre à jour la plupart de vos
          informations de compte dans le tableau de bord. Vous pouvez demander
          l&apos;accès, la correction ou la suppression de vos données en nous
          contactant.
        </p>
        <p>
          Vous pouvez également révoquer l&apos;accès de GBReplAi à votre fiche
          Google via les paramètres de sécurité de votre compte Google.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          7. Modifications de cette politique
        </h2>
        <p>
          Nous pouvons mettre à jour cette politique de confidentialité. La date
          &quot;Dernière mise à jour&quot; sera révisée en conséquence. En cas
          de changement important, nous vous informerons via l&apos;application
          ou par e‑mail.
        </p>

        <h2 className="mt-6 text-xl font-semibold">8. Nous contacter</h2>
        <p>
          Pour toute question relative à cette politique de confidentialité :
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
          Voir aussi nos{" "}
          <Link href="/terms" className="text-primary underline">
            Conditions d&apos;utilisation
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
        <h1 className="text-3xl font-bold tracking-tight">
          سياسة الخصوصية
        </h1>
        <p className="text-sm text-muted-foreground">GBReplAi من Greotech</p>
        <p className="text-xs text-muted-foreground">
          <strong>تاريخ السريان:</strong> 12/12/2025 <br />
          <strong>آخر تحديث:</strong> 12/12/2025
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-right">
        <p>
          توضح هذه السياسة كيفية قيام Greotech (&quot;نحن&quot;) بجمع بياناتك
          واستخدامها وتخزينها ومشاركتها عند استخدامك لخدمة GBReplAi
          (&quot;الخدمة&quot;).
        </p>

        <h2 className="mt-6 text-xl font-semibold">1. البيانات التي نصل إليها</h2>
        <p>
          لا نصل إلا إلى الحد الأدنى من البيانات اللازمة لتقديم الخدمة وتحسينها.
        </p>

        <h3 className="mt-3 text-base font-semibold">
          1.1 بيانات Google التي يتم الوصول إليها عبر واجهات Google API
        </h3>
        <p>
          عند ربط ملفك على Google Business Profile من خلال OAuth وبموافقتك
          الصريحة، نصل إلى:
        </p>
        <ul className="list-disc pr-6 space-y-1">
          <li>
            <strong>مراجعات Google:</strong> نص المراجعة، التقييم، الاسم
            المعروض للمراجع، وتاريخ إنشاء المراجعة.
          </li>
          <li>
            <strong>بيانات الملف التجاري:</strong> اسم النشاط، معرّفات
            الأنشطة، الفئات، العنوان الرئيسي، وبعض الإعدادات اللازمة لإدارة
            مواقعك.
          </li>
          <li>
            <strong>سجل الردود:</strong> الردود السابقة للمالك على المراجعات
            وتواريخ نشرها.
          </li>
          <li>
            <strong>معلومات هوية حساب Google:</strong> معرّف الحساب، البريد
            الإلكتروني، ومعلومات الملف الشخصي الأساسية (الاسم وصورة الملف
            الشخصي) لربط حسابك في Google بحسابك في GBReplAi.
          </li>
        </ul>

        <p className="mt-3">
          نستخدم النطاقات (Scopes) التالية من OAuth للوصول إلى هذه البيانات:
        </p>
        <ul className="list-disc pr-6 space-y-1">
          <li>
            <code>https://www.googleapis.com/auth/business.manage</code> – لقراءة
            بيانات ملفك التجاري على Google (بما في ذلك المراجعات) ونشر ردود
            المالك نيابة عنك.
          </li>
          <li>
            <code>openid</code>،{" "}
            <code>https://www.googleapis.com/auth/userinfo.email</code>،{" "}
            <code>https://www.googleapis.com/auth/userinfo.profile</code> –
            لمصادقة حسابك في Google وربطه بحسابك في GBReplAi.
          </li>
        </ul>

        <h3 className="mt-3 text-base font-semibold">
          1.2 بيانات أخرى نقوم بجمعها
        </h3>
        <ul className="list-disc pr-6 space-y-1">
          <li>
            <strong>بيانات الحساب:</strong> الاسم، البريد الإلكتروني، اسم
            الشركة، وغيرها من البيانات التي تقدمها عند التسجيل.
          </li>
          <li>
            <strong>بيانات الفوترة:</strong> المعلومات اللازمة لمعالجة
            المدفوعات (من خلال مزوّد دفع خارجي).
          </li>
          <li>
            <strong>بيانات تقنية وبيانات استخدام:</strong> عنوان IP، نوع
            الجهاز والمتصفح، الصفحات التي تزورها، الميزات المستخدمة، وأوقات
            الزيارة، وذلك لتحسين الأمان والأداء.
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">2. كيفية استخدام البيانات</h2>
        <p>
          نستخدم البيانات فقط للأغراض الموضحة أدناه ووفقًا لسياسة Google API
          Services User Data. لا نستخدم بياناتك للإعلانات أو بيعها لأطراف
          أخرى.
        </p>
        <ul className="list-disc pr-6 space-y-1 mt-2">
          <li>
            <strong>تقديم الخدمة:</strong> متابعة المراجعات، توليد ردود مدعومة
            بالذكاء الاصطناعي ونشرها بحسب إعداداتك، وعرض تحليلات حول أداء
            المراجعات والردود.
          </li>
          <li>
            <strong>إدارة الحساب والدعم:</strong> إنشاء وإدارة حسابك، تقديم
            الدعم، وإرسال إشعارات مهمة مثل تغييرات الخدمة أو مشكلات الأمان.
          </li>
          <li>
            <strong>تحسين الخدمة:</strong> تحليل بيانات مجمّعة أو منزوعة
            الهوية لتحسين جودة النماذج والميزات.
          </li>
          <li>
            <strong>الأمان ومكافحة إساءة الاستخدام:</strong> الكشف عن الاحتيال
            أو إساءة الاستخدام ومنعها والتحقيق فيها.
          </li>
          <li>
            <strong>تحليلات الاستخدام (Google Analytics):</strong> قياس
            استخدام التطبيق وأدائه. يمكنك التحكم في تفضيلاتك من خلال إعدادات
            حساب Google أو الجهاز.
          </li>
          <li>
            <strong>تدريب النماذج (اختياري):</strong> إذا قمت بالموافقة
            الصريحة وكان لديك أكثر من 1000 رد، يمكن استخدام ردودك السابقة
            لتحسين النماذج الخاصة بحسابك. هذا الخيار مُعطّل افتراضيًا ويمكنك
            إيقافه في أي وقت.
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">3. مشاركة البيانات</h2>
        <p>
          لا نقوم ببيع بياناتك الشخصية. قد نشارك بياناتك فقط مع مزوّدي خدمات
          موثوقين يعملون لصالحنا وتحت إشرافنا، مثل:
        </p>
        <ul className="list-disc pr-6 space-y-1">
          <li>Firebase (الاستضافة وقاعدة البيانات والمصادقة)،</li>
          <li>مزودي البنية التحتية السحابية،</li>
          <li>مزود الدفع،</li>
          <li>خدمات البريد الإلكتروني والدعم،</li>
          <li>أدوات التحليلات،</li>
          <li>مزوّدي نماذج الذكاء الاصطناعي لتوليد الردود.</li>
        </ul>
        <p>
          قد نكشف عن بياناتك إذا طُلب منا ذلك قانونيًا أو لحماية حقوقنا أو
          حقوق مستخدمينا.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          4. تخزين البيانات وحمايتها
        </h2>
        <p>
          يتم تخزين جميع البيانات على بنية Google Firebase / Google Cloud
          مع تشفير أثناء النقل (HTTPS/TLS) وعند التخزين.
        </p>
        <ul className="list-disc pr-6 space-y-1 mt-2">
          <li>تشفير للبيانات أثناء النقل وعند التخزين.</li>
          <li>تقييد الوصول للموظفين المخوّلين فقط.</li>
          <li>
            تخزين المفاتيح والأسرار (مثل مفاتيح OAuth) في إعدادات آمنة وليس في
            كود الواجهة الأمامية.
          </li>
          <li>استخدام قواعد أمان Firebase لتقييد الوصول للبيانات.</li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">
          5. الاحتفاظ بالبيانات وحذفها
        </h2>
        <p>
          نحتفظ ببياناتك ما دام حسابك نشطًا وبالقدر اللازم لتقديم الخدمة.
        </p>
        <p className="mt-2">
          عند إغلاق حسابك أو طلب الحذف، نبدأ في حذف بياناتك أو إخفاء هويتها من
          أنظمتنا النشطة خلال{" "}
          <strong>60 يومًا</strong>، ما لم يفرض القانون الاحتفاظ بها لمدة
          أطول.
        </p>
        <p>
          يمكنك طلب معرفة البيانات التي نحتفظ بها أو طلب حذفها عبر التواصل
          معنا.
        </p>

        <h2 className="mt-6 text-xl font-semibold">6. حقوقك واختياراتك</h2>
        <p>
          يمكنك تعديل معظم بيانات حسابك من داخل لوحة التحكم. يمكنك أيضًا
          التواصل معنا لطلب الوصول إلى بياناتك أو تصحيحها أو حذفها.
        </p>
        <p>
          يمكنك إلغاء وصول GBReplAi إلى ملفك على Google في أي وقت من خلال
          إعدادات أمان حساب Google الخاص بك.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          7. التغييرات على سياسة الخصوصية
        </h2>
        <p>
          قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم تعديل تاريخ &quot;آخر
          تحديث&quot; في أعلى الصفحة. في حالة التغييرات الجوهرية، قد نخطرك عبر
          البريد الإلكتروني أو داخل التطبيق.
        </p>

        <h2 className="mt-6 text-xl font-semibold">8. الاتصال بنا</h2>
        <p>للاستفسار حول سياسة الخصوصية أو بياناتك، يمكنك التواصل معنا:</p>
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
          <Link href="/terms" className="text-primary underline">
            شروط الاستخدام
          </Link>
          .
        </p>
      </section>
    </>
  );
}
