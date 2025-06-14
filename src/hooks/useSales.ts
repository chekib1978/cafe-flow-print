
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleItem, CartItem, SaleWithItems } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function useSales() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les ventes avec leurs articles
  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async (): Promise<SaleWithItems[]> => {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Mutation pour créer une vente
  const createSaleMutation = useMutation({
    mutationFn: async (cartItems: CartItem[]) => {
      // Générer un numéro de ticket unique
      const ticketNumber = `T${Date.now()}`;
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      // Créer la vente
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          ticket_number: ticketNumber,
          total,
          items_count: itemsCount,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Créer les articles de la vente
      const saleItems = cartItems.map(item => ({
        sale_id: sale.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // Mettre à jour le stock des produits
      for (const item of cartItems) {
        const newStock = item.stock - item.quantity;
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);

        if (stockError) throw stockError;
      }

      return { ...sale, sale_items: saleItems };
    },
    onSuccess: (newSale) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Vente validée!",
        description: `Ticket N°${newSale.ticket_number} - Total: ${newSale.total.toFixed(2)}€`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de valider la vente",
        variant: "destructive",
      });
      console.error('Erreur lors de la création de la vente:', error);
    },
  });

  const createSale = (cartItems: CartItem[]) => {
    return createSaleMutation.mutateAsync(cartItems);
  };

  return {
    sales,
    isLoading,
    createSale,
    isCreating: createSaleMutation.isPending,
  };
}
