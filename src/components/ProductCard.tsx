
import { Plus, Minus, Coffee, Sandwich, IceCream, Cookie, Soup, Pizza, Salad, Cake, Utensils, Apple } from "lucide-react";
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

// Fonction pour obtenir l'icône appropriée selon le nom de la catégorie
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('boisson') || name.includes('café') || name.includes('thé')) {
    return Coffee;
  } else if (name.includes('sandwich') || name.includes('burger') || name.includes('wrap')) {
    return Sandwich;
  } else if (name.includes('glace') || name.includes('ice') || name.includes('frozen')) {
    return IceCream;
  } else if (name.includes('biscuit') || name.includes('cookie') || name.includes('gâteau sec')) {
    return Cookie;
  } else if (name.includes('soupe') || name.includes('soup') || name.includes('potage')) {
    return Soup;
  } else if (name.includes('pizza') || name.includes('pâte')) {
    return Pizza;
  } else if (name.includes('salade') || name.includes('salad') || name.includes('crudité')) {
    return Salad;
  } else if (name.includes('gâteau') || name.includes('cake') || name.includes('pâtisserie')) {
    return Cake;
  } else if (name.includes('fruit') || name.includes('pomme') || name.includes('banane')) {
    return Apple;
  } else {
    return Utensils; // Icône par défaut pour les autres catégories
  }
};

export function ProductCard({ product, onAddToCart, onRemoveFromCart, cartQuantity }: ProductCardProps) {
  const categoryColors = product.category?.name 
    ? CATEGORY_COLORS[product.category.name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default
    : CATEGORY_COLORS.default;

  const CategoryIcon = getCategoryIcon(product.category?.name || '');

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${categoryColors.border} ${categoryColors.bg} overflow-hidden`}>
      {/* Bande colorée en haut */}
      <div className={`h-1 bg-gradient-to-r ${categoryColors.gradient}`} />
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* En-tête avec icône colorée */}
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${categoryColors.bg} ${categoryColors.border} border`}>
              <CategoryIcon className={`w-4 h-4 ${categoryColors.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                {product.name}
              </h3>
              <Badge 
                variant="secondary" 
                className={`mt-1 text-xs ${categoryColors.bg} ${categoryColors.text} border-0`}
              >
                {product.category?.name || 'Sans catégorie'}
              </Badge>
            </div>
          </div>

          {/* Prix */}
          <div className="flex justify-center items-center py-3 border-t border-gray-100">
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
          </div>
          
          {/* Actions avec couleurs de catégorie */}
          <div className="pt-2">
            {cartQuantity > 0 ? (
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveFromCart(product.id)}
                  className={`h-8 w-8 p-0 rounded-full ${categoryColors.border} hover:${categoryColors.bg}`}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <div className="flex-1 text-center">
                  <div className={`${categoryColors.bg} rounded-lg px-3 py-2 ${categoryColors.border} border`}>
                    <span className="font-semibold text-gray-900">{cartQuantity}</span>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {formatPrice(product.price * cartQuantity)}
                    </p>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => onAddToCart(product)}
                  className={`h-8 w-8 p-0 rounded-full bg-gradient-to-r ${categoryColors.gradient} hover:opacity-90 text-white`}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onAddToCart(product)}
                className={`w-full bg-gradient-to-r ${categoryColors.gradient} hover:opacity-90 text-white font-medium py-2.5 rounded-lg`}
              >
                Ajouter au panier
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
