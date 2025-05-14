
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailIcon } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
         <div className="flex justify-center items-center gap-3 mb-4">
            <MailIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Nous Contacter
            </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Nous serions ravis de vous entendre ! Que vous ayez une question sur les fonctionnalités, les essais, les tarifs ou toute autre chose, notre équipe est prête à répondre à toutes vos questions.
        </p>
      </header>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Prendre Contact</CardTitle>
          <CardDescription>
            Le formulaire de contact et les détails seront bientôt disponibles ici.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            En attendant, vous pouvez imaginer un magnifique formulaire de contact ici, ou des informations de contact directes comme une adresse e-mail ou un numéro de téléphone.
          </p>
          <p className="text-muted-foreground mt-4">
            Pour le support, veuillez envoyer un e-mail à <a href="mailto:support@autopool.example.com" className="text-primary hover:underline">support@autopool.example.com</a>.
          </p>
           <p className="text-muted-foreground mt-2">
            Pour les demandes commerciales, veuillez envoyer un e-mail à <a href="mailto:sales@autopool.example.com" className="text-primary hover:underline">ventes@autopool.example.com</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
