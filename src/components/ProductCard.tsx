
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/database";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  cartQuantity: number;
}

export function ProductCard({ product, onAddToCart, onRemoveFromCart, cartQuantity }: ProductCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm leading-tight">{product.name}</h3>
              <Badge variant="secondary" className="mt-1 text-xs bg-blue-100 text-blue-700">
                {product.category}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">{product.price.toFixed(2)}€</p>
              <p className="text-xs text-gray-500">Stock: {product.stock}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            {cartQuantity > 0 ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveFromCart(product.id)}
                  className="h-8 w-8 p-0 rounded-full border-red-200 hover:border-red-300 hover:bg-red-50"
                >
                  <Minus className="w-3 h-3 text-red-500" />
                </Button>
                <span className="w-8 text-center font-semibold text-gray-700">{cartQuantity}</span>
                <Button
                  size="sm"
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock <= cartQuantity}
                  className="h-8 w-8 p-0 rounded-full bg-green-500 hover:bg-green-600"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Ajouter
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
