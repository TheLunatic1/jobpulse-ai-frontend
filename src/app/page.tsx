import { MotionDiv } from "@/components/motion/MotionDiv";
import { fadeInUp } from "@/lib/animations";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-base-100">
      <MotionDiv
  variants={fadeInUp}
  className="text-5xl font-bold text-primary"
>
  JobPulse AI
</MotionDiv>

      <p className="text-xl mb-10 text-center max-w-2xl text-base-content/80">
        Next-generation job recruitment platform with AI-powered matching, career assistant, 
        smart recommendations and instant insights.
      </p>

      <div className="card bg-base-200 shadow-2xl w-full max-w-lg border border-base-300/30">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl text-base-content">
            Welcome to smarter hiring
          </h2>
          <p className="py-6 text-base-content/70">
            Discover opportunities, get AI-tailored job suggestions, 
            chat with career AI — everything in one powerful dashboard.
          </p>
          <div className="card-actions mt-4">
            <button className="btn btn-primary btn-lg px-12">
              Browse Jobs
            </button>
          </div>
        </div>
      </div>

      <p className="mt-16 text-sm text-base-content/50">
        © {new Date().getFullYear()} JobPulse AI • Built with passion
      </p>
    </main>
  );
}