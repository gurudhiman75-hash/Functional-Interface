import { EntityCategory, FrequencyType, GenderType } from './entity-types';

export interface Scenario {
  id: string;
  name: { en: string; hi: string; pa: string };
  allowedGroups: string[];
  allowedProfessions: string[];
  allowedPlaces: string[];
  allowedObjects: string[];
  allowedSubjects: string[];
  allowedBuildings: string[];
  allowedAnimals: string[];
  allowedContainers: string[];
  allowedVehicles: string[];
  allowedFoods: string[];
  allowedCommodities: string[];
  forbiddenProfessions?: string[];
  forbiddenGroups?: string[];
  tags: string[];
}

export interface LiquidCategory {
  id: string;
  en: string;
  hi: string;
  pa: string;
  liquids: string[];
}
