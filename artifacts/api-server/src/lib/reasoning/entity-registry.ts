export type SupportedReasoningLanguage = "en" | "hi" | "pa";

export type EntityGender = "M" | "F";

export interface Entity {
  id: string;
  gender: EntityGender;
  names: Record<SupportedReasoningLanguage, string>;
}

export type RelationType =
  | "IMMEDIATE_LEFT"
  | "IMMEDIATE_RIGHT"
  | "SECOND_TO_LEFT"
  | "OPPOSITE"
  | "BETWEEN";

export interface ClueLogic {
  subjectId: string;
  relation: RelationType;
  objectId?: string;
  anchorObjectId?: string;
}

type LocalizedRelation = {
  en: string;
  hi: string;
  pa: string;
  usesPostposition: boolean;
};

export function normalizeText(input: string): string {
  return input.normalize("NFC");
}

function entity(
  id: string,
  gender: EntityGender,
  en: string,
  hi: string,
  pa: string,
): Entity {
  return {
    id,
    gender,
    names: {
      en: normalizeText(en),
      hi: normalizeText(hi),
      pa: normalizeText(pa),
    },
  };
}

export const ENTITY_POOL: Entity[] = [
  entity("rahul", "M", "Rahul", "राहुल", "ਰਾਹੁਲ"),
  entity("arjun", "M", "Arjun", "अर्जुन", "ਅਰਜੁਨ"),
  entity("aman", "M", "Aman", "अमन", "ਅਮਨ"),
  entity("vikram", "M", "Vikram", "विक्रम", "ਵਿਕਰਮ"),
  entity("karan", "M", "Karan", "करण", "ਕਰਨ"),
  entity("sandeep", "M", "Sandeep", "संदीप", "ਸੰਦੀਪ"),
  entity("harpreet_m", "M", "Harpreet", "हरप्रीत", "ਹਰਪ੍ਰੀਤ"),
  entity("rohit", "M", "Rohit", "रोहित", "ਰੋਹਿਤ"),
  entity("manav", "M", "Manav", "मानव", "ਮਾਨਵ"),
  entity("dev", "M", "Dev", "देव", "ਦੇਵ"),
  entity("priya", "F", "Priya", "प्रिया", "ਪ੍ਰਿਆ"),
  entity("simran", "F", "Simran", "सिमरन", "ਸਿਮਰਨ"),
  entity("neha", "F", "Neha", "नेहा", "ਨੇਹਾ"),
  entity("kavya", "F", "Kavya", "काव्या", "ਕਾਵਿਆ"),
  entity("ananya", "F", "Ananya", "अनन्या", "ਅਨਨਿਆ"),
  entity("jaspreet", "F", "Jaspreet", "जसप्रीत", "ਜਸਪ੍ਰੀਤ"),
  entity("meera", "F", "Meera", "मीरा", "ਮੀਰਾ"),
  entity("isha", "F", "Isha", "ईशा", "ਈਸ਼ਾ"),
  entity("gurleen", "F", "Gurleen", "गुरलीन", "ਗੁਰਲੀਨ"),
  entity("navjot_f", "F", "Navjot", "नवजोत", "ਨਵਜੋਤ"),
];

const RELATION_PHRASES: Record<RelationType, LocalizedRelation> = {
  IMMEDIATE_LEFT: {
    en: "to the immediate left of",
    hi: "ठीक बाईं ओर",
    pa: "ਬਿਲਕੁਲ ਖੱਬੇ ਪਾਸੇ",
    usesPostposition: true,
  },
  IMMEDIATE_RIGHT: {
    en: "to the immediate right of",
    hi: "ठीक दाईं ओर",
    pa: "ਬਿਲਕੁਲ ਸੱਜੇ ਪਾਸੇ",
    usesPostposition: true,
  },
  SECOND_TO_LEFT: {
    en: "second to the left of",
    hi: "दूसरे बाईं ओर",
    pa: "ਦੂਜੇ ਖੱਬੇ ਪਾਸੇ",
    usesPostposition: true,
  },
  OPPOSITE: {
    en: "opposite",
    hi: "के विपरीत",
    pa: "ਦੇ ਸਾਹਮਣੇ",
    usesPostposition: false,
  },
  BETWEEN: {
    en: "between",
    hi: "के बीच",
    pa: "ਦੇ ਵਿਚਕਾਰ",
    usesPostposition: false,
  },
};

const SIT_VERB: Record<SupportedReasoningLanguage, Record<EntityGender, string>> = {
  en: {
    M: "sits",
    F: "sits",
  },
  hi: {
    M: "बैठा है",
    F: "बैठी है",
  },
  pa: {
    M: "ਬੈਠਾ ਹੈ",
    F: "ਬੈਠੀ ਹੈ",
  },
};

export function getUniqueEntities(count: number): Entity[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error(`Entity count must be a non-negative integer. Received: ${count}`);
  }
  if (count > ENTITY_POOL.length) {
    throw new Error(`Requested ${count} entities, but only ${ENTITY_POOL.length} are available.`);
  }

  const shuffled = [...ENTITY_POOL];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export class ReasoningTextRealizer {
  private readonly entityMap: Map<string, Entity>;

  constructor(entities: Entity[] = ENTITY_POOL) {
    this.entityMap = new Map(entities.map((item) => [item.id, item]));
  }

  generateClue(logic: ClueLogic, lang: SupportedReasoningLanguage): string {
    const subject = this.getEntity(logic.subjectId);
    const relation = RELATION_PHRASES[logic.relation];

    if (logic.relation === "BETWEEN") {
      return this.generateBetweenClue(logic, lang, subject, relation);
    }

    const object = this.getRequiredEntity(logic.objectId, logic.relation);

    if (lang === "en") {
      return normalizeText(`${subject.names.en} ${SIT_VERB.en[subject.gender]} ${relation.en} ${object.names.en}.`);
    }

    const subjectName = subject.names[lang];
    const objectName = object.names[lang];
    const verb = SIT_VERB[lang][subject.gender];

    if (relation.usesPostposition) {
      const postposition = lang === "hi" ? "के" : "ਦੇ";
      return normalizeText(`${subjectName}, ${objectName} ${postposition} ${relation[lang]} ${verb}।`);
    }

    return normalizeText(`${subjectName}, ${objectName} ${relation[lang]} ${verb}।`);
  }

  private generateBetweenClue(
    logic: ClueLogic,
    lang: SupportedReasoningLanguage,
    subject: Entity,
    relation: LocalizedRelation,
  ): string {
    const leftObject = this.getRequiredEntity(logic.objectId, "BETWEEN");
    const rightObject = this.getRequiredEntity(logic.anchorObjectId, "BETWEEN");

    if (lang === "en") {
      return normalizeText(
        `${subject.names.en} ${SIT_VERB.en[subject.gender]} ${relation.en} ${leftObject.names.en} and ${rightObject.names.en}.`,
      );
    }

    const conjunction = lang === "hi" ? "और" : "ਅਤੇ";
    return normalizeText(
      `${subject.names[lang]}, ${leftObject.names[lang]} ${conjunction} ${rightObject.names[lang]} ${relation[lang]} ${SIT_VERB[lang][subject.gender]}।`,
    );
  }

  private getEntity(id: string): Entity {
    const found = this.entityMap.get(id);
    if (!found) {
      throw new Error(`Unknown entity id: ${id}`);
    }
    return found;
  }

  private getRequiredEntity(id: string | undefined, relation: RelationType): Entity {
    if (!id) {
      throw new Error(`Relation ${relation} requires an objectId.`);
    }
    return this.getEntity(id);
  }
}
