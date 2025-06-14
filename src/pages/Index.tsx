
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProductCard } from "@/components/ProductCard";
import { Cart } from "@/components/Cart";
import { ReceiptModal } from "@/components/ReceiptModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { cafeteriaStore, CATEGORIES } from "@/data/database";
import { useToast } from "@/hooks/use-toast";
import type { Sale } from "@/data/database";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const { cartItems, addToCart, removeFromCart, clearCart, getCartQuantity } = useCart();
  const { toast } = useToast();

  const products = cafeteriaStore.getProducts();
  const filteredProducts = selectedCategory === 'Tous' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const sale = cafeteriaStore.addSale({
      items: cartItems,
      total,
      date: new Date()
    });

    setCurrentSale(sale);
    setShowReceipt(true);
    clearCart();
    
    toast({
      title: "Vente validée!",
      description: `Ticket N°${sale.ticketNumber} - Total: ${total.toFixed(2)}€`,
    });
  };

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
                {CATEGORIES.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category 
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600' 
                      : 'hover:bg-white/60'
                    }
                  >
                    {category}
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
