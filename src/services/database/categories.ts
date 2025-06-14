
import { BaseDatabaseService } from './base';
import { DatabaseCategory } from './types';

export class CategoriesService extends BaseDatabaseService {
  getCategories(): DatabaseCategory[] {
    if (!this.db) return [];
    const stmt = this.db.prepare('SELECT * FROM categories ORDER BY name');
    const categories: DatabaseCategory[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      categories.push({
        id: row.id as string,
        name: row.name as string,
        created_at: row.created_at as string || new Date().toISOString()
      });
    }
    stmt.free();
    return categories;
  }
}
