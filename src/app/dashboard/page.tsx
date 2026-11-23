
import { logout } from "./actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-blue-700">
            CareerAI PH
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{user.email}</span>

            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to your dashboard!
          </h1>

          <p className="mt-2 text-gray-700">
            Connect what you learn today with the AI skills you&apos;ll need
            tomorrow.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="My Profile"
            description="Manage your degree program, year level, and AI knowledge."
            href="/profile"
          />

          <DashboardCard
            title="My Subjects"
            description="Add your current college subjects and classroom topics."
            href="/subjects"
          />

          <DashboardCard
            title="My Career Interests"
            description="Add and manage the careers you want to pursue."
            href="/career-interests"
          />

          <DashboardCard
            title="AI Recommendations"
            description="Discover AI skills connected to what you are studying."
            href="/recommendations"
          />

          <DashboardCard
            title="Learning Roadmap"
            description="Explore your personalized AI learning journey."
            href="/roadmap"
          />
        </div>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-gray-700">
        {description}
      </p>

      <span className="mt-5 inline-block text-sm font-semibold text-blue-700">
        Open →
      </span>
    </Link>
  );
}
