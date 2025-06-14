
import { CategoriesService } from './categories';
import { ProductsService } from './products';
import { SalesService } from './sales';
import { DatabaseCategory, DatabaseProductWithCategory, DatabaseSaleWithItems, CartItem } from './types';

class LocalDatabase {
  private categoriesService = new CategoriesService();
  private productsService = new ProductsService();
  private salesService = new SalesService();

  async initialize(): Promise<void> {
    await this.categoriesService.initialize();
    await this.productsService.initialize();
    await this.salesService.initialize();
  }

  // Méthodes pour les catégories
  getCategories(): DatabaseCategory[] {
    return this.categoriesService.getCategories();
  }

  // Méthodes pour les produits
  getProducts(): DatabaseProductWithCategory[] {
    return this.productsService.getProducts();
  }

  createProduct(product: { name: string; price: number; category_id: string | null; stock: number }): void {
    this.productsService.createProduct(product);
  }

  updateProduct(id: string, updates: any): void {
    this.productsService.updateProduct(id, updates);
  }

  deleteProduct(id: string): void {
    this.productsService.deleteProduct(id);
  }

  // Méthodes pour les ventes
  getSales(): DatabaseSaleWithItems[] {
    return this.salesService.getSales();
  }

  createSale(cartItems: CartItem[]): DatabaseSaleWithItems | null {
    return this.salesService.createSale(cartItems);
  }
}

export const localDatabase = new LocalDatabase();
export * from './types';
