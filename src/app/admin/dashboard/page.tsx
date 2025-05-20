
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ShieldCheckIcon,
  UsersIcon,
  BuildingIcon,
  CarIcon,
  BookMarkedIcon,
  SettingsIcon,
  UserPlusIcon,
  BriefcaseIcon,
  WrenchIcon,
  ListChecksIcon
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboardPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const isAdmin = window.localStorage.getItem('isAdminLoggedIn') === 'true';
      if (!isAdmin) {
        router.push('/login'); // Redirect if not admin
      }
    }
  }, [router]);

  if (!mounted) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement du tableau de bord administrateur...</div>;
  }


  const managementSections = [
    {
      title: 'Gestion des Utilisateurs',
      icon: UsersIcon,
      links: [
        { href: '/admin/agencies', label: 'Gérer les Agences', icon: BuildingIcon, description: "Voir, approuver ou suspendre les comptes d'agence." },
        { href: '/admin/renters', label: 'Gérer les Locataires', icon: UsersIcon, description: "Voir ou gérer les comptes locataires." },
        { href: '/admin/agencies/new', label: 'Créer Compte Agence', icon: UserPlusIcon, description: "Ajouter manuellement une nouvelle agence." },
        { href: '/admin/renters/new', label: 'Créer Compte Locataire', icon: UserPlusIcon, description: "Ajouter manuellement un nouveau locataire." },
      ]
    },
    {
      title: 'Gestion du Contenu',
      icon: ListChecksIcon,
      links: [
        { href: '/admin/listings', label: 'Gérer les Annonces (Global)', icon: CarIcon, description: "Superviser toutes les annonces de voitures sur la plateforme." },
        { href: '/admin/bookings', label: 'Gérer les Réservations (Global)', icon: BookMarkedIcon, description: "Voir et gérer toutes les réservations." },
      ]
    },
    {
      title: 'Paramètres de la Plateforme',
      icon: SettingsIcon,
      links: [
        { href: '#', label: 'Paramètres Généraux (Bientôt)', icon: WrenchIcon, description: "Configurer les aspects clés de la plateforme." , disabled: true},
        { href: '#', label: 'Gestion des Permissions (Future)', icon: ShieldCheckIcon, description: "Définir les rôles et permissions (fonctionnalité avancée).", disabled: true },
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheckIcon className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Tableau de Bord Administrateur</h1>
        </div>
        <p className="text-lg text-muted-foreground">Gestion globale de la plateforme {APP_NAME}.</p>
      </header>

      {managementSections.map(section => (
        <section key={section.title} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
            <section.icon className="h-6 w-6 text-muted-foreground" />
            {section.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.links.map((link) => (
              <Card key={link.href} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col group">
                <CardHeader className="pb-3">
                   <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <link.icon className="h-7 w-7" />
                      </div>
                      <div>
                          <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">{link.label.replace(' (Bientôt)', '').replace(' (Global)', '').replace(' (Future)', '')}</CardTitle>
                          <CardDescription className="text-sm leading-tight">{link.description}</CardDescription>
                      </div>
                   </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-end pt-2">
                  <Button asChild className="w-full mt-auto" variant="outline" disabled={link.disabled}>
                    <Link href={link.disabled ? '#' : link.href}>
                      {link.label.includes('Créer') ? 'Accéder' : `Gérer ${link.label.replace('Gérer les ', '').replace(' (Global)', '').replace(' (Bientôt)', '').replace(' (Future)', '')}`}
                      {link.disabled && <span className="ml-1 text-xs">(Bientôt)</span>}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default AdminDashboardPage;
