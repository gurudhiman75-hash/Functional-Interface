import cp001 from './cp001.json';
import cp002 from './cp002.json';
import cp003 from './cp003.json';
import cp004 from './cp004.json';
import cp005 from './cp005.json';
import cp006 from './cp006.json';
import cp007 from './cp007.json';
import cp008 from './cp008.json';
import cp009 from './cp009.json';
import cp010 from './cp010.json';
import cp011 from './cp011.json';
import cp012 from './cp012.json';
import cp013 from './cp013.json';
import cp014 from './cp014.json';
import cp015 from './cp015.json';
import cp016 from './cp016.json';
import cp017 from './cp017.json';
import cp018 from './cp018.json';
import cp019 from './cp019.json';
import cp020 from './cp020.json';
import cp021 from './cp021.json';
import cp022 from './cp022.json';
import cp023 from './cp023.json';
import cp024 from './cp024.json';
import cp025 from './cp025.json';
import cp026 from './cp026.json';
import cp027 from './cp027.json';
import cp028 from './cp028.json';
import sources from './sources.json';
import type { QuestionStudioDifficulty, QuestionStudioLanguage } from '../../question-studio/engine-types';

export type WorldGeographyQuestion = {
  id: string; cpId: string; objective: string; difficulty: QuestionStudioDifficulty;
  sourceIds: string[]; correctIndex: number;
  locales: Record<QuestionStudioLanguage, { stem: string; options: string[]; explanation: string }>;
};
export const WGE_LANGUAGES = ['en', 'hi', 'pa'] as const;
export const WGE_CP_TITLES = {
  'WGE-001-CP001': 'Earth, Continents and Oceans',
  'WGE-001-CP002': 'Latitude, Longitude and Time',
  'WGE-001-CP003': 'Rotation, Revolution and Seasons',
  'WGE-001-CP004': "Earth’s Interior, Rocks and Minerals",
  'WGE-001-CP005': 'Plate Tectonics',
  'WGE-001-CP006': 'Earthquakes, Volcanoes and Tsunamis',
  'WGE-001-CP007': 'Weathering and River Landforms',
  'WGE-001-CP008': 'Glacial, Desert, Coastal and Karst Landforms',
  'WGE-001-CP009': 'Atmosphere and Temperature',
  'WGE-001-CP010': 'Pressure and Winds',
  'WGE-001-CP011': 'Moisture and Rainfall',
  'WGE-001-CP012': 'Cyclones, Fronts and Climate Variability',
  'WGE-001-CP013': 'World Climate Regions',
  'WGE-001-CP014': 'Biomes, Grasslands and World Soils',
  'WGE-001-CP015': 'Ocean Relief and Properties',
  'WGE-001-CP016': 'Currents, Tides and Reefs',
  'WGE-001-CP017': 'Seas, Gulfs, Bays and Passages',
  'WGE-001-CP018': 'Mountains, Peaks, Plateaus and Plains',
  'WGE-001-CP019': 'World Rivers and Drainage',
  'WGE-001-CP020': 'Lakes, Waterfalls and Inland Waters',
  'WGE-001-CP021': 'Deserts, Islands, Peninsulas and Capes',
  'WGE-001-CP022': 'Countries, Capitals and Political Geography',
  'WGE-001-CP023': 'South Asia and India’s Neighbours',
  'WGE-001-CP024': 'East, Southeast and Central Asia',
  'WGE-001-CP025': 'West Asia',
  'WGE-001-CP026': 'Europe',
  'WGE-001-CP027': 'Africa',
  'WGE-001-CP028': 'North America, Central America and the Caribbean',
} as const;
export type WorldGeographyCpId = keyof typeof WGE_CP_TITLES;
export const WGE_SOURCES = sources;

// JSON is the owning authored variable library. No runtime LLM or arbitrary
// substitution can change a question's geographic relationship or answer.
function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}
export function validateWorldGeographyCorpus(rows: readonly WorldGeographyQuestion[]): void {
  const ids = new Set<string>();
  const objectives = new Set<string>();
  const stems = new Set<string>();
  const sourceIds = new Set(WGE_SOURCES.map(s => s.id));
  for (const q of rows) {
    if (ids.has(q.id) || !q.id.startsWith(`${q.cpId}-Q`)) throw new Error(`Invalid or duplicate WGE identity: ${q.id}`);
    ids.add(q.id);
    if (!(q.cpId in WGE_CP_TITLES)) throw new Error(`Unknown WGE checkpoint: ${q.cpId}`);
    const objective = `${q.cpId}:${q.objective}`;
    if (!q.objective || objectives.has(objective)) throw new Error(`Invalid or duplicate objective: ${objective}`);
    objectives.add(objective);
    if (!['Easy', 'Medium', 'Hard'].includes(q.difficulty)) throw new Error(`Invalid difficulty: ${q.id}`);
    if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) throw new Error(`Invalid answer: ${q.id}`);
    if (!q.sourceIds.length || q.sourceIds.some(id => !sourceIds.has(id))) throw new Error(`Missing source: ${q.id}`);
    for (const language of WGE_LANGUAGES) {
      const l = q.locales[language];
      if (!l?.stem?.trim() || !l.explanation?.trim()) throw new Error(`Missing ${language} content: ${q.id}`);
      if (l.options.length !== 4 || l.options.some(o => !o.trim()) || new Set(l.options.map(o => o.normalize('NFC').trim().toLowerCase())).size !== 4) throw new Error(`Invalid options: ${q.id}/${language}`);
      const text = [l.stem, ...l.options, l.explanation].join(' ');
      if (/\{\{|\}\}|\b(?:TODO|TBD|undefined)\b/.test(text)) throw new Error(`Unresolved content: ${q.id}`);
      if (language !== 'en' && /[a-z]/i.test(text)) throw new Error(`English leakage: ${q.id}/${language}`);
      const stemKey = `${language}:${l.stem.normalize('NFC').trim().toLowerCase()}`;
      if (stems.has(stemKey)) throw new Error(`Duplicate stem: ${q.id}/${language}`);
      stems.add(stemKey);
    }
  }
  for (const cp of Object.keys(WGE_CP_TITLES)) {
    const questions = rows.filter(q => q.cpId === cp);
    if (!questions.length) throw new Error(`Empty WGE checkpoint: ${cp}`);
    for (const difficulty of ['Easy', 'Medium', 'Hard']) {
      if (!questions.some(q => q.difficulty === difficulty)) throw new Error(`Missing ${difficulty}: ${cp}`);
    }
  }
}
const authored = [...cp001, ...cp002, ...cp003, ...cp004, ...cp005, ...cp006, ...cp007, ...cp008, ...cp009, ...cp010, ...cp011, ...cp012, ...cp013, ...cp014, ...cp015, ...cp016, ...cp017, ...cp018, ...cp019, ...cp020, ...cp021, ...cp022, ...cp023, ...cp024, ...cp025, ...cp026, ...cp027, ...cp028] as WorldGeographyQuestion[];
validateWorldGeographyCorpus(authored);
export const WGE_CORPUS: readonly WorldGeographyQuestion[] = deepFreeze(authored);
