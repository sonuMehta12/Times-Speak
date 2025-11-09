"use client";

import { usePathname } from "next/navigation";
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
  "/lesson"
  // Add more routes here as needed
];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if current route should hide both navbar and footer
  const shouldHideBoth = HIDE_BOTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current route should hide only navbar
  const shouldHideNavbarOnly = HIDE_NAVBAR_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Determine what to show
  const showNavbar = !shouldHideBoth && !shouldHideNavbarOnly;
  const showFooter = !shouldHideBoth;

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="mobile-content">{children}</main>
      {showFooter && <Footer />}
    </>
  );
}
