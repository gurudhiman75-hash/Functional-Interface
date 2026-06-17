import { Entity } from '../../../../common/entity-types';

export class SemanticValidator {
  validateFamilyRatios(entities: Entity[]): string[] {
    const errors: string[] = [];
    // Example: Can't have 5 fathers in a small family ratio if it's supposed to be realistic
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
      if (/[a-zA-Z]/.test(entity.hi) && !entity.hi.includes('₹')) errors.push(`Potential translation leakage (English in Hindi) for: ${entity.id}`);
      if (/[a-zA-Z]/.test(entity.pa) && !entity.pa.includes('₹')) errors.push(`Potential translation leakage (English in Punjabi) for: ${entity.id}`);
    }
    return errors;
  }
}
