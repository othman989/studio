
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheckIcon } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
         <div className="flex justify-center items-center gap-3 mb-4">
            <ShieldCheckIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
            </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your privacy is important to us. This Privacy Policy explains how {APP_NAME} collects, uses, and protects your personal information.
        </p>
      </header>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Our Commitment to Your Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            At {APP_NAME}, we are committed to protecting the privacy and security of our users&apos; personal information. 
            This policy outlines our practices concerning the collection, use, and sharing of your data.
          </p>
          <h3 className="text-xl font-semibold pt-2">Content Placeholder</h3>
          <p className="text-muted-foreground">
            The detailed Privacy Policy for {APP_NAME} is currently being drafted and will be available here soon.
            This document will explain what information we collect, how we use it, and the choices you have regarding your information.
          </p>
           <p className="text-muted-foreground">
            Topics typically covered include:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
            <li>Information We Collect (Personal Information, Usage Data, Cookies)</li>
            <li>How We Use Your Information</li>
            <li>How We Share Your Information</li>
            <li>Data Security</li>
            <li>Your Privacy Rights (e.g., Access, Correction, Deletion)</li>
            <li>Children&apos;s Privacy</li>
            <li>Changes to This Policy</li>
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
