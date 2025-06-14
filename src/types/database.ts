
export interface Category {
  id: string;
  name: string;
  created_at: string;
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  ticket_number: string;
  total: number;
  items_count: number;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface SaleWithItems extends Sale {
  sale_items: SaleItem[];
}

export const CATEGORY_COLORS = {
  'Boissons': 'from-blue-500 to-cyan-500',
  'Snacks': 'from-orange-500 to-yellow-500',
  'Sandwichs': 'from-green-500 to-emerald-500',
  'Pâtisseries': 'from-pink-500 to-rose-500',
  'Plats chauds': 'from-red-500 to-orange-600',
  'Salades': 'from-lime-500 to-green-400',
  'Desserts': 'from-purple-500 to-violet-500',
  'Fruits': 'from-amber-500 to-orange-400',
  'Soupes': 'from-teal-500 to-cyan-600',
  'Pizzas': 'from-red-600 to-pink-500',
  'default': 'from-gray-500 to-slate-600'
};

export const formatPrice = (price: number): string => {
  return `${price.toFixed(3)} TND`;
};
