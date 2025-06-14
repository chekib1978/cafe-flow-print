
import { ShoppingCart, Trash2, Receipt, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/types/database";

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
      <Card className="h-fit bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-md">
        <CardContent className="p-6 text-center">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Panier vide</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          Panier ({itemCount} articles)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-800">{item.name}</h4>
                <p className="text-xs text-gray-500">
                  {item.quantity} × {item.price.toFixed(2)}€
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-600">
                  {(item.price * item.quantity).toFixed(2)}€
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(item.id)}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500"
                  disabled={isProcessing}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-lg font-bold text-gray-800">
            <span>Total:</span>
            <span className="text-green-600">{total.toFixed(2)}€</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClearCart}
              disabled={isProcessing}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              Vider
            </Button>
            <Button
              onClick={onCheckout}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Receipt className="w-4 h-4 mr-2" />
              )}
              {isProcessing ? 'Traitement...' : 'Valider'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
