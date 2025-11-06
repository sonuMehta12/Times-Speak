import { Tag } from "@/lib/types/event"; // We can reuse the Tag type if it fits

// Explicitly define Category type for filters
// or ensure event.category fits this need.
// export interface FilterCategory extends Tag {}

// Using an array of objects for categories
export const CATEGORIES_DATA: Tag[] = [
  { id: "all", name: "All Categories" },
  { id: "art-festival", name: "Art Festival" }, // Matches event.category.id
  { id: "art-workshop", name: "Art Workshop" }, // Matches event.category.id
  { id: "digital-art", name: "Digital Art" },   // Matches event.category.id
  { id: "painting", name: "Painting" },       // Ensure this matches an event.category.id
  // Add more categories based on your EVENTS_DATA or anticipated future categories
  // Example: { id: "music", name: "Music" },
];