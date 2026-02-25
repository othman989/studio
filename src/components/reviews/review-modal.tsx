"use client";

import type { Review } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, RefreshCw, Send, Loader2, AlertCircle, Ban } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;

  // NEW: let parent update list immediately after actions
  onReviewUpdated?: (patch: Partial<Review> & { id: string }) => void;
}

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <span className="flex items-center">
      {Array(fullStars).fill(0).map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      ))}
      {Array(emptyStars).fill(0).map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      ))}
    </span>
  );
}

function getReviewDate(review: Review): Date | null {
  const ts: any = review.timestamp ?? review.createdAt;
  if (ts?.toDate) return ts.toDate();
  if (review.createTime) return new Date(review.createTime);
  return null;
}

function getAuthorName(review: Review): string {
  return review.authorName || "Anonymous";
}

export function ReviewModal({ review, isOpen, onClose, onReviewUpdated }: ReviewModalProps) {
  const [responseText, setResponseText] = useState("");
  const [originalResponse, setOriginalResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const { client, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (review) {
      setResponseText(review.response ?? "");
      setOriginalResponse(review.response ?? "");
    } else {
      setResponseText("");
      setOriginalResponse("");
      setIsGenerating(false);
      setIsPublishing(false);
      setIsSaving(false);
      setIsDeclining(false);
    }
  }, [review, isOpen]);

  if (!review) return null;

  const editableStatuses: Review["status"][] = [
    "pending",
    "error",
    "declined",
    "post_failed",
    "new",
    "unreplied",
  ];
  const isEditable = editableStatuses.includes(review.status);
  const wasEdited = originalResponse !== responseText;

  const authorName = getAuthorName(review);
  const reviewDate = getReviewDate(review);

  async function getTokenOrThrow() {
    if (!user) throw new Error("Not signed in");
    return await user.getIdToken();
  }

  const handleGenerateReply = async () => {
    if (!client || !user) return;

    if ((client.credits ?? 0) < 1) {
      toast({
        variant: "destructive",
        title: "Out of Credits",
        description: "Please purchase more credits to generate responses.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const token = await getTokenOrThrow();

      const res = await fetch(`/api/reviews/${review.id}/generate-reply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Error Generating Reply",
          description: data.error || "Could not generate an AI reply. Please try again.",
        });
        return;
      }

      const replyText = data.replyText || "";
      setResponseText(replyText);

      // Persist as draft via API (so it survives refresh)
      const save = await fetch(`/api/reviews/${review.id}/save-draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ replyText }),
      });

      if (save.ok) {
        onReviewUpdated?.({ id: review.id, response: replyText, status: "pending" });
      }

      toast({
        title: "New Response Generated",
        description: "A new AI response has been generated and saved as a draft.",
      });
    } catch (error) {
      console.error("Generate reply failed:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Reply",
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const token = await getTokenOrThrow();

      const res = await fetch(`/api/reviews/${review.id}/save-draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ replyText: responseText }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        toast({
          variant: "destructive",
          title: "Failed to Save Draft",
          description: data.error || "Could not save draft.",
        });
        return;
      }

      onReviewUpdated?.({ id: review.id, response: responseText, status: "pending" });

      toast({ title: "Draft Saved", description: "Your response has been saved." });
      onClose();
    } catch (e) {
      console.error("Save draft failed:", e);
      toast({
        variant: "destructive",
        title: "Failed to Save Draft",
        description: "Could not save your draft. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user) return;

    setIsPublishing(true);
    try {
      const token = await getTokenOrThrow();

      const res = await fetch(`/api/reviews/${review.id}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ replyText: responseText }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        toast({
          variant: "destructive",
          title: "Publishing Error",
          description: data.message || "Could not post to Google. The reply is saved as a draft.",
        });
        return;
      }

      // Update UI locally. Your server should also set status="posted" and timestamps.
      onReviewUpdated?.({ id: review.id, status: "posted", response: responseText });

      toast({
        title: "Response Published!",
        description: "Your response has been successfully posted to Google Business Profile.",
      });

      onClose();
    } catch (error) {
      console.error("Publish failed:", error);
      toast({
        variant: "destructive",
        title: "Failed to Publish",
        description: (error as Error).message || "Could not publish. Please try again.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDecline = async () => {
    if (!user) return;

    setIsDeclining(true);
    try {
      const token = await getTokenOrThrow();

      const res = await fetch(`/api/reviews/${review.id}/decline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        toast({
          variant: "destructive",
          title: "Failed to Decline",
          description: data.error || "Could not decline this review.",
        });
        return;
      }

      onReviewUpdated?.({ id: review.id, status: "declined", response: "" });

      toast({ title: "Review Declined" });
      onClose();
    } catch (e) {
      console.error("Decline failed:", e);
      toast({
        variant: "destructive",
        title: "Failed to Decline",
        description: "Please try again.",
      });
    } finally {
      setIsDeclining(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Review from {authorName}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {reviewDate ? format(reviewDate, "MMM d, yyyy") : "Unknown date"}
            </span>
          </DialogTitle>

          <DialogDescription className="flex items-center gap-2">
            {renderStars(review.rating)}
            {review.status === "post_failed" && (
              <Badge variant="destructive" className="ml-2">
                <AlertCircle className="mr-1 h-3 w-3" />
                Post Failed
              </Badge>
            )}
            <Badge variant="secondary" className="ml-2 capitalize">
              {review.status}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[70vh] gap-6 overflow-y-auto py-4 pr-4">
          <div>
            <h3 className="mb-2 text-md font-semibold">Customer Review</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">{review.text}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-md font-semibold">AI Generated Response</h3>
            {isEditable ? (
              <div className="space-y-2">
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder={
                    !responseText
                      ? "No response generated yet. Click 'Generate' to create one."
                      : ""
                  }
                  maxLength={4000}
                  rows={6}
                  className="bg-background"
                />
                <p className="text-right text-xs text-muted-foreground">
                  {responseText.length} / 4000
                </p>

                <Button
                  onClick={handleGenerateReply}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {review.response ? "Regenerate" : "Generate"} Response
                </Button>

                <p className="text-xs text-muted-foreground">(Costs 1 credit)</p>
              </div>
            ) : (
              <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">{review.response}</p>
              </div>
            )}

            {review.status === "post_failed" && review.googlePostError && (
              <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
                <p className="text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="mr-1 inline h-3 w-3" />
                  Google Error: {review.googlePostError}
                </p>
              </div>
            )}
          </div>

          {wasEdited && isEditable && originalResponse && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 text-md font-semibold">Response History</h3>
                <p className="mt-1 rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">
                  {originalResponse}
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {isEditable ? (
            <div className="flex w-full items-center justify-between gap-3">
              <div className="text-xs text-yellow-600">
                Generation consumes 1 credit. Publishing posts to Google.
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDecline}
                  disabled={isPublishing || isSaving || isGenerating || isDeclining}
                >
                  {isDeclining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ban className="mr-2 h-4 w-4" />}
                  Decline
                </Button>

                <DialogClose asChild>
                  <Button type="button" variant="ghost" disabled={isPublishing || isSaving || isGenerating}>
                    Cancel
                  </Button>
                </DialogClose>

                {responseText && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isPublishing || isSaving || isGenerating}
                  >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Draft
                  </Button>
                )}

                {responseText && (
                  <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handlePublish}
                    disabled={isPublishing || isSaving || isGenerating}
                  >
                    {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    {review.status === "post_failed" ? "Retry Publish" : "Publish"}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
