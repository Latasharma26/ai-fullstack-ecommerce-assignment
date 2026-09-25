import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { Product } from '../types';
import { fetchProductById } from '../services/products';
import { useCart } from '../context/CartContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(Number(id));
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const { addToCart } = useCart();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!product) return;
    setErrorMessage(null);
    const res = addToCart(product, quantity);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    } else {
      setErrorMessage(res.message);
      setTimeout(() => setErrorMessage(null), 3500);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-6 bg-slate-200 rounded w-32 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-slate-200 rounded-3xl p-8 animate-pulse">
          <div className="aspect-square bg-slate-200 rounded-2xl"></div>
          <div className="space-y-4 py-4">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-20 bg-slate-200 rounded w-full"></div>
            <div className="h-12 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested product (ID #{id}) does not exist in the database or may have been deactivated.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      {/* Main Product Card */}
      <Card className="p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Product Image */}
        <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 left-4">
            {isOutOfStock ? (
              <Badge variant="destructive" className="shadow-md text-xs py-1 px-3">
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge variant="warning" className="shadow-md text-xs py-1 px-3">
                Only {product.stock} units remaining!
              </Badge>
            ) : (
              <Badge variant="success" className="shadow-md text-xs py-1 px-3">
                In Stock ({product.stock} units)
              </Badge>
            )}
          </div>
        </div>

        {/* Right: Info and Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Official Catalog Item #{product.id}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">Includes all taxes</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {product.description}
            </p>
          </div>

          {/* Quantity and Cart Controls */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 hover:bg-slate-200 disabled:opacity-40 transition text-slate-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2.5 hover:bg-slate-200 disabled:opacity-40 transition text-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                size="lg"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                variant={isOutOfStock ? "secondary" : "default"}
                className="flex-1 gap-2 shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isOutOfStock ? 'Currently Out of Stock' : 'Add to Cart'}</span>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
              >
                <Link to="/cart">
                  View Cart
                </Link>
              </Button>
            </div>

            {addedNotice && (
              <Alert variant="success" className="p-3 text-center">
                <AlertDescription className="font-semibold">
                  Added {quantity} x {product.name} to cart!
                </AlertDescription>
              </Alert>
            )}

            {errorMessage && (
              <Alert variant="destructive" className="p-3 text-center">
                <AlertDescription className="font-semibold">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-center">
            <div className="space-y-1">
              <Truck className="w-5 h-5 text-blue-600 mx-auto" />
              <div className="text-[11px] font-semibold text-slate-800">Free Delivery</div>
              <div className="text-[10px] text-slate-400">On all prepaid orders</div>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
              <div className="text-[11px] font-semibold text-slate-800">Authentic</div>
              <div className="text-[10px] text-slate-400">100% Genuine product</div>
            </div>
            <div className="space-y-1">
              <RotateCcw className="w-5 h-5 text-purple-600 mx-auto" />
              <div className="text-[11px] font-semibold text-slate-800">7-Day Return</div>
              <div className="text-[10px] text-slate-400">Hassle-free guarantee</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
