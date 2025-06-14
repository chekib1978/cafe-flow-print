
-- Créer les tables pour la gestion de la cafétéria

-- Table des catégories de produits
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des produits
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des ventes
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  items_count INTEGER NOT NULL CHECK (items_count > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des articles vendus (détail des ventes)
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0)
);

-- Insérer les catégories par défaut
INSERT INTO public.categories (name) VALUES 
  ('Boissons'),
  ('Snacks'),
  ('Sandwichs'),
  ('Pâtisseries'),
  ('Plats chauds');

-- Insérer quelques produits par défaut
INSERT INTO public.products (name, price, category_id, stock) VALUES 
  ('Café Expresso', 2.50, (SELECT id FROM public.categories WHERE name = 'Boissons'), 100),
  ('Cappuccino', 3.00, (SELECT id FROM public.categories WHERE name = 'Boissons'), 80),
  ('Croissant', 1.80, (SELECT id FROM public.categories WHERE name = 'Pâtisseries'), 25),
  ('Sandwich Jambon-Beurre', 4.50, (SELECT id FROM public.categories WHERE name = 'Sandwichs'), 15),
  ('Salade César', 7.90, (SELECT id FROM public.categories WHERE name = 'Plats chauds'), 12),
  ('Chips Nature', 1.20, (SELECT id FROM public.categories WHERE name = 'Snacks'), 50),
  ('Muffin Chocolat', 2.80, (SELECT id FROM public.categories WHERE name = 'Pâtisseries'), 20),
  ('Eau Minérale', 1.00, (SELECT id FROM public.categories WHERE name = 'Boissons'), 200);

-- Activer Row Level Security (RLS) - pour l'instant, permettre l'accès à tous
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Politiques RLS permissives pour l'instant (accès public)
CREATE POLICY "Allow all operations on categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow all operations on sales" ON public.sales FOR ALL USING (true);
CREATE POLICY "Allow all operations on sale_items" ON public.sale_items FOR ALL USING (true);

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at sur les produits
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
