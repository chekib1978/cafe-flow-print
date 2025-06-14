
export interface DatabaseCategory {
  id: string;
  name: string;
  created_at: string;
}

export interface DatabaseProduct {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
  stock: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProductWithCategory extends DatabaseProduct {
  category: DatabaseCategory | null;
  category_name?: string;
}

export interface DatabaseSale {
  id: string;
  ticket_number: string;
  total: number;
  items_count: number;
  created_at: string;
}

export interface DatabaseSaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface DatabaseSaleWithItems extends DatabaseSale {
  sale_items: DatabaseSaleItem[];
}

export interface DatabaseSettings {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  printer_model?: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
