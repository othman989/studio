
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { APP_NAME } from '@/lib/constants';

const testimonials = [
  {
    name: "Sarah L.",
    role: "Exploratrice du Week-end",
    avatar: "https://picsum.photos/seed/sarah/100/100",
    quote: `${APP_NAME} a rendu la recherche d'une voiture de location pour notre week-end si facile ! Le processus était fluide et la voiture parfaite. Je recommande vivement !`,
    rating: 5,
    aiHint: "woman smiling"
  },
  {
    name: "Jean B.",
    role: "Voyageur d'Affaires",
    avatar: "https://picsum.photos/seed/john/100/100",
    quote: `En tant que voyageur d'affaires fréquent, j'apprécie la rapidité avec laquelle je peux réserver une voiture fiable via ${APP_NAME}. La fonction de chat est idéale pour les questions rapides.`,
    rating: 4,
    aiHint: "man professional"
  },
  {
    name: "Maria G.",
    role: "Vacancière en Famille",
    avatar: "https://picsum.photos/seed/maria/100/100",
    quote: "Nous avons trouvé un van spacieux pour nos vacances en famille à un prix avantageux. L'agence a été très serviable. Nous utiliserons certainement ${APP_NAME} à nouveau !",
    rating: 5,
    aiHint: "woman happy"
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Ce Que Disent Nos Utilisateurs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les témoignages de clients satisfaits qui ont trouvé leur voiture idéale avec {APP_NAME}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                    data-ai-hint={testimonial.aiHint}
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-muted-foreground italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                  {Array(5 - testimonial.rating).fill(0).map((_, i) => (
                     <Star key={i + testimonial.rating} className="h-5 w-5 text-muted-foreground/50" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
