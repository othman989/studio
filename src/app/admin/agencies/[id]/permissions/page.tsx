
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShieldCheckIcon, ListChecksIcon, BarChart3Icon, CheckCircle2Icon, BookMarkedIcon } from 'lucide-react';
import type { AdminAgency, AgencyPermission } from '@/types';
import { MOCK_ADMIN_AGENCIES } from '@/lib/constants';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const defaultPermissions: AgencyPermission = {
  canListCars: false,
  canAccessAnalytics: false,
  isVerified: false,
  canManageBookings: false,
};

export default function AgencyPermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const agencyId = params.id as string;

  const [agency, setAgency] = useState<AdminAgency | null>(null);
  const [permissions, setPermissions] = useState<AgencyPermission>(defaultPermissions);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const foundAgency = MOCK_ADMIN_AGENCIES.find(a => a.id === agencyId);
    if (foundAgency) {
      setAgency(foundAgency);
      setPermissions(foundAgency.permissions || defaultPermissions);
    }
    setLoading(false);
  }, [agencyId]);

  const handlePermissionChange = (permissionKey: keyof AgencyPermission, value: boolean) => {
    setPermissions(prev => ({ ...prev, [permissionKey]: value }));
  };

  const handleSaveChanges = () => {
    if (!agency) return;
    setSaving(true);

    // Simulate saving to MOCK_ADMIN_AGENCIES for client-side demo persistence
    const agencyIndex = MOCK_ADMIN_AGENCIES.findIndex(a => a.id === agencyId);
    if (agencyIndex !== -1) {
      MOCK_ADMIN_AGENCIES[agencyIndex] = {
        ...MOCK_ADMIN_AGENCIES[agencyIndex],
        permissions: { ...permissions }
      };
    }

    console.log(`Permissions sauvegardées pour ${agency.name}:`, permissions);
    toast({
      title: "Permissions Mises à Jour (Simulation)",
      description: `Les permissions pour l'agence ${agency.name} ont été mises à jour.`,
    });
    setTimeout(() => setSaving(false), 1000);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement des permissions...</div>;
  }

  if (!agency) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold mb-4">Agence non trouvée</h1>
        <Button asChild variant="outline">
          <Link href="/admin/agencies"><ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des agences</Link>
        </Button>
      </div>
    );
  }
  
  const permissionItems = [
    { key: 'canListCars', label: 'Peut lister des voitures', icon: ListChecksIcon, description: "Autoriser l'agence à ajouter et gérer des annonces de voitures."},
    { key: 'canManageBookings', label: 'Peut gérer les réservations', icon: BookMarkedIcon, description: "Autoriser l'agence à accepter/refuser les demandes de réservation."},
    { key: 'canAccessAnalytics', label: 'Accès aux analyses', icon: BarChart3Icon, description: "Autoriser l'agence à voir les statistiques de performance (fonctionnalité à venir)."},
    { key: 'isVerified', label: 'Statut Agence Vérifiée', icon: CheckCircle2Icon, description: "Marquer cette agence comme vérifiée (affiche un badge de confiance)."},
  ];


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href={`/admin/agencies/${agencyId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux détails de l'agence
        </Link>
      </Button>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheckIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gérer les Permissions</h1>
        </div>
        <CardDescription>Configurer les accès et permissions pour l'agence : <strong>{agency.name}</strong></CardDescription>
      </header>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle>Permissions de l'Agence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {permissionItems.map((item) => (
            <div key={item.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-start gap-3 mb-2 sm:mb-0">
                <item.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                    <Label htmlFor={`permission-${item.key}`} className="text-md font-semibold cursor-pointer">
                    {item.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <Switch
                id={`permission-${item.key}`}
                checked={permissions[item.key as keyof AgencyPermission]}
                onCheckedChange={(value) => handlePermissionChange(item.key as keyof AgencyPermission, value)}
                aria-label={item.label}
              />
            </div>
          ))}
          <Separator className="my-6" />
           <Button onClick={handleSaveChanges} disabled={saving} className="w-full sm:w-auto">
            {saving ? "Sauvegarde en cours..." : "Sauvegarder les Modifications"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
