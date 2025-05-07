import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CalendarCheck, Car, Smile } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-10 w-10 text-primary mb-4" />,
    title: "Search & Discover",
    description: "Find the perfect car by searching based on location, dates, price, and car type.",
  },
  {
    icon: <CalendarCheck className="h-10 w-10 text-primary mb-4" />,
    title: "Book Securely",
    description: "Select your car, specify rental dates, and submit a booking request to the agency.",
  },
  {
    icon: <Car className="h-10 w-10 text-primary mb-4" />,
    title: "Pick Up & Go",
    description: "Once confirmed, pick up your car from the agency and enjoy your trip.",
  },
  {
    icon: <Smile className="h-10 w-10 text-primary mb-4" />,
    title: "Review & Share",
    description: "After your rental, leave a review for the car and agency to help others.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            How AutoPool Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Renting a car has never been easier. Follow these simple steps to get on the road.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="items-center">
                {step.icon}
                <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
