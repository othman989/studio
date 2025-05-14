
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock, Lightbulb } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    console.log('Tentative de connexion :', { email, password });
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === "test@example.com" && password === "password") {
      toast({
        title: "Connexion Réussie !",
        description: `Bienvenue à nouveau sur ${APP_NAME}.`,
      });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('isLoggedIn', 'true');
      }
      router.push('/account/dashboard'); 
    } else {
      toast({
        title: "Échec de la Connexion",
        description: "Adresse e-mail ou mot de passe invalide. Veuillez réessayer.",
        variant: "destructive",
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex justify-center items-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Bon Retour !</CardTitle>
          <CardDescription>Connectez-vous pour continuer vers votre compte {APP_NAME}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Adresse E-mail</Label>
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
              <Label htmlFor="password" className="flex items-center gap-1 mb-1"><Lock className="h-4 w-4 text-muted-foreground"/>Mot de Passe</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="h-11"
              />
            </div>
            <div className="text-right text-sm">
              <Button variant="link" asChild className="p-0 h-auto font-normal">
                <Link href="/forgot-password">Mot de passe oublié ?</Link>
              </Button>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Connexion en cours...' : 'Se Connecter'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas de compte ?{' '}
            <Button variant="link" asChild className="p-0 h-auto font-medium">
              <Link href="/register">S'inscrire</Link>
            </Button>
          </p>
          <div className="flex items-center text-xs text-muted-foreground p-3 bg-muted/50 rounded-md mt-4">
            <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
            <span>Pour la démo : utilisez <strong>test@example.com</strong> / <strong>password</strong></span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
