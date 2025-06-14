
import { useSales } from "@/hooks/useSales";
import { formatPrice } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Receipt, Package, TrendingUp } from "lucide-react";

export function AllSalesTab() {
  const { sales, isLoading } = useSales();

  // Calculer les statistiques totales
  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
  const totalItemsCount = sales.reduce((sum, sale) => sum + sale.items_count, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-400">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-indigo-700 font-medium">Recette Totale</p>
              <p className="text-2xl font-bold text-indigo-900">{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500 rounded-lg">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-rose-700 font-medium">Total Ventes</p>
              <p className="text-2xl font-bold text-rose-900">{sales.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-amber-700 font-medium">Articles Vendus</p>
              <p className="text-2xl font-bold text-amber-900">{totalItemsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste de toutes les ventes */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Receipt className="w-5 h-5 text-gray-600" />
            Historique Complet des Ventes
          </h3>
        </div>
        <div className="p-6">
          {sales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune vente trouvée
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-700 font-semibold border-b">
                    <th className="px-4 py-3 text-left">Ticket #</th>
                    <th className="px-4 py-3 text-left">Articles</th>
                    <th className="px-4 py-3 text-center">Total Vente</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-blue-600">#{sale.ticket_number}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {sale.sale_items.map((item, idx) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.quantity}x {item.product_name}
                              </Badge>
                              <span className="text-xs text-gray-400">{formatPrice(item.unit_price)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-600">
                        {formatPrice(Number(sale.total))}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(sale.created_at).toLocaleString('fr-FR')}
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
