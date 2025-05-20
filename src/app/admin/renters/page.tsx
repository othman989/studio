
"use client";

import type { NextPage } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UsersIcon, PlusCircle, Edit3, Trash2, ArrowLeft, MoreHorizontal, EyeIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ClientProfile } from '@/types';
import { MOCK_CLIENTS } from '@/lib/constants'; // Assuming MOCK_CLIENTS is in constants

const AdminManageRentersPage: NextPage = () => {
  const { toast } = useToast();
  const [renters, setRenters] = useState<ClientProfile[]>(MOCK_CLIENTS); // Use MOCK_CLIENTS

  const handleViewDetails = (renterId: string) => {
    toast({ title: "Fonctionnalité à venir", description: `La visualisation des détails du locataire ${renterId} sera bientôt disponible.` });
  };

  const handleSuspendRenter = (renterId: string) => {
    // Simulate suspension toggle - in a real app, update status in DB
    toast({ title: "Fonctionnalité à venir", description: `La suspension du locataire ${renterId} sera bientôt disponible.` });
  };

  const handleDeleteRenter = (renterId: string) => {
    toast({ title: "Fonctionnalité à venir", description: `La suppression du locataire ${renterId} sera bientôt disponible.`, variant: "destructive" });
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
          <UsersIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gérer les Locataires</h1>
        </div>
        <CardDescription>Visualisez, modifiez ou suspendez des comptes locataires.</CardDescription>
      </header>

      <div className="mb-6 text-right">
        <Button asChild>
          <Link href="/admin/renters/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Créer un Nouveau Locataire
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Liste des Locataires Enregistrés</CardTitle>
           <CardDescription>
            {renters.length} locataire{renters.length > 1 ? 's' : ''} trouvé{renters.length > 1 ? 's' : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renters.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucun locataire enregistré pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">N° Permis</TableHead>
                    <TableHead>Statut (Simulé)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renters.map((renter) => (
                    <TableRow key={renter.id}>
                      <TableCell className="font-medium">{renter.fullName}</TableCell>
                      <TableCell className="hidden sm:table-cell">{renter.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{renter.licenseNumber || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={'default'} className='bg-green-600 hover:bg-green-700'>Actif</Badge> 
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
                            <DropdownMenuItem onClick={() => handleViewDetails(renter.id)}>
                              <EyeIcon className="mr-2 h-4 w-4" /> Voir Détails
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleSuspendRenter(renter.id)}>
                              <Edit3 className="mr-2 h-4 w-4" /> Suspendre/Réactiver
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onClick={() => handleDeleteRenter(renter.id)}
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

export default AdminManageRentersPage;
