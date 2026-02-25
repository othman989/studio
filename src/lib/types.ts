import type { Timestamp } from "firebase/firestore";

export interface Client {
  id: string;
  businessName: string;
  email: string;
  credits: number;
  createdAt: Timestamp;
  approveAllReplies: boolean; // Simplified setting
  responseTone: "professional" | "friendly" | "casual" | "empathetic";
  responseLanguage: "auto" | "en" | "fr" | "ar" | "es";
  language?: string;
  responseTemplate?: string;
}

export interface Notification {
  id: string;
  type: "new_review" | "low_credits" | "auto_reply_posted" | "system";
  title: string;
  body: string;
  read: boolean;
  createdAt: Timestamp;
  actionUrl?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountPercent: number;
  maxUses?: number | null;
  uses: number;
  partnerId?: string | null;
  active: boolean;
  createdBy?: string;
  createdAt?: Timestamp;
}

export interface Review {
  id: string;
  clientId: string;

  // Google Business identifiers
  googleReviewId?: string;
  reviewName?: string;

  // Author info
  authorName: string;
  author?: string; 
  authorPhotoUrl?: string;

  // Review content
  text: string;
  rating: number;

  // Location info
  locationId?: string;
  locationName?: string;
  googleLocationName?: string;

  // All possible statuses for a review
  status: "new" | "pending" | "posted" | "post_failed" | "error" | "declined" | "unreplied";
  
  response?: string;
  responseTimestamp?: any;

  // Auto-reply metadata
  autoReplied?: boolean;
  autoReplyMode?: "high_rating" | "low_rating";
  autoReplyEligible?: boolean;
  autoReplyInProgress?: boolean;
  autoReplySkippedReason?: string;
  autoReplyFailed?: boolean;
  autoReplyError?: string;

  // Google posting metadata
  postedToGoogle?: boolean;
  googlePostError?: string;
  publishedAt?: any;
  publishedBy?: string;

  // Timestamps
  timestamp?: any; 
  createdAt: any;
  createTime?: string;
  updateTime?: string;

  // Source
  source?: "google_sync" | "manual";
}

export interface CreditTransaction {
  id: string;
  clientId?: string; // Made optional for demo data
  timestamp: Timestamp;
  description: string;
  amount: number;
  type: 'grant' | 'debit' | 'refund';
}
