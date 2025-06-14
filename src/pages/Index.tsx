
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProductCard } from "@/components/ProductCard";
import { Cart } from "@/components/Cart";
import { ReceiptModal } from "@/components/ReceiptModal";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useSales } from "@/hooks/useSales";
import { SaleWithItems } from "@/types/database";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [currentSale, setCurrentSale] = useState<SaleWithItems | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  
  const { cartItems, addToCart, removeFromCart, clearCart, getCartQuantity } = useCart();
  const { products, categories, isLoading: productsLoading } = useProducts();
  const { createSale, isCreating } = useSales();

  const filteredProducts = selectedCategory === 'Tous' 
    ? products 
    : products.filter(product => product.category?.name === selectedCategory);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      const sale = await createSale(cartItems);
      setCurrentSale(sale);
      setShowReceipt(true);
      clearCart();
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    }
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-green-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger className="hover:bg-white/60 transition-colors" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Point de Vente
            </h1>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              {/* Filtres par catégorie */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'Tous' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('Tous')}
                  className={selectedCategory === 'Tous' 
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600' 
                    : 'hover:bg-white/60'
                  }
                >
                  Tous
                </Button>
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.name)}
                    className={selectedCategory === category.name 
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600' 
                      : 'hover:bg-white/60'
                    }
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Grille des produits */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onRemoveFromCart={removeFromCart}
                    cartQuantity={getCartQuantity(product.id)}
                  />
                ))}
              </div>
            </div>

            {/* Panier */}
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <Cart
                  items={cartItems}
                  onRemoveItem={removeFromCart}
                  onClearCart={clearCart}
                  onCheckout={handleCheckout}
                  isProcessing={isCreating}
                />
              </div>
            </div>
          </div>
        </main>

        <ReceiptModal
          sale={currentSale}
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
