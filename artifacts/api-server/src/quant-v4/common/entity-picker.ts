import { EntityLibrary } from './entity-library';
import { Entity, EntityCategory } from './entity-types';

export class EntityPicker {
  constructor(private library: EntityLibrary) {}

  public pickRandom(category: EntityCategory, excludeIds: string[] = []): Entity {
    const entities = this.library.getCategory(category);
    if (entities.length === 0) {
      throw new Error(`Category ${category} is empty or missing`);
    }

    const available = entities.filter(e => !excludeIds.includes(e.id));
    if (available.length === 0) {
      throw new Error(`No available entities in category ${category} after exclusions`);
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }

  public pickMultiple(category: EntityCategory, count: number, excludeIds: string[] = []): Entity[] {
    const result: Entity[] = [];
    const currentExclusions = [...excludeIds];
    
    for (let i = 0; i < count; i++) {
      const picked = this.pickRandom(category, currentExclusions);
      result.push(picked);
      currentExclusions.push(picked.id);
    }
    
    return result;
  }

  public pickByIndex(category: EntityCategory, index: number, excludeIds: string[] = []): Entity {
    const entities = this.library.getCategory(category);
    if (entities.length === 0) {
      throw new Error(`Category ${category} is empty or missing`);
    }

    const available = entities.filter(e => !excludeIds.includes(e.id));
    if (available.length === 0) {
      throw new Error(`No available entities in category ${category} after exclusions`);
    }

    const normalizedIndex = ((index % available.length) + available.length) % available.length;
    return available[normalizedIndex];
  }

  public pickMultipleByIndex(category: EntityCategory, count: number, seedIndex: number, excludeIds: string[] = []): Entity[] {
    const result: Entity[] = [];
    const currentExclusions = [...excludeIds];

    for (let i = 0; i < count; i++) {
      const picked = this.pickByIndex(category, seedIndex + i, currentExclusions);
      result.push(picked);
      currentExclusions.push(picked.id);
    }

    return result;
  }
}
