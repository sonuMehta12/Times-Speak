// lib/types/event.ts
import React from "react";

export interface ImageAsset {
  url: string;
  alt: string;
}

export interface GalleryImageItem extends ImageAsset {
  id: string; // For key prop in React
}

export interface Tag {
  id: string;
  name: string;
}
export interface GoodToKnowItem {
  icon: string | undefined; // Optional specific icon from Lucide
  heading: string;
  text: string;
}

export interface Host {
  id: string;
  name: string;
  tagline?: string;
  avatar: ImageAsset;
  introVideoUrl?: string | null;
  introVideoPosterUrl?: string | null; // Corrected typo from "introVodeoPosterUrl"
  portfolioUrl?: string | null;
  hostRating?: number | null;
  hostReviewCount?: number | null;
  instagramHandle?: string | null;
  verified: boolean;
  title?: string;
  bio?: string;
  experience?: string;
  eventsHosted?: number;
  responseTime?: string;
  languages?: string[];
}

export interface HowToGetThere {
  publicTransport?: string[];
  parking?: string;
  byCar?: string;
  notes?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  mapUrl?: string;
  directions?: string;
  venueImage?: ImageAsset | null;
  howToGetThere: HowToGetThere;
  accessibility: string[];
  amenities?: string[] | null;
  isVerified: boolean;
}

export interface Review {
  id: string;
  name: string;
  profession?: string;
  avatar?: ImageAsset;
  rating: number; // e.g., 4.5
  date: string; // e.g., "June 2, 2024" or ISO string "2024-06-02"
  comment: string;
  verified?: boolean;
}

export interface AttendeeInfo {
  name: string;
  avatarUrl?: string | null; // Optional: URL to attendee's avatar
}

export interface AttendeeMomentItem {
  id: string; // Unique ID for the moment
  mediaUrl: string; // URL for the image or video
  mediaType: "image" | "video";
  altText: string; // Alt text for the image, or description for video
  caption?: string | null; // Optional short caption from the attendee
  attendee: AttendeeInfo;
  timestamp: string; // ISO string or relative time string
}
export interface UpcomingDateSession {
  date: string; // ISO Date string "YYYY-MM-DD"
  startTime: string; // "HH:MM" or "HH:MM AM/PM" e.g., "12:00 PM"
  endTime?: string;
  spotsLeft: number;
  totalSpots?: number;
  status?: "available" | "sold-out" | "cancelled" | "past";
}

export interface PolicyDetails {
  cancellation: string;
  healthSafety?: string;
  refund?: string;
  privateBooking?: string;
  groupBooking?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface RelatedEventInfo {
  id: string;
  slug: string; // For linking
  name: string;
  heroImage: ImageAsset;
  type?: string;
  price?: number; // Assuming this is the base price for the related event card display
  currency?: string;
  isFree?: boolean;
  date?: string; // Next available date for display
  startTime?: string; // Next available time for display
}

export interface WhatYoullDoItem {
  id: string;
  title: string;
  description: string;
  image?: ImageAsset;
}

// Main Event interface
export interface Event {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  shortDescription: string;
  type: string;
  category: {
    id: string;
    name: string;
  };
  tags: Tag[];
  isFeatured: boolean;
  isTrending: boolean;
  status: "upcoming" | "active" | "past" | "cancelled" | "sold-out";
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  upcomingDates: UpcomingDateSession[];
  price: number;
  currency: string;
  isFree: boolean;
  capacity?: number | null;
  ticketsLeft?: number | null;
  heroImage: ImageAsset;
  galleryImages: GalleryImageItem[] | null;
  host: Host[] | null;
  venue: Venue;
  attendeeMoments?: AttendeeMomentItem[] | null;
  averageRating: number;
  reviewCount: number;
  reviews: Review[] | null;
  skillLevel: string;
  ageRequirement: string;
  whatYoullDo: WhatYoullDoItem[];
  goodToKnow: GoodToKnowItem[];
  policies: PolicyDetails;
  guidelines?: string[] | null;
  faqs: FAQItem[];
  videoUrl: string | null;
  videoPosterUrl: string | null;
}