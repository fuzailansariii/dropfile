import React from "react";

interface ButtonProps {
  startIcon?: React.ReactNode;
  title: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

export default function Button({
  startIcon,
  title,
  onClick,
  type,
  className,
}: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className={className}>
      {startIcon}
      {title}
    </button>
  );
}
