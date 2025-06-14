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
  'Boissons': {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: 'text-blue-600'
  },
  'Snacks': {
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    icon: 'text-orange-600'
  },
  'Sandwichs': {
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: 'text-green-600'
  },
  'Pâtisseries': {
    gradient: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    icon: 'text-pink-600'
  },
  'Plats chauds': {
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: 'text-red-600'
  },
  'Salades': {
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    icon: 'text-emerald-600'
  },
  'Desserts': {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    icon: 'text-purple-600'
  },
  'Fruits': {
    gradient: 'from-yellow-500 to-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    icon: 'text-yellow-600'
  },
  'Soupes': {
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: 'text-amber-600'
  },
  'Pizzas': {
    gradient: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    icon: 'text-indigo-600'
  },
  'default': {
    gradient: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
    icon: 'text-gray-600'
  }
};

export const formatPrice = (price: number): string => {
  return `${price.toFixed(3)} TND`;
};
