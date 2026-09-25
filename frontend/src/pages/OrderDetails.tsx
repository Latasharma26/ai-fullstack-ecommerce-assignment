import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  PackageCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Truck,
  ShieldCheck,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Order } from '../types';
import { fetchOrderById } from '../services/orders';
import { createCheckoutSession, simulatePayment } from '../services/payments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const justPlaced = searchParams.get('success') === 'true';
  const paymentRedirect = searchParams.get('payment');
  const isCancelled = paymentRedirect === 'cancelled';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paying, setPaying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  const loadOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrderById(Number(id));
      setOrder(data);

      // Handle return from simulated payment
      if (paymentRedirect === 'simulated_success' && data.payment_status !== 'PAID') {
        await handleSimulatePayment(data.id);
      }
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'response' in err && (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail || 'Failed to load order'
          : err instanceof Error
          ? err.message
          : 'Order not found';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id, paymentRedirect]);

  const handleStripeCheckout = async () => {
    if (!order) return;
    try {
      setPaying(true);
      setError(null);
      const res = await createCheckoutSession(order.id);
      if (res.simulated) {
        // In local demo / simulation mode, directly confirm
        await handleSimulatePayment(order.id);
      } else if (res.checkout_url) {
        window.location.href = res.checkout_url;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Stripe checkout initialization failed';
      setError(msg);
    } finally {
      setPaying(false);
    }
  };

  const handleSimulatePayment = async (orderId: number) => {
    try {
      setPaying(true);
      setError(null);
      const res = await simulatePayment(orderId);
      setPaymentSuccessMsg(res.message);
      // Refresh order data
      const updated = await fetchOrderById(orderId);
      setOrder(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment simulation failed';
      setError(msg);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-32"></div>
        <Card className="h-32 p-6"></Card>
        <Card className="h-64 p-6"></Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-sm text-slate-500">
          {error || `Order #${id} could not be retrieved or belongs to another user.`}
        </p>
        <Button asChild>
          <Link to="/orders" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>
        </Button>
      </div>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isPaid = order.payment_status === 'PAID';

  const orderStatusVariant =
    order.status === 'CONFIRMED'
      ? 'success'
      : order.status === 'CANCELLED'
      ? 'destructive'
      : 'warning';

  const paymentStatusVariant =
    isPaid
      ? 'success'
      : order.payment_status === 'FAILED'
      ? 'destructive'
      : 'warning';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Orders</span>
      </Link>

      {/* Payment Success Notification */}
      {paymentSuccessMsg && (
        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-900 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base">Payment Confirmed!</h3>
            <AlertDescription className="text-xs text-emerald-800">{paymentSuccessMsg}</AlertDescription>
          </div>
        </Alert>
      )}

      {/* Just Placed Success Banner */}
      {justPlaced && !paymentSuccessMsg && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-900 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base">Order Placed Successfully!</h3>
            <AlertDescription className="text-xs text-blue-800">
              Your order has been recorded in PostgreSQL. Complete payment below to confirm dispatch.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Payment Cancelled Notification */}
      {isCancelled && !isPaid && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-900 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base">Payment Cancelled</h3>
            <AlertDescription className="text-xs text-amber-800">
              Payment was cancelled. Your order is still pending and no payment was confirmed. You can complete payment anytime below.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Order Header Card */}
      <Card className="rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">Order #{order.id}</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Placed on {formattedDate}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right sm:text-left">
            <div className="text-[11px] text-slate-400 font-medium">Order Status</div>
            <Badge variant={orderStatusVariant} className="mt-0.5">
              {order.status}
            </Badge>
          </div>

          <div className="text-right sm:text-left">
            <div className="text-[11px] text-slate-400 font-medium">Payment Status</div>
            <Badge variant={paymentStatusVariant} className="mt-0.5">
              {order.payment_status}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stripe Payment Action Banner (if not paid) */}
      {!isPaid && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-800/80 px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Stripe Payment Integration</span>
            </div>
            <h2 className="text-xl font-bold">Complete Payment for Order #{order.id}</h2>
            <p className="text-xs text-blue-200 max-w-md">
              Securely pay ₹{order.total_amount.toLocaleString('en-IN')} using Stripe Test Checkout or 1-click interview simulation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              type="button"
              disabled={paying}
              onClick={handleStripeCheckout}
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm rounded-2xl shadow-lg transition"
            >
              {paying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Pay with Stripe</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={paying}
              onClick={() => handleSimulatePayment(order.id)}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-semibold text-xs rounded-2xl transition"
              title="Instantly marks order as PAID and CONFIRMED without opening Stripe"
            >
              <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
              <span>Instant Test Pay</span>
            </Button>
          </div>
        </div>
      )}

      {/* Items Breakdown */}
      <Card className="rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <CardHeader className="p-0 pb-3 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-900">
            Purchased Items ({order.items?.length || 0})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 space-y-6">
          <div className="divide-y divide-slate-100">
            {order.items?.map((item) => {
              const itemSubtotal = item.price * item.quantity;

              return (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                      />
                    )}
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">
                        {item.product?.name || `Product #${item.product_id}`}
                      </h3>
                      <div className="text-xs text-slate-500">
                        Price at purchase: <span className="font-medium text-slate-700">₹{item.price.toLocaleString('en-IN')}</span> &times; {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:text-right w-full sm:w-auto">
                    <div className="text-xs text-slate-400">Item Total</div>
                    <div className="text-base font-bold text-slate-900">
                      ₹{itemSubtotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calculation Totals */}
          <div className="pt-6 border-t border-slate-100 space-y-2 max-w-xs ml-auto text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">
                ₹{order.total_amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-2xl font-black text-blue-600">
                ₹{order.total_amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Logistics Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl p-4 flex items-center gap-3">
          <Truck className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="text-xs">
            <div className="font-semibold text-slate-800">Standard Delivery</div>
            <div className="text-slate-500">Dispatched within 24-48 hrs</div>
          </div>
        </Card>

        <Card className="rounded-2xl p-4 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <div className="font-semibold text-slate-800">Payment: {order.payment_status}</div>
            <div className="text-slate-500">
              {order.stripe_session_id ? `Session: ${order.stripe_session_id.slice(0, 16)}...` : 'Stripe Test Checkout'}
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-4 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
          <div className="text-xs">
            <div className="font-semibold text-slate-800">Order Security</div>
            <div className="text-slate-500">Authenticated user-isolated receipt</div>
          </div>
        </Card>
      </div>
    </div>
  );
};
