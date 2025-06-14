
import { Plus, Minus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProductWithCategory } from "@/types/database";
import { CATEGORY_COLORS, formatPrice } from "@/types/database";

interface ProductCardProps {
  product: ProductWithCategory;
  onAddToCart: (product: ProductWithCategory) => void;
  onRemoveFromCart: (productId: string) => void;
  cartQuantity: number;
}

export function ProductCard({ product, onAddToCart, onRemoveFromCart, cartQuantity }: ProductCardProps) {
  const categoryColor = product.category?.name 
    ? CATEGORY_COLORS[product.category.name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default
    : CATEGORY_COLORS.default;

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white/90 backdrop-blur-md overflow-hidden relative">
      {/* Gradient de catégorie en arrière-plan */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColor} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <CardContent className="p-5 relative">
        <div className="space-y-4">
          {/* En-tête avec icône */}
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-gray-900 transition-colors">
                  {product.name}
                </h3>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs bg-gradient-to-r ${categoryColor} text-white border-0 shadow-sm`}
              >
                {product.category?.name || 'Sans catégorie'}
              </Badge>
            </div>
          </div>

          {/* Prix et stock */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold text-emerald-600 tracking-tight">
                {formatPrice(product.price)}
              </p>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">
                  Stock: <span className={`${product.stock <= 5 ? 'text-red-500' : 'text-green-600'} font-bold`}>
                    {product.stock}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {cartQuantity > 0 ? (
              <div className="flex items-center gap-3 w-full">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveFromCart(product.id)}
                  className="h-9 w-9 p-0 rounded-full border-red-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 text-center">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <span className="font-bold text-gray-800 text-lg">{cartQuantity}</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Total: {formatPrice(product.price * cartQuantity)}
                    </p>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock <= cartQuantity}
                  className={`h-9 w-9 p-0 rounded-full bg-gradient-to-r ${categoryColor} hover:shadow-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:transform-none`}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className={`w-full bg-gradient-to-r ${categoryColor} hover:shadow-lg text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none`}
              >
                {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
