
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailIcon } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
         <div className="flex justify-center items-center gap-3 mb-4">
            <MailIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Contact Us
            </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          We&apos;d love to hear from you! Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
        </p>
      </header>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Get in Touch</CardTitle>
          <CardDescription>
            Contact form and details will be available here soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            In the meantime, you can imagine a beautiful contact form here, or direct contact information like an email address or phone number.
          </p>
          <p className="text-muted-foreground mt-4">
            For support, please email <a href="mailto:support@autopool.example.com" className="text-primary hover:underline">support@autopool.example.com</a>.
          </p>
           <p className="text-muted-foreground mt-2">
            For sales inquiries, please email <a href="mailto:sales@autopool.example.com" className="text-primary hover:underline">sales@autopool.example.com</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
