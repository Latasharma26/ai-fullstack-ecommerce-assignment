import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { OrderDetails } from './pages/OrderDetails';
import { Login } from './pages/Login';
import { AISupport } from './pages/AISupport';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { NotFound } from './pages/NotFound';
import { fetchHealthCheck, HealthCheckResponse } from './services/api';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const checkBackend = async () => {
      try {
        const data = await fetchHealthCheck();
        if (isMounted) {
          setHealthData(data);
        }
      } catch (err) {
        if (isMounted) {
          setHealthData(null);
        }
      } finally {
        if (isMounted) {
          setLoadingHealth(false);
        }
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 15000); // Ping every 15s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const isApiHealthy = healthData?.api === 'online';

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout apiHealthy={isApiHealthy} />}>
              <Route index element={<Home healthData={healthData} loadingHealth={loadingHealth} />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<Login />} />
              <Route path="ai-support" element={<AISupport />} />
              
              {/* Admin routes with RBAC protection */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/products"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/orders"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />

              {/* 404 catch-all */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
