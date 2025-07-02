import { Link } from 'react-router-dom';
import { FaSearch, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-neutral-600 p-10  max-w-sm">
        <div className="flex justify-center mb-6">
          <div className={`text-8xl ${'animate-pulse'} transition-all`}>
            <FaSearch />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">
          It seems we can't find what you're looking for.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          The page might have been moved or deleted.
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 text-white font-semibold py-3 px-6 rounded-lg transform transition-all hover:scale-105 hover:shadow-lg hover:opacity-90"
        >
          <FaHome className="inline-block mr-2" />
          Take Me Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
