
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, degree_program, year_level, ai_knowledge_level"
    )
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            My Student Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Tell us about your academic background so we can personalize
            your AI learning recommendations.
          </p>

          <ProfileForm
            initialValues={{
              full_name: profile?.full_name ?? "",
              degree_program: profile?.degree_program ?? "",
              year_level: profile?.year_level ?? "",
              ai_knowledge_level: profile?.ai_knowledge_level ?? "",
            }}
          />
        </div>
      </div>
    </main>
  );
}
