
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListChecksIcon, PlusCircle } from "lucide-react";

export default function AgencyListingsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ListChecksIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Mes Annonces de Voitures</h1>
        </div>
        <CardDescription>Visualisez, modifiez et gérez vos annonces de voitures. Ajoutez de nouvelles voitures pour agrandir votre flotte.</CardDescription>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Gérez Votre Flotte</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Cette section est en construction. Ici, vous pourrez voir toutes vos voitures listées, modifier leurs détails,
            et gérer leur statut.
          </p>
          <Button asChild>
            <Link href="/account/listings/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Ajouter une Nouvelle Annonce de Voiture
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
