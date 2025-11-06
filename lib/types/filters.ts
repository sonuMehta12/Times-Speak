// lib/types/filters.ts

// Defines the structure for our search filter state
export interface SearchFilters {
  query: string; // For text search
  category: string; // Category ID (e.g., "all", "art-workshop")
  startDate: Date | null; // Start of the date range
  endDate: Date | null; // End of the date range
  // Future potential filters:
  // isFree?: boolean | undefined; // undefined means 'any', true for free, false for paid
  // location?: string; // e.g., city for more specific location filtering
  // priceRange?: [number, number] | null;
}

// Initial/default state for the filters
export const INITIAL_FILTERS: SearchFilters = {
  query: "",
  category: "all", // Default to "all" categories
  startDate: null,
  endDate: null,
  // isFree: undefined,
};
