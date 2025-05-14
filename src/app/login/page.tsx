
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

    // Simulate API call for login
    console.log('Login attempt:', { email, password });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate success/failure
    if (email === "test@example.com" && password === "password") {
      toast({
        title: "Login Successful!",
        description: `Welcome back to ${APP_NAME}.`,
      });
      router.push('/account/dashboard'); // Redirect to a protected dashboard page
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
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
          <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to your {APP_NAME} account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="h-11"
              />
            </div>
            <div className="text-right text-sm">
              <Button variant="link" asChild className="p-0 h-auto font-normal">
                <Link href="/forgot-password">Forgot Password?</Link>
              </Button>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" asChild className="p-0 h-auto font-medium">
              <Link href="/register">Sign Up</Link>
            </Button>
          </p>
          <div className="flex items-center text-xs text-muted-foreground p-3 bg-muted/50 rounded-md mt-4">
            <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
            <span>For demo: use <strong>test@example.com</strong> / <strong>password</strong></span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
