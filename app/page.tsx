"use client";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh] text-center font-nunito">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Welcome to <span className="text-blue-600">DropFile</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
        Securely upload, manage, and access your files anytime, anywhere.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="/sign-up"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </a>
        <a
          href="/about"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          Learn More
        </a>
      </div>
    </main>
  );
}
