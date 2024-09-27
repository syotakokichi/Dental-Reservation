import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-24">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to Our Application</h1>
        <p className="text-xl mb-12 text-gray-600">
          Please select an option to proceed:
        </p>
        <div className="flex justify-center">
          <Link href="/auth/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded transition duration-200">
            ログイン
          </Link>
        </div>
      </div>
    </main>
  );
}