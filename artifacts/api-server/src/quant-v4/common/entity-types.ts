export type FrequencyType = 'common' | 'uncommon' | 'rare';
export type GenderType = 'male' | 'female' | 'neutral';

export interface MultilingualEntity {
  id: string;
  en: string;
  hi: string;
  pa: string;
  gender?: GenderType;
  numberType?: 'countable' | 'uncountable';
  frequency?: FrequencyType;
  tags?: string[];
}

export type Entity = MultilingualEntity;

export type EntityCategory =
  | 'person' | 'group' | 'object' | 'subject' | 'liquid'
  | 'metal' | 'fruit' | 'vehicle' | 'occupation' | 'city'
  | 'container' | 'animal' | 'relation' | 'food' | 'commodity'
  | 'business' | 'education' | 'sports' | 'currency' | 'unit'
  | 'time-unit' | 'place' | 'building' | 'tool' | 'plant'
  | 'bird' | 'profession-category' | 'material' | 'weather'
  | 'color' | 'month' | 'day' | 'festival';

export interface EntityReference {
  categoryId: EntityCategory;
  entityId: string;
}

export interface ResolvedEntity {
  id: string;
  value: string;
  language: 'en' | 'hi' | 'pa';
}
