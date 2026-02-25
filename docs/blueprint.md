# **App Name**: GBReplAi Dashboard

## Core Features:

- Google Sign-In: Enable users to sign in with their Google accounts via Firebase Authentication.
- User Profile Creation: After login, check if the user exists in the 'clients' Firestore collection. If not, create a new document with default values.
- Reviews Fetching: Fetch Google Business Profile reviews from Firestore for a given client.
- AI-Powered Reply Generation: Generate intelligent and context-aware responses to Google Business Profile reviews using generative AI tool.
- Review Management Interface: Display and manage reviews in a dashboard interface, including options to view, filter, and respond to reviews.
- Credit Management: Track and manage user credits, displaying current balance and transaction history from the 'credit_transactions' collection.
- Settings Page: Enable users to modify their settings, such as business name, auto-reply settings, and response tone.

## Style Guidelines:

- Primary color: Google Blue (#4285F4) for main branding.
- Background color: Light gray (#F8F9FA) for a clean and modern look.
- Accent color: Green (#34A853) for positive actions and success indicators.
- Warning color: Yellow (#FBBC04) for low credit warnings.
- Error color: Red (#EA4335) for error messages and alerts.
- Body and headline font: 'Inter' sans-serif for a modern and neutral design.
- Responsive layout with top navigation, left sidebar (collapsible on mobile), and a main content area with padding.
- Use material design icons to provide a consistent visual language across the UI.
- Use subtle transitions and animations to provide feedback to the user and improve the overall experience.