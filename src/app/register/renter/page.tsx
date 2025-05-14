
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Lock, ArrowLeft } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function RenterSignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (password !== confirmPassword) {
      toast({ title: "Passwords Don't Match", description: "Please ensure your passwords match.", variant: "destructive" });
      setSubmitting(false);
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password Too Short", description: "Password must be at least 6 characters long.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Simulate API call for renter registration
    console.log('Renter Registration:', { fullName, email, password });
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Registration Successful!",
      description: `Welcome to ${APP_NAME}, ${fullName}! You can now log in.`,
    });
    router.push('/login'); 
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center min-h-[calc(100vh-12rem)]">
       <div className="w-full max-w-md mb-6">
         <Button variant="outline" size="sm" asChild>
            <Link href="/register">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Registration Options
            </Link>
         </Button>
       </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <UserPlus className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Create Your Renter Account</CardTitle>
          <CardDescription>Sign up to start finding and booking great cars on {APP_NAME}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="flex items-center gap-1 mb-1">Full Name</Label>
              <Input 
                id="fullName" 
                type="text" 
                placeholder="e.g. John Doe" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="password" className="flex items-center gap-1 mb-1"><Lock className="h-4 w-4 text-muted-foreground"/>Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="•••••••• (min. 6 characters)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={6}
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="flex items-center gap-1 mb-1"><Lock className="h-4 w-4 text-muted-foreground"/>Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="h-11"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" asChild className="p-0 h-auto font-medium">
              <Link href="/login">Sign In</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

