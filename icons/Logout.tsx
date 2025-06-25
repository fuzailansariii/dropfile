import React from "react";

interface IconProps {
  sizeVarient: "sm" | "md" | "lg";
}

const size = {
  sm: "h-4, w-4",
  md: "h-5, w-5",
  lg: "h-8, w-8",
};

export default function Logout({ sizeVarient }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={size[sizeVarient]}
    >
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    </svg>
  );
}
