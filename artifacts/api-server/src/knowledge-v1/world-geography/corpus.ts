import cp001 from './cp001.json';
import cp002 from './cp002.json';
import cp003 from './cp003.json';
import cp004 from './cp004.json';
import cp005 from './cp005.json';
import cp006 from './cp006.json';
import cp007 from './cp007.json';
import cp008 from './cp008.json';
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
const authored = [...cp001, ...cp002, ...cp003, ...cp004, ...cp005, ...cp006, ...cp007, ...cp008] as WorldGeographyQuestion[];
validateWorldGeographyCorpus(authored);
export const WGE_CORPUS: readonly WorldGeographyQuestion[] = deepFreeze(authored);
