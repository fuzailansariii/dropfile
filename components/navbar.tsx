"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "./container";
import { useClerk, useUser } from "@clerk/nextjs";
import Logout from "@/icons/Logout";
import MenuIcon from "@/icons/MenuIcon";

export default function Navbar() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  const menuItems = [
    ...(isSignedIn ? [{ label: "Dashboard", href: "/dashboard" }] : []),
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
  ];

  const authRoutes = [
    { label: "Sign In", href: "/sign-in" },
    { label: "Sign Up", href: "/sign-up" },
  ];

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ redirectUrl: "/sign-in" });
    setIsLoading(false);
  };

  return (
    <Container className="shadow-xl px-4 rounded-xl navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <MenuIcon />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={"/"}
          className="text-2xl font-semibold cursor-pointer font-nunito"
        >
          DropFile
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-nunito text-lg">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <h1>Hello,</h1>
            {isLoading ? (
              <span>Logging out...</span>
            ) : (
              <button
                className="btn btn-secondary flex items-center gap-2 cursor-pointer"
                onClick={handleSignOut}
              >
                <Logout sizeVarient="md" />
              </button>
            )}
          </div>
        ) : (
          <div className="navbar-center">
            <ul className="menu menu-horizontal px-1 font-nunito text-lg">
              {authRoutes.map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Container>
  );
}
