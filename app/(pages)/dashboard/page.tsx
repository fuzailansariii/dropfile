"use client";
import { useClerk, useSignIn } from "@clerk/nextjs";
import React from "react";

export default function Dashboard() {
  const { signOut } = useClerk();
  return (
    <div>
      Dashboard
      <button
        onClick={() => signOut()}
        className="cursor-pointer btn btn-primary"
      >
        Sign Out
      </button>
    </div>
  );
}
