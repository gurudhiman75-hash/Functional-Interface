import { Entity } from '../../../../common/entity-types';

export class SemanticValidator {
  validateMixtures(entities: Entity[], compatibilityMap: any): string[] {
    const errors: string[] = [];
    // Specialized check for forbidden mixtures
    const forbidden = compatibilityMap.forbidden_mixtures;
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const e1 = entities[i].id;
        const e2 = entities[j].id;
        if (forbidden[e1] && forbidden[e1].includes(e2)) {
          errors.push(`Illegal mixture detected: ${e1} and ${e2}`);
        }
        if (forbidden[e2] && forbidden[e2].includes(e1)) {
          errors.push(`Illegal mixture detected: ${e2} and ${e1}`);
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

  validateTranslationLeakage(entities: Entity[]): string[] {
    const errors: string[] = [];
    for (const entity of entities) {
      if (/[a-zA-Z]/.test(entity.hi)) errors.push(`Potential translation leakage (English in Hindi) for: ${entity.id}`);
      if (/[a-zA-Z]/.test(entity.pa)) errors.push(`Potential translation leakage (English in Punjabi) for: ${entity.id}`);
    }
    return errors;
  }
}
