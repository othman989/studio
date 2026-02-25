import { Timestamp } from "firebase/firestore";
import type { Review, CreditTransaction } from "@/lib/types";

// Comprehensive placeholder reviews
export const placeholderReviews: Review[] = [
  {
    id: "1",
    clientId: 'demo-client',
    author: "Jane Doe",
    authorName: "Jane Doe",
    authorPhotoUrl: "https://picsum.photos/seed/101/48/48",
    rating: 5,
    text: "Absolutely fantastic service! The team was professional, and the results exceeded my expectations. Highly recommend!",
    timestamp: Timestamp.fromDate(new Date("2024-07-20T10:30:00")),
    createdAt: Timestamp.fromDate(new Date("2024-07-20T10:30:00")),
    status: 'pending',
    response: "Thank you so much, Jane! We're thrilled to hear you had a fantastic experience. We appreciate your recommendation!",
  },
  {
    id: "2",
    clientId: 'demo-client',
    author: "John Smith",
    authorName: "John Smith",
    authorPhotoUrl: "https://picsum.photos/seed/102/48/48",
    rating: 4,
    text: "Great experience overall. There was a slight delay, but the quality of work was top-notch. Would use them again.",
    timestamp: Timestamp.fromDate(new Date("2024-07-19T15:00:00")),
    createdAt: Timestamp.fromDate(new Date("2024-07-19T15:00:00")),
    response: "Hi John, thank you for your feedback! We're glad you were happy with the quality of our work and apologize for the delay. We're working to improve our timelines and hope to provide an even better experience next time.",
    status: 'posted',
    responseTimestamp: Timestamp.fromDate(new Date("2024-07-19T15:10:00")),
  },
  {
    id: "3",
    clientId: 'demo-client',
    author: "Emily White",
    authorName: "Emily White",
    authorPhotoUrl: "https://picsum.photos/seed/103/48/48",
    rating: 2,
    text: "I was not satisfied with the service. The communication was poor and the final product did not meet my needs. I expected more.",
    timestamp: Timestamp.fromDate(new Date("2024-07-18T09:00:00")),
    createdAt: Timestamp.fromDate(new Date("2024-07-18T09:00:00")),
    status: 'declined',
    response: '',
  },
  {
    id: "4",
    clientId: 'demo-client',
    author: "Michael Brown",
    authorName: "Michael Brown",
    authorPhotoUrl: "https://picsum.photos/seed/104/48/48",
    rating: 5,
    text: "Five stars! A seamless process from start to finish. The customer support was excellent.",
    timestamp: Timestamp.fromDate(new Date("2024-07-17T11:45:00")),
    createdAt: Timestamp.fromDate(new Date("2024-07-17T11:45:00")),
    status: 'pending',
    response: "Thank you for the 5-star review, Michael! We're so glad you had a seamless experience with us."
  },
  {
    id: "5",
    clientId: 'demo-client',
    author: "Sarah Green",
    authorName: "Sarah Green",
    authorPhotoUrl: "https://picsum.photos/seed/105/48/48",
    rating: 1,
    text: "A complete disaster. I would not recommend this business to anyone. The service was terrible and I wasted my money.",
    timestamp: Timestamp.fromDate(new Date("2024-07-16T14:20:00")),
    createdAt: Timestamp.fromDate(new Date("2024-07-16T14:20:00")),
    status: 'error',
    response: "We are so sorry to hear about your experience, Sarah. This is not the standard we aim for. Please contact us directly so we can make things right."
  },
  {
    id: "6",
    clientId: 'demo-client',
    author: "David Lee",
    authorName: "David Lee",
    authorPhotoUrl: "https://picsum.photos/seed/106/48/48",
    rating: 3,
    text: "It was an okay experience. Not great, but not terrible either. Just average.",
    timestamp: Timestamp.fromDate(new Date("2024-07-15T18:00:00")),
    createdAt: Timestamp.fromDate(new Date("2024-07-15T18:00:00")),
    status: 'posted',
    response: "Thanks for the feedback, David. We're always looking for ways to improve from 'average' to 'great'. We'd love to hear any specific suggestions you have.",
    responseTimestamp: Timestamp.fromDate(new Date("2024-07-15T18:05:00")),
  },
  {
    id: "7",
    clientId: 'demo-client',
    author: "Laura Chen",
    authorName: "Laura Chen",
    authorPhotoUrl: "https://picsum.photos/seed/107/48/48",
    rating: 5,
    text: "Incredible attention to detail. I'm very impressed with the quality and professionalism.",
    timestamp: Timestamp.fromDate(new Date("2024-07-14T12:00:00")),
    createdAt: Timestamp.fromDate(new Date("2024-07-14T12:00:00")),
    status: 'pending',
    response: "Wow, Laura! Thanks for noticing the details. We're passionate about what we do, and we're so glad it shows. We appreciate your business!"
  },
  {
    id: "8",
    clientId: 'demo-client',
    author: "Chris Martinez",
    authorName: "Chris Martinez",
    authorPhotoUrl: "https://picsum.photos/seed/108/48/48",
    rating: 4,
    text: "Very good service. The staff was friendly and helpful. I'll be back for sure.",
    timestamp: Timestamp.fromDate(new Date("2024-07-13T10:00:00")),
    createdAt: Timestamp.fromDate(new Date("2024-07-13T10:00:00")),
    status: 'unreplied',
    response: ""
  },
];

// Placeholder transactions remain the same
export const placeholderTransactions: CreditTransaction[] = [
  {
    id: "t1",
    timestamp: Timestamp.fromDate(new Date("2024-07-01T00:00:00")),
    description: "Initial free credits",
    amount: 5,
    type: 'grant'
  },
  {
    id: "t2",
    timestamp: Timestamp.fromDate(new Date("2024-07-16T14:22:00")),
    description: "AI reply for review by Sarah G.",
    amount: -1,
    type: 'debit'
  },
  {
    id: "t3",
    timestamp: Timestamp.fromDate(new Date("2024-07-17T11:50:00")),
    description: "AI reply for review by Michael B.",
    amount: -1,
    type: 'debit'
  },
  {
    id: "t4",
    timestamp: Timestamp.fromDate(new Date("2024-07-19T15:05:00")),
    description: "AI reply for review by John S.",
    amount: -1,
    type: 'debit'
  },
    {
    id: "t5",
    timestamp: Timestamp.fromDate(new Date("2024-07-20T10:32:00")),
    description: "AI reply for review by Jane D.",
    amount: -1,
    type: 'debit'
  },
];
