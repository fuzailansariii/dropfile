"use client";
import Container from "@/components/container";
import Input from "@/components/input";
import EmailIcon from "@/icons/EmailIcon";
import KeyIcon from "@/icons/KeyIcon";
import { signInScheama } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SignInForm() {
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
    console.log(data);
  };

  return (
    <Container>
      <div className="card w-md bg-base-100 shadow-lg">
        <div className="card-body w-full">
          <h2 className="text-3xl font-bold text-center">Sign In</h2>
          <div className="mt-10">
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
