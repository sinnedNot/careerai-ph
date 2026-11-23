
"use client";

import { useActionState } from "react";
import {
  registerStudent,
  type RegistrationState,
} from "./actions";

const initialState: RegistrationState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerStudent,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
          placeholder="Enter your password again"
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
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
