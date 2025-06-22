"use client";
import ErrorIcon from "@/icons/ErrorIcon";
import React from "react";
import Input from "./input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verificationCode } from "@/schemas/verificationSchema";
import { z } from "zod";
import { useSignUp } from "@clerk/nextjs";

interface VerificationCodeFormProps {
  verificationError?: string | null;
  handleVerificationSubmit: (data: z.infer<typeof verificationCode>) => void;
  authError?: string | null;
}

export default function VerificationCodeForm({
  verificationError,
  handleVerificationSubmit,
}: VerificationCodeFormProps) {
  const { signUp } = useSignUp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof verificationCode>>({
    resolver: zodResolver(verificationCode),
  });

  const onSubmit = async (data: z.infer<typeof verificationCode>) => {
    try {
      handleVerificationSubmit(data);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Verification error: ", error.message);
      } else {
        console.error("An unexpected error occurred during verification.");
      }
    }
  };

  const resendCode = async () => {
    try {
      // Logic to resend the verification code
      console.log("Resending verification code...");
      if (signUp) {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error resending code: ", error.message);
      } else {
        console.error("An unexpected error occurred while resending the code.");
      }
    }
  };

  return (
    <div className="card w-96 bg-base-100 card-lg shadow-sm">
      <h2 className="text-center text-2xl">Verify Your Email</h2>
      <div className="card-body">
        <p className="text-center text-md text-gray-600">
          We have sent a 6-digit verification code to your email address. Please
          enter it below.
        </p>
        <div className="mt-7">
          {verificationError && (
            <div role="alert" className="alert alert-error">
              <ErrorIcon />
              <span>{verificationError}</span>
            </div>
          )}
        </div>
        {/* <div className="divider" /> */}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            placeholder="Enter verification code"
            type="text"
            register={register("code")}
            error={errors.code?.message}
            autoFocus
          />
          <button
            type="submit"
            className="btn btn-primary rounded-md w-full mt-4"
            disabled={isSubmitting}
          >
            Verify
          </button>
        </form>
        <div className="flex justify-center items-center gap-2 text-gray-600">
          <span className="text-sm">Didn't receive the code?</span>
          <span
            role="button"
            onClick={resendCode}
            className="underline cursor-pointer hover:text-gray-400 transition-colors duration-200"
          >
            Resend
          </span>
        </div>
      </div>
    </div>
  );
}
