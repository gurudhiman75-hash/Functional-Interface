import { ScenarioLibrary } from './scenario-library';
import { EntityLibrary } from './entity-library';
import { EntityCategory } from './entity-types';

export class ScenarioValidator {
  constructor(
    private scenarioLibrary: ScenarioLibrary,
    private entityLibrary: EntityLibrary
  ) {}

  public validateAll(): string[] {
    const errors: string[] = [];
    const scenarios = this.scenarioLibrary.getAllScenarios();

    for (const scenario of scenarios) {
      const checkIds = (ids: string[], category: EntityCategory, label: string) => {
        if (!ids) return;
        for (const id of ids) {
           if (!this.entityLibrary.getEntity(category, id)) {
             errors.push(`[Scenario:${scenario.id}] ${label} ID not found in library: ${id}`);
           }
        }
      };

      checkIds(scenario.allowedGroups, 'group', 'allowedGroups');
      checkIds(scenario.allowedProfessions, 'occupation', 'allowedProfessions');
      checkIds(scenario.allowedPlaces, 'place', 'allowedPlaces');
      checkIds(scenario.allowedObjects, 'object', 'allowedObjects');
      checkIds(scenario.allowedSubjects, 'subject', 'allowedSubjects');
      checkIds(scenario.allowedBuildings, 'building', 'allowedBuildings');
      checkIds(scenario.allowedAnimals, 'animal', 'allowedAnimals');
      checkIds(scenario.allowedContainers, 'container', 'allowedContainers');
      checkIds(scenario.allowedVehicles, 'vehicle', 'allowedVehicles');
      checkIds(scenario.allowedFoods, 'food', 'allowedFoods');
      checkIds(scenario.allowedCommodities, 'commodity', 'allowedCommodities');
      
      // Check forbidden professions
      if (scenario.forbiddenProfessions) {
        checkIds(scenario.forbiddenProfessions, 'occupation', 'forbiddenProfessions');
      }

      // Check for empty translations or English leaks
      if (!scenario.name.hi || scenario.name.hi === scenario.name.en) {
        errors.push(`[Scenario:${scenario.id}] Potential Hindi translation leak or missing: ${scenario.name.hi}`);
      }
      if (!scenario.name.pa || scenario.name.pa === scenario.name.en) {
        errors.push(`[Scenario:${scenario.id}] Potential Punjabi translation leak or missing: ${scenario.name.pa}`);
      }
    }

    return errors;
  }

  public isCoherent(scenarioId: string, entityId: string, category: EntityCategory): boolean {
    const scenario = this.scenarioLibrary.getScenario(scenarioId);
    if (!scenario) return false;

    switch (category) {
      case 'group': return scenario.allowedGroups.includes(entityId);
      case 'occupation': return scenario.allowedProfessions.includes(entityId);
      case 'place': return scenario.allowedPlaces.includes(entityId);
      case 'object': return scenario.allowedObjects.includes(entityId);
      case 'subject': return scenario.allowedSubjects.includes(entityId);
      case 'building': return scenario.allowedBuildings.includes(entityId);
      case 'animal': return scenario.allowedAnimals.includes(entityId);
      case 'container': return scenario.allowedContainers.includes(entityId);
      case 'vehicle': return scenario.allowedVehicles.includes(entityId);
      case 'food': return scenario.allowedFoods.includes(entityId);
      case 'commodity': return scenario.allowedCommodities.includes(entityId);
      default: return true; // Other categories might be universally allowed or not yet restricted
    }
  }
}
