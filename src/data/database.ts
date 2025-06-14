
// Simulation d'une base de données locale pour les produits et ventes
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  ticketNumber: string;
}

export const CATEGORIES = [
  'Boissons',
  'Snacks',
  'Sandwichs',
  'Pâtisseries',
  'Plats chauds'
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Café Expresso',
    price: 2.50,
    category: 'Boissons',
    stock: 100
  },
  {
    id: '2',
    name: 'Cappuccino',
    price: 3.00,
    category: 'Boissons',
    stock: 80
  },
  {
    id: '3',
    name: 'Croissant',
    price: 1.80,
    category: 'Pâtisseries',
    stock: 25
  },
  {
    id: '4',
    name: 'Sandwich Jambon-Beurre',
    price: 4.50,
    category: 'Sandwichs',
    stock: 15
  },
  {
    id: '5',
    name: 'Salade César',
    price: 7.90,
    category: 'Plats chauds',
    stock: 12
  },
  {
    id: '6',
    name: 'Chips Nature',
    price: 1.20,
    category: 'Snacks',
    stock: 50
  },
  {
    id: '7',
    name: 'Muffin Chocolat',
    price: 2.80,
    category: 'Pâtisseries',
    stock: 20
  },
  {
    id: '8',
    name: 'Eau Minérale',
    price: 1.00,
    category: 'Boissons',
    stock: 200
  }
];

// Store pour la gestion des données
class CafeteriaStore {
  private products: Product[] = [...PRODUCTS];
  private sales: Sale[] = [];

  getProducts(): Product[] {
    return this.products;
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(product => product.category === category);
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updates };
      return this.products[index];
    }
    return null;
  }

  addSale(sale: Omit<Sale, 'id' | 'ticketNumber'>): Sale {
    const ticketNumber = `T${Date.now().toString().slice(-6)}`;
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      ticketNumber
    };
    this.sales.push(newSale);
    
    // Mettre à jour le stock
    sale.items.forEach(item => {
      const product = this.products.find(p => p.id === item.id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    });
    
    return newSale;
  }

  getSales(): Sale[] {
    return this.sales;
  }

  getTodayStats() {
    const today = new Date().toDateString();
    const todaySales = this.sales.filter(sale => 
      sale.date.toDateString() === today
    );
    
    return {
      totalSales: todaySales.length,
      revenue: todaySales.reduce((sum, sale) => sum + sale.total, 0),
      itemsSold: todaySales.reduce((sum, sale) => 
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
      )
    };
  }
}

export const cafeteriaStore = new CafeteriaStore();
