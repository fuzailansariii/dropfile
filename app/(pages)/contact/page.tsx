"use client";
import Container from "@/components/container";
import Input from "@/components/input";
import { Mail, User } from "lucide-react";
import Link from "next/link";
import { ContactSchema } from "@/schemas/contactSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function Contact() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ContactSchema>) => {
    console.log("Form Data:", data);
    reset(); // Reset the form after submission
  };

  return (
    <Container className="p-4 flex justify-center">
      <div className="card w-full max-w-3xl md:p-8 p-4 gap-4 shadow-lg">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-gray-400 mt-2 text-center">
          If you have any questions, suggestions, or just want to say hello,
          feel free to reach out! You can contact us via email at{" "}
          <Link
            href="mailto:fuzailansarisecret@gmail.com"
            className="text-blue-500 hover:underline"
          >
            Fuzail Ansari
          </Link>
        </p>
        <div className="flex flex-col items-center my-8">
          <form
            className="w-full md:max-w-3/4 p-2 md:px-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="First Name"
                icon={<User size={18} />}
                register={register("firstName")}
                error={errors.firstName?.message}
              />
              <Input
                type="text"
                placeholder="Last Name"
                icon={<User size={18} />}
                register={register("lastName")}
                error={errors.lastName?.message}
              />
              <Input
                type="email"
                placeholder="your.email@example.com"
                icon={<Mail size={18} />}
                register={register("email")}
                error={errors.email?.message}
              />
              <textarea
                placeholder="Your message"
                className="textarea w-full"
                {...register("message")}
              />
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message.message}</p>
              )}
              <button type="submit" className="btn btn-primary w-full">
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
          <div>
            <p className="mt-4">
              Alternatively, you can also reach out to us on{" "}
              <Link
                target="_blank"
                href="https://x.com/fuzail_ansarii/"
                className="text-blue-500 hover:underline"
              >
                X{" "}
              </Link>{" "}
              or{" "}
              <Link
                target="_blank"
                href="https://www.linkedin.com/in/mohdfuzailansari/"
                className="text-blue-500 hover:underline"
              >
                LinkedIn
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
