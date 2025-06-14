
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
        <main className="flex-1 flex flex-col items-center p-6">
          <div className="bg-white/80 border rounded-2xl p-8 shadow-lg flex flex-col items-center w-full max-w-4xl mb-8">
            <Package className="w-12 h-12 text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Gestion des articles
            </h1>
            <p className="text-gray-600 mb-4 text-center max-w-md">
              Gérez votre inventaire de produits avec Supabase.
            </p>
            <Button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un nouvel article
            </Button>
          </div>
          <div className="w-full max-w-4xl bg-white/70 rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Articles disponibles
            </h2>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="animate-spin w-8 h-8 text-blue-600 mb-3" />
                <span className="text-gray-500">Chargement des produits...</span>
              </div>
            ) : error ? (
              <div className="text-red-600 py-6 text-center">Erreur lors du chargement des articles.</div>
            ) : products.length === 0 ? (
              <div className="text-gray-500 py-6 text-center">Aucun produit trouvé.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-700 font-semibold border-b">
                      <th className="px-4 py-2 text-left">Nom</th>
                      <th className="px-4 py-2 text-left">Catégorie</th>
                      <th className="px-4 py-2 text-right">Prix</th>
                      <th className="px-4 py-2 text-center">Actions</th>
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
                          <td className="px-4 py-2 font-medium">{prod.name}</td>
                          <td className="px-4 py-2">
                            <Badge className={`bg-gradient-to-r ${catColor.gradient} text-white px-3 py-1`} variant="secondary">
                              {prod.category?.name || "Sans catégorie"}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 text-right">{formatPrice(prod.price)}</td>
                          <td className="px-4 py-2 text-center">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(prod)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(prod)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
