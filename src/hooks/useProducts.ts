
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category, ProductWithCategory } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function useProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer tous les produits avec leurs catégories
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<ProductWithCategory[]> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });

  // Récupérer les catégories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
  });

  // Create Product
  const createProductMutation = useMutation({
    mutationFn: async (newProduct: { name: string; price: number; category_id: string | null }) => {
      const { error } = await supabase
        .from('products')
        .insert([{ ...newProduct, stock: 0 }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Article créé",
        description: "Le nouvel article a été ajouté avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer cet article.",
        variant: "destructive",
      });
    },
  });

  // Update Product
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Modification enregistrée",
        description: "Le produit a été modifié.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier ce produit.",
        variant: "destructive",
      });
    },
  });

  // Soft Delete Product
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Suppression",
        description: "L'article a été supprimé.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cet article.",
        variant: "destructive",
      });
    },
  });

  const updateProduct = (id: string, updates: Partial<Product>) => {
    updateProductMutation.mutate({ id, updates });
  };

  const deleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const createProduct = (newProduct: { name: string; price: number; category_id: string | null }) => {
    createProductMutation.mutate(newProduct);
  };

  return {
    products,
    categories,
    isLoading,
    error,
    updateProduct,
    deleteProduct,
    createProduct,
  };
}
