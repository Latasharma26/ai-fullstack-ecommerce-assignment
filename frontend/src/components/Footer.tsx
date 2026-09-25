import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        <p>ShopAI &copy; {new Date().getFullYear()} — Production-ready Mini AI E-Commerce Application</p>
        <p className="text-xs text-slate-400 mt-1">
          FastAPI &bull; PostgreSQL &bull; React &bull; LangChain AI &bull; Stripe
        </p>
      </div>
    </footer>
  );
};
