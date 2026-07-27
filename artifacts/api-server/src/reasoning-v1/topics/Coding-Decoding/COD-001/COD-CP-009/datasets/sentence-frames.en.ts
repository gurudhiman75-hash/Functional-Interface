import type { SentenceCodeTopologyKind } from "../topology-generator";

export interface EnglishSentenceCodeFrame {
  id: string;
  topologyKind: SentenceCodeTopologyKind;
  rowTemplates: Readonly<Record<string, string>>;
  grammarFamily: "SUBJECT_VERB" | "SUBJECT_VERB_MODIFIER" | "SUBJECT_VERB_OBJECT_MODIFIER" | "LIST";
  status: "REVIEWED";
}

export const ENGLISH_SENTENCE_CODE_FRAMES: readonly EnglishSentenceCodeFrame[] = [
  {
    id: "DIRECT-SUBJECT-VERB",
    topologyKind: "DIRECT_SINGLE_INTERSECTION",
    grammarFamily: "SUBJECT_VERB",
    rowTemplates: {
      r1: "{TARGET} {LEFT_ONLY}",
      r2: "{TARGET} {RIGHT_ONLY}",
    },
    status: "REVIEWED",
  },
  {
    id: "CHAINED-SUBJECT-VERB-MODIFIER",
    topologyKind: "CHAINED_SINGLETON_PROPAGATION",
    grammarFamily: "SUBJECT_VERB_MODIFIER",
    rowTemplates: {
      r1: "{TARGET} {HELPER} {ROW_1_ONLY}",
      r2: "{TARGET} {HELPER} {ROW_2_ONLY}",
      r3: "{ROW_3_ONLY} {HELPER}",
    },
    status: "REVIEWED",
  },
  {
    id: "DIFFERENCE-SUBJECT-VERB-OBJECT-MODIFIER",
    topologyKind: "SET_DIFFERENCE_ELIMINATION",
    grammarFamily: "SUBJECT_VERB_OBJECT_MODIFIER",
    rowTemplates: {
      r1: "{TARGET} {SHARED_A} {SHARED_B} {ROW_1_ONLY}",
      r2: "{TARGET} {SHARED_A} {SHARED_B} {ROW_2_ONLY}",
      r3: "{ROW_3_ONLY} {SHARED_A} {SHARED_B}",
    },
    status: "REVIEWED",
  },
  {
    id: "FORKED-TWO-BRANCH-ELIMINATION",
    topologyKind: "FORKED_EVIDENCE_JOIN",
    grammarFamily: "SUBJECT_VERB_OBJECT_MODIFIER",
    rowTemplates: {
      r1: "{TARGET} {SHARED_A} {SHARED_B} {ROW_1_ONLY}",
      r2: "{ROW_2_ONLY} {SHARED_A}",
      r3: "{TARGET} {SHARED_A} {SHARED_B} {ROW_3_ONLY}",
      r4: "{ROW_4_ONLY} {SHARED_B}",
    },
    status: "REVIEWED",
  },
  {
    id: "GLOBAL-TWO-ITEM-LIST",
    topologyKind: "GLOBAL_BIJECTION_DEDUCTION",
    grammarFamily: "LIST",
    rowTemplates: {
      r1: "{MISSING_ROW_2} {TARGET} {MISSING_ROW_3}",
      r2: "{MISSING_ROW_1} {TARGET} {MISSING_ROW_3}",
      r3: "{MISSING_ROW_1} {TARGET} {MISSING_ROW_2}",
    },
    status: "REVIEWED",
  },
  {
    id: "PARTIAL-SUBJECT-VERB-TWO-MODIFIERS",
    topologyKind: "CONTROLLED_PARTIAL_INFORMATION",
    grammarFamily: "SUBJECT_VERB_MODIFIER",
    rowTemplates: {
      r1: "{TARGET} {TARGET_PARTNER} {MISSING_ROW_2} {MISSING_ROW_3}",
      r2: "{TARGET} {TARGET_PARTNER} {MISSING_ROW_1} {MISSING_ROW_3}",
      r3: "{TARGET} {TARGET_PARTNER} {MISSING_ROW_1} {MISSING_ROW_2}",
    },
    status: "REVIEWED",
  },
  {
    id: "PARTIAL-THREE-WAY-CORE-WITH-TWO-MODIFIERS",
    topologyKind: "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
    grammarFamily: "SUBJECT_VERB_OBJECT_MODIFIER",
    rowTemplates: {
      r1: "{TARGET} {TARGET_PARTNER_A} {TARGET_PARTNER_B} {MISSING_ROW_2} {MISSING_ROW_3}",
      r2: "{TARGET} {TARGET_PARTNER_A} {TARGET_PARTNER_B} {MISSING_ROW_1} {MISSING_ROW_3}",
      r3: "{TARGET} {TARGET_PARTNER_A} {TARGET_PARTNER_B} {MISSING_ROW_1} {MISSING_ROW_2}",
    },
    status: "REVIEWED",
  },
  {
    id: "PHRASE-SUBJECT-VERB-TWO-MODIFIERS",
    topologyKind: "PHRASE_SET_COMPOSITION",
    grammarFamily: "SUBJECT_VERB_MODIFIER",
    rowTemplates: {
      r1: "{PHRASE_A} {PHRASE_B} {MISSING_ROW_2} {MISSING_ROW_3}",
      r2: "{PHRASE_A} {PHRASE_B} {MISSING_ROW_1} {MISSING_ROW_3}",
      r3: "{PHRASE_A} {PHRASE_B} {MISSING_ROW_1} {MISSING_ROW_2}",
    },
    status: "REVIEWED",
  },
  {
    id: "MISSING-SUBJECT-VERB-MODIFIER",
    topologyKind: "MISSING_MEMBER_COMPLETION",
    grammarFamily: "SUBJECT_VERB_MODIFIER",
    rowTemplates: {
      r1: "{TARGET} {HELPER} {ROW_1_ONLY}",
      r2: "{TARGET} {HELPER} {ROW_2_ONLY}",
      r3: "{ROW_3_ONLY} {HELPER}",
    },
    status: "REVIEWED",
  },
] as const;

const FRAME_BY_KIND = new Map(ENGLISH_SENTENCE_CODE_FRAMES.map((frame) => [frame.topologyKind, frame]));

export function getEnglishSentenceCodeFrame(kind: SentenceCodeTopologyKind): EnglishSentenceCodeFrame {
  const found = FRAME_BY_KIND.get(kind);
  if (!found) throw new Error(`No English sentence frame for topology '${kind}'`);
  return found;
}

export function renderEnglishSentenceTemplate(
  template: string,
  roleDisplays: Readonly<Record<string, string>>,
): string {
  const rendered = template.replace(/\{([A-Z0-9_]+)\}/g, (_, role: string) => {
    const display = roleDisplays[role];
    if (!display) throw new Error(`No English lexeme supplied for role '${role}'`);
    return display;
  });
  if (/[{}]/.test(rendered)) throw new Error(`Unresolved English sentence template '${rendered}'`);
  return rendered.replace(/\s+/g, " ").replace(/\s+,/g, ",").trim();
}
