
import { BaseDatabaseService } from './base';
import { DatabaseProductWithCategory } from './types';

export class ProductsService extends BaseDatabaseService {
  getProducts(): DatabaseProductWithCategory[] {
    if (!this.db) return [];
    const stmt = this.db.prepare(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
      ORDER BY p.name
    `);
    const products: DatabaseProductWithCategory[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      products.push({
        id: row.id as string,
        name: row.name as string,
        price: row.price as number,
        category_id: row.category_id as string | null,
        stock: row.stock as number,
        image_url: row.image_url as string,
        is_active: Boolean(row.is_active),
        created_at: row.created_at as string || new Date().toISOString(),
        updated_at: row.updated_at as string || new Date().toISOString(),
        category: row.category_name ? { 
          id: row.category_id as string, 
          name: row.category_name as string,
          created_at: new Date().toISOString()
        } : null
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
      [id, product.name, product.price, product.category_id || null, product.stock]
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
}
