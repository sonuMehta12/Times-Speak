// lib/types/user.ts
// Using FieldValue and Timestamp directly from firebase/firestore for type accuracy
import type { Timestamp, FieldValue } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;

  role?: "user" | "artist" | "admin"; // Adjust roles as needed
  profileComplete?: boolean; // Especially for artists

  // Optional fields that might come from artist profile completion
  phoneNumber?: string | null;
  city?: string | null;
  portfolioLink?: string | null;
  tagline?: string | null;
  bio?: string | null; // Could be a shorter version for display
  artExperience?: string | null; // Could be a summary

  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;

  // Add any other fields from your Firestore 'users' collection that UserMenu might use
  // For example, if you directly store agreedToGuidelines in the user profile:
  // agreedToGuidelines?: boolean;
}
