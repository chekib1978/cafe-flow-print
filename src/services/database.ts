
import initSqlJs, { Database } from 'sql.js';

class LocalDatabase {
  private db: Database | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });

    // Charger la base de données depuis localStorage ou créer une nouvelle
    const savedDb = localStorage.getItem('cafeteria_db');
    if (savedDb) {
      const buf = new Uint8Array(JSON.parse(savedDb));
      this.db = new SQL.Database(buf);
    } else {
      this.db = new SQL.Database();
      this.createTables();
    }

    this.isInitialized = true;
  }

  private createTables(): void {
    if (!this.db) return;

    // Créer la table categories
    this.db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table products
    this.db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category_id TEXT,
        stock INTEGER DEFAULT 0,
        image_url TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )
    `);

    // Créer la table sales
    this.db.run(`
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        ticket_number TEXT NOT NULL,
        total REAL NOT NULL,
        items_count INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table sale_items
    this.db.run(`
      CREATE TABLE IF NOT EXISTS sale_items (
        id TEXT PRIMARY KEY,
        sale_id TEXT,
        product_id TEXT,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        total_price REAL NOT NULL,
        FOREIGN KEY (sale_id) REFERENCES sales (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);

    // Créer la table cafeteria_settings
    this.db.run(`
      CREATE TABLE IF NOT EXISTS cafeteria_settings (
        id TEXT PRIMARY KEY,
        name TEXT DEFAULT 'Cafétéria',
        address TEXT DEFAULT '',
        phone TEXT,
        email TEXT,
        printer_model TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insérer des catégories par défaut
    this.insertDefaultData();
    this.saveToLocalStorage();
  }

  private insertDefaultData(): void {
    if (!this.db) return;

    // Catégories par défaut
    const defaultCategories = [
      { id: 'cat_1', name: 'Boissons' },
      { id: 'cat_2', name: 'Snacks' },
      { id: 'cat_3', name: 'Sandwichs' },
      { id: 'cat_4', name: 'Pâtisseries' },
      { id: 'cat_5', name: 'Plats chauds' }
    ];

    defaultCategories.forEach(cat => {
      this.db!.run(
        'INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)',
        [cat.id, cat.name]
      );
    });

    // Produits par défaut
    const defaultProducts = [
      { id: 'prod_1', name: 'Café', price: 1.5, category_id: 'cat_1', stock: 50 },
      { id: 'prod_2', name: 'Thé', price: 1.2, category_id: 'cat_1', stock: 30 },
      { id: 'prod_3', name: 'Croissant', price: 2.5, category_id: 'cat_4', stock: 20 },
      { id: 'prod_4', name: 'Sandwich Thon', price: 4.5, category_id: 'cat_3', stock: 15 }
    ];

    defaultProducts.forEach(prod => {
      this.db!.run(
        'INSERT OR IGNORE INTO products (id, name, price, category_id, stock) VALUES (?, ?, ?, ?, ?)',
        [prod.id, prod.name, prod.price, prod.category_id, prod.stock]
      );
    });

    // Paramètres par défaut
    this.db.run(
      'INSERT OR IGNORE INTO cafeteria_settings (id, name, address) VALUES (?, ?, ?)',
      ['default', 'Cafétéria', 'Adresse de la cafétéria']
    );
  }

  private saveToLocalStorage(): void {
    if (!this.db) return;
    const data = this.db.export();
    localStorage.setItem('cafeteria_db', JSON.stringify(Array.from(data)));
  }

  // Méthodes pour les catégories
  getCategories(): any[] {
    if (!this.db) return [];
    const stmt = this.db.prepare('SELECT * FROM categories ORDER BY name');
    const categories = [];
    while (stmt.step()) {
      categories.push(stmt.getAsObject());
    }
    stmt.free();
    return categories;
  }

  // Méthodes pour les produits
  getProducts(): any[] {
    if (!this.db) return [];
    const stmt = this.db.prepare(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
      ORDER BY p.name
    `);
    const products = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      products.push({
        ...row,
        category: row.category_name ? { id: row.category_id, name: row.category_name } : null
      });
    }
    stmt.free();
    return products;
  }

  createProduct(product: { name: string; price: number; category_id: string | null; stock: number }): void {
    if (!this.db) return;
    const id = 'prod_' + Date.now();
    this.db.run(
      'INSERT INTO products (id, name, price, category_id, stock) VALUES (?, ?, ?, ?, ?)',
      [id, product.name, product.price, product.category_id, product.stock]
    );
    this.saveToLocalStorage();
  }

  updateProduct(id: string, updates: any): void {
    if (!this.db) return;
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    this.db.run(
      `UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );
    this.saveToLocalStorage();
  }

  deleteProduct(id: string): void {
    if (!this.db) return;
    this.db.run('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
    this.saveToLocalStorage();
  }

  // Méthodes pour les ventes
  getSales(): any[] {
    if (!this.db) return [];
    const stmt = this.db.prepare('SELECT * FROM sales ORDER BY created_at DESC');
    const sales = [];
    while (stmt.step()) {
      const sale = stmt.getAsObject();
      // Récupérer les items pour cette vente
      const itemsStmt = this.db.prepare('SELECT * FROM sale_items WHERE sale_id = ?');
      itemsStmt.bind([sale.id as string]);
      const saleItems = [];
      while (itemsStmt.step()) {
        saleItems.push(itemsStmt.getAsObject());
      }
      itemsStmt.free();
      
      sales.push({
        ...sale,
        sale_items: saleItems
      });
    }
    stmt.free();
    return sales;
  }

  createSale(cartItems: any[]): any {
    if (!this.db) return null;
    
    const saleId = 'sale_' + Date.now();
    const ticketNumber = `T${Date.now()}`;
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Créer la vente
    this.db.run(
      'INSERT INTO sales (id, ticket_number, total, items_count) VALUES (?, ?, ?, ?)',
      [saleId, ticketNumber, total, itemsCount]
    );

    // Créer les articles de la vente
    const saleItems: any[] = [];
    cartItems.forEach(item => {
      const itemId = 'item_' + Date.now() + '_' + Math.random();
      this.db!.run(
        'INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [itemId, saleId, item.id, item.name, item.quantity, item.price, item.price * item.quantity]
      );
      
      saleItems.push({
        id: itemId,
        sale_id: saleId,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      });

      // Mettre à jour le stock
      this.db!.run(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    });

    this.saveToLocalStorage();

    return {
      id: saleId,
      ticket_number: ticketNumber,
      total,
      items_count: itemsCount,
      sale_items: saleItems
    };
  }
}

export const localDatabase = new LocalDatabase();
