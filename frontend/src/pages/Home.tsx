import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, CreditCard, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { HealthCheckResponse } from '../services/api';

interface HomeProps {
  healthData?: HealthCheckResponse | null;
  loadingHealth: boolean;
}

export const Home: React.FC<HomeProps> = ({ healthData, loadingHealth }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl overflow-hidden relative">
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven E-Commerce</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Shop Smarter with Real-Time AI Support
          </h1>

          <p className="text-slate-300 text-base sm:text-lg">
            Experience modern shopping backed by FastAPI, PostgreSQL, LangChain tool-calling, and Stripe test checkout.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-lg shadow-blue-600/30 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/ai-support"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-white backdrop-blur transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Talk to ShopAI</span>
            </Link>
          </div>
        </div>
      </section>

      {/* System Status / Phase 1 Verification Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Phase 1 Architecture Status</h2>
            <p className="text-xs text-slate-500">Live communication test between React frontend and FastAPI backend</p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-mono font-medium">
            Phase 1 Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Frontend status */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Frontend</div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>React 19 + TypeScript + Vite</span>
            </div>
            <p className="text-xs text-slate-500">Tailwind CSS, React Router &amp; Axios ready</p>
          </div>

          {/* Backend API status */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Backend API</div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              {loadingHealth ? (
                <span className="text-xs text-slate-400">Pinging /health...</span>
              ) : healthData?.api === 'online' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>FastAPI Online ({healthData.environment})</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span className="text-rose-600">Offline / Unreachable</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500">CORS configured, REST endpoints ready</p>
          </div>

          {/* Database status */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Database Engine</div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              {loadingHealth ? (
                <span className="text-xs text-slate-400">Checking DB...</span>
              ) : healthData?.database?.status === 'connected' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>PostgreSQL Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-700">Configured (Awaiting Phase 2 DB)</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500">SQLAlchemy 2.0 &amp; Alembic migrations configured</p>
          </div>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">E-Commerce Flow</h3>
          <p className="text-sm text-slate-600">
            Product catalog, stock tracking, customer shopping cart, and order placement.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">LangChain AI Agent</h3>
          <p className="text-sm text-slate-600">
            Tool-calling assistant querying live products, real order statuses, and verified customer data.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">Stripe &amp; Webhooks</h3>
          <p className="text-sm text-slate-600">
            Test mode checkout sessions, cryptographic webhook signature verification, and inventory updates.
          </p>
        </div>
      </section>
    </div>
  );
};
