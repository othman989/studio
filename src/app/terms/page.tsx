
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileTextIcon } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
         <div className="flex justify-center items-center gap-3 mb-4">
            <FileTextIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Terms of Service
            </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Please read these Terms of Service carefully before using the {APP_NAME} platform.
        </p>
      </header>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>
          <h3 className="text-xl font-semibold pt-2">Content Placeholder</h3>
          <p className="text-muted-foreground">
            The detailed Terms of Service for {APP_NAME} are currently being drafted and will be available here soon. 
            This document will outline the rules and regulations for the use of {APP_NAME}&apos;s Website.
          </p>
          <p className="text-muted-foreground">
            Topics typically covered include:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
            <li>User Accounts and Responsibilities</li>
            <li>Rental Agency Obligations</li>
            <li>Booking and Cancellation Policies</li>
            <li>Payment Terms</li>
            <li>Intellectual Property Rights</li>
            <li>Limitation of Liability</li>
            <li>Governing Law</li>
            <li>Changes to Terms</li>
            <li>Contact Information</li>
          </ul>
           <p className="text-muted-foreground">
            Please check back later for the full document.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
