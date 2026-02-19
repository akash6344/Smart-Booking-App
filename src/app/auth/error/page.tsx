import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const message = params?.message ?? "An error occurred during sign in.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h1 className="text-lg font-semibold text-red-800">Authentication Error</h1>
        <p className="mt-2 text-sm text-red-700">{message}</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-red-600 hover:text-red-800 underline"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
