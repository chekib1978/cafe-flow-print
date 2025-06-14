
import { useSales } from "@/hooks/useSales";
import { formatPrice } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, TrendingUp, Package, Receipt } from "lucide-react";

export function DailySalesTab() {
  const { sales, isLoading } = useSales();

  // Calculer les statistiques du jour
  const today = new Date().toDateString();
  const todaySales = sales.filter(sale => 
    new Date(sale.created_at).toDateString() === today
  );

  const dailyRevenue = todaySales.reduce((sum, sale) => sum + Number(sale.total), 0);
  const dailyItemsCount = todaySales.reduce((sum, sale) => sum + sale.items_count, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-400">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Recette du Jour</p>
              <p className="text-2xl font-bold text-blue-900">{formatPrice(dailyRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-emerald-700 font-medium">Ventes Aujourd'hui</p>
              <p className="text-2xl font-bold text-emerald-900">{todaySales.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700 font-medium">Articles Vendus</p>
              <p className="text-2xl font-bold text-purple-900">{dailyItemsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des ventes du jour */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            Ventes d'Aujourd'hui
          </h3>
        </div>
        <div className="p-6">
          {todaySales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune vente aujourd'hui
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-700 font-semibold border-b">
                    <th className="px-4 py-3 text-left">Ticket</th>
                    <th className="px-4 py-3 text-left">Articles</th>
                    <th className="px-4 py-3 text-center">Total</th>
                    <th className="px-4 py-3 text-left">Heure</th>
                  </tr>
                </thead>
                <tbody>
                  {todaySales.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-blue-600">#{sale.ticket_number}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {sale.sale_items.map((item, idx) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.quantity}x {item.product_name}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-600">
                        {formatPrice(Number(sale.total))}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(sale.created_at).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
