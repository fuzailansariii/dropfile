import Container from "@/components/container";
import React from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function About() {
  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/mohdfuzailansari/",
      icon: FaLinkedin,
    },
    {
      name: "X",
      url: "https://x.com/fuzail_ansarii",
      icon: FaXTwitter,
    },
    {
      name: "GitHub",
      url: "https://github.com/fuzailansariii/",
      icon: FaGithub,
    },
  ];

  return (
    <Container className="p-4 flex justify-center">
      <div className="max-w-3xl w-full card p-6 md:p-8 shadow-lg flex flex-col gap-6">
        <h1 className="text-3xl font-bold">About Me</h1>

        <p className="text-base leading-relaxed">
          Hi! I'm <strong>Fuzail</strong>, a passionate Full-Stack Developer
          with a focus on building clean and performant web applications using
          modern technologies like{" "}
          <span className="text-gray-500 font-bold">Next.js</span>,{" "}
          <span className="text-gray-500 font-bold">TailwindCSS</span>, and{" "}
          <span className="text-gray-500 font-bold">Drizzle ORM</span>.
        </p>

        <p className="text-base leading-relaxed">
          I love solving problems, exploring DevOps tools, and designing
          user-friendly interfaces. This project is part of my ongoing journey
          to become a more efficient and impactful developer.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Frontend: React, Next.js, TailwindCSS</li>
            <li>Backend: Node.js, Drizzle ORM, PostgreSQL</li>
            <li>DevOps: Docker, GitHub Actions, Vercel</li>
          </ul>
        </div>

        {/* social icons */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Find me on</h2>
          <div className="flex justify-center md:justify-start gap-4 mt-6">
            {socialLinks.map((item, index) => (
              <div
                key={index}
                className="bg-gray-700 p-2 rounded-lg shadow-md"
                title={item.name}
              >
                <Link href={item.url} target="_blank" rel="noopener noreferrer">
                  <item.icon className="h-8 w-8 hover:scale-125 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Feel free to reach out if you'd like to collaborate or have questions!
        </p>
      </div>
    </Container>
  );
}
