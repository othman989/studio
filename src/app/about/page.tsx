
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
        <div className="flex justify-center items-center gap-3 mb-4">
            <InfoIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
            À Propos de {APP_NAME}
            </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Apprenez-en plus sur notre mission, notre vision et l'équipe derrière {APP_NAME}.
        </p>
      </header>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Notre Histoire</CardTitle>
          <CardDescription>
            Connecter les locataires de voitures avec des agences locales de confiance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Bienvenue chez {APP_NAME}, votre destination de choix pour des locations de voitures sans tracas et une expérience de covoiturage transparente.
            Notre plateforme est née d'un désir de simplifier le processus de location de voitures, facilitant la recherche du véhicule parfait pour les locataires
            et permettant aux agences de location d'atteindre un public plus large.
          </p>
          <p className="text-muted-foreground">
            <strong>Notre Mission :</strong> Révolutionner l'industrie de la location de voitures en fournissant un marché transparent, efficace et convivial
            qui profite à la fois aux locataires et aux agences de location. Nous visons à autonomiser les entreprises locales et à offrir un choix et une commodité inégalés aux voyageurs.
          </p>
           <p className="text-muted-foreground">
            <strong>Notre Vision :</strong> Être la principale plateforme mondiale de covoiturage et de location, favorisant une communauté bâtie sur la confiance, la fiabilité et l'innovation.
            Nous envisageons un avenir où la location d'une voiture sera aussi simple que quelques clics, partout dans le monde.
          </p>
          <p className="text-muted-foreground">
            Le contenu de cette page est actuellement en cours de développement. Plus de détails sur notre équipe, nos valeurs et notre parcours seront bientôt ajoutés !
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
