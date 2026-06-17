import { EntityLibrary } from './entity-library';
import { EntityCategory, ResolvedEntity } from './entity-types';

export class EntityResolver {
  constructor(private library: EntityLibrary) {}

  public resolveEntity(
    category: EntityCategory,
    id: string,
    language: 'en' | 'hi' | 'pa'
  ): string {
    const entity = this.library.getEntity(category, id);
    if (!entity) {
      return `[[MISSING_ENTITY:${category}:${id}]]`;
    }
    return entity[language] || entity.en || id;
  }
  
  public resolveFullEntity(
    category: EntityCategory,
    id: string,
    language: 'en' | 'hi' | 'pa'
  ): ResolvedEntity {
    const value = this.resolveEntity(category, id, language);
    return {
      id,
      value,
      language
    };
  }

  public resolveAllLanguages(category: EntityCategory, id: string): Record<'en' | 'hi' | 'pa', string> {
    return {
      en: this.resolveEntity(category, id, 'en'),
      hi: this.resolveEntity(category, id, 'hi'),
      pa: this.resolveEntity(category, id, 'pa'),
    };
  }
}
