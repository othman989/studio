
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, SettingsIcon, Palette, Bell, DollarSignIcon, LockIcon } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

const AdminSettingsPage = () => {
  const { toast } = useToast();

  const handleSettingAction = (settingName: string) => {
    toast({
      title: "Fonctionnalité à venir",
      description: `La gestion de "${settingName}" sera bientôt disponible.`,
    });
  };
  
  const settingsSections = [
    {
      title: "Apparence et Thème",
      icon: Palette,
      description: "Personnaliser l'apparence de la plateforme (couleurs, logo).",
      actionLabel: "Gérer le Thème",
      actionKey: "theme"
    },
    {
      title: "Notifications Administrateur",
      icon: Bell,
      description: "Configurer les préférences de notification pour les événements importants.",
      actionLabel: "Gérer les Notifications",
       actionKey: "notifications"
    },
    {
      title: "Paramètres de Paiement",
      icon: DollarSignIcon,
      description: "Gérer les passerelles de paiement, les commissions, etc.",
      actionLabel: "Configurer les Paiements",
      actionKey: "payments"
    },
    {
      title: "Sécurité et Accès",
      icon: LockIcon,
      description: "Gérer les paramètres de sécurité globaux, les rôles administrateur (avancé).",
      actionLabel: "Paramètres de Sécurité",
      actionKey: "security"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/admin/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Tableau de Bord Admin
        </Link>
      </Button>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Paramètres Généraux de la Plateforme</h1>
        </div>
        <p className="text-lg text-muted-foreground">Configurez les aspects essentiels de {APP_NAME}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => (
          <Card key={section.title} className="shadow-md">
            <CardHeader>
              <div className="flex items-start gap-3">
                <section.icon className="h-7 w-7 text-primary mt-1" />
                <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => handleSettingAction(section.title)}>
                {section.actionLabel}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
       <Card className="mt-8 bg-muted/30 border-dashed">
        <CardHeader>
            <CardTitle className="text-xl">Attention</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
            Ces paramètres sont des placeholders pour la démonstration. Dans une application réelle, ils nécessiteraient une intégration backend complexe.
            </p>
        </CardContent>
       </Card>
    </div>
  );
};

export default AdminSettingsPage;

    