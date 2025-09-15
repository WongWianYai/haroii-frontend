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

export type TabType = "menu" | "restaurant";