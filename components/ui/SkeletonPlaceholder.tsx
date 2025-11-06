// components/ui/SkeletonPlaceholder.tsx
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"; // Import the base Skeleton from shadcn/ui

interface SkeletonPlaceholderProps {
  /** Additional classes for the container div */
  className?: string;
  /** Number of skeleton lines to render */
  lines?: number;
  /** Tailwind CSS height class for each line (e.g., "h-4", "h-6") */
  lineHeightClassName?: string;
  /**
   * Array of Tailwind CSS width classes for lines.
   * If 'lines' is greater than length of 'lineWidths', it will cycle through 'lineWidths'.
   * e.g., ["w-full", "w-3/4", "w-5/6"]
   */
  lineWidths?: string[];
  /** Spacing between lines, e.g., "space-y-2", "space-y-3" */
  lineSpacingClassName?: string;
  /** If true, child skeletons will have rounded corners */
  rounded?: boolean | "sm" | "md" | "lg" | "full";
}

export function SkeletonPlaceholder({
  className,
  lines = 1,
  lineHeightClassName = "h-4", // Default to 16px height
  lineWidths = ["w-full"], // Default to full width for all lines
  lineSpacingClassName = "space-y-2", // Default spacing
  rounded = "md", // Default to medium rounded corners
}: SkeletonPlaceholderProps) {
  const getRoundedClass = () => {
    if (rounded === true) return "rounded-md";
    if (typeof rounded === "string") return `rounded-${rounded}`;
    return "";
  };

  return (
    <div className={cn("animate-pulse", lineSpacingClassName, className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            lineHeightClassName,
            lineWidths[i % lineWidths.length], // Cycle through lineWidths for variety
            getRoundedClass()
          )}
        />
      ))}
    </div>
  );
}
