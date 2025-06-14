
import { ShoppingCart, Trash2, Receipt, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/types/database";
import { formatPrice } from "@/types/database";

interface CartProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  isProcessing?: boolean;
}

export function Cart({ items, onRemoveItem, onClearCart, onCheckout, isProcessing = false }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <Card className="h-fit bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Votre panier est vide</p>
          <p className="text-gray-400 text-sm mt-1">Ajoutez des produits pour commencer</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/30 border-0 shadow-2xl backdrop-blur-sm">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="bg-white/20 rounded-full p-2">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold">Panier</div>
            <div className="text-sm font-normal opacity-90">{itemCount} article{itemCount > 1 ? 's' : ''}</div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 p-6">
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-sm leading-tight">{item.name}</h4>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-xs text-gray-500">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                  <div className="bg-emerald-100 px-2 py-1 rounded-full">
                    <span className="text-xs font-bold text-emerald-700">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveItem(item.id)}
                disabled={isProcessing}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500 rounded-full transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          {/* Récapitulatif */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Sous-total:</span>
              <span className="font-semibold text-gray-800">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-gray-800">Total à payer:</span>
              <span className="text-emerald-600 text-xl">{formatPrice(total)}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClearCart}
              disabled={isProcessing}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium transition-all duration-200"
            >
              Vider
            </Button>
            <Button
              onClick={onCheckout}
              disabled={isProcessing}
              className="flex-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payer
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
