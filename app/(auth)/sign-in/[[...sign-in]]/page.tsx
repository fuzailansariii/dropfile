"use client";
import Container from "@/components/container";
import Input from "@/components/input";
import EmailIcon from "@/icons/EmailIcon";
import KeyIcon from "@/icons/KeyIcon";
import { signInScheama } from "@/schemas/signInSchema";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SignInForm() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInScheama),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInScheama>) => {
    // console.log(data);
    if (!isLoaded) return;
    setAuthError(null);
    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        // Sign-in was successful, redirect to the home page or dashboard
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        // Handle other statuses like "needs_second_factor" or "requires_action"
        setAuthError("Sign-in requires additional verification.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("An unexpected error occurred.");
      }
    }
  };

  return (
    <Container>
      <div className="card w-md bg-base-100 shadow-lg">
        <div className="card-body w-full">
          <h2 className="text-3xl font-bold text-center">Sign In</h2>
          <div className="mt-10">
            {authError && (
              <div role="alert" className="alert alert-error">
                <span>{authError}</span>
              </div>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
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
              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-block rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
