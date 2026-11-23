
"use client";

import { useState } from "react";

type ApiResponse = {
  recommendations?: Array<Record<string, unknown>>;
  error?: string;
};

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setIsLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await fetch("/api/recommendations/generate", {
        method: "POST",
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate recommendations.");
      }

      setRecommendations(data.recommendations ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <a
          href="/dashboard"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </a>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Learning Recommendations
          </h1>

          <p className="mt-3 text-gray-600">
            Discover AI skills connected to your college subjects,
            classroom topics, and career interests.
          </p>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Generating..." : "Generate Recommendations"}
          </button>

          {error && (
            <p className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {recommendations.length > 0 && (
            <div className="mt-8 space-y-6">
              {recommendations.map((item, index) => (
                <article
                  key={index}
                  className="rounded-xl border border-gray-200 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900">
                    {String(item.recommendedTopic ?? "AI Learning Topic")}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Subject: {String(item.subjectName ?? "—")}
                    {" · "}
                    Classroom topic: {String(item.classroomTopic ?? "—")}
                  </p>

                  <div className="mt-4 space-y-4 text-gray-700">
                    <div>
                      <h3 className="font-semibold">Why this is relevant</h3>
                      <p className="mt-1">
                        {String(item.relevanceExplanation ?? "—")}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold">Career application</h3>
                      <p className="mt-1">
                        {String(item.careerApplication ?? "—")}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold">Learning objective</h3>
                      <p className="mt-1">
                        {String(item.learningObjective ?? "—")}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold">Practical activity</h3>
                      <p className="mt-1">
                        {String(item.practicalActivity ?? "—")}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold">Recommended tools</h3>
                      <p className="mt-1">
                        {Array.isArray(item.recommendedTools)
                          ? item.recommendedTools.join(", ")
                          : "—"}
                      </p>
                    </div>

                    <p className="text-sm font-semibold capitalize">
                      Priority: {String(item.priority ?? "—")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
