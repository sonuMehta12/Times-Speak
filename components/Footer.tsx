"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, User, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Footer() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/aditi", label: "Aditi", icon: null, isAI: true }, // Special AI tutor item
    { href: "/learn", label: "Learn", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50 bg-white border-t border-gray-200 shadow-lg">
      <nav className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          // Special styling for Aditi (AI Tutor)
          if (item.isAI) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 min-w-[60px] py-1.5 relative"
              >
                {/* Glowing Effect for AI */}
                <div
                  className={`absolute inset-0 rounded-full ${
                    active ? "bg-navy/5" : ""
                  }`}
                />

                {/* AI Avatar - Aditi */}
                <div className="relative">
                  <Avatar
                    className={`w-8 h-8 border-2 transition-all ${
                      active ? "border-navy shadow-navy" : "border-navy/30"
                    }`}
                  >
                    <AvatarImage src="/imgs/Aditi.png" alt="Aditi AI" />
                    <AvatarFallback
                      className={`font-bold text-xs transition-colors ${
                        active ? "bg-navy text-white" : "bg-navy/10 text-navy"
                      }`}
                    >
                      AI
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator dot */}
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-teal rounded-full border-2 border-white" />
                </div>

                <span
                  className={`text-[10px] font-medium transition-colors ${
                    active ? "text-navy" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          // Regular nav items
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 min-w-[60px] py-1.5 relative"
            >
              {active && (
                <div className="absolute inset-0 bg-navy/5 rounded-full" />
              )}

              {Icon && (
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? "text-navy" : "text-gray-500"
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
              )}

              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "text-navy" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
