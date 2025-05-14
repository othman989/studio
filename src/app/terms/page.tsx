
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileTextIcon } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
         <div className="flex justify-center items-center gap-3 mb-4">
            <FileTextIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Conditions d'Utilisation
            </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Veuillez lire attentivement ces Conditions d'Utilisation avant d'utiliser la plateforme {APP_NAME}.
        </p>
      </header>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Acceptation des Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            En accédant ou en utilisant notre Service, vous acceptez d'être lié par ces Conditions. Si vous n'êtes pas d'accord avec une partie des conditions, alors vous ne pouvez pas accéder au Service.
          </p>
          <h3 className="text-xl font-semibold pt-2">Contenu de Remplacement</h3>
          <p className="text-muted-foreground">
            Les Conditions d'Utilisation détaillées pour {APP_NAME} sont actuellement en cours de rédaction et seront disponibles ici prochainement.
            Ce document décrira les règles et réglementations pour l'utilisation du site Web de {APP_NAME}.
          </p>
          <p className="text-muted-foreground">
            Les sujets généralement couverts incluent :
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
            <li>Comptes Utilisateurs et Responsabilités</li>
            <li>Obligations des Agences de Location</li>
            <li>Politiques de Réservation et d'Annulation</li>
            <li>Conditions de Paiement</li>
            <li>Droits de Propriété Intellectuelle</li>
            <li>Limitation de Responsabilité</li>
            <li>Droit Applicable</li>
            <li>Modifications des Conditions</li>
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
