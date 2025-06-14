
import { BarChart3 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useSales } from "@/hooks/useSales";
import { formatPrice } from "@/types/database";
import { Badge } from "@/components/ui/badge";

const Stats = () => {
  const { sales, isLoading } = useSales();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-center p-6">
          <div className="bg-white/80 border rounded-2xl p-8 shadow-lg flex flex-col items-center w-full max-w-3xl">
            <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Statistiques du Cafétéria
            </h1>
            <p className="text-gray-600 mb-2 text-center max-w-md">
              Détail de toutes les ventes réalisées.
            </p>
          </div>
          <div className="w-full max-w-3xl bg-white/70 rounded-xl p-6 shadow mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Liste détaillée des ventes
            </h2>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                Chargement...
              </div>
            ) : sales.length === 0 ? (
              <div className="text-gray-500 py-6 text-center">Aucune vente trouvée.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-700 font-semibold border-b">
                      <th className="px-2 py-2">Ticket #</th>
                      <th className="px-2 py-2">Articles</th>
                      <th className="px-2 py-2 text-center">Total Vente</th>
                      <th className="px-2 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-2 py-2 font-semibold text-blue-800">#{sale.ticket_number}</td>
                        <td className="px-2 py-2">
                          {sale.sale_items.map((item, idx) => (
                            <div key={item.id} className="flex items-center gap-1">
                              <Badge className="bg-emerald-200 text-emerald-800 font-mono">{item.quantity} x {item.product_name}</Badge>
                              <span className="text-xs text-gray-400">{formatPrice(item.unit_price)}</span>
                            </div>
                          ))}
                        </td>
                        <td className="px-2 py-2 text-center font-bold text-emerald-600">{formatPrice(Number(sale.total))}</td>
                        <td className="px-2 py-2 text-xs text-gray-500">{new Date(sale.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Stats;
