
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StarIcon, ArrowLeft, UserIcon } from "lucide-react";
import type { Review } from '@/types';
import { MOCK_REVIEWS } from '@/lib/constants';
import { formatISO } from 'date-fns';

export default function NewReviewPage({ params }: { params: { id: string } }) {
  const carId = params.id;
  const router = useRouter();
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast({ title: "Nom Requis", description: "Veuillez entrer votre nom.", variant: "destructive" });
      return;
    }
    if (rating === 0) {
      toast({ title: "Note Requise", description: "Veuillez sélectionner une note en étoiles.", variant: "destructive" });
      return;
    }
    if (!comment.trim()) {
      toast({ title: "Commentaire Requis", description: "Veuillez écrire un commentaire.", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newReview: Review = {
      id: `review-${Date.now()}`,
      userId: `user-${Date.now()}`, // Placeholder user ID
      userName,
      targetType: 'car',
      targetId: carId,
      rating,
      comment,
      createdAt: formatISO(new Date()),
      // avatarUrl: can be added if user profiles with avatars exist
    };

    MOCK_REVIEWS.push(newReview);
    console.log("Nouvel avis soumis (simulation):", newReview);

    setSubmitting(false);
    toast({
      title: "Avis Soumis !",
      description: "Merci d'avoir partagé votre expérience.",
    });
    router.push(`/cars/${carId}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
       <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href={`/cars/${params.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Détails de la Voiture
        </Link>
      </Button>
      <header className="mb-8 text-center">
        <div className="flex justify-center items-center gap-3 mb-2">
          <StarIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Laisser un Avis</h1>
        </div>
        <CardDescription>Partagez votre expérience concernant la voiture (ID : {params.id}).</CardDescription>
      </header>

      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Soumettre Votre Avis</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="userName" className="flex items-center gap-1 mb-1">
                <UserIcon className="h-4 w-4 text-muted-foreground"/> Votre Nom *
              </Label>
              <Input 
                id="userName" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                placeholder="ex. Jean Dupont" 
                required 
              />
            </div>

            <div>
              <Label className="mb-2 block">Votre Note *</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-colors
                      ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50 hover:text-yellow-300'}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Votre Commentaire *</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Décrivez votre expérience avec la voiture et l'agence..."
                rows={5}
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Envoi en cours..." : "Soumettre l'Avis"}
            </Button>
          </form>
        </CardContent>
         <CardFooter>
          <p className="text-xs text-muted-foreground">
            Votre avis aidera les autres utilisateurs à faire des choix éclairés.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
