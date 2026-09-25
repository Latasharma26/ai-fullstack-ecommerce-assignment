import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  PackagePlus,
  RefreshCw,
  AlertCircle,
  Check,
  Power,
  Trash2,
} from 'lucide-react';
import { Product } from '../../types';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  CreateProductPayload,
} from '../../services/products';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // New product form state
  const [form, setForm] = useState<CreateProductPayload>({
    name: '',
    description: '',
    price: 0,
    stock: 10,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    is_active: true,
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all products including inactive ones
      const data = await fetchProducts(false);
      setProducts(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load products';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleActive = async (p: Product) => {
    try {
      setError(null);
      const updated = await updateProduct(p.id, { is_active: !p.is_active });
      setProducts((prev) => prev.map((item) => (item.id === p.id ? updated : item)));
      setSuccessMsg(`'${p.name}' is now ${updated.is_active ? 'Active' : 'Inactive'}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      setError(msg);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to deactivate or remove '${name}'?`)) return;
    try {
      setError(null);
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSuccessMsg(`Product '${name}' removed successfully`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product';
      setError(msg);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.price <= 0) {
      setError('Please provide a valid product name and price');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const newProd = await createProduct(form);
      setProducts((prev) => [newProd, ...prev]);
      setShowAddModal(false);
      setForm({
        name: '',
        description: '',
        price: 0,
        stock: 10,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
        is_active: true,
      });
      setSuccessMsg(`Added new product '${newProd.name}'!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create product';
      setError(msg);
    } finally {
      setSubmitting(false);
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
          <h1 className="text-2xl font-bold text-slate-900">Manage Store Catalog &amp; Stock</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadProducts}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
        </div>
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

      {/* Products Table */}
      <Card className="rounded-3xl overflow-hidden shadow-sm p-0">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs text-slate-500">Loading catalog from PostgreSQL...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="py-3.5 px-4">Item</TableHead>
                <TableHead className="py-3.5 px-4">Price</TableHead>
                <TableHead className="py-3.5 px-4">Stock</TableHead>
                <TableHead className="py-3.5 px-4">Status</TableHead>
                <TableHead className="py-3.5 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/50">
                  <TableCell className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{p.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 font-bold text-slate-900">
                    ₹{p.price.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <span
                      className={`font-semibold ${
                        p.stock <= 5 ? 'text-amber-600' : 'text-slate-700'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <Badge variant={p.is_active ? 'success' : 'secondary'} className="text-[11px]">
                      {p.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleActive(p)}
                        className={`h-8 w-8 ${
                          p.is_active
                            ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={p.is_active ? 'Deactivate Product' : 'Activate Product'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add Product Modal using Shadcn Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Add New Catalog Product
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 text-xs mt-2">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Product Title</label>
              <Input
                type="text"
                required
                placeholder="e.g. Wireless Charging Pad"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Description</label>
              <textarea
                rows={2}
                required
                placeholder="Brief feature overview"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Price (INR ₹)</label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={form.price || ''}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Initial Stock</label>
                <Input
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Image URL</label>
              <Input
                type="url"
                required
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              />
            </div>

            <div className="pt-3 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? 'Creating...' : 'Create Listing'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
