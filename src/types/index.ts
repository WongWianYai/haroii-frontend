export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  isAvailable: boolean;
}

export interface Restaurant {
  name: string;
  slug: string;
  phone?: string;
  address?: string;
  type: string;
  owner?: string;
  openTime: string;
  closeTime: string;
}

export interface Owner {
  name: string;
  email: string;
  phone?: string;
}

export interface MeResponse {
  user: Owner;
  restaurant: Restaurant;
}

export type TabType = "menu" | "restaurant" | "orders";

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'READY' | 'SERVED' | 'CANCELLED';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
  options?: any;
  lineTotal: number;
}

export interface Order {
  _id: string;
  restaurantId: string;
  tableSessionId: string;
  sessionTokenHash: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  hasNotes: boolean;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  tableNo?: string; // Add table number field
}

export interface TableSession {
  _id: string;
  tableNo: string;
  restaurantId: string;
  expiresAt: string;
}