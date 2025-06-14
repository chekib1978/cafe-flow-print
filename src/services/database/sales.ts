
import { BaseDatabaseService } from './base';
import { DatabaseSaleWithItems, DatabaseSaleItem, CartItem } from './types';

export class SalesService extends BaseDatabaseService {
  getSales(): DatabaseSaleWithItems[] {
    if (!this.db) return [];
    const stmt = this.db.prepare('SELECT * FROM sales ORDER BY created_at DESC');
    const sales: DatabaseSaleWithItems[] = [];
    while (stmt.step()) {
      const sale = stmt.getAsObject();
      // Récupérer les items pour cette vente
      const itemsStmt = this.db.prepare('SELECT * FROM sale_items WHERE sale_id = ?');
      itemsStmt.bind([sale.id as string]);
      const saleItems: DatabaseSaleItem[] = [];
      while (itemsStmt.step()) {
        const item = itemsStmt.getAsObject();
        saleItems.push({
          id: item.id as string,
          sale_id: item.sale_id as string,
          product_id: item.product_id as string,
          product_name: item.product_name as string,
          quantity: item.quantity as number,
          unit_price: item.unit_price as number,
          total_price: item.total_price as number
        });
      }
      itemsStmt.free();
      
      sales.push({
        id: sale.id as string,
        ticket_number: sale.ticket_number as string,
        total: sale.total as number,
        items_count: sale.items_count as number,
        created_at: sale.created_at as string,
        sale_items: saleItems
      });
    }
    stmt.free();
    return sales;
  }

  createSale(cartItems: CartItem[]): DatabaseSaleWithItems | null {
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
    const saleItems: DatabaseSaleItem[] = [];
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
      created_at: new Date().toISOString(),
      sale_items: saleItems
    };
  }
}
