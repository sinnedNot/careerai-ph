
import Link from "next/link";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <Link
          href="/login"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to login
        </Link>

        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Reset your password
          </h1>

          <p className="mt-2 text-gray-600">
            Choose a new password for your CareerAI PH account.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </main>
  );
}
