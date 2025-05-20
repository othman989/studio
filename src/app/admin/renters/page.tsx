
"use client";

import type { NextPage } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UsersIcon, PlusCircle, Edit3, Trash2, ArrowLeft, MoreHorizontal, EyeIcon, UserXIcon, UserCheckIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ClientProfile } from '@/types';
import { MOCK_CLIENTS } from '@/lib/constants';

const AdminManageRentersPage: NextPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [renters, setRenters] = useState<ClientProfile[]>(MOCK_CLIENTS);
  const [renterToModify, setRenterToModify] = useState<ClientProfile | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);

  const handleViewDetails = (renterId: string) => {
    router.push(`/admin/renters/${renterId}`);
  };

  const openBlacklistDialog = (renter: ClientProfile) => {
    setRenterToModify(renter);
    setIsBlacklistDialogOpen(true);
  };

  const handleToggleBlacklist = () => {
    if (!renterToModify) return;

    const renterIndex = MOCK_CLIENTS.findIndex(r => r.id === renterToModify.id);
    if (renterIndex !== -1) {
      MOCK_CLIENTS[renterIndex].isBlacklisted = !MOCK_CLIENTS[renterIndex].isBlacklisted;
      setRenters([...MOCK_CLIENTS]); // Update local state to trigger re-render
      toast({
        title: `Statut du Locataire Mis à Jour`,
        description: `${renterToModify.fullName} a été ${MOCK_CLIENTS[renterIndex].isBlacklisted ? 'ajouté à' : 'retiré de'} la liste noire.`,
      });
    }
    setIsBlacklistDialogOpen(false);
    setRenterToModify(null);
  };

  const openDeleteDialog = (renter: ClientProfile) => {
    setRenterToModify(renter);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteRenter = () => {
    if (!renterToModify) return;

    const renterIndex = MOCK_CLIENTS.findIndex(r => r.id === renterToModify.id);
    if (renterIndex !== -1) {
      MOCK_CLIENTS.splice(renterIndex, 1);
    }
    setRenters([...MOCK_CLIENTS]);
    toast({ 
        title: "Locataire Supprimé (Simulation)", 
        description: `Le locataire ${renterToModify.fullName} a été supprimé.`, 
        variant: "destructive" 
    });
    setIsDeleteDialogOpen(false);
    setRenterToModify(null);
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
        <CardDescription>Visualisez, modifiez, ajoutez à la liste noire ou supprimez des comptes locataires.</CardDescription>
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
                    <TableHead>Statut</TableHead>
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
                        {renter.isBlacklisted ? (
                          <Badge variant={'destructive'}>Liste Noire</Badge>
                        ) : (
                          <Badge variant={'default'} className='bg-green-600 hover:bg-green-700'>Actif</Badge>
                        )}
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
                             <DropdownMenuItem onClick={() => openBlacklistDialog(renter)}>
                              {renter.isBlacklisted ? (
                                <UserCheckIcon className="mr-2 h-4 w-4 text-green-600" />
                              ) : (
                                <UserXIcon className="mr-2 h-4 w-4 text-orange-600" />
                              )}
                              {renter.isBlacklisted ? "Retirer de la liste noire" : "Ajouter à la liste noire"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onClick={() => openDeleteDialog(renter)}
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

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer Suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement le locataire "{renterToModify?.fullName}" ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRenterToModify(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRenter} className={buttonVariants({variant: "destructive"})}>
              Supprimer Définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Blacklist Dialog */}
      <AlertDialog open={isBlacklistDialogOpen} onOpenChange={setIsBlacklistDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'Action sur la Liste Noire</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir {renterToModify?.isBlacklisted ? 'retirer' : 'ajouter'} "{renterToModify?.fullName}" {renterToModify?.isBlacklisted ? 'de la' : 'à la'} liste noire ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRenterToModify(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleBlacklist} 
              className={renterToModify?.isBlacklisted ? '' : buttonVariants({variant: "destructive"})}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminManageRentersPage;
