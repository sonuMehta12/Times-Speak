"use client";

import { useState } from "react";
import { Flame, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [streak, setStreak] = useState(7);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  // Mock user data - replace with actual user data
  const user = {
    name: "John",
    image: null, // Set to user photo URL if available
  };

  const languages = [
    { code: "EN", label: "English", flag: "🇬🇧" },
    { code: "HI", label: "हिंदी", flag: "🇮🇳" },
    { code: "HE", label: "Hinglish", flag: "🇮🇳" },
  ];

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="font-display text-xl font-bold text-navy">
            TimeSpeak
          </h1>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-orange-500" fill="#f97316" />
            <span className="text-sm font-semibold text-orange-700">
              {streak}
            </span>
          </div>

          {/* Language Picker */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                {selectedLanguage}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`cursor-pointer ${
                    selectedLanguage === lang.code ? "bg-blue-50" : ""
                  }`}
                >
                  <span className="mr-2 text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar */}
          <Avatar className="w-9 h-9 border-2 border-coral cursor-pointer hover:border-coral-hover transition-colors">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="bg-coral text-white font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
