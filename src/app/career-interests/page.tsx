
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CareerInterestsForm from "./career-interests-form";

export default async function CareerInterestsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: careerInterests, error } = await supabase
    .from("career_interests")
    .select("id, career_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Career interests fetch failed:", error.message);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to dashboard
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Career Interests
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Tell us which careers you are interested in pursuing. We&apos;ll
            use these interests to connect your college subjects with
            relevant AI skills.
          </p>

          <CareerInterestsForm
            initialInterests={careerInterests ?? []}
          />
        </div>
      </div>
    </main>
  );
}
