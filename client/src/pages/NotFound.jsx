import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-8xl font-extrabold text-red-500">404</h1>
        <h2 className="text-3xl font-bold mt-4">Oops! Page Not Found</h2>
        <p className="text-gray-600 mt-2">
          The page you are looking for might have been removed or does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
