
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
import { Loader2, Store, Sparkles } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600 font-medium">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          {/* En-tête moderne */}
          <div className="flex items-center gap-4 mb-8">
            <SidebarTrigger className="hover:bg-white/80 transition-colors rounded-lg p-2" />
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-emerald-600 p-3 rounded-xl shadow-lg">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Cafétéria Pro
                </h1>
                <p className="text-gray-600 font-medium">Point de Vente Moderne</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 text-emerald-600">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">TND - Dinar Tunisien</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-6">
              {/* Filtres par catégorie modernisés */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Catégories de produits
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={selectedCategory === 'Tous' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('Tous')}
                    className={selectedCategory === 'Tous' 
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg transform hover:scale-105 transition-all duration-200' 
                      : 'hover:bg-white/80 border-gray-200 hover:border-gray-300 transition-all duration-200'
                    }
                  >
                    Tous les produits
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.name ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.name)}
                      className={selectedCategory === category.name 
                        ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg transform hover:scale-105 transition-all duration-200' 
                        : 'hover:bg-white/80 border-gray-200 hover:border-gray-300 transition-all duration-200'
                      }
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Grille des produits */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Store className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Aucun produit dans cette catégorie</p>
                </div>
              )}
            </div>

            {/* Panier modernisé */}
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
