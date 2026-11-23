
"use client";

import { useActionState } from "react";
import {
  updateProfile,
  type ProfileState,
} from "./actions";

type ProfileFormProps = {
  initialValues: {
    full_name: string;
    degree_program: string;
    year_level: string;
    ai_knowledge_level: string;
  };
};

const initialState: ProfileState = {};

const inputClassName =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200";

export default function ProfileForm({
  initialValues,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState
  );

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          defaultValue={initialValues.full_name}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="degreeProgram"
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          Degree program
        </label>
        <input
          id="degreeProgram"
          name="degreeProgram"
          type="text"
          required
          defaultValue={initialValues.degree_program}
          placeholder="e.g. BS Accountancy"
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="yearLevel"
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          Year level
        </label>
        <select
          id="yearLevel"
          name="yearLevel"
          required
          defaultValue={initialValues.year_level}
          className={inputClassName}
        >
          <option value="" disabled>
            Select your year level
          </option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
          <option value="5th Year">5th Year</option>
          <option value="Graduate">Graduate</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="aiKnowledgeLevel"
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          Current AI knowledge
        </label>
        <select
          id="aiKnowledgeLevel"
          name="aiKnowledgeLevel"
          required
          defaultValue={initialValues.ai_knowledge_level}
          className={inputClassName}
        >
          <option value="" disabled>
            Select your AI knowledge level
          </option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-700">
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
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
