
// src/app/admin/bookings/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarkedIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminManageBookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/admin/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Tableau de Bord Admin
        </Link>
      </Button>
      <div className="flex items-center gap-3 mb-6">
        <BookMarkedIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Gérer les Réservations (Vue Globale)</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Toutes les Réservations</CardTitle>
          <CardDescription>
            Cette section permettra aux administrateurs de visualiser et de gérer toutes les réservations
            sur la plateforme. Fonctionnalité à venir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Les outils de gestion globale des réservations seront disponibles ici prochainement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
