
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheckIcon } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
         <div className="flex justify-center items-center gap-3 mb-4">
            <ShieldCheckIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Politique de Confidentialité
            </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Votre vie privée est importante pour nous. Cette Politique de Confidentialité explique comment {APP_NAME} collecte, utilise et protège vos informations personnelles.
        </p>
      </header>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Notre Engagement envers Votre Vie Privée</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Chez {APP_NAME}, nous nous engageons à protéger la confidentialité et la sécurité des informations personnelles de nos utilisateurs.
            Cette politique décrit nos pratiques concernant la collecte, l'utilisation et le partage de vos données.
          </p>
          <h3 className="text-xl font-semibold pt-2">Contenu de Remplacement</h3>
          <p className="text-muted-foreground">
            La Politique de Confidentialité détaillée pour {APP_NAME} est actuellement en cours de rédaction et sera disponible ici prochainement.
            Ce document expliquera quelles informations nous collectons, comment nous les utilisons et les choix dont vous disposez concernant vos informations.
          </p>
           <p className="text-muted-foreground">
            Les sujets généralement couverts incluent :
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
            <li>Informations que Nous Collectons (Informations Personnelles, Données d'Utilisation, Cookies)</li>
            <li>Comment Nous Utilisons Vos Informations</li>
            <li>Comment Nous Partageons Vos Informations</li>
            <li>Sécurité des Données</li>
            <li>Vos Droits en matière de Confidentialité (ex: Accès, Correction, Suppression)</li>
            <li>Confidentialité des Enfants</li>
            <li>Modifications de Cette Politique</li>
            <li>Coordonnées</li>
          </ul>
           <p className="text-muted-foreground">
            Veuillez revenir plus tard pour le document complet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
