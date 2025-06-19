"use client";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  placeholder: string;
  type: string;
  register?: UseFormRegisterReturn; // Adjust type as needed for your form library
  error?: string;
}

export default function Input({
  icon,
  type,
  placeholder,
  register,
  error,
}: InputProps) {
  return (
    <div className="">
      <label className="input validator w-full rounded-md">
        {icon}
        <input {...register} type={type} placeholder={placeholder} />
      </label>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
