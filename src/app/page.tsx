
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Tell us what you're studying",
    description:
      "Add your college degree, current subjects, and the topics you're learning in class.",
  },
  {
    number: "02",
    title: "Choose your career direction",
    description:
      "Share the career you want to pursue and your current level of AI knowledge.",
  },
  {
    number: "03",
    title: "Discover what to learn next",
    description:
      "Get personalized AI skills, practical activities, and a learning roadmap connected to your studies.",
  },
];

const benefits = [
  {
    title: "Connected to your subjects",
    description:
      "Recommendations are based on what you actually study in college, not just your degree title.",
  },
  {
    title: "Relevant to your future career",
    description:
      "Understand how AI skills can be applied in the profession you want to pursue.",
  },
  {
    title: "Learn through practical activities",
    description:
      "Discover learning objectives, useful tools, and activities that help you apply new knowledge.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight text-blue-700">
            CareerAI PH
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="hidden text-sm font-medium text-slate-600 hover:text-blue-700 sm:block"
            >
              How it works
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-blue-700"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
          <div>
            <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
              Your future is evolving. Get ready for AI.
            </span>

            <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Connect What You Learn Today With the{" "}
              <span className="text-blue-700">AI Skills</span> You&apos;ll Need
              Tomorrow.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover which AI-related knowledge and skills you should develop
              based on your college subjects and the career you want to pursue.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-blue-700 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
              >
                Start your journey
              </Link>

              <Link
                href="#how-it-works"
                className="rounded-lg border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:border-blue-700 hover:text-blue-700"
              >
                Explore how it works
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Built for Filipino college students preparing for an AI-driven
              future.
            </p>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-white p-7 shadow-xl shadow-blue-900/5 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
              Your learning journey
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              From classroom topics to career-ready AI skills.
            </h2>

            <div className="mt-8 space-y-5">
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  What you study
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  Accountancy · Auditing
                </p>
              </div>

              <div className="flex justify-center text-2xl text-blue-600">
                ↓
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                <p className="text-sm font-medium text-blue-700">
                  What you can explore
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  AI-assisted auditing and anomaly detection
                </p>
              </div>

              <div className="flex justify-center text-2xl text-blue-600">
                ↓
              </div>

              <div className="rounded-xl bg-slate-900 p-5 text-white">
                <p className="text-sm font-medium text-blue-200">
                  Where it can take you
                </p>
                <p className="mt-2 font-semibold">
                  A more AI-ready accounting professional
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs leading-5 text-slate-500">
              Illustrative example. Recommendations will be personalized to
              each student&apos;s subjects and career interests.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Your college subjects. Your career goals. Your AI learning path.
          </h2>
          <p className="mt-5 leading-7 text-slate-600">
            CareerAI PH connects your current academic learning with the AI
            knowledge and skills you may need in your future profession.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-slate-200 p-8 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-sm font-bold tracking-widest text-blue-700">
                STEP {step.number}
              </span>
              <h3 className="mt-5 text-xl font-bold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-4 leading-7 text-slate-600">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Why CareerAI PH
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
              Go beyond generic AI learning recommendations.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-2xl bg-white p-8 shadow-sm"
              >
                <div className="mb-5 h-2 w-12 rounded-full bg-blue-700" />
                <h3 className="text-xl font-bold text-slate-950">
                  {benefit.title}
                </h3>
                <p className="mt-4 leading-7 text-slate-600">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-700 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Start connecting your studies with your future.
          </h2>
          <p className="mt-5 leading-7 text-blue-100">
            Discover the AI skills that can complement what you&apos;re
            learning in college today.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Get started for free
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} CareerAI PH. All rights reserved.</p>
          <p>Connect what you learn today with the AI skills you&apos;ll need tomorrow.</p>
        </div>
      </footer>
    </main>
  );
}
