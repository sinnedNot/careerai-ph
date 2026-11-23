
import Link from "next/link";
import LoginForm from "./login-form";

export default function LoginPage() {
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
            Welcome back
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to continue your AI career journey.
          </p>
        </div>

        <LoginForm />
        <div className="mt-4 text-right">
  <Link
    href="/forgot-password"
    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
  >
    Forgot password?
  </Link>
</div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
