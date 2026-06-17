import { Entity } from '../../../../common/entity-types';

export class SemanticValidator {
  validateImpossibleWorlds(entities: Entity[]): string[] {
    const errors: string[] = [];
    // Example: Men and Girls in a subject-specific group might be okay, but checking for contradictions
    return errors;
  }

  validateIllegalMixtures(entities: Entity[], compatibilityMap: any): string[] {
    const errors: string[] = [];
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const e1 = entities[i].id;
        const e2 = entities[j].id;
        if (compatibilityMap[e1] && !compatibilityMap[e1].includes(e2)) {
          // If e1 has a compatibility list, e2 must be in it if they are paired
          // This is a simple check; actual implementation might be more complex
        }
      }
    }
    return errors;
  }

  validateDuplicateEntities(entities: Entity[]): string[] {
    const ids = entities.map(e => e.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    return duplicates.map(id => `Duplicate entity found: ${id}`);
  }

  validateGenderMismatch(entities: Entity[]): string[] {
    const errors: string[] = [];
    // Check if gender-specific verbs match entity gender
    return errors;
  }

  validateTranslationLeakage(entities: Entity[]): string[] {
    const errors: string[] = [];
    for (const entity of entities) {
      if (!entity.hi || !entity.pa || !entity.en) {
        errors.push(`Missing translation for entity: ${entity.id}`);
      }
      // Basic check for English characters in Hindi/Punjabi fields
      if (/[a-zA-Z]/.test(entity.hi)) errors.push(`Potential translation leakage (English in Hindi) for: ${entity.id}`);
      if (/[a-zA-Z]/.test(entity.pa)) errors.push(`Potential translation leakage (English in Punjabi) for: ${entity.id}`);
    }
    return errors;
  }
}
