import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Package, ShoppingBag, IndianRupee, CheckCircle2, Clock, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchAdminStats, AdminStats } from '../../services/admin';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load admin metrics';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
            <p className="text-xs text-slate-500">Live PostgreSQL analytics &amp; role-based control</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadStats}
          disabled={loading}
          className="gap-2 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card className="p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading ? '...' : `₹${(stats?.total_revenue || 0).toLocaleString('en-IN')}`}
          </div>
          <p className="text-[11px] text-slate-500">From all verified Stripe &amp; settled payments</p>
        </Card>

        {/* Total Orders */}
        <Card className="p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading ? '...' : stats?.total_orders || 0}
          </div>
          <p className="text-[11px] text-slate-500">Across all registered user accounts</p>
        </Card>

        {/* Paid Orders */}
        <Card className="p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Paid Orders</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading ? '...' : stats?.paid_orders || 0}
          </div>
          <p className="text-[11px] text-slate-500">Successfully confirmed transactions</p>
        </Card>

        {/* Pending Orders */}
        <Card className="p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading ? '...' : stats?.pending_orders || 0}
          </div>
          <p className="text-[11px] text-slate-500">Awaiting payment or dispatch confirmation</p>
        </Card>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/products"
          className="group block"
        >
          <Card className="p-7 hover:border-blue-400 hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <Package className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-lg flex items-center justify-between">
                <span>Manage Products</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create new catalog listings, update product pricing, adjust inventory stock levels, and toggle active status.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-blue-600">
              {stats ? `${stats.total_products} Products in Database` : 'View Catalog →'}
            </div>
          </Card>
        </Link>

        <Link
          to="/admin/orders"
          className="group block"
        >
          <Card className="p-7 hover:border-emerald-400 hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-lg flex items-center justify-between">
                <span>Manage Orders</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspect all orders placed by customers, verify Stripe payment states, and update fulfillment to SHIPPED or DELIVERED.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-emerald-600">
              {stats ? `${stats.total_orders} Total Orders Registered` : 'View Orders →'}
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};
