import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="text-center py-16 space-y-4">
      <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
      <h1 className="text-3xl font-bold text-slate-900">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
      >
        <Home className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
};
