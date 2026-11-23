
"use client";

import { useActionState, useState, useTransition } from "react";
import {
  addCareerInterest,
  deleteCareerInterest,
  type CareerInterestState,
} from "./actions";

type CareerInterest = {
  id: string;
  career_name: string;
  created_at: string;
};

type Props = {
  initialInterests: CareerInterest[];
};

const initialState: CareerInterestState = {};

export default function CareerInterestsForm({
  initialInterests,
}: Props) {
  const [interests, setInterests] = useState(initialInterests);
  const [state, formAction, isPending] = useActionState(
    addCareerInterest,
    initialState
  );
  const [isDeleting, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState("");

  function handleDelete(id: string) {
    setDeleteError("");

    startTransition(async () => {
      const result = await deleteCareerInterest(id);

      if (result.error) {
        setDeleteError(result.error);
        return;
      }

      setInterests((current) =>
        current.filter((interest) => interest.id !== id)
      );
    });
  }

  return (
    <div className="mt-8 space-y-8">
      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="careerName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Career you&apos;re interested in
          </label>

          <input
            id="careerName"
            name="careerName"
            type="text"
            placeholder="e.g. Financial Analyst"
            maxLength={100}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {state.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}

        {state.success && (
          <p role="status" className="text-sm text-green-700">
            {state.success}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Adding..." : "Add career interest"}
        </button>
      </form>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Your career interests
        </h2>

        {interests.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            You haven&apos;t added any career interests yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {interests.map((interest) => (
              <li
                key={interest.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4"
              >
                <span className="text-sm font-medium text-gray-800">
                  {interest.career_name}
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(interest.id)}
                  disabled={isDeleting}
                  className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {deleteError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {deleteError}
          </p>
        )}
      </div>
    </div>
  );
}
