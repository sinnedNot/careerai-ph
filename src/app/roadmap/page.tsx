
import RoadmapProgressButton from "./roadmap-progress-button";
import GenerateRoadmapButton from "./generate-roadmap-button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type RoadmapItem = {
  id: string;
  stage: string;
  topic: string;
  learning_objective: string;
  practical_activity: string;
  sequence_order: number;
  completed: boolean;
};

export default async function RoadmapPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Retrieve the user's latest roadmap.
  const { data: roadmap, error: roadmapError } = await supabase
    .from("learning_roadmaps")
    .select("id, title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (roadmapError) {
    console.error(
      "Roadmap retrieval failed:",
      roadmapError.message
    );
  }

  // Initialize roadmap activities and progress values.
  let items: RoadmapItem[] = [];

  let totalActivities = 0;
  let completedActivities = 0;
  let remainingActivities = 0;
  let completionPercentage = 0;

  // Retrieve activities if a roadmap exists.
  if (roadmap) {
    const { data, error } = await supabase
      .from("roadmap_items")
      .select(
        "id, stage, topic, learning_objective, practical_activity, sequence_order, completed"
      )
      .eq("roadmap_id", roadmap.id)
      .eq("user_id", user.id)
      .order("sequence_order", { ascending: true });

    if (error) {
      console.error(
        "Roadmap items retrieval failed:",
        error.message
      );
    } else {
      items = (data ?? []) as RoadmapItem[];

      // Calculate learning progress.
      totalActivities = items.length;

      completedActivities = items.filter(
        (item) => item.completed
      ).length;

      remainingActivities =
        totalActivities - completedActivities;

      completionPercentage =
        totalActivities > 0
          ? Math.round(
              (completedActivities / totalActivities) * 100
            )
          : 0;
    }
  }

  const stages = ["Foundation", "Intermediate", "Applied"];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Learning Roadmap
          </h1>

          <p className="mt-3 text-gray-600">
            Follow your personalized learning journey from foundational
            AI knowledge to practical career applications.
          </p>

          {/* Always display the generate button. */}
          <div className="mt-5">
            <GenerateRoadmapButton />
          </div>
        </div>

        {!roadmap || items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Your roadmap is not ready yet
            </h2>

            <p className="mt-2 text-gray-600">
              Generate a personalized roadmap from your saved AI
              recommendations to see your learning stages here.
            </p>

            <Link
              href="/recommendations"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              View AI Recommendations
            </Link>
          </div>
        ) : (
          <>
            {/* Roadmap information */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">
                {roadmap.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Created:{" "}
                {new Date(roadmap.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Learning progress summary */}
            <div className="mb-8 mt-8 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Your Learning Progress
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    Total Activities
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {totalActivities}
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-gray-600">
                    Completed
                  </p>
                  <p className="mt-1 text-2xl font-bold text-green-700">
                    {completedActivities}
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-gray-600">
                    Remaining
                  </p>
                  <p className="mt-1 text-2xl font-bold text-blue-700">
                    {remainingActivities}
                  </p>
                </div>
              </div>

              {/* Completion percentage */}
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    Overall Completion
                  </span>

                  <span className="font-bold text-gray-900">
                    {completionPercentage}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-green-600 transition-all duration-500"
                    style={{
                      width: `${completionPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Roadmap stages */}
            <div className="mt-8 space-y-8">
              {stages.map((stage) => {
                const stageItems = items.filter(
                  (item) =>
                    item.stage.toLowerCase() === stage.toLowerCase()
                );

                return (
                  <section key={stage}>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {stage}
                    </h2>

                    {stageItems.length === 0 ? (
                      <p className="mt-3 text-sm text-gray-500">
                        No learning activities in this stage yet.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-4">
                        {stageItems.map((item) => (
                          <article
                            key={item.id}
                            className="rounded-xl border border-gray-200 bg-white p-6"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.sequence_order}. {item.topic}
                              </h3>

                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                {item.completed
                                  ? "Completed"
                                  : "Not started"}
                              </span>
                            </div>

                            <RoadmapProgressButton
                              itemId={item.id}
                              initialCompleted={item.completed}
                            />

                            <div className="mt-4">
                              <h4 className="font-semibold text-gray-800">
                                Learning objective
                              </h4>

                              <p className="mt-1 text-gray-600">
                                {item.learning_objective}
                              </p>
                            </div>

                            <div className="mt-4">
                              <h4 className="font-semibold text-gray-800">
                                Practical activity
                              </h4>

                              <p className="mt-1 text-gray-600">
                                {item.practical_activity}
                              </p>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
