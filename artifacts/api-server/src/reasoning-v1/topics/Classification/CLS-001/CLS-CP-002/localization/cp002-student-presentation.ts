import {
  localizedClassLabel,
  localizedEntityLabel,
} from "../../CLS-CP-001/localization/cp001-language-pack";
import {
  CLS_CP002_FACTS,
} from "../relation-registry";
import type { ClsCp002Pair } from "../types";
import {
  canonicalizeClsCp002Pair,
  localizeClsCp002Pair,
  localizedClsCp002RelationLabel,
  localizedClsCp002RelationRule,
  type ClsCp002TranslatedLocale,
} from "./cp002-language-pack";

type LocalizedPair = readonly [string, string];

type ExactPairOverride = {
  readonly left: string;
  readonly right: string;
  readonly hi: LocalizedPair;
  readonly pa: LocalizedPair;
};

const EXACT_PAIR_OVERRIDES: readonly ExactPairOverride[] = [
  {
    left: "Cool",
    right: "Cold",
    hi: ["ठंडा", "बहुत ठंडा"],
    pa: ["ਠੰਢਾ", "ਬਹੁਤ ਠੰਢਾ"],
  },
  {
    left: "Ice",
    right: "Cold",
    hi: ["बर्फ़", "ठंडी"],
    pa: ["ਬਰਫ਼", "ਠੰਢੀ"],
  },
  {
    left: "Lion",
    right: "Cub",
    hi: ["शेर", "शावक"],
    pa: ["ਸ਼ੇਰ", "ਸ਼ਾਵਕ"],
  },
  {
    left: "Court",
    right: "Adjudication",
    hi: ["न्यायालय", "न्याय करना"],
    pa: ["ਅਦਾਲਤ", "ਨਿਆਂ ਕਰਨਾ"],
  },
  {
    left: "Telephone",
    right: "Ring",
    hi: ["टेलीफोन", "ट्रिन-ट्रिन"],
    pa: ["ਟੈਲੀਫੋਨ", "ਟ੍ਰਿਨ-ਟ੍ਰਿਨ"],
  },
  {
    left: "Alarm",
    right: "Buzz",
    hi: ["अलार्म", "बीप"],
    pa: ["ਅਲਾਰਮ", "ਬੀਪ"],
  },
  {
    left: "Gun",
    right: "Bang",
    hi: ["बंदूक", "धाँय"],
    pa: ["ਬੰਦੂਕ", "ਧਾਂ"],
  },
  {
    left: "Firecracker",
    right: "Bang",
    hi: ["पटाखा", "धमाका"],
    pa: ["ਪਟਾਕਾ", "ਧਮਾਕਾ"],
  },
  {
    left: "Engine",
    right: "Roar",
    hi: ["इंजन", "घरघराहट"],
    pa: ["ਇੰਜਣ", "ਘਰਘਰਾਹਟ"],
  },
];

const TERM_OVERRIDES: Readonly<Record<string, { readonly hi: string; readonly pa: string }>> = {
  Wine: { hi: "वाइन", pa: "ਵਾਈਨ" },
  Jar: { hi: "जार", pa: "ਜਾਰ" },
  Crown: { hi: "पेड़ का ऊपरी भाग", pa: "ਦਰੱਖਤ ਦਾ ਉੱਪਰਲਾ ਹਿੱਸਾ" },
  Sapwood: { hi: "पेड़ की नई लकड़ी", pa: "ਦਰੱਖਤ ਦੀ ਨਵੀਂ ਲੱਕੜ" },
};

const CLASS_LABEL_OVERRIDES: Readonly<Record<string, { readonly hi: string; readonly pa: string }>> = {
  CLS_TROPICAL_FRUITS: { hi: "गर्म इलाकों के फल", pa: "ਗਰਮ ਇਲਾਕਿਆਂ ਦੇ ਫਲ" },
  CLS_MAMMALS: { hi: "दूध पिलाने वाले जानवर", pa: "ਦੁੱਧ ਪਿਲਾਉਣ ਵਾਲੇ ਜਾਨਵਰ" },
  CLS_AQUATIC_ANIMALS: { hi: "पानी में रहने वाले जानवर", pa: "ਪਾਣੀ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਜਾਨਵਰ" },
  CLS_FLYING_ANIMALS: { hi: "उड़ने वाले जानवर", pa: "ਉੱਡਣ ਵਾਲੇ ਜਾਨਵਰ" },
  CLS_SPORTS_EQUIPMENT: { hi: "खेल का सामान", pa: "ਖੇਡਾਂ ਦਾ ਸਾਮਾਨ" },
};

const FACT_BY_ID = new Map(CLS_CP002_FACTS.map((fact) => [fact.factId, fact]));

function localePair(
  override: ExactPairOverride,
  locale: ClsCp002TranslatedLocale,
): LocalizedPair {
  return locale === "hi-IN" ? override.hi : override.pa;
}

function exactOverrideForCanonical(
  pair: ClsCp002Pair,
  locale: ClsCp002TranslatedLocale,
): ClsCp002Pair | null {
  for (const override of EXACT_PAIR_OVERRIDES) {
    const localized = localePair(override, locale);
    if (pair.left === override.left && pair.right === override.right) {
      return { left: localized[0], right: localized[1] };
    }
    if (pair.left === override.right && pair.right === override.left) {
      return { left: localized[1], right: localized[0] };
    }
  }
  return null;
}

function overrideTerm(
  canonical: string,
  rawLocalized: string,
  locale: ClsCp002TranslatedLocale,
): string {
  const override = TERM_OVERRIDES[canonical];
  if (!override) return rawLocalized;
  return locale === "hi-IN" ? override.hi : override.pa;
}

function unpolishTerm(
  displayed: string,
  locale: ClsCp002TranslatedLocale,
): string {
  for (const [canonical, override] of Object.entries(TERM_OVERRIDES)) {
    const student = locale === "hi-IN" ? override.hi : override.pa;
    if (displayed !== student) continue;

    try {
      return localizedEntityLabel(canonical, locale);
    } catch {
      // Imported and supplemental facts are resolved below.
    }

    for (const fact of CLS_CP002_FACTS) {
      if (fact.left !== canonical && fact.right !== canonical) continue;
      try {
        const raw = localizeClsCp002Pair(
          { left: fact.left, right: fact.right },
          [fact.factId],
          locale,
        );
        return fact.left === canonical ? raw.left : raw.right;
      } catch {
        continue;
      }
    }
  }
  return displayed;
}

export function localizeClsCp002StudentPair(
  pair: ClsCp002Pair,
  sourceFactIds: readonly string[],
  locale: ClsCp002TranslatedLocale,
): ClsCp002Pair {
  const exact = exactOverrideForCanonical(pair, locale);
  if (exact) return exact;

  const raw = localizeClsCp002Pair(pair, sourceFactIds, locale);
  return {
    left: overrideTerm(pair.left, raw.left, locale),
    right: overrideTerm(pair.right, raw.right, locale),
  };
}

export function canonicalizeClsCp002StudentPair(
  displayedPair: ClsCp002Pair,
  sourceFactIds: readonly string[],
  locale: ClsCp002TranslatedLocale,
): ClsCp002Pair {
  for (const factId of sourceFactIds) {
    const fact = FACT_BY_ID.get(factId);
    if (!fact) continue;
    for (const candidate of [
      { left: fact.left, right: fact.right },
      { left: fact.right, right: fact.left },
    ]) {
      try {
        const displayedCandidate = localizeClsCp002StudentPair(candidate, sourceFactIds, locale);
        if (
          displayedCandidate.left === displayedPair.left
          && displayedCandidate.right === displayedPair.right
        ) {
          return candidate;
        }
      } catch {
        continue;
      }
    }
  }

  return canonicalizeClsCp002Pair(
    {
      left: unpolishTerm(displayedPair.left, locale),
      right: unpolishTerm(displayedPair.right, locale),
    },
    sourceFactIds,
    locale,
  );
}

export function localizedClsCp002StudentClassLabel(
  classId: string,
  locale: ClsCp002TranslatedLocale,
): string {
  const override = CLASS_LABEL_OVERRIDES[classId];
  if (override) return locale === "hi-IN" ? override.hi : override.pa;
  return localizedClassLabel(classId, locale);
}

export function localizedClsCp002StudentRelationLabel(
  relationId: string,
  locale: ClsCp002TranslatedLocale,
): string {
  if (relationId.startsWith("PAIR_CLASS_")) {
    const classId = relationId.slice("PAIR_CLASS_".length);
    const classLabel = localizedClsCp002StudentClassLabel(classId, locale);
    return locale === "hi-IN"
      ? `${classLabel} वाले दो शब्द`
      : `${classLabel} ਵਾਲੇ ਦੋ ਸ਼ਬਦ`;
  }
  return localizedClsCp002RelationLabel(relationId, locale);
}

export function localizedClsCp002StudentRelationRule(
  relationId: string,
  locale: ClsCp002TranslatedLocale,
): string {
  if (relationId.startsWith("PAIR_CLASS_")) {
    const classId = relationId.slice("PAIR_CLASS_".length);
    const classLabel = localizedClsCp002StudentClassLabel(classId, locale);
    return locale === "hi-IN"
      ? `जोड़ी के दोनों शब्द ${classLabel} हैं।`
      : `ਜੋੜੀ ਦੇ ਦੋਵੇਂ ਸ਼ਬਦ ${classLabel} ਹਨ।`;
  }

  const simpleRules: Readonly<Record<string, { readonly hi: string; readonly pa: string }>> = {
    SEM_MATERIAL_PRODUCT: {
      hi: "दूसरी चीज़ पहली सामग्री से बनती है।",
      pa: "ਦੂਜੀ ਚੀਜ਼ ਪਹਿਲੀ ਸਮੱਗਰੀ ਤੋਂ ਬਣਦੀ ਹੈ।",
    },
    SEM_PRODUCT_MATERIAL: {
      hi: "दूसरा शब्द वह सामग्री है जिससे पहली चीज़ बनती है।",
      pa: "ਦੂਜਾ ਸ਼ਬਦ ਉਹ ਸਮੱਗਰੀ ਹੈ ਜਿਸ ਤੋਂ ਪਹਿਲੀ ਚੀਜ਼ ਬਣਦੀ ਹੈ।",
    },
    SEM_PLACE_PURPOSE: {
      hi: "दूसरा शब्द बताता है कि पहली जगह का मुख्य काम क्या है।",
      pa: "ਦੂਜਾ ਸ਼ਬਦ ਦੱਸਦਾ ਹੈ ਕਿ ਪਹਿਲੇ ਸਥਾਨ ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ।",
    },
    SEM_KIN_ONE_GENERATION_DOWN: {
      hi: "दूसरा रिश्ता पहले से एक पीढ़ी नीचे है।",
      pa: "ਦੂਜਾ ਰਿਸ਼ਤਾ ਪਹਿਲੇ ਨਾਲੋਂ ਇੱਕ ਪੀੜ੍ਹੀ ਹੇਠਾਂ ਹੈ।",
    },
  };
  const simple = simpleRules[relationId];
  if (simple) return locale === "hi-IN" ? simple.hi : simple.pa;
  return localizedClsCp002RelationRule(relationId, locale);
}