import { Link } from "react-router-dom";

export default function Error404() {
    return (
        <div className="h-screen flex items-center justify-center bg-slate-100">

            <div className="text-center">

                <h1 className="text-8xl font-bold text-red-600">
                    404
                </h1>

                <h2 className="text-3xl font-bold mt-4">
                    Page Not Found
                </h2>

                <p className="text-gray-500 mt-3">
                    The page you are looking for does not exist.
                </p>

                <Link
                    to="/"
                    className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                    Go Home
                </Link>

            </div>

        </div>
    );
}