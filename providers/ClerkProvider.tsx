"use client";
import { ClerkProvider } from "@clerk/nextjs";

export const ClerkProviders = ({ children }: { children: React.ReactNode }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};
