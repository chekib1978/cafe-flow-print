
import { Package, Loader2, Plus } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_COLORS, formatPrice } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { ProductEditModal } from "@/components/ProductEditModal";
import { ProductCreateModal } from "@/components/ProductCreateModal";

const Products = () => {
  const { products, categories, isLoading, error, updateProduct, deleteProduct, createProduct } = useProducts();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleSave = (values) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, values);
    }
    setEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleCreate = (values) => {
    createProduct(values);
    setCreateModalOpen(false);
  };

  const handleDelete = (prod) => {
    if (window.confirm("Supprimer cet article ? Cette action le cachera du stock sans supprimer l'historique.")) {
      deleteProduct(prod.id);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-center p-3 sm:p-6">
          {/* Header - Mobile optimized */}
          <div className="bg-white/80 border rounded-2xl p-4 sm:p-8 shadow-lg flex flex-col items-center w-full max-w-4xl mb-4 sm:mb-8">
            <Package className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 mb-2 sm:mb-4" />
            <h1 className="text-xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent text-center">
              Gestion des articles
            </h1>
            <p className="text-gray-600 mb-4 text-center max-w-md text-sm sm:text-base px-2">
              Gérez votre inventaire de produits avec Supabase.
            </p>
            <Button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200 touch-manipulation min-h-[44px] text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ajouter un nouvel article</span>
              <span className="sm:hidden">Ajouter article</span>
            </Button>
          </div>

          {/* Products list - Mobile optimized */}
          <div className="w-full max-w-4xl bg-white/70 rounded-xl p-3 sm:p-6 shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Articles disponibles
            </h2>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8 sm:p-12">
                <Loader2 className="animate-spin w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-3" />
                <span className="text-gray-500 text-sm sm:text-base">Chargement des produits...</span>
              </div>
            ) : error ? (
              <div className="text-red-600 py-6 text-center text-sm sm:text-base">Erreur lors du chargement des articles.</div>
            ) : products.length === 0 ? (
              <div className="text-gray-500 py-6 text-center text-sm sm:text-base">Aucun produit trouvé.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="text-gray-700 font-semibold border-b">
                      <th className="px-2 sm:px-4 py-2 text-left">Nom</th>
                      <th className="px-2 sm:px-4 py-2 text-left hidden sm:table-cell">Catégorie</th>
                      <th className="px-2 sm:px-4 py-2 text-right">Prix</th>
                      <th className="px-2 sm:px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => {
                      const catColor =
                        prod.category?.name && CATEGORY_COLORS[prod.category.name as keyof typeof CATEGORY_COLORS]
                          ? CATEGORY_COLORS[prod.category.name as keyof typeof CATEGORY_COLORS]
                          : CATEGORY_COLORS.default;
                      return (
                        <tr key={prod.id} className="border-b hover:bg-gray-50 transition">
                          <td className="px-2 sm:px-4 py-2 font-medium">
                            <div>
                              <div className="font-medium">{prod.name}</div>
                              {/* Show category on mobile */}
                              <div className="sm:hidden mt-1">
                                <Badge className={`bg-gradient-to-r ${catColor.gradient} text-white px-2 py-0.5 text-xs`} variant="secondary">
                                  {prod.category?.name || "Sans catégorie"}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2 hidden sm:table-cell">
                            <Badge className={`bg-gradient-to-r ${catColor.gradient} text-white px-3 py-1`} variant="secondary">
                              {prod.category?.name || "Sans catégorie"}
                            </Badge>
                          </td>
                          <td className="px-2 sm:px-4 py-2 text-right font-medium">{formatPrice(prod.price)}</td>
                          <td className="px-2 sm:px-4 py-2 text-center">
                            <div className="flex justify-center gap-1 sm:gap-2">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 touch-manipulation" onClick={() => handleEdit(prod)}>
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button variant="destructive" size="sm" className="h-8 w-8 p-0 touch-manipulation" onClick={() => handleDelete(prod)}>
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <ProductEditModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            product={editingProduct}
            onSave={handleSave}
          />

          <ProductCreateModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            categories={categories}
            onSave={handleCreate}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Products;
