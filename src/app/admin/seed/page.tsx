
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DatabaseZap } from "lucide-react";
import { seedDatabase } from "./actions";

export default function SeedPage() {
  const { toast } = useToast();

  const handleSeed = async () => {
    const result = await seedDatabase();
    if (result.success) {
      toast({
        title: "Base de données amorcée avec succès",
        description: `${result.count} documents de voitures ont été écrits dans la collection 'cars' de Firestore.`,
      });
    } else {
      toast({
        title: "Erreur lors de l'amorçage de la base de données",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <DatabaseZap className="h-8 w-8 text-primary" />
            <CardTitle>Amorcer la base de données Firestore</CardTitle>
          </div>
          <CardDescription>
            Cliquez sur le bouton ci-dessous pour remplir votre base de données Firestore avec les données de voitures d'exemple du projet. Cela créera une collection 'cars' et y ajoutera les véhicules fictifs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSeed}>
            <Button type="submit" className="w-full">
              Amorcer les données des voitures
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            Note : Cette action écrasera tous les documents existants dans la collection 'cars' qui ont le même ID que les données d'exemple.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
