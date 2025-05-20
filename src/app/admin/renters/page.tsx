
// src/app/admin/renters/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminManageRentersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/admin/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Tableau de Bord Admin
        </Link>
      </Button>
      <div className="flex items-center gap-3 mb-6">
        <UsersIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Gérer les Locataires</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Locataires</CardTitle>
          <CardDescription>
            Cette section affichera tous les locataires enregistrés, avec des options pour
            visualiser les détails, suspendre ou supprimer des comptes. Fonctionnalité à venir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Le contenu et les outils de gestion des locataires seront disponibles ici prochainement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
