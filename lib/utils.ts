import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Your existing formatINR - it's good for INR specifically
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2, // Allow for paisa if price was e.g. 799.50
  }).format(amount);
};

// More generic currency formatter (useful if you have multiple currencies)
export const formatCurrency = (amount: number, currencyCode: string, locale: string = 'en-US'): string => {
  // For price stored as whole units (e.g., 799 for $799.00 or ₹799.00)
  // If price is stored in smallest units (e.g., 79900 for $799.00), divide by 100 here.
  // Let's assume for now 'amount' is passed as the main unit (e.g., 799 for 799 INR/USD)
  
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: currencyCode,
  };

  // Adjust fraction digits based on common currency practices
  if (currencyCode === "INR") {
    options.minimumFractionDigits = 0;
    options.maximumFractionDigits = 2; // Typically 0 or 2 for INR
  } else {
    // Default for USD, EUR etc.
    options.minimumFractionDigits = 2;
    options.maximumFractionDigits = 2;
  }

  return new Intl.NumberFormat(locale, options).format(amount);
};

// Simple Date Formatter (example, you can use date-fns directly in components too)
export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  };
  return new Date(dateString).toLocaleDateString(undefined, defaultOptions); // Uses user's locale
};