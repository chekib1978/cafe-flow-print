
import { useState, useEffect } from 'react';
import { localDatabase } from '@/services/database';
import { useToast } from '@/hooks/use-toast';
import { CartItem, SaleWithItems } from '@/types/database';

export function useLocalSales() {
  const { toast } = useToast();
  const [sales, setSales] = useState<SaleWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const loadSales = async () => {
    try {
      setIsLoading(true);
      await localDatabase.initialize();
      const salesData = localDatabase.getSales();
      setSales(salesData);
    } catch (err) {
      console.error('Error loading sales:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const createSale = async (cartItems: CartItem[]) => {
    try {
      setIsCreating(true);
      const newSale = localDatabase.createSale(cartItems);
      
      if (newSale) {
        await loadSales(); // Recharger les ventes
        toast({
          title: "Vente validée!",
          description: `Ticket N°${newSale.ticket_number} - Total: ${newSale.total.toFixed(3)} TND`,
        });
        return newSale;
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de valider la vente",
        variant: "destructive",
      });
      console.error('Error creating sale:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    sales,
    isLoading,
    createSale,
    isCreating,
  };
}
