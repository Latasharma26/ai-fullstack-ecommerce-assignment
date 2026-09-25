import React, { useEffect, useState } from 'react';
import { Package, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { fetchProducts } from '../services/products';
import { ProductCard } from '../components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts(true);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Products Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time product inventory connected directly to PostgreSQL database
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-10"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={loadProducts}
            title="Refresh Products"
            className="rounded-xl border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse flex flex-col space-y-4 p-4"
            >
              <div className="w-full aspect-square bg-slate-200 rounded-xl"></div>
              <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded-md w-full"></div>
              <div className="h-3 bg-slate-200 rounded-md w-2/3"></div>
              <div className="pt-4 flex justify-between items-center">
                <div className="h-6 bg-slate-200 rounded-md w-20"></div>
                <div className="h-8 bg-slate-200 rounded-lg w-20"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <Alert variant="destructive" className="max-w-lg mx-auto p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <AlertTitle className="text-base font-bold text-rose-900">Failed to load catalog</AlertTitle>
          <AlertDescription className="text-xs text-rose-700">{error}</AlertDescription>
          <div className="pt-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={loadProducts}
            >
              Retry Connection
            </Button>
          </div>
        </Alert>
      )}

      {/* Empty State (when search returns 0 results) */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No products found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? `No products match your search query "${searchTerm}". Try a different search term.`
              : 'The product catalog is currently empty. Run the database seed script to populate products.'}
          </p>
          {searchTerm && (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
