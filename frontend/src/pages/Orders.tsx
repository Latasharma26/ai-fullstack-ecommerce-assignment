import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, AlertCircle, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { fetchOrders } from '../services/orders';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders();
      setOrders(data);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'response' in err && (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail || 'Failed to load orders'
          : err instanceof Error
          ? err.message
          : 'Failed to load orders';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Orders</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your order history, fulfillment progress, and payment receipts
        </p>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((idx) => (
            <Card
              key={idx}
              className="p-6 shadow-sm animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-200 rounded w-32"></div>
                <div className="h-6 bg-slate-200 rounded-full w-24"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 rounded w-28"></div>
            </Card>
          ))}
        </div>
      )}

      {!loading && error && (
        <Alert variant="destructive" className="max-w-md mx-auto text-center p-6 space-y-4">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
          <div>
            <Button
              type="button"
              onClick={loadOrders}
              variant="destructive"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {!loading && !error && orders.length === 0 && (
        <Card className="p-16 text-center space-y-5 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">No orders placed yet</h3>
            <p className="text-xs text-slate-500">
              When you purchase items from the catalog, your confirmed orders and receipts will appear here.
            </p>
          </div>
          <Button asChild size="sm">
            <Link to="/products" className="inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Start Shopping</span>
            </Link>
          </Button>
        </Card>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const statusVariant =
              order.status === 'CONFIRMED'
                ? 'success'
                : order.status === 'CANCELLED'
                ? 'destructive'
                : 'warning';

            const paymentVariant =
              order.payment_status === 'PAID'
                ? 'success'
                : order.payment_status === 'FAILED'
                ? 'destructive'
                : 'secondary';

            return (
              <Card
                key={order.id}
                className="p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">Order #{order.id}</span>
                      <span className="text-xs text-slate-400">&bull;</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <Badge variant={statusVariant}>
                      {order.status}
                    </Badge>

                    {/* Payment Status Badge */}
                    <Badge variant={paymentVariant}>
                      Pay: {order.payment_status}
                    </Badge>
                  </div>
                </div>

                {/* Items preview snippet */}
                {order.items && order.items.length > 0 && (
                  <div className="text-xs text-slate-600 space-y-1">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="line-clamp-1">
                          {item.quantity} &times; {item.product?.name || `Product #${item.product_id}`}
                        </span>
                        <span className="font-medium text-slate-800">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-[11px] text-slate-400 italic">
                        +{order.items.length - 3} more items...
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Total Amount:</span>
                    <div className="text-lg font-bold text-slate-900">
                      ₹{order.total_amount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5"
                    >
                      <span>View Order Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
