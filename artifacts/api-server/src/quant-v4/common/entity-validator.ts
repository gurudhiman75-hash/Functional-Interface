import { EntityLibrary } from './entity-library';
import { EntityCategory } from './entity-types';

export class EntityValidator {
  constructor(private library: EntityLibrary) {}

  public validateAll(): string[] {
    const errors: string[] = [];
    const categories = this.library.getAllCategories();

    for (const category of categories) {
      const entities = this.library.getCategory(category);
      const idSet = new Set<string>();

      if (entities.length === 0) {
        errors.push(`Category ${category} has no entities.`);
        continue;
      }

      for (const entity of entities) {
        if (!entity.id || typeof entity.id !== 'string') {
          errors.push(`[${category}] Entity missing valid id.`);
          continue;
        }

        if (idSet.has(entity.id)) {
          errors.push(`[${category}] Duplicate id found: ${entity.id}`);
        }
        idSet.add(entity.id);

        const languages: ('en' | 'hi' | 'pa')[] = ['en', 'hi', 'pa'];
        for (const lang of languages) {
          if (!entity[lang] || entity[lang].trim() === '') {
            errors.push(`[${category}:${entity.id}] Missing or empty translation for language: ${lang}`);
          }
        }
        
        if (entity.hi === entity.pa && entity.hi !== entity.en && category !== 'person') {
          // Warning for identical translations in hi and pa, might be valid but worth noting
          // However, we won't strictly enforce an error for it unless it's identical to English too.
        }
        
        if (entity.en === entity.hi && /^[A-Za-z]+$/.test(entity.en) && category !== 'person') {
           errors.push(`[${category}:${entity.id}] Potential dictionary/untranslated string in Hindi: ${entity.hi}`);
        }
      }
    }

    return errors;
  }

  public validateReference(category: EntityCategory, id: string): string[] {
    const errors: string[] = [];
    const entity = this.library.getEntity(category, id);
    if (!entity) {
      return [`[${category}:${id}] Invalid entity id.`];
    }

    const languages: ('en' | 'hi' | 'pa')[] = ['en', 'hi', 'pa'];
    for (const lang of languages) {
      if (!entity[lang] || entity[lang].trim() === '') {
        errors.push(`[${category}:${id}] Missing or empty rendering for ${lang}.`);
      }
    }

    return errors;
  }
}
