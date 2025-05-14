
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Lock, ShieldAlert, Mail, Phone, Building } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Mock user data (replace with actual data fetching for logged-in user)
const MOCK_USER_DATA = {
  fullName: "John Doe (Agency Owner)",
  email: "john.doe.agency@example.com",
  phone: "(555) 123-4567",
  agencyName: "Doe's Drive Rentals",
  agencyAddress: "456 Business Rd, Commerce City, USA",
  profileBio: "Passionate about providing great cars and service."
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
    console.log('Updating profile:', { fullName, email, phone, profileBio, agencyName, agencyAddress });
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    setSubmittingProfile(false);
    setIsEditingProfile(false); 
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Passwords Don't Match", description: "New password and confirmation must match.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password Too Short", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setSubmittingPassword(true);
    // Simulate API call
    console.log('Changing password with current:', currentPassword, 'to new:', newPassword);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: "Password Changed", description: "Your password has been updated successfully." });
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
          <h1 className="text-3xl font-bold">Account Profile</h1>
        </div>
        <p className="text-muted-foreground">Manage your personal and agency information, and update your password.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information Card */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="text-2xl">Profile Information</CardTitle>
                <CardDescription>View and update your personal and agency details.</CardDescription>
            </div>
            <Button onClick={() => setIsEditingProfile(!isEditingProfile)} variant={isEditingProfile ? "destructive" : "outline"}>
                {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="flex items-center gap-1 mb-1"><UserCircle className="h-4 w-4 text-muted-foreground"/>Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!isEditingProfile} />
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditingProfile} />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-1 mb-1"><Phone className="h-4 w-4 text-muted-foreground"/>Phone Number</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditingProfile} />
                </div>
              </div>
              
              <Separator className="my-6"/>
              <h3 className="text-lg font-semibold text-muted-foreground">Agency Details (if applicable)</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <Label htmlFor="agencyName" className="flex items-center gap-1 mb-1"><Building className="h-4 w-4 text-muted-foreground"/>Agency Name</Label>
                    <Input id="agencyName" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} disabled={!isEditingProfile} />
                  </div>
                  <div>
                    <Label htmlFor="agencyAddress" className="flex items-center gap-1 mb-1"><MapPin className="h-4 w-4 text-muted-foreground"/>Agency Address</Label>
                    <Input id="agencyAddress" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} disabled={!isEditingProfile} />
                  </div>
               </div>


              <div>
                <Label htmlFor="profileBio" className="flex items-center gap-1 mb-1">Profile Bio / About Agency</Label>
                <Textarea id="profileBio" value={profileBio} onChange={(e) => setProfileBio(e.target.value)} rows={4} disabled={!isEditingProfile} placeholder="Tell us a bit about yourself or your agency."/>
              </div>
              {isEditingProfile && (
                <Button type="submit" className="w-full sm:w-auto" disabled={submittingProfile}>
                  {submittingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <div className="space-y-6">
            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Lock className="h-6 w-6 text-primary"/>Change Password</CardTitle>
                <CardDescription>Update your account password for security.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} placeholder="Min. 6 characters"/>
                </div>
                <div>
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={submittingPassword}>
                    {submittingPassword ? 'Updating Password...' : 'Update Password'}
                </Button>
                </form>
            </CardContent>
            </Card>
            
            <Card className="shadow-md border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5"/>Account Security</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                        Ensure your account is secure by using a strong, unique password and enabling two-factor authentication if available.
                    </p>
                    <Button variant="destructive" className="w-full" disabled>Manage Account Deletion (Coming Soon)</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
