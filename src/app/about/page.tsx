
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
        <div className="flex justify-center items-center gap-3 mb-4">
            <InfoIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
            About {APP_NAME}
            </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn more about our mission, vision, and the team behind {APP_NAME}.
        </p>
      </header>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Our Story</CardTitle>
          <CardDescription>
            Connecting car renters with trusted local agencies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Welcome to {APP_NAME}, your premier destination for hassle-free car rentals and a seamless car-sharing experience. 
            Our platform was born from a desire to simplify the car rental process, making it easier for renters to find the perfect vehicle 
            and for rental agencies to reach a wider audience.
          </p>
          <p className="text-muted-foreground">
            <strong>Our Mission:</strong> To revolutionize the car rental industry by providing a transparent, efficient, and user-friendly marketplace 
            that benefits both renters and rental agencies. We aim to empower local businesses and provide unparalleled choice and convenience to travelers.
          </p>
           <p className="text-muted-foreground">
            <strong>Our Vision:</strong> To be the leading global platform for car sharing and rentals, fostering a community built on trust, reliability, and innovation. 
            We envision a future where renting a car is as easy as a few clicks, anywhere in the world.
          </p>
          <p className="text-muted-foreground">
            Content for this page is currently under development. More details about our team, values, and journey will be added soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
