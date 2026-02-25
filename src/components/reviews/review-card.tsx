"use client";

import type { Review } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface ReviewCardProps {
  review: Review;
  onCardClick: (review: Review) => void;
}

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center">
      {Array(fullStars).fill(0).map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {Array(emptyStars).fill(0).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
}

export function ReviewCard({ review, onCardClick }: ReviewCardProps) {
  const statusVariant =
    review.status === "posted"
      ? "success"
      : review.status === "pending"
      ? "warning"
      : review.status === "error"
      ? "destructive"
      : "secondary";

  const displayName = (review as any).author || (review as any).authorName || "Customer";
  const fallbackInitial =
    displayName && displayName.trim().length > 0 ? displayName.trim().charAt(0).toUpperCase() : "?";

  let dateString = "";
  const ts: any = review.timestamp;
  if (ts) {
    if (ts.toDate) dateString = ts.toDate().toLocaleString();
    else if (typeof ts.seconds === "number") dateString = new Date(ts.seconds * 1000).toLocaleString();
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onCardClick(review)}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={review.authorPhotoUrl} alt={displayName} />
          <AvatarFallback>{fallbackInitial}</AvatarFallback>
        </Avatar>

        <div className="grid gap-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold">{displayName}</p>
            {renderStars(review.rating)}
          </div>
          {dateString && <p className="text-xs text-muted-foreground">{dateString}</p>}
        </div>

        <Badge variant={statusVariant as any} className="capitalize">
          {review.status}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-sm text-foreground mb-4 line-clamp-2">{review.text}</p>

        {review.response && (
          <>
            <Separator className="my-2" />
            <div className="mt-2 rounded-lg bg-muted/30 p-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                <span className="font-semibold text-foreground">AI Response:</span>{" "}
                {review.response}
              </p>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onCardClick(review);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View & Respond
        </Button>
      </CardFooter>
    </Card>
  );
}
