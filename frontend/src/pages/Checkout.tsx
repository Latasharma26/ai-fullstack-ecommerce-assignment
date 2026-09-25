import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const Checkout: React.FC = () => {
  const { cart, totalItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Button asChild>
          <Link to="/products" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Catalog</span>
          </Link>
        </Button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      setErrorMessage(null);

      const payload = {
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await createOrder(payload);
      
      // Clear client cart after order confirmed by PostgreSQL
      clearCart();

      // Navigate to order details page
      navigate(`/orders/${order.id}?success=true`);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'response' in err && (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail || 'Failed to place order'
          : err instanceof Error
          ? err.message
          : 'Failed to place order';
      setErrorMessage(errorMsg);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Review &amp; Place Order</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your order details. Stock is reserved and confirmed through atomic database transaction.
        </p>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Order Items List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-3xl p-6 shadow-sm space-y-4">
            <CardHeader className="p-0 pb-3 border-b border-slate-100">
              <CardTitle className="font-bold text-slate-900 text-base">
                Items in Order ({totalItems})
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 text-sm line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        Qty: <span className="font-semibold text-slate-700">{quantity}</span> &times; ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-bold text-slate-900 flex-shrink-0">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span>
              <strong>Phase 3 Mode:</strong> Order records and inventory reconciliation are processed by backend PostgreSQL. Stripe Test Checkout will be integrated in <strong>Phase 6</strong>.
            </span>
          </div>
        </div>

        {/* Payment & Summary Card */}
        <Card className="rounded-3xl p-6 shadow-sm space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900">
              Payment Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total Payable</span>
              <span className="text-2xl font-black text-blue-600">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </CardContent>

          <Button
            type="button"
            disabled={placingOrder}
            onClick={handlePlaceOrder}
            className="w-full py-6 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25"
          >
            {placingOrder ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                <span>Place Order (Cash / Dev Mode)</span>
              </>
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
};
