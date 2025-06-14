
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
  'Boissons': 'from-slate-100 to-slate-200 border-slate-300',
  'Snacks': 'from-gray-100 to-gray-200 border-gray-300',
  'Sandwichs': 'from-stone-100 to-stone-200 border-stone-300',
  'Pâtisseries': 'from-neutral-100 to-neutral-200 border-neutral-300',
  'Plats chauds': 'from-zinc-100 to-zinc-200 border-zinc-300',
  'Salades': 'from-slate-100 to-slate-200 border-slate-300',
  'Desserts': 'from-gray-100 to-gray-200 border-gray-300',
  'Fruits': 'from-stone-100 to-stone-200 border-stone-300',
  'Soupes': 'from-neutral-100 to-neutral-200 border-neutral-300',
  'Pizzas': 'from-zinc-100 to-zinc-200 border-zinc-300',
  'default': 'from-gray-100 to-gray-200 border-gray-300'
};

export const formatPrice = (price: number): string => {
  return `${price.toFixed(3)} TND`;
};
