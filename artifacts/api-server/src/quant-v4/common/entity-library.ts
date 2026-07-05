import { Entity, EntityCategory } from './entity-types';
import * as fs from 'fs';
import * as path from 'path';

export class EntityLibrary {
  private libraries: Map<EntityCategory, Entity[]> = new Map();
  private entityIndices: Map<EntityCategory, Map<string, Entity>> = new Map();

  constructor(private libraryPath: string) {}

  public load(): void {
    const categories: EntityCategory[] = [
      'person', 'group', 'object', 'subject', 'liquid',
      'metal', 'fruit', 'vehicle', 'occupation', 'city',
      'container', 'animal', 'relation', 'food', 'commodity',
      'business', 'education', 'sports', 'currency', 'unit',
      'time-unit', 'place', 'building', 'tool', 'plant',
      'bird', 'profession-category', 'material', 'weather',
      'color', 'month', 'day', 'festival', 'financial-concept',
      'percentage-label'
    ];

    for (const category of categories) {
      const filePath = path.join(this.libraryPath, `${category}-library.json`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        try {
          const entities = JSON.parse(content) as Entity[];
          this.libraries.set(category, entities);
          
          const index = new Map<string, Entity>();
          for (const entity of entities) {
            index.set(entity.id, entity);
          }
          this.entityIndices.set(category, index);
        } catch (e) {
          console.error(`Failed to load entity library: ${category}`, e);
        }
      } else {
        this.libraries.set(category, []);
        this.entityIndices.set(category, new Map());
      }
    }
  }

  public getCategory(category: EntityCategory): Entity[] {
    return this.libraries.get(category) || [];
  }

  public getEntity(category: EntityCategory, id: string): Entity | undefined {
    return this.entityIndices.get(category)?.get(id);
  }

  public getAllCategories(): EntityCategory[] {
    return Array.from(this.libraries.keys());
  }
}
