
import { Package } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Products = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <AppSidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white/80 border rounded-2xl p-8 shadow-lg flex flex-col items-center">
          <Package className="w-12 h-12 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Gestion des produits
          </h1>
          <p className="text-gray-600 mb-2 text-center max-w-md">
            Ici, bientôt la gestion complète des produits du Cafétéria.
          </p>
        </div>
      </main>
    </div>
  </SidebarProvider>
);

export default Products;
