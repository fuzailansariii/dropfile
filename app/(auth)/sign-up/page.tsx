"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Input from "../../../components/input";
import EmailIcon from "@/icons/EmailIcon";
import KeyIcon from "@/icons/KeyIcon";
import Container from "@/components/container";

export default function SignUpForm() {
  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [otp, setOtp] = useState<string>("");
  const { signUp, isLoaded, setActive } = useSignUp();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  //   Form Submission Handler
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
      // Reset the form only if the sign-up was successful
      reset();
    }
  };

  //   OTP Verification Handler
  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: otp,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // TODO: Toast success message
        // Redirect to the dashboard or home page
        router.push("/dashboard");
      } else {
        console.error("Verification failed:", result);
        setVerificationError("An unexpected error occurred.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
      // Reset the OTP input field
      setOtp("");
    }
  };

  const formHandler = (data: z.infer<typeof signUpSchema>) => {
    console.log(data);
    reset();
  };
  return (
    <Container>
      <div className="card w-md bg-base-100 shadow-lg">
        <div className="card-body w-full">
          <h2 className="text-3xl font-bold text-center">Create an Account</h2>
          <div className="mt-10">
            <form
              onSubmit={handleSubmit(formHandler)}
              className="flex flex-col space-y-4"
            >
              <Input
                icon={<EmailIcon />}
                placeholder="Email"
                error={errors.email?.message}
                type="email"
                register={register("email")}
              />
              <Input
                icon={<KeyIcon />}
                placeholder="Password"
                error={errors.password?.message}
                type="password"
                register={register("password")}
              />
              <Input
                icon={<KeyIcon />}
                placeholder="Confirm password"
                error={errors.confirmPassword?.message}
                type="password"
                register={register("confirmPassword")}
              />
              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-block rounded-md"
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
