"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Review } from "@/lib/types"
import { format } from "date-fns"
import { Star, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Timestamp } from "firebase/firestore"

function renderStars(rating: number) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
        {Array(emptyStars).fill(0).map((_, i) => <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)}
      </div>
    );
}

// We need to pass the onReviewClick handler to the columns
export const getColumns = (onReviewClick: (review: Review) => void): ColumnDef<Review>[] => [
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => {
        const ts = row.getValue("timestamp") as Timestamp;
        const date = ts?.toDate ? ts.toDate() : new Date();
        return <span>{format(date, "MMM d, yyyy")}</span>
    }
  },
  {
    accessorKey: "authorName",
    header: "Reviewer",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
        const rating = parseFloat(row.getValue("rating"))
        return renderStars(rating);
    }
  },
  {
    accessorKey: "text",
    header: "Review",
    cell: ({row}) => {
        const text = row.getValue("text") as string;
        return <p className="truncate max-w-xs">{text}</p>
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const review = row.original
 
      return (
        <Button variant="outline" size="sm" onClick={() => onReviewClick(review)}>
            <Eye className="mr-2 h-4 w-4" />
            View
        </Button>
      )
    },
  },
]
