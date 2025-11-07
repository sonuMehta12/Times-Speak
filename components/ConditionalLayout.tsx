"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Define routes where Navbar and Footer should be hidden.
 *
 * To hide layout on a new route, simply add the route path to this array.
 * The component uses `startsWith()` so all sub-routes will also hide the layout.
 *
 * Example: Adding "/role" will hide layout for "/role", "/role/123", "/role/practice", etc.
 */
const HIDDEN_LAYOUT_ROUTES = [
  "/role",
  "/lesson",
  "/quiz",
  // Add more routes here as needed in the future
  // "/another-route",
  // "/yet-another-route",
];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if current route should hide layout
  const shouldHideLayout = HIDDEN_LAYOUT_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main className="mobile-content">{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}
