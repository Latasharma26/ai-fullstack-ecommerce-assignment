import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Your Cart is Empty</h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our curated tech gear and gadgets.
          </p>
        </div>
        <Button asChild size="lg" className="shadow-lg shadow-blue-600/25">
          <Link to="/products" className="inline-flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-slate-500 mt-1">
            You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => {
            const itemSubtotal = product.price * quantity;
            const isMaxStock = quantity >= product.stock;

            return (
              <Card
                key={product.id}
                className="p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Image & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Link to={`/products/${product.id}`} className="flex-shrink-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-100 bg-slate-50"
                    />
                  </Link>

                  <div className="space-y-1 min-w-0 flex-1">
                    <Link
                      to={`/products/${product.id}`}
                      className="font-semibold text-slate-900 hover:text-blue-600 text-sm line-clamp-1 transition"
                    >
                      {product.name}
                    </Link>
                    <div className="text-xs text-slate-500">
                      Unit Price: <span className="font-medium text-slate-700">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                    {product.stock <= 5 && (
                      <Badge variant="warning" className="text-[10px] px-2 py-0.5">
                        Only {product.stock} units left
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Controls and Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-700 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      disabled={isMaxStock}
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[90px]">
                    <div className="text-xs text-slate-400 font-medium">Subtotal</div>
                    <div className="text-sm font-bold text-slate-900">
                      ₹{itemSubtotal.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <Card className="rounded-3xl p-6 shadow-sm space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900">
              Order Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({totalItems})</span>
              <span className="font-semibold text-slate-800">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Standard Shipping</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Estimated Taxes</span>
              <span className="text-slate-500">Calculated in price</span>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-2xl font-black text-blue-600">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </CardContent>

          <Button asChild className="w-full py-6 text-sm font-bold shadow-lg shadow-blue-600/25">
            <Link to="/checkout" className="inline-flex items-center justify-center gap-2">
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
};
