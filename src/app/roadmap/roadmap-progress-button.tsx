
"use client";

import { useState } from "react";
import { updateRoadmapProgress } from "./actions";

type Props = {
  itemId: string;
  initialCompleted: boolean;
};

export default function RoadmapProgressButton({
  itemId,
  initialCompleted,
}: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    if (isSaving) return;

    const nextValue = !completed;

    setIsSaving(true);
    setError("");

    try {
      const result = await updateRoadmapProgress(itemId, nextValue);

      if (result.error) {
        setError(result.error);
        return;
      }

      setCompleted(nextValue);
    } catch {
      setError("Unable to update your progress. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isSaving}
        className={`rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60 ${
          completed
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isSaving
          ? "Saving..."
          : completed
            ? "✓ Completed – Mark as not completed"
            : "Mark as completed"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
