
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

  // Form state
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

    // Basic validation
    if (!ownerFullName || !ownerEmail || !agencyName || !agencyAddress) {
      toast({ title: "Missing Required Fields", description: "Please fill in all fields marked with *.", variant: "destructive" });
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

    // Simulate API call to submit application (e.g., send email to admin)
    console.log('Agency Application Submitted:', agencyApplicationData);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitting(false);
    toast({
      title: "Application Submitted!",
      description: `Thank you for applying to list your agency on ${APP_NAME}. We will review your information and contact you via email shortly with next steps.`,
      duration: 7000, // Longer duration for this important message
    });
    router.push('/'); // Redirect to homepage after submission
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/register">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Registration Options
        </Link>
      </Button>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Building className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Register Your Agency</CardTitle>
          </div>
          <CardDescription>
            Join {APP_NAME} and reach more customers. Fill out the form below to apply.
            We&apos;ll review your application and get back to you with account details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Owner Information */}
            <section>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Owner Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ownerFullName" className="flex items-center gap-1 mb-1"><User className="h-4 w-4 text-muted-foreground"/>Full Name *</Label>
                  <Input id="ownerFullName" value={ownerFullName} onChange={(e) => setOwnerFullName(e.target.value)} placeholder="e.g. Jane Doe" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ownerEmail" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Email Address *</Label>
                      <Input id="ownerEmail" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="you@company.com" required />
                    </div>
                    <div>
                      <Label htmlFor="ownerPhone" className="flex items-center gap-1 mb-1"><Phone className="h-4 w-4 text-muted-foreground"/>Phone Number</Label>
                      <Input id="ownerPhone" type="tel" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="(555) 123-4567" />
                    </div>
                </div>
              </div>
            </section>

            {/* Agency Information */}
            <section>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Agency Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agencyName" className="flex items-center gap-1 mb-1"><Building className="h-4 w-4 text-muted-foreground"/>Agency Name *</Label>
                  <Input id="agencyName" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="e.g. City Car Rentals" required />
                </div>
                <div>
                  <Label htmlFor="agencyAddress" className="flex items-center gap-1 mb-1"><MapPin className="h-4 w-4 text-muted-foreground"/>Agency Address *</Label>
                  <Input id="agencyAddress" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} placeholder="123 Main St, Anytown, USA" required />
                </div>
                <div>
                  <Label htmlFor="agencyDescription" className="flex items-center gap-1 mb-1"><FileText className="h-4 w-4 text-muted-foreground"/>Agency Description (Optional)</Label>
                  <Textarea id="agencyDescription" value={agencyDescription} onChange={(e) => setAgencyDescription(e.target.value)} placeholder="Briefly describe your agency, services, and types of cars you offer." rows={3} />
                </div>
              </div>
            </section>
            
            <section>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Additional Notes</h3>
                 <div>
                  <Label htmlFor="notes" className="flex items-center gap-1 mb-1"><Info className="h-4 w-4 text-muted-foreground"/>Questions or Special Requests (Optional)</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else you'd like us to know?" rows={3} />
                </div>
            </section>
            
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting Application...' : 'Submit Agency Application'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Fields marked with * are required. By submitting this application, you agree to our terms of service for agencies.
                An admin will review your submission and contact you.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
