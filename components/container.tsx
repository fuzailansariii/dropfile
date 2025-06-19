import { cn } from "@/lib/cn";
import React from "react";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl mx-auto flex justify-center items-center min-h-screen",
        className
      )}
    >
      {children}
    </div>
  );
}
