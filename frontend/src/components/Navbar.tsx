import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Bot, ShoppingCart, Package, Shield, Activity, LogOut, User as UserIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  apiHealthy?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ apiHealthy = true }) => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition">
            <ShoppingBag className="w-6 h-6" />
            <span>ShopAI</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className={`text-sm font-medium transition ${
                isActive('/products') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Products
            </Link>

            <Link
              to="/orders"
              className={`flex items-center gap-1.5 text-sm font-medium transition ${
                isActive('/orders') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </Link>

            <Link
              to="/ai-support"
              className={`flex items-center gap-1.5 text-sm font-medium transition ${
                isActive('/ai-support') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Support</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 text-xs uppercase tracking-wide font-semibold px-2.5 py-1 rounded-full border transition ${
                  isActive('/admin')
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* API Health badge */}
            <div
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                apiHealthy
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
              title={apiHealthy ? 'Backend API connected' : 'Backend API disconnected'}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{apiHealthy ? 'API Online' : 'API Offline'}</span>
            </div>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-blue-600 transition rounded-lg hover:bg-slate-100"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Actions */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-200">
                    {user.name ? user.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                    <span className={`inline-block text-[10px] font-medium px-1.5 py-0.2 rounded ${
                      isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
