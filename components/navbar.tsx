"use client";

import React from "react";
import Link from "next/link";
import Container from "./container";

export default function Navbar() {
  const menuItems = [
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
  ];

  const authRoutes = [
    { label: "Sign In", href: "/sign-in" },
    { label: "Sign Up", href: "/sign-up" },
  ];

  return (
    <Container className="py-4 px-10 border-b shadow-xl">
      <nav className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 font-nunito">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold text-blue-600">
          DropFile
        </Link>

        {/* Menu Items */}
        <div className="flex items-center gap-6 text-lg">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {authRoutes.map((item) => (
            <Link key={item.href} href={item.href} className="btn btn-outline">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </Container>
  );
}
