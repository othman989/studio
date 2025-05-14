
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StarIcon, ArrowLeft } from "lucide-react";

export default function NewReviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
       <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href={`/cars/${params.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Car Details
        </Link>
      </Button>
      <header className="mb-8 text-center">
        <div className="flex justify-center items-center gap-3 mb-2">
          <StarIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Leave a Review</h1>
        </div>
        <CardDescription>Share your experience about the car (ID: {params.id}).</CardDescription>
      </header>

      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Submit Your Review</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            The form to submit a review will be available here soon.
            Please check back later!
          </p>
          {/* Placeholder for review form */}
        </CardContent>
      </Card>
    </div>
  );
}
