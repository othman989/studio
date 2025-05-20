
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Lock, ShieldAlert, Mail, Phone, Building, MapPin } from 'lucide-react'; // Added MapPin
import { Separator } from '@/components/ui/separator';

// Mock user data (replace with actual data fetching for logged-in user)
const MOCK_USER_DATA = {
  fullName: "Jean Dupont (Propriétaire Agence)",
  email: "jean.dupont.agence@example.com",
  phone: "01 23 45 67 89",
  agencyName: "Les Locations Dupont",
  agencyAddress: "456 Rue du Commerce, Ville Commerciale, France",
  profileBio: "Passionné par la fourniture de superbes voitures et services."
};

export default function ProfilePage() {
  const { toast } = useToast();

  // Profile Info State
  const [fullName, setFullName] = useState(MOCK_USER_DATA.fullName);
  const [email, setEmail] = useState(MOCK_USER_DATA.email);
  const [phone, setPhone] = useState(MOCK_USER_DATA.phone);
  const [profileBio, setProfileBio] = useState(MOCK_USER_DATA.profileBio);
  const [agencyName, setAgencyName] = useState(MOCK_USER_DATA.agencyName);
  const [agencyAddress, setAgencyAddress] = useState(MOCK_USER_DATA.agencyAddress);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [submittingPassword, setSubmittingPassword] = useState(false);


  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingProfile(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: "Profil Mis à Jour", description: "Vos informations de profil ont été enregistrées." });
    setSubmittingProfile(false);
    setIsEditingProfile(false); 
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Les Mots de Passe ne Correspondent Pas", description: "Le nouveau mot de passe et sa confirmation doivent correspondre.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Mot de Passe Trop Court", description: "Le nouveau mot de passe doit comporter au moins 6 caractères.", variant: "destructive" });
      return;
    }
    setSubmittingPassword(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: "Mot de Passe Changé", description: "Votre mot de passe a été mis à jour avec succès." });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setSubmittingPassword(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <UserCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Profil du Compte</h1>
        </div>
        <p className="text-muted-foreground">Gérez vos informations personnelles et d'agence, et mettez à jour votre mot de passe.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information Card */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="text-2xl">Informations du Profil</CardTitle>
                <CardDescription>Visualisez et mettez à jour vos détails personnels et d'agence.</CardDescription>
            </div>
            <Button onClick={() => setIsEditingProfile(!isEditingProfile)} variant={isEditingProfile ? "destructive" : "outline"}>
                {isEditingProfile ? "Annuler la Modification" : "Modifier le Profil"}
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="flex items-center gap-1 mb-1"><UserCircle className="h-4 w-4 text-muted-foreground"/>Nom Complet</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!isEditingProfile} />
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Adresse E-mail</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditingProfile} />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-1 mb-1"><Phone className="h-4 w-4 text-muted-foreground"/>Numéro de Téléphone</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditingProfile} />
                </div>
              </div>
              
              <Separator className="my-6"/>
              <h3 className="text-lg font-semibold text-muted-foreground">Détails de l'Agence (si applicable)</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <Label htmlFor="agencyName" className="flex items-center gap-1 mb-1"><Building className="h-4 w-4 text-muted-foreground"/>Nom de l'Agence</Label>
                    <Input id="agencyName" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} disabled={!isEditingProfile} />
                  </div>
                  <div>
                    <Label htmlFor="agencyAddress" className="flex items-center gap-1 mb-1"><MapPin className="h-4 w-4 text-muted-foreground"/>Adresse de l'Agence</Label>
                    <Input id="agencyAddress" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} disabled={!isEditingProfile} />
                  </div>
               </div>


              <div>
                <Label htmlFor="profileBio" className="flex items-center gap-1 mb-1">Bio du Profil / À Propos de l'Agence</Label>
                <Textarea id="profileBio" value={profileBio} onChange={(e) => setProfileBio(e.target.value)} rows={4} disabled={!isEditingProfile} placeholder="Parlez-nous un peu de vous ou de votre agence."/>
              </div>
              {isEditingProfile && (
                <Button type="submit" className="w-full sm:w-auto" disabled={submittingProfile}>
                  {submittingProfile ? 'Sauvegarde en cours...' : 'Sauvegarder les Modifications'}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <div className="space-y-6">
            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Lock className="h-6 w-6 text-primary"/>Changer le Mot de Passe</CardTitle>
                <CardDescription>Mettez à jour le mot de passe de votre compte pour plus de sécurité.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="currentPassword">Mot de Passe Actuel</Label>
                    <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="newPassword">Nouveau Mot de Passe</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} placeholder="Min. 6 caractères"/>
                </div>
                <div>
                    <Label htmlFor="confirmNewPassword">Confirmer le Nouveau Mot de Passe</Label>
                    <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={submittingPassword}>
                    {submittingPassword ? 'Mise à jour en cours...' : 'Mettre à Jour le Mot de Passe'}
                </Button>
                </form>
            </CardContent>
            </Card>
            
            <Card className="shadow-md border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5"/>Sécurité du Compte</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                        Assurez la sécurité de votre compte en utilisant un mot de passe fort et unique, et activez l'authentification à deux facteurs si disponible.
                    </p>
                    <Button variant="destructive" className="w-full" disabled>Gérer la Suppression du Compte (Bientôt disponible)</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    