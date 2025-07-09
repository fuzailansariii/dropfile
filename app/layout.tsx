import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ImageKitProviders } from "./providers/imageKitProvider";
import Navbar from "@/components/navbar";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DropFile App",
  description:
    "A simple file sharing app built with Next.js, Clerk, and ImageKit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="business">
        <body
          className={`${quicksand.variable} ${nunito.variable} antialiased`}
        >
          <ImageKitProviders>
            <Navbar />
            {children}
          </ImageKitProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
