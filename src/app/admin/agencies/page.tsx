
"use client";

import type { NextPage } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BuildingIcon, PlusCircle, Edit3, Trash2, ArrowLeft, MoreHorizontal, EyeIcon, ShieldAlert, Ban, CheckCircle } from 'lucide-react';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { AdminAgency } from '@/types';
import { MOCK_ADMIN_AGENCIES } from '@/lib/constants';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminManageAgenciesPage: NextPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [agencies, setAgencies] = useState<AdminAgency[]>(MOCK_ADMIN_AGENCIES);
  const [agencyToModify, setAgencyToModify] = useState<AdminAgency | null>(null);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  const openSuspendDialog = (agency: AdminAgency) => {
    setAgencyToModify(agency);
    setIsSuspendDialogOpen(true);
  };

  const openDeleteDialog = (agency: AdminAgency) => {
    setAgencyToModify(agency);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleSuspendAgency = () => {
    if (!agencyToModify) return;

    const newStatus: AdminAgency['status'] = agencyToModify.status === 'Suspendue' ? 'Approuvée' : 'Suspendue';
    const agencyIndex = MOCK_ADMIN_AGENCIES.findIndex(a => a.id === agencyToModify.id);
    if (agencyIndex !== -1) {
      MOCK_ADMIN_AGENCIES[agencyIndex].status = newStatus;
      // Ensure permissions are appropriately set if re-activating from suspended
      if (newStatus === 'Approuvée' && MOCK_ADMIN_AGENCIES[agencyIndex].permissions) {
         MOCK_ADMIN_AGENCIES[agencyIndex].permissions!.canListCars = true;
         MOCK_ADMIN_AGENCIES[agencyIndex].permissions!.canManageBookings = true;
      } else if (newStatus === 'Suspendue' && MOCK_ADMIN_AGENCIES[agencyIndex].permissions) {
         MOCK_ADMIN_AGENCIES[agencyIndex].permissions!.canListCars = false;
         MOCK_ADMIN_AGENCIES[agencyIndex].permissions!.canManageBookings = false;
      }
    }
    setAgencies([...MOCK_ADMIN_AGENCIES]);
    toast({
      title: `Statut de l'agence ${agencyToModify.name} mis à jour`,
      description: `L'agence est maintenant ${newStatus.toLowerCase()}.`,
    });
    setIsSuspendDialogOpen(false);
    setAgencyToModify(null);
  };

  const handleDeleteAgency = () => {
    if (!agencyToModify) return;
    const agencyIndex = MOCK_ADMIN_AGENCIES.findIndex(a => a.id === agencyToModify.id);
    if (agencyIndex !== -1) {
      MOCK_ADMIN_AGENCIES.splice(agencyIndex, 1);
    }
    setAgencies([...MOCK_ADMIN_AGENCIES]);
    toast({
      title: "Agence Supprimée (Simulation)",
      description: `L'agence ${agencyToModify.name} a été supprimée de la liste.`,
      variant: "destructive"
    });
    setIsDeleteDialogOpen(false);
    setAgencyToModify(null);
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
                    <TableHead className="hidden lg:table-cell">Créée le</TableHead>
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
                      <TableCell className="hidden lg:table-cell">
                        {format(parseISO(agency.createdAt), 'dd/MM/yyyy', { locale: fr })}
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
                            <DropdownMenuLabel>Actions Admin</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/admin/agencies/${agency.id}`)}>
                              <EyeIcon className="mr-2 h-4 w-4" /> Voir Détails
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => router.push(`/admin/agencies/${agency.id}/edit`)}>
                              <Edit3 className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => router.push(`/admin/agencies/${agency.id}/permissions`)}>
                              <ShieldAlert className="mr-2 h-4 w-4" /> Gérer Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openSuspendDialog(agency)}>
                               {agency.status === 'Suspendue' ? <CheckCircle className="mr-2 h-4 w-4 text-green-600"/> : <Ban className="mr-2 h-4 w-4 text-destructive"/>}
                              {agency.status === 'Suspendue' ? "Réactiver" : "Suspendre"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onClick={() => openDeleteDialog(agency)}
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

      {/* Suspend/Reactivate Dialog */}
      <AlertDialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer {agencyToModify?.status === 'Suspendue' ? 'Réactivation' : 'Suspension'}</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir {agencyToModify?.status === 'Suspendue' ? 'réactiver' : 'suspendre'} l'agence "{agencyToModify?.name}" ?
              {agencyToModify?.status !== 'Suspendue' && " Cela pourrait affecter sa capacité à lister des voitures et à gérer des réservations."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAgencyToModify(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleSuspendAgency}>
              Confirmer {agencyToModify?.status === 'Suspendue' ? 'Réactivation' : 'Suspension'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer Suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement l'agence "{agencyToModify?.name}" ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAgencyToModify(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAgency} className={buttonVariants({variant: "destructive"})}>
              Supprimer Définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminManageAgenciesPage;

    