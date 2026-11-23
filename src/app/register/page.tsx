
import Link from "next/link";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← CareerAI PH
        </Link>

        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-gray-600">
            Start connecting what you learn today with the AI skills you&apos;ll
            need tomorrow.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
