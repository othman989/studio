'use client';

import type { Review } from '@/lib/types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ReviewCard } from './review-card';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { RefreshCw, Inbox } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  onReviewClick: (review: Review) => void;
  onSync?: () => void;           // NEW
  syncing?: boolean;             // NEW
}

export function ReviewList({ reviews, isLoading, onReviewClick, onSync, syncing }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="grid gap-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
              <Skeleton className="h-9 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-4">
            <Inbox className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-lg font-semibold">No reviews found.</p>
            <p>There are no reviews matching your current filters, or you haven't synced them yet.</p>
            <Button onClick={onSync} disabled={!onSync || syncing}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {syncing ? "Syncing..." : "Sync New Reviews"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} onCardClick={onReviewClick} />
      ))}
    </div>
  );
}
