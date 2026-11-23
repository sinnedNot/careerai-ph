
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateRoadmapButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleGenerate() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to generate your roadmap."
        );
      }

      router.refresh();
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
    <div className="mt-5">
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Generating Roadmap..." : "Generate Learning Roadmap"}
      </button>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
