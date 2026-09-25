export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: number;
  google_id?: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  stripe_session_id?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
