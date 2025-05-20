
"use client";

import type { NextPage } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BuildingIcon, PlusCircle, Edit3, Trash2, ArrowLeft, MoreHorizontal, EyeIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MockAgency {
  id: string;
  name: string;
  contactEmail: string;
  status: 'Approuvée' | 'En attente' | 'Suspendue';
  listingsCount: number;
  createdAt: string;
}

const MOCK_AGENCIES: MockAgency[] = [
  { id: 'agency1', name: 'Location Verte Paris', contactEmail: 'contact@verteparis.fr', status: 'Approuvée', listingsCount: 3, createdAt: '2023-01-15' },
  { id: 'agency2', name: 'EV Loc Lyon', contactEmail: 'info@evlyon.com', status: 'Approuvée', listingsCount: 5, createdAt: '2023-03-20' },
  { id: 'agency3', name: 'Sud Auto Plaisir', contactEmail: 'sudauto@example.com', status: 'En attente', listingsCount: 0, createdAt: '2024-05-10' },
  { id: 'agency4', name: 'Roues Agiles Bordeaux', contactEmail: 'bordeaux@rouesagiles.fr', status: 'Suspendue', listingsCount: 2, createdAt: '2022-11-01' },
];

const AdminManageAgenciesPage: NextPage = () => {
  const { toast } = useToast();
  const [agencies, setAgencies] = useState<MockAgency[]>(MOCK_AGENCIES);

  const handleViewDetails = (agencyId: string) => {
    toast({ title: "Fonctionnalité à venir", description: `La visualisation des détails de l'agence ${agencyId} sera bientôt disponible.` });
  };

  const handleSuspendAgency = (agencyId: string) => {
    toast({ title: "Fonctionnalité à venir", description: `La suspension de l'agence ${agencyId} sera bientôt disponible.` });
     setAgencies(prev => prev.map(a => a.id === agencyId ? {...a, status: a.status === 'Suspendue' ? 'Approuvée' : 'Suspendue'} : a));
  };

  const handleDeleteAgency = (agencyId: string) => {
    toast({ title: "Fonctionnalité à venir", description: `La suppression de l'agence ${agencyId} sera bientôt disponible.`, variant: "destructive" });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/admin/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Tableau de Bord Admin
        </Link>
      </Button>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BuildingIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gérer les Agences de Location</h1>
        </div>
        <CardDescription>Approuvez, visualisez, suspendez ou supprimez des comptes d'agence.</CardDescription>
      </header>

      <div className="mb-6 text-right">
        <Button asChild>
          <Link href="/admin/agencies/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Créer une Nouvelle Agence
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Liste des Agences Enregistrées</CardTitle>
          <CardDescription>
            {agencies.length} agence{agencies.length > 1 ? 's' : ''} trouvée{agencies.length > 1 ? 's' : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agencies.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucune agence enregistrée pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom de l'Agence</TableHead>
                    <TableHead className="hidden sm:table-cell">Email de Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Annonces</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agencies.map((agency) => (
                    <TableRow key={agency.id}>
                      <TableCell className="font-medium">{agency.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{agency.contactEmail}</TableCell>
                      <TableCell className="hidden md:table-cell">{agency.listingsCount}</TableCell>
                      <TableCell>
                        <Badge variant={
                          agency.status === 'Approuvée' ? 'default' :
                          agency.status === 'En attente' ? 'secondary' : 'destructive'
                        } className={agency.status === 'Approuvée' ? 'bg-green-600 hover:bg-green-700' : ''}>
                          {agency.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Ouvrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(agency.id)}>
                              <EyeIcon className="mr-2 h-4 w-4" /> Voir Détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSuspendAgency(agency.id)}>
                              <Edit3 className="mr-2 h-4 w-4" /> 
                              {agency.status === 'Suspendue' ? "Réactiver" : "Suspendre"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onClick={() => handleDeleteAgency(agency.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManageAgenciesPage;
