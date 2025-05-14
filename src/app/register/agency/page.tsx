
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Building, User, Mail, Phone, MapPin, FileText, ArrowLeft, Info } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function AgencySignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [ownerFullName, setOwnerFullName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [agencyAddress, setAgencyAddress] = useState('');
  const [agencyDescription, setAgencyDescription] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!ownerFullName || !ownerEmail || !agencyName || !agencyAddress) {
      toast({ title: "Champs Obligatoires Manquants", description: "Veuillez remplir tous les champs marqués d'un *.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const agencyApplicationData = {
      ownerFullName,
      ownerEmail,
      ownerPhone,
      agencyName,
      agencyAddress,
      agencyDescription,
      notes,
      submittedAt: new Date().toISOString(),
    };

    console.log('Candidature Agence Soumise :', agencyApplicationData);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitting(false);
    toast({
      title: "Candidature Soumise !",
      description: `Merci d'avoir postulé pour inscrire votre agence sur ${APP_NAME}. Nous examinerons vos informations et vous contacterons par e-mail sous peu avec les prochaines étapes.`,
      duration: 7000, 
    });
    router.push('/'); 
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/register">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Options d'Inscription
        </Link>
      </Button>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Building className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Inscrire Votre Agence</CardTitle>
          </div>
          <CardDescription>
            Rejoignez {APP_NAME} et atteignez plus de clients. Remplissez le formulaire ci-dessous pour postuler.
            Nous examinerons votre candidature et vous recontacterons avec les détails du compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Informations du Propriétaire</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ownerFullName" className="flex items-center gap-1 mb-1"><User className="h-4 w-4 text-muted-foreground"/>Nom Complet *</Label>
                  <Input id="ownerFullName" value={ownerFullName} onChange={(e) => setOwnerFullName(e.target.value)} placeholder="ex. Jeanne Dupont" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ownerEmail" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Adresse E-mail *</Label>
                      <Input id="ownerEmail" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="vous@entreprise.com" required />
                    </div>
                    <div>
                      <Label htmlFor="ownerPhone" className="flex items-center gap-1 mb-1"><Phone className="h-4 w-4 text-muted-foreground"/>Numéro de Téléphone</Label>
                      <Input id="ownerPhone" type="tel" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="01 23 45 67 89" />
                    </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Informations de l'Agence</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agencyName" className="flex items-center gap-1 mb-1"><Building className="h-4 w-4 text-muted-foreground"/>Nom de l'Agence *</Label>
                  <Input id="agencyName" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="ex. Locations Auto Ville" required />
                </div>
                <div>
                  <Label htmlFor="agencyAddress" className="flex items-center gap-1 mb-1"><MapPin className="h-4 w-4 text-muted-foreground"/>Adresse de l'Agence *</Label>
                  <Input id="agencyAddress" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} placeholder="123 Rue Principale, Ville, Pays" required />
                </div>
                <div>
                  <Label htmlFor="agencyDescription" className="flex items-center gap-1 mb-1"><FileText className="h-4 w-4 text-muted-foreground"/>Description de l'Agence (Optionnel)</Label>
                  <Textarea id="agencyDescription" value={agencyDescription} onChange={(e) => setAgencyDescription(e.target.value)} placeholder="Décrivez brièvement votre agence, vos services et les types de voitures que vous proposez." rows={3} />
                </div>
              </div>
            </section>
            
            <section>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Notes Supplémentaires</h3>
                 <div>
                  <Label htmlFor="notes" className="flex items-center gap-1 mb-1"><Info className="h-4 w-4 text-muted-foreground"/>Questions ou Demandes Spéciales (Optionnel)</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Autre chose que vous aimeriez nous faire savoir ?" rows={3} />
                </div>
            </section>
            
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Soumission en cours...' : 'Soumettre la Candidature Agence'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Les champs marqués d'un * sont obligatoires. En soumettant cette candidature, vous acceptez nos conditions de service pour les agences.
                Un administrateur examinera votre soumission et vous contactera.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
