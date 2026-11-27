import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Languages,
  RefreshCw,
  Save,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

type Language = "en" | "hi" | "pa";
type Gender = "M" | "F";
type RelationType =
  | "IMMEDIATE_LEFT"
  | "IMMEDIATE_RIGHT"
  | "SECOND_TO_LEFT"
  | "OPPOSITE"
  | "BETWEEN";

interface Entity {
  id: string;
  gender: Gender;
  names: Record<Language, string>;
}

interface ClueLogic {
  subjectId: string;
  relation: RelationType;
  objectId?: string;
  anchorObjectId?: string;
}

interface LogicCommitPayload {
  patternId: string;
  logic: {
    nodes: Array<{
      id: string;
      entityId: string;
      gender: Gender;
      position: number;
    }>;
    edges: Array<{
      from: string;
      to: string;
      relation: RelationType;
    }>;
  };
  availableLangs: Language[];
  difficulty: number;
}

const languageLabels: Record<Language, string> = {
  en: "English",
  hi: "\u0939\u093f\u0928\u094d\u0926\u0940",
  pa: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40",
};

const languageOrder: Language[] = ["en", "hi", "pa"];

const patternOptions = [
  {
    id: "linear_north",
    label: "Linear Arrangement - Facing North",
    arrangement: "Linear Arrangement (Facing North)",
    difficulty: 2,
    initialRelation: "IMMEDIATE_LEFT" as RelationType,
  },
  {
    id: "circular_in",
    label: "Circular Arrangement - Facing In",
    arrangement: "Circular Arrangement (Facing In)",
    difficulty: 3,
    initialRelation: "IMMEDIATE_RIGHT" as RelationType,
  },
  {
    id: "complex_circular_8",
    label: "Complex Circular - 8 Seats",
    arrangement: "Circular Arrangement (Facing In)",
    difficulty: 4,
    initialRelation: "SECOND_TO_LEFT" as RelationType,
  },
];

const languageDescriptions: Record<Language, string> = {
  en: "Base question",
  hi: "Devanagari realization",
  pa: "Gurmukhi realization",
};

const relationLabels: Record<RelationType, string> = {
  IMMEDIATE_LEFT: "Immediate Left",
  IMMEDIATE_RIGHT: "Immediate Right",
  SECOND_TO_LEFT: "Second to Left",
  OPPOSITE: "Opposite",
  BETWEEN: "Between",
};

function normalizeIndicText(input: string) {
  return input.normalize("NFC");
}

function makeEntity(
  id: string,
  gender: Gender,
  en: string,
  hi: string,
  pa: string,
): Entity {
  return {
    id,
    gender,
    names: {
      en,
      hi: normalizeIndicText(hi),
      pa: normalizeIndicText(pa),
    },
  };
}

const entityPool: Entity[] = [
  makeEntity("rahul", "M", "Rahul", "\u0930\u093e\u0939\u0941\u0932", "\u0a30\u0a3e\u0a39\u0a41\u0a32"),
  makeEntity("arjun", "M", "Arjun", "\u0905\u0930\u094d\u091c\u0941\u0928", "\u0a05\u0a30\u0a1c\u0a41\u0a28"),
  makeEntity("aman", "M", "Aman", "\u0905\u092e\u0928", "\u0a05\u0a2e\u0a28"),
  makeEntity("vikram", "M", "Vikram", "\u0935\u093f\u0915\u094d\u0930\u092e", "\u0a35\u0a3f\u0a15\u0a30\u0a2e"),
  makeEntity("karan", "M", "Karan", "\u0915\u0930\u0923", "\u0a15\u0a30\u0a28"),
  makeEntity("sandeep", "M", "Sandeep", "\u0938\u0902\u0926\u0940\u092a", "\u0a38\u0a70\u0a26\u0a40\u0a2a"),
  makeEntity("harish", "M", "Harish", "\u0939\u0930\u0940\u0936", "\u0a39\u0a30\u0a40\u0a36"),
  makeEntity("rohit", "M", "Rohit", "\u0930\u094b\u0939\u093f\u0924", "\u0a30\u0a4b\u0a39\u0a3f\u0a24"),
  makeEntity("rohan", "M", "Rohan", "\u0930\u094b\u0939\u0928", "\u0a30\u0a4b\u0a39\u0a28"),
  makeEntity("manav", "M", "Manav", "\u092e\u093e\u0928\u0935", "\u0a2e\u0a3e\u0a28\u0a35"),
  makeEntity("dev", "M", "Dev", "\u0926\u0947\u0935", "\u0a26\u0a47\u0a35"),
  makeEntity("priya", "F", "Priya", "\u092a\u094d\u0930\u093f\u092f\u093e", "\u0a2a\u0a4d\u0a30\u0a3f\u0a06"),
  makeEntity("simran", "F", "Simran", "\u0938\u093f\u092e\u0930\u0928", "\u0a38\u0a3f\u0a2e\u0a30\u0a28"),
  makeEntity("neha", "F", "Neha", "\u0928\u0947\u0939\u093e", "\u0a28\u0a47\u0a39\u0a3e"),
  makeEntity("kavya", "F", "Kavya", "\u0915\u093e\u0935\u094d\u092f\u093e", "\u0a15\u0a3e\u0a35\u0a3f\u0a06"),
  makeEntity("ananya", "F", "Ananya", "\u0905\u0928\u0928\u094d\u092f\u093e", "\u0a05\u0a28\u0a28\u0a3f\u0a06"),
  makeEntity("rohini", "F", "Rohini", "\u0930\u094b\u0939\u093f\u0923\u0940", "\u0a30\u0a4b\u0a39\u0a3f\u0a23\u0a40"),
  makeEntity("jaspreet", "F", "Jaspreet", "\u091c\u0938\u092a\u094d\u0930\u0940\u0924", "\u0a1c\u0a38\u0a2a\u0a4d\u0a30\u0a40\u0a24"),
  makeEntity("meera", "F", "Meera", "\u092e\u0940\u0930\u093e", "\u0a2e\u0a40\u0a30\u0a3e"),
  makeEntity("isha", "F", "Isha", "\u0908\u0936\u093e", "\u0a08\u0a36\u0a3e"),
  makeEntity("gurleen", "F", "Gurleen", "\u0917\u0941\u0930\u0932\u0940\u0928", "\u0a17\u0a41\u0a30\u0a32\u0a40\u0a28"),
  makeEntity("tanvi", "F", "Tanvi", "\u0924\u0928\u094d\u0935\u0940", "\u0a24\u0a28\u0a35\u0a40"),
];

const relationPhrases: Record<RelationType, Record<Language, string>> = {
  IMMEDIATE_LEFT: {
    en: "to the immediate left of",
    hi: "\u0920\u0940\u0915 \u092c\u093e\u0908\u0902 \u0913\u0930",
    pa: "\u0a2c\u0a3f\u0a32\u0a15\u0a41\u0a32 \u0a16\u0a71\u0a2c\u0a47 \u0a2a\u0a3e\u0a38\u0a47",
  },
  IMMEDIATE_RIGHT: {
    en: "to the immediate right of",
    hi: "\u0920\u0940\u0915 \u0926\u093e\u0908\u0902 \u0913\u0930",
    pa: "\u0a2c\u0a3f\u0a32\u0a15\u0a41\u0a32 \u0a38\u0a71\u0a1c\u0a47 \u0a2a\u0a3e\u0a38\u0a47",
  },
  SECOND_TO_LEFT: {
    en: "second to the left of",
    hi: "\u0926\u0942\u0938\u0930\u0947 \u092c\u093e\u0908\u0902 \u0913\u0930",
    pa: "\u0a26\u0a42\u0a1c\u0a47 \u0a16\u0a71\u0a2c\u0a47 \u0a2a\u0a3e\u0a38\u0a47",
  },
  OPPOSITE: {
    en: "opposite",
    hi: "\u0935\u093f\u092a\u0930\u0940\u0924",
    pa: "\u0a38\u0a3e\u0a39\u0a2e\u0a23\u0a47",
  },
  BETWEEN: {
    en: "between",
    hi: "\u0915\u0947 \u092c\u0940\u091a",
    pa: "\u0a26\u0a47 \u0a35\u0a3f\u0a1a\u0a15\u0a3e\u0a30",
  },
};

const sitVerb: Record<Language, Record<Gender, string>> = {
  en: { M: "sits", F: "sits" },
  hi: {
    M: "\u092c\u0948\u0920\u093e \u0939\u0948",
    F: "\u092c\u0948\u0920\u0940 \u0939\u0948",
  },
  pa: {
    M: "\u0a2c\u0a48\u0a20\u0a3e \u0a39\u0a48",
    F: "\u0a2c\u0a48\u0a20\u0a40 \u0a39\u0a48",
  },
};

function getUniqueEntities(count: number): Entity[] {
  const shuffled = [...entityPool];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled.slice(0, count);
}

function getNameClashEntities(count: number): Entity[] {
  const grouped = entityPool.reduce((acc, entity) => {
    const initial = entity.names.en.charAt(0).toUpperCase();
    const bucket = acc.get(initial) ?? [];
    bucket.push(entity);
    acc.set(initial, bucket);
    return acc;
  }, new Map<string, Entity[]>());

  const initials = Array.from(grouped.keys()).sort(() => Math.random() - 0.5);
  const fullInitial = initials.find(
    (initial) => (grouped.get(initial)?.length ?? 0) >= count,
  );

  if (fullInitial) {
    return [...(grouped.get(fullInitial) ?? [])]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  const strongestGroup =
    Array.from(grouped.values())
      .filter((group) => group.length >= 2)
      .sort((a, b) => b.length - a.length)[0] ?? [];
  const seed = [...strongestGroup]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(3, count));
  const used = new Set(seed.map((entity) => entity.id));
  const filler = entityPool
    .filter((entity) => !used.has(entity.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, count - seed.length);

  return [...seed, ...filler];
}

function generateClue(
  logic: ClueLogic,
  entities: Entity[],
  lang: Language,
): string {
  const map = new Map(entities.map((entity) => [entity.id, entity]));
  const subject = map.get(logic.subjectId);
  const object = logic.objectId ? map.get(logic.objectId) : undefined;
  const anchor = logic.anchorObjectId ? map.get(logic.anchorObjectId) : undefined;

  if (!subject || !object) return "";

  if (logic.relation === "BETWEEN" && anchor) {
    if (lang === "en") {
      return normalizeIndicText(
        `${subject.names.en} ${sitVerb.en[subject.gender]} between ${object.names.en} and ${anchor.names.en}.`,
      );
    }
    const conjunction = lang === "hi" ? "\u0914\u0930" : "\u0a05\u0a24\u0a47";
    return normalizeIndicText(
      `${subject.names[lang]}, ${object.names[lang]} ${conjunction} ${anchor.names[lang]} ${relationPhrases.BETWEEN[lang]} ${sitVerb[lang][subject.gender]}\u0964`,
    );
  }

  if (lang === "en") {
    return normalizeIndicText(
      `${subject.names.en} ${sitVerb.en[subject.gender]} ${relationPhrases[logic.relation].en} ${object.names.en}.`,
    );
  }

  if (logic.relation === "OPPOSITE") {
    const postposition = lang === "hi" ? "\u0915\u0947" : "\u0a26\u0a47";
    return normalizeIndicText(
      `${subject.names[lang]}, ${object.names[lang]} ${postposition} ${relationPhrases.OPPOSITE[lang]} ${sitVerb[lang][subject.gender]}\u0964`,
    );
  }

  const postposition = lang === "hi" ? "\u0915\u0947" : "\u0a26\u0a47";
  return normalizeIndicText(
    `${subject.names[lang]}, ${object.names[lang]} ${postposition} ${relationPhrases[logic.relation][lang]} ${sitVerb[lang][subject.gender]}\u0964`,
  );
}

function getPreviewClass(language: Language) {
  if (language === "pa") {
    return "punjabi-text text-[1.18rem] leading-loose";
  }
  if (language === "hi") {
    return "text-[1.12rem] leading-relaxed";
  }
  return "text-base leading-7";
}

export function GeneratorHub() {
  const [entities, setEntities] = useState(() => getUniqueEntities(4));
  const [activePattern, setActivePattern] = useState(patternOptions[1].id);
  const [previewLanguages, setPreviewLanguages] = useState<Language[]>([
    "en",
    "hi",
    "pa",
  ]);
  const [relation, setRelation] = useState<RelationType>(
    patternOptions[1].initialRelation,
  );
  const [enableNameClash, setEnableNameClash] = useState(false);
  const [draftTexts, setDraftTexts] = useState<Record<Language, string>>({
    en: "",
    hi: "",
    pa: "",
  });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [realizationStatus, setRealizationStatus] =
    useState<Record<string, unknown>>({});

  const selectedPattern =
    patternOptions.find((pattern) => pattern.id === activePattern) ??
    patternOptions[1];

  const logic: ClueLogic = useMemo(
    () => ({
      subjectId: entities[0]?.id ?? "",
      relation,
      objectId: entities[1]?.id,
      anchorObjectId: entities[2]?.id,
    }),
    [entities, relation],
  );

  const subjectEntity = entities.find((entity) => entity.id === logic.subjectId);
  const objectEntity = entities.find((entity) => entity.id === logic.objectId);
  const isAmbiguous = !logic.subjectId || !logic.objectId || !subjectEntity || !objectEntity;

  const commitPayload: LogicCommitPayload = useMemo(
    () => ({
      patternId: selectedPattern.id,
      logic: {
        nodes: entities.map((entity, index) => ({
          id: `node_${index + 1}`,
          entityId: entity.id,
          gender: entity.gender,
          position: index + 1,
        })),
        edges: [
          {
            from: logic.subjectId,
            to: logic.objectId ?? "",
            relation: logic.relation,
          },
        ],
      },
      availableLangs: previewLanguages,
      difficulty: selectedPattern.difficulty,
    }),
    [entities, logic, previewLanguages, selectedPattern],
  );

  const generatedTexts = useMemo(
    () =>
      languageOrder.reduce(
        (acc, language) => ({
          ...acc,
          [language]: generateClue(logic, entities, language),
        }),
        {} as Record<Language, string>,
      ),
    [entities, logic],
  );

  useEffect(() => {
    let cancelled = false;

    const runNativeRealizer = async () => {
      const localFallback = generatedTexts;

      try {
        const response = await fetch(
          `${API_BASE_URL}/generator/realize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patternId: selectedPattern.id,
              languages: previewLanguages,
              logic: commitPayload.logic,
              question: {
                text: generatedTexts.en,
                options: entities.map(
                  (entity) => entity.names.en,
                ),
                correct: 0,
                explanation:
                  "Apply the seating relation and choose the valid answer.",
              },
            }),
          },
        );

        if (!response.ok) {
          throw new Error(
            `Realizer failed with ${response.status}`,
          );
        }

        const payload = await response.json();
        const realizedQuestion =
          payload?.question ?? {};

        if (cancelled) return;

        setRealizationStatus(
          payload?.nativeRealization ?? {},
        );
        setDraftTexts({
          en:
            realizedQuestion.text ||
            localFallback.en,
          hi:
            realizedQuestion.textHi ||
            localFallback.hi,
          pa:
            realizedQuestion.textPa ||
            localFallback.pa,
        });
      } catch {
        if (cancelled) return;

        setRealizationStatus({});
        setDraftTexts(localFallback);
      }
    };

    void runNativeRealizer();

    return () => {
      cancelled = true;
    };
  }, [
    commitPayload.logic,
    entities,
    generatedTexts,
    previewLanguages,
    selectedPattern.id,
  ]);

  const previews = useMemo(
    () =>
      previewLanguages.map((language) => ({
        language,
        text: draftTexts[language] || generatedTexts[language],
      })),
    [draftTexts, generatedTexts, previewLanguages],
  );

  const toggleLanguage = (language: Language) => {
    if (language === "en") return;
    setPreviewLanguages((current) =>
      current.includes(language)
        ? current.filter((item) => item !== language)
        : languageOrder.filter((item) => item === "en" || current.includes(item) || item === language),
    );
  };

  const updateDraftText = (language: Language, value: string) => {
    setDraftTexts((current) => ({
      ...current,
      [language]: normalizeIndicText(value),
    }));
    setSaved(false);
  };

  const regenerateNames = () => {
    setEntities(
      enableNameClash && selectedPattern.difficulty >= 4
        ? getNameClashEntities(4)
        : getUniqueEntities(4),
    );
    setSaved(false);
    setSaveError("");
  };

  const toggleLogic = () => {
    const relationCycle: RelationType[] = [
      "IMMEDIATE_LEFT",
      "IMMEDIATE_RIGHT",
      "SECOND_TO_LEFT",
      "OPPOSITE",
    ];
    const currentIndex = relationCycle.indexOf(relation);
    setRelation(relationCycle[(currentIndex + 1) % relationCycle.length]);
    setSaved(false);
    setSaveError("");
  };

  const changePattern = (patternId: string) => {
    const nextPattern =
      patternOptions.find((pattern) => pattern.id === patternId) ??
      patternOptions[1];
    setActivePattern(nextPattern.id);
    setRelation(nextPattern.initialRelation);
    setSaved(false);
    setSaveError("");
  };

  const handleSave = () => {
    if (isAmbiguous) {
      setSaveError("Cannot commit: backend solver flagged this logic as Ambiguous.");
      setSaved(false);
      return;
    }
    setSaveError("");
    setSaved(true);
  };

  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-blue-950 px-4 py-4 text-white">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-indigo-300" />
              <h2 className="text-lg font-semibold tracking-tight">
                Generator Hub
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Preview the same reasoning logic in English, Hindi, and Punjabi at once.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-md border border-blue-900 bg-blue-900/50 px-3 py-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Target Languages
            </span>
            {languageOrder.map((language) => (
              <button
                key={language}
                type="button"
                disabled={language === "en"}
                onClick={() => toggleLanguage(language)}
                className={`rounded-md border px-3 py-1.5 text-sm font-semibold transition ${
                  previewLanguages.includes(language)
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : "border-blue-900 bg-blue-950 text-slate-400 hover:border-slate-500 hover:text-white"
                } ${language === "en" ? "cursor-not-allowed opacity-95" : ""}`}
              >
                {languageLabels[language]}
                {language === "en" ? " (Locked)" : ""}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[320px_1fr]">
        <aside className="border-b border-slate-200 bg-white p-4 xl:border-b-0 xl:border-r">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Controller State
          </p>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-500">
                Pattern Selector
              </span>
              <select
                value={activePattern}
                onChange={(event) => changePattern(event.target.value)}
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {patternOptions.map((pattern) => (
                  <option key={pattern.id} value={pattern.id}>
                    {pattern.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-500">
                Preview Languages
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {languageOrder.map((language) => (
                  <button
                    key={language}
                    type="button"
                    disabled={language === "en"}
                    onClick={() => toggleLanguage(language)}
                    className={`rounded-md border px-3 py-1.5 text-sm font-semibold transition ${
                      previewLanguages.includes(language)
                        ? "border-indigo-500 bg-indigo-600 text-white"
                        : "border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-950"
                    } ${language === "en" ? "cursor-not-allowed opacity-95" : ""}`}
                  >
                    {languageLabels[language]}
                    {language === "en" ? " (Locked)" : ""}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
              <input
                type="checkbox"
                checked={enableNameClash}
                onChange={(event) =>
                  setEnableNameClash(event.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-950">
                  Enable Name Clash (Hard)
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Shuffle Entities will prefer same-initial names for level 4+ patterns.
                </span>
              </span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">
                  Subject
                </p>
                <p className="mt-1 text-sm font-medium text-slate-950">
                  {subjectEntity ? `${subjectEntity.names.en} (${subjectEntity.gender})` : "NA"}
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">
                  Object
                </p>
                <p className="mt-1 text-sm font-medium text-slate-950">
                  {objectEntity ? `${objectEntity.names.en} (${objectEntity.gender})` : "NA"}
                </p>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-500">
                Logic Identity
              </p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                <p>Pattern: {selectedPattern.id}</p>
                <p>Relation: {relationLabels[relation]}</p>
                <p>Difficulty: {selectedPattern.difficulty}</p>
                <p className={isAmbiguous ? "font-semibold text-rose-600" : "font-semibold text-emerald-600"}>
                  Solver: {isAmbiguous ? "Ambiguous" : "Unique"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                className="justify-start rounded-md border-slate-300"
                onClick={regenerateNames}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Shuffle Entities
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start rounded-md border-slate-300"
                onClick={toggleLogic}
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Regenerate Logic
              </Button>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-500">
                Commit Summary
              </p>
              <div className="mt-2 space-y-1.5 text-sm text-slate-700">
                <div className="flex justify-between gap-3">
                  <span>Question ID</span>
                  <span className="font-medium text-slate-950">Q1</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Pattern</span>
                  <span className="font-medium text-slate-950">
                    {selectedPattern.label}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Languages</span>
                  <span className="font-medium text-slate-950">
                    {commitPayload.availableLangs.map((language) => language.toUpperCase()).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Stored Format</span>
                  <span className="font-medium text-emerald-700">
                    Logic only
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Generated English, Hindi, and Punjabi text will not be stored.
              </p>
            </div>

            {saveError ? (
              <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                {saveError}
              </div>
            ) : null}

            <Button
              type="button"
              disabled={isAmbiguous}
              className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              onClick={handleSave}
            >
              {saved ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saved ? "Committed" : "Commit to Bank"}
            </Button>
          </div>
        </aside>

        <div className="space-y-4 bg-slate-100 p-4">
          <div
            className={`grid gap-4 ${
              previews.length === 1
                ? "grid-cols-1"
                : previews.length === 2
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1 lg:grid-cols-3"
            }`}
          >
            {previews.map(({ language, text }) => (
              <article
                key={language}
                className="flex min-h-56 flex-col rounded-md border border-slate-200 bg-white"
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-950">
                      {languageLabels[language]}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {languageDescriptions[language]}
                    </p>
                  </div>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {(realizationStatus[language] as any)?.supported === true
                      ? "Native"
                      : "Live"}
                  </span>
                </div>
                <textarea
                  lang={language === "pa" ? "pa" : language === "hi" ? "hi" : "en"}
                  value={text}
                  onChange={(event) => updateDraftText(language, event.target.value)}
                  spellCheck={language === "en"}
                  className={`min-h-40 flex-1 resize-y border-0 bg-transparent p-5 font-medium text-slate-950 outline-none ring-0 placeholder:text-slate-400 focus:ring-0 ${getPreviewClass(language)}`}
                />
              </article>
            ))}
          </div>
          <p className="rounded-md border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-500">
            These cards call the same realizer with the same logic object for each active language.
            Punjabi output uses <span className="font-semibold">lang="pa"</span> and increased line-height for Gurmukhi vowel marks.
          </p>
        </div>
      </div>
    </section>
  );
}

export const MultilingualQuestionBuilder = GeneratorHub;
