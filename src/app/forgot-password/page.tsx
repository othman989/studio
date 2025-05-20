
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { MailQuestion, ArrowLeft } from 'lucide-react'; // Changed MailLock to MailQuestion
import { APP_NAME } from '@/lib/constants';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    console.log('Demande de réinitialisation de mot de passe pour :', email);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Demande de Réinitialisation de Mot de Passe Envoyée",
      description: `Si un compte existe pour ${email}, un lien de réinitialisation de mot de passe a été envoyé. Veuillez vérifier votre boîte de réception (et dossier spam).`,
      duration: 7000,
    });
    
    setEmail('');
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex justify-center items-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <MailQuestion className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Mot de Passe Oublié ?</CardTitle>
          <CardDescription>
            Pas de soucis ! Entrez votre adresse e-mail ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="flex items-center gap-1 mb-1">Adresse E-mail</Label>
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
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Envoi du lien...' : 'Envoyer le Lien de Réinitialisation'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" asChild size="sm">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la Connexion
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
