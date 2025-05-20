
// src/app/admin/agencies/new/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlusIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminCreateAgencyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/admin/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Tableau de Bord Admin
        </Link>
      </Button>
      <div className="flex items-center gap-3 mb-6">
        <UserPlusIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Créer un Compte Agence</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Formulaire de Création de Compte Agence</CardTitle>
          <CardDescription>
            Cette section permettra aux administrateurs de créer manuellement un nouveau compte pour une agence de location.
            Fonctionnalité à venir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Le formulaire de création de compte agence sera disponible ici prochainement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
