// src/app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-blue-600">
        JobPulse AI
      </h1>

      <p className="text-xl mb-10 text-center max-w-2xl text-gray-700">
        Smart job recruitment portal with AI-powered matching, career guidance, and instant suggestions.
      </p>

      {/* daisyUI Card */}
      <div className="card bg-white shadow-2xl w-full max-w-lg border border-gray-200">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl text-gray-800">
            Welcome to the future of hiring
          </h2>
          <p className="py-6 text-gray-600">
            Discover thousands of jobs, get personalized AI recommendations, chat with a career assistant — all in one modern platform.
          </p>
          <div className="card-actions mt-4">
            <button className="btn btn-primary btn-lg px-10">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Small footer-like note */}
      <p className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} JobPulse AI. All rights reserved.
      </p>
    </div>
  );
}