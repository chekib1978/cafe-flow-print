
-- Créer la table pour les paramètres de la cafétéria
CREATE TABLE public.cafeteria_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Cafétéria Pro',
  address text NOT NULL DEFAULT '',
  email text,
  phone text,
  printer_model text,
  created_at timestamp with time zone DEFAULT now()
);

-- Permission RLS : tout le monde peut voir et modifier (vous pourrez restreindre plus tard si vous ajoutez des utilisateurs/auth)
ALTER TABLE public.cafeteria_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cafeteria settings"
  ON public.cafeteria_settings
  FOR SELECT
  USING (true);
CREATE POLICY "Public update cafeteria settings"
  ON public.cafeteria_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
CREATE POLICY "Public insert cafeteria settings"
  ON public.cafeteria_settings
  FOR INSERT
  WITH CHECK (true);
