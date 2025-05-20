
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { UserPlusIcon, ArrowLeft, Mail, User, Phone, FileText, CalendarIcon as LucideCalendarIcon } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function AdminCreateRenterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseIssueYear, setLicenseIssueYear] = useState<number | ''>('');


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!fullName || !email || !licenseNumber || !licenseIssueYear) {
      toast({ title: "Champs Obligatoires Manquants", description: "Veuillez remplir tous les champs marqués d'un *.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Simulate API call to create renter
    console.log('Création d\'un nouveau locataire (simulation) :', { fullName, email, phone, licenseNumber, licenseIssueYear });
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitting(false);
    toast({
      title: "Compte Locataire Créé !",
      description: `Le compte pour ${fullName} a été créé avec succès. N'oubliez pas de communiquer les identifiants.`,
    });
    // Reset form or redirect
    setFullName('');
    setEmail('');
    setPhone('');
    setLicenseNumber('');
    setLicenseIssueYear('');
    router.push('/admin/renters');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/admin/renters">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la Gestion des Locataires
        </Link>
      </Button>

      <Card className="max-w-lg mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <UserPlusIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Créer un Nouveau Compte Locataire</CardTitle>
          </div>
          <CardDescription>
            Remplissez les informations ci-dessous pour enregistrer un nouveau locataire sur {APP_NAME}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="flex items-center gap-1 mb-1"><User className="h-4 w-4 text-muted-foreground"/>Nom Complet *</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="ex. Alice Wonderland" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Email *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alice@example.com" required />
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center gap-1 mb-1"><Phone className="h-4 w-4 text-muted-foreground"/>Téléphone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 01 02 03 04" />
              </div>
            </div>
             <div>
              <Label htmlFor="licenseNumber" className="flex items-center gap-1 mb-1"><FileText className="h-4 w-4 text-muted-foreground"/>Numéro de Permis de Conduire *</Label>
              <Input id="licenseNumber" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="ex. 24AB12345" required />
            </div>
            <div>
              <Label htmlFor="licenseIssueYear" className="flex items-center gap-1 mb-1"><LucideCalendarIcon className="h-4 w-4 text-muted-foreground"/>Année d'Émission du Permis *</Label>
              <Input 
                id="licenseIssueYear" 
                type="number" 
                value={licenseIssueYear} 
                onChange={(e) => setLicenseIssueYear(e.target.value ? parseInt(e.target.value) : '')} 
                placeholder={`ex. ${new Date().getFullYear() - 2}`} 
                required 
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Création en cours...' : 'Créer le Compte Locataire'}
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
