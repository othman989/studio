
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarkedIcon } from "lucide-react";

export default function AgencyBookingsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
            <BookMarkedIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Demandes de Réservation</h1>
        </div>
        <CardDescription>Examinez et gérez les demandes de réservation entrantes pour vos véhicules.</CardDescription>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Gérer les Réservations</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Cette page affichera toutes les demandes de réservation (en attente, confirmées, terminées, annulées).
            Contenu et fonctionnalités à venir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
