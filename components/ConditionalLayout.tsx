"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Define routes where both Navbar and Footer should be hidden.
 *
 * Example: Adding "/role" will hide both for "/role", "/role/123", "/role/practice", etc.
 */
const HIDE_BOTH_ROUTES = [
  "/role",
  "/quiz",
  "/aditi"
  // Add more routes here as needed
];

/**
 * Define routes where only Navbar should be hidden (Footer will still show).
 *
 * Example: Adding "/lesson" will hide navbar but show footer for "/lesson" and sub-routes.
 */
const HIDE_NAVBAR_ONLY_ROUTES = [
  "/lesson",
  "/lesson-complete"
  // Add more routes here as needed
];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check for dynamic routes like /unit_1_introduction/l1/quiz
  const isDynamicQuizRoute = pathname.includes("/quiz");
  const isDynamicRoleplayRoute = pathname.includes("/roleplay");
  const isDynamicLessonRoute = pathname.includes("/lesson");

  // Check if current route should hide both navbar and footer
  const shouldHideBoth = HIDE_BOTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  ) || isDynamicQuizRoute || isDynamicRoleplayRoute;

  // Check if current route should hide only navbar
  const shouldHideNavbarOnly = HIDE_NAVBAR_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  ) || isDynamicLessonRoute;

  // Determine what to show
  const showNavbar = !shouldHideBoth && !shouldHideNavbarOnly;
  const showFooter = !shouldHideBoth;

  return (
    <>
      {showNavbar && <Navbar />}
      <main 
        className={cn(
          "mobile-content",
          shouldHideBoth && "!p-0",
          shouldHideNavbarOnly && "!pt-4"
        )}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  );
}
