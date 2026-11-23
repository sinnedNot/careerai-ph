
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubjectsForm from "./subjects-form";

export default async function SubjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: subjects, error } = await supabase
    .from("subjects")
    .select("id, subject_name, current_topics, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Subjects fetch failed:", error.message);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to dashboard
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Academic Subjects
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Add the college subjects you are currently taking and the topics
            you are studying in each one. CareerAI PH will use these details
            to recommend relevant AI skills for your career interests.
          </p>

          <SubjectsForm initialSubjects={subjects ?? []} />
        </div>
      </div>
    </main>
  );
}
