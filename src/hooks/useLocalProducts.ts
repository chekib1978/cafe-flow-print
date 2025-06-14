
import { useState, useEffect } from 'react';
import { localDatabase } from '@/services/database';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/database';
import type { DatabaseProductWithCategory, DatabaseCategory } from '@/services/database/types';

// Type mapping functions
const mapDatabaseProductToUI = (dbProduct: DatabaseProductWithCategory) => ({
  ...dbProduct,
  category: dbProduct.category ? {
    ...dbProduct.category,
    created_at: dbProduct.category.created_at
  } : undefined
});

const mapDatabaseCategoryToUI = (dbCategory: DatabaseCategory) => ({
  ...dbCategory,
  created_at: dbCategory.created_at
});

export function useLocalProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await localDatabase.initialize();
      
      const productsData = localDatabase.getProducts();
      const categoriesData = localDatabase.getCategories();
      
      setProducts(productsData.map(mapDatabaseProductToUI));
      setCategories(categoriesData.map(mapDatabaseCategoryToUI));
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Database error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createProduct = async (newProduct: { name: string; price: number; category_id: string | null; stock: number }) => {
    try {
      localDatabase.createProduct(newProduct);
      await loadData(); // Recharger les données
      toast({
        title: "Article créé",
        description: "Le nouvel article a été ajouté avec succès.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer cet article.",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      localDatabase.updateProduct(id, updates);
      await loadData(); // Recharger les données
      toast({
        title: "Modification enregistrée",
        description: "Le produit a été modifié.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier ce produit.",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      localDatabase.deleteProduct(id);
      await loadData(); // Recharger les données
      toast({
        title: "Suppression",
        description: "L'article a été supprimé.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cet article.",
        variant: "destructive",
      });
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    try {
      localDatabase.updateProduct(productId, { stock: newStock });
      await loadData(); // Recharger les données
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le stock",
        variant: "destructive",
      });
    }
  };

  return {
    products,
    categories,
    isLoading,
    error,
    updateStock,
    updateProduct,
    deleteProduct,
    createProduct,
  };
}
