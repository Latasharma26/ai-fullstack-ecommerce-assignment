import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, AlertCircle, RefreshCw, ExternalLink, Check } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { fetchAllOrders, updateOrderStatus } from '../../services/admin';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load orders';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      setError(null);
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setSuccessMsg(`Order #${orderId} status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update order status';
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
            <span>Manage All Customer Orders</span>
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadOrders}
          disabled={loading}
          className="gap-2 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </Button>
      </div>

      {successMsg && (
        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 p-3.5 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <AlertDescription className="text-xs font-medium">{successMsg}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* Orders Table */}
      <Card className="rounded-3xl overflow-hidden shadow-sm p-0">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs text-slate-500">Loading orders from PostgreSQL...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No customer orders recorded in the database yet.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="py-3.5 px-4">Order ID</TableHead>
                <TableHead className="py-3.5 px-4">User ID</TableHead>
                <TableHead className="py-3.5 px-4">Items</TableHead>
                <TableHead className="py-3.5 px-4">Total</TableHead>
                <TableHead className="py-3.5 px-4">Payment</TableHead>
                <TableHead className="py-3.5 px-4">Fulfillment Status</TableHead>
                <TableHead className="py-3.5 px-4 text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const isPaid = order.payment_status === 'PAID';

                return (
                  <TableRow key={order.id} className="hover:bg-slate-50/50">
                    <TableCell className="py-4 px-4 font-bold text-slate-900">#{order.id}</TableCell>
                    <TableCell className="py-4 px-4 text-slate-600">User #{order.user_id}</TableCell>
                    <TableCell className="py-4 px-4 text-slate-600">
                      {order.items?.length || 0} items
                    </TableCell>
                    <TableCell className="py-4 px-4 font-bold text-slate-900">
                      ₹{order.total_amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Badge
                        variant={isPaid ? 'success' : 'warning'}
                        className="text-[11px]"
                      >
                        {order.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-2.5 py-1 text-xs font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-right">
                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
