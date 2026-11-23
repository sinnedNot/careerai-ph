
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CareerInterestsForm from "./career-interests-form";

export default async function CareerInterestsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: interests, error: interestsError } = await supabase
    .from("career_interests")
    .select("id, career_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (interestsError) {
    console.error("Career interests fetch failed:", interestsError.message);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-blue-700">
            CareerAI PH
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900">
          My Career Interests
        </h1>

        <p className="mt-2 text-gray-800">
          Tell us about the careers you want to pursue so we can connect
          your college subjects with relevant AI skills.
        </p>

        <CareerInterestsForm initialInterests={interests ?? []} />
      </div>
    </main>
  );
}
