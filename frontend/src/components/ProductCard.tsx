import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    const res = addToCart(product, 1);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Card className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group p-0">
      {/* Image container */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Stock Badge */}
        <div className="absolute top-3 left-3">
          {isOutOfStock ? (
            <Badge variant="destructive" className="shadow-sm">
              Out of Stock
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning" className="shadow-sm">
              Only {product.stock} left
            </Badge>
          ) : (
            <Badge variant="success" className="shadow-sm">
              In Stock
            </Badge>
          )}
        </div>
      </div>

      {/* Product Details */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <Link to={`/products/${product.id}`} className="hover:text-blue-600 transition">
            <h3 className="font-semibold text-slate-900 line-clamp-1 text-base">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Price</span>
            <div className="text-lg font-bold text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50"
              title="View Details"
            >
              <Link to={`/products/${product.id}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>

            <Button
              type="button"
              size="sm"
              disabled={isOutOfStock}
              onClick={handleAdd}
              variant={isOutOfStock ? "secondary" : added ? "emerald" : "default"}
              className="gap-1.5 rounded-xl text-xs font-semibold"
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
