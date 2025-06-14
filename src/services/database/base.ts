
import initSqlJs, { Database } from 'sql.js';

export class BaseDatabaseService {
  protected db: Database | null = null;
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

    // Insérer des données par défaut
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

  protected saveToLocalStorage(): void {
    if (!this.db) return;
    const data = this.db.export();
    localStorage.setItem('cafeteria_db', JSON.stringify(Array.from(data)));
  }
}
