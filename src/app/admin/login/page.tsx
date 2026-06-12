import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to review creator applications.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
