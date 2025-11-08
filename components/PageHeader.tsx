// components/PageHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = true,
  onBack,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = onBack || (() => router.back());

  return (
    <header className="flex-shrink-0 bg-white/95 backdrop-blur-lg z-20 border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-text-primary leading-tight truncate font-display text-base">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs text-text-secondary">{subtitle}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-gray-100 text-navy flex-shrink-0"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}