
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { UserPlusIcon, ArrowLeft, Building, Mail, User, Phone, MapPin } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function AdminCreateAgencyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [agencyName, setAgencyName] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyAddress, setAgencyAddress] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!agencyName || !agencyEmail || !ownerName || !ownerEmail) {
      toast({ title: "Champs Obligatoires Manquants", description: "Veuillez remplir tous les champs marqués d'un *.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Simulate API call to create agency
    console.log('Création d\'une nouvelle agence (simulation) :', { agencyName, agencyEmail, agencyAddress, ownerName, ownerEmail, ownerPhone });
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitting(false);
    toast({
      title: "Compte Agence Créé !",
      description: `Le compte pour ${agencyName} a été créé avec succès. N'oubliez pas de communiquer les identifiants au propriétaire.`,
    });
    // Reset form or redirect
    setAgencyName('');
    setAgencyEmail('');
    setAgencyAddress('');
    setOwnerName('');
    setOwnerEmail('');
    setOwnerPhone('');
    router.push('/admin/agencies');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/admin/agencies">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la Gestion des Agences
        </Link>
      </Button>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <UserPlusIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Créer un Nouveau Compte Agence</CardTitle>
          </div>
          <CardDescription>
            Remplissez les informations ci-dessous pour enregistrer une nouvelle agence de location sur {APP_NAME}.
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
                    <Label htmlFor="agencyAddress" className="flex items-center gap-1 mb-1"><MapPin className="h-4 w-4 text-muted-foreground"/>Adresse de l'Agence</Label>
                    <Input id="agencyAddress" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} placeholder="123 Rue Principale, Ville" />
                  </div>
                </div>
              </div>
            </section>

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
                        <Input id="ownerPhone" type="tel" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="06 12 34 56 78" />
                    </div>
                 </div>
              </div>
            </section>
            
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Création en cours...' : 'Créer le Compte Agence'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Les champs marqués d'un * sont obligatoires. Un mot de passe initial devra être communiqué séparément.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
