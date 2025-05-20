
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building, Mail, User, Phone, MapPin, Edit3Icon, Save, PlusCircle, Trash2, UserCircleIcon } from 'lucide-react';
import { MOCK_ADMIN_AGENCIES } from '@/lib/constants';
import type { AdminAgency, ContactPerson } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';

export default function AdminEditAgencyPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const agencyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialAgencyData, setInitialAgencyData] = useState<AdminAgency | null>(null);

  // Form state
  const [agencyName, setAgencyName] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyAddress, setAgencyAddress] = useState('');
  const [agencyDescription, setAgencyDescription] = useState('');
  const [agencyPhoneNumber, setAgencyPhoneNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [otherContacts, setOtherContacts] = useState<ContactPerson[]>([]);
  
  // Dialog state for adding new contact
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  

  useEffect(() => {
    if (agencyId) {
      const agencyToEdit = MOCK_ADMIN_AGENCIES.find(agency => agency.id === agencyId);
      if (agencyToEdit) {
        setInitialAgencyData(agencyToEdit);
        setAgencyName(agencyToEdit.name);
        setAgencyEmail(agencyToEdit.contactEmail);
        setAgencyAddress(agencyToEdit.agencyAddress || '');
        setAgencyDescription(agencyToEdit.description || '');
        setAgencyPhoneNumber(agencyToEdit.phoneNumber || '');
        setOwnerName(agencyToEdit.ownerName || '');
        setOwnerEmail(agencyToEdit.ownerEmail || '');
        setOwnerPhone(agencyToEdit.ownerPhone || '');
        setOtherContacts(agencyToEdit.otherContacts || []);
      } else {
        toast({ title: "Agence non trouvée", description: "Impossible de trouver les détails de l'agence à modifier.", variant: "destructive" });
        router.push('/admin/agencies');
      }
      setLoading(false);
    }
  }, [agencyId, router, toast]);

  const handleAddOtherContact = () => {
    if (!newContactName.trim()) {
      toast({ title: "Nom du contact requis", description: "Veuillez entrer le nom du nouveau contact.", variant: "destructive" });
      return;
    }
    const newContact: ContactPerson = {
      id: `contact-${Date.now()}`, // Simple unique ID for client-side
      name: newContactName.trim(),
      email: newContactEmail.trim() || undefined,
      phone: newContactPhone.trim() || undefined,
      role: newContactRole.trim() || undefined,
    };
    setOtherContacts(prev => [...prev, newContact]);
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setNewContactRole('');
    setIsAddContactDialogOpen(false);
    toast({ title: "Contact Ajouté", description: `${newContact.name} a été ajouté aux contacts de l'agence.`});
  };

  const handleRemoveOtherContact = (contactId: string) => {
    setOtherContacts(prev => prev.filter(contact => contact.id !== contactId));
    toast({ title: "Contact Supprimé", description: "Le contact a été retiré de la liste.", variant: "destructive"});
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!agencyName || !agencyEmail || !ownerName || !ownerEmail) {
      toast({ title: "Champs Obligatoires Manquants", description: "Veuillez remplir tous les champs marqués d'un *.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const agencyIndex = MOCK_ADMIN_AGENCIES.findIndex(agency => agency.id === agencyId);
    if (agencyIndex === -1) {
        toast({ title: "Erreur", description: "Agence non trouvée pour la mise à jour.", variant: "destructive" });
        setSubmitting(false);
        return;
    }
    
    const updatedAgencyData: AdminAgency = {
        ...MOCK_ADMIN_AGENCIES[agencyIndex],
        name: agencyName,
        contactEmail: agencyEmail,
        agencyAddress: agencyAddress,
        description: agencyDescription,
        phoneNumber: agencyPhoneNumber,
        ownerName: ownerName,
        ownerEmail: ownerEmail,
        ownerPhone: ownerPhone,
        otherContacts: otherContacts,
    };
    
    MOCK_ADMIN_AGENCIES[agencyIndex] = updatedAgencyData;

    console.log('Détails Agence Mis à Jour (simulation) :', updatedAgencyData);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitting(false);
    toast({
      title: "Agence Mise à Jour !",
      description: `Les informations pour ${agencyName} ont été mises à jour (simulation côté client).`,
    });
    router.push(`/admin/agencies/${agencyId}`); 
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement des informations de l'agence...</div>;
  }

  if (!initialAgencyData) {
    return <div className="container mx-auto px-4 py-12 text-center">Agence non trouvée.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href={`/admin/agencies/${agencyId}`}> 
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Détails de l'Agence
        </Link>
      </Button>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Edit3Icon className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Modifier l'Agence</CardTitle>
          </div>
          <CardDescription>
            Mettez à jour les informations pour l'agence : {initialAgencyData.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Informations de l'Agence</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agencyName" className="flex items-center gap-1 mb-1"><Building className="h-4 w-4 text-muted-foreground"/>Nom de l'Agence *</Label>
                  <Input id="agencyName" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="ex. Locations Auto Rapides" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agencyEmail" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Email de Contact de l'Agence *</Label>
                    <Input id="agencyEmail" type="email" value={agencyEmail} onChange={(e) => setAgencyEmail(e.target.value)} placeholder="contact@agence.com" required />
                  </div>
                   <div>
                    <Label htmlFor="agencyPhoneNumber" className="flex items-center gap-1 mb-1"><Phone className="h-4 w-4 text-muted-foreground"/>Téléphone de l'Agence</Label>
                    <Input id="agencyPhoneNumber" type="tel" value={agencyPhoneNumber} onChange={(e) => setAgencyPhoneNumber(e.target.value)} placeholder="01 23 45 67 89" />
                  </div>
                </div>
                 <div>
                    <Label htmlFor="agencyAddress" className="flex items-center gap-1 mb-1"><MapPin className="h-4 w-4 text-muted-foreground"/>Adresse de l'Agence</Label>
                    <Input id="agencyAddress" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} placeholder="123 Rue Principale, Ville" />
                  </div>
                 <div>
                    <Label htmlFor="agencyDescription" className="flex items-center gap-1 mb-1">Description de l'Agence</Label>
                    <Textarea id="agencyDescription" value={agencyDescription} onChange={(e) => setAgencyDescription(e.target.value)} placeholder="Décrivez brièvement votre agence..." rows={3} />
                  </div>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Informations du Propriétaire/Contact Principal</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ownerName" className="flex items-center gap-1 mb-1"><User className="h-4 w-4 text-muted-foreground"/>Nom Complet du Propriétaire *</Label>
                  <Input id="ownerName" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="ex. Jean Dupont" required />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="ownerEmail" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Email du Propriétaire *</Label>
                        <Input id="ownerEmail" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="proprietaire@example.com" required />
                    </div>
                    <div>
                        <Label htmlFor="ownerPhone" className="flex items-center gap-1 mb-1"><Phone className="h-4 w-4 text-muted-foreground"/>Téléphone du Propriétaire</Label>
                        <Input id="ownerPhone" type="tel" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="06 01 02 03 04" />
                    </div>
                 </div>
              </div>
            </section>

            <Separator />

            <section>
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-xl font-semibold">Autres Contacts</h3>
                    <Dialog open={isAddContactDialogOpen} onOpenChange={(isOpen) => {
                        setIsAddContactDialogOpen(isOpen);
                        if (!isOpen) { // Reset dialog form on close
                            setNewContactName('');
                            setNewContactEmail('');
                            setNewContactPhone('');
                            setNewContactRole('');
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter Contact
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Ajouter un Nouveau Contact</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div>
                                    <Label htmlFor="newContactNameDialog" className="mb-1">Nom Complet *</Label>
                                    <Input id="newContactNameDialog" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} placeholder="ex. Alice Bertrand"/>
                                </div>
                                 <div>
                                    <Label htmlFor="newContactEmailDialog" className="mb-1">Email</Label>
                                    <Input id="newContactEmailDialog" type="email" value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} placeholder="alice.b@example.com"/>
                                </div>
                                 <div>
                                    <Label htmlFor="newContactPhoneDialog" className="mb-1">Téléphone</Label>
                                    <Input id="newContactPhoneDialog" type="tel" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} placeholder="07 12 34 56 78"/>
                                </div>
                                 <div>
                                    <Label htmlFor="newContactRoleDialog" className="mb-1">Rôle/Titre</Label>
                                    <Input id="newContactRoleDialog" value={newContactRole} onChange={(e) => setNewContactRole(e.target.value)} placeholder="ex. Manager, Support Technique"/>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">Annuler</Button>
                                </DialogClose>
                                <Button type="button" onClick={handleAddOtherContact}>Sauvegarder Contact</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                {otherContacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucun autre contact ajouté.</p>
                ) : (
                    <div className="space-y-3">
                        {otherContacts.map((contact) => (
                            <Card key={contact.id} className="p-3 bg-muted/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-sm flex items-center gap-2"><UserCircleIcon className="h-4 w-4 text-muted-foreground"/>{contact.name} {contact.role && <span className="text-xs text-muted-foreground">({contact.role})</span>}</p>
                                        {contact.email && <p className="text-xs text-muted-foreground ml-6 flex items-center gap-1"><Mail className="h-3 w-3"/>{contact.email}</p>}
                                        {contact.phone && <p className="text-xs text-muted-foreground ml-6 flex items-center gap-1"><Phone className="h-3 w-3"/>{contact.phone}</p>}
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOtherContact(contact.id)} aria-label="Supprimer contact">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
            
            <Button type="submit" size="lg" className="w-full mt-8" disabled={submitting}>
              <Save className="mr-2 h-5 w-5" />
              {submitting ? 'Sauvegarde en cours...' : 'Sauvegarder les Modifications'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Les champs marqués d'un * sont obligatoires.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
