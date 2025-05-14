
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, ArrowLeft, Phone, Briefcase, Building } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function RenterSignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!fullName || !email) {
      toast({ title: "Champs Obligatoires Manquants", description: "Veuillez remplir le Nom Complet et l'Adresse E-mail.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const renterApplicationData = {
      fullName,
      email,
      phoneNumber,
      jobTitle,
      organization,
      submittedAt: new Date().toISOString(),
    };

    console.log('Candidature Locataire Soumise :', renterApplicationData);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Candidature Soumise !",
      description: `Merci d'avoir postulé pour louer avec ${APP_NAME}, ${fullName} ! Nous examinerons vos informations et vous contacterons par e-mail avec les détails de votre compte si approuvé.`,
      duration: 7000,
    });
    router.push('/login'); 
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center min-h-[calc(100vh-12rem)]">
       <div className="w-full max-w-md mb-6">
         <Button variant="outline" size="sm" asChild>
            <Link href="/register">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Options d'Inscription
            </Link>
         </Button>
       </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <UserPlus className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Postuler pour Louer avec {APP_NAME}</CardTitle>
          <CardDescription>Soumettez votre candidature pour commencer à trouver et réserver de superbes voitures.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="flex items-center gap-1 mb-1"><UserPlus className="h-4 w-4 text-muted-foreground"/>Nom Complet *</Label>
              <Input 
                id="fullName" 
                type="text" 
                placeholder="ex. Jean Dupont" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Adresse E-mail *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="vous@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="flex items-center gap-1 mb-1"><Phone className="h-4 w-4 text-muted-foreground"/>Numéro de Téléphone (Optionnel)</Label>
              <Input 
                id="phoneNumber" 
                type="tel" 
                placeholder="01 23 45 67 89" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="jobTitle" className="flex items-center gap-1 mb-1"><Briefcase className="h-4 w-4 text-muted-foreground"/>Poste (Optionnel)</Label>
              <Input 
                id="jobTitle" 
                type="text" 
                placeholder="ex. Ingénieur Logiciel" 
                value={jobTitle} 
                onChange={(e) => setJobTitle(e.target.value)} 
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="organization" className="flex items-center gap-1 mb-1"><Building className="h-4 w-4 text-muted-foreground"/>Organisation (Optionnel)</Label>
              <Input 
                id="organization" 
                type="text" 
                placeholder="ex. Solutions Tech Inc." 
                value={organization} 
                onChange={(e) => setOrganization(e.target.value)} 
                className="h-11"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Soumission en cours...' : 'Soumettre la Candidature'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-xs text-muted-foreground text-center">
                Un administrateur examinera votre soumission. Si approuvée, vous recevrez vos identifiants de compte par e-mail.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
                Vous avez déjà un compte ?{' '}
                <Button variant="link" asChild className="p-0 h-auto font-medium">
                <Link href="/login">Se Connecter</Link>
                </Button>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
