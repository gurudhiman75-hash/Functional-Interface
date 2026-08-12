import type { FamilyGraph } from "../../foundation/types";
import {
  broadRelation,
  evaluateCount,
  evaluatePredicate,
  relationInModel,
  type BlrCp005FamilyTreeDiagram,
  type BlrCp005Model,
  type BlrCp005Option,
  type BlrCp005Predicate,
  type BlrCp005RelationAnswerId,
  type GeneratedBlrCp005Question,
} from "../cp005-model";
import { generateBlrCp005FrozenBank } from "../cp005-bank";
import {
  BLR_CP005_LOCALIZATION_VERSION,
  BLR_CP005_MULTILINGUAL_RUNTIME_VERSION,
  localeText,
  localizedCannotDetermine,
  localizedCoreConcept,
  localizedCountDescription,
  localizedLineageSide,
  localizedRelationLabel,
  localizedShortcut,
  localizedStem,
  localizedTruthStatus,
  type BlrCp005TranslatedLocale,
} from "./cp005-language-pack";

export const BLR_CP005_HI_PA_LOCALISATION_REVIEW_CANDIDATE =
  "BLR_CP005_HI_PA_LOCALISATION_REVIEW_CANDIDATE" as const;
export const BLR_CP005_HUMAN_REVIEW_BLOCKER = "HINDI_PUNJABI_HUMAN_REVIEW_PENDING" as const;

export type GeneratedBlrCp005LocalizedQuestion = Omit<
  GeneratedBlrCp005Question,
  "locale" | "itemId" | "sharedPrompt" | "stem" | "options" | "explanation" | "metadata"
> & {
  locale: BlrCp005TranslatedLocale;
  canonicalLocale: "en-IN";
  canonicalItemId: string;
  itemId: string;
  questionLanguageId: string;
  sharedPrompt: string;
  stem: string;
  options: readonly BlrCp005Option[];
  explanation: GeneratedBlrCp005Question["explanation"];
  metadata: GeneratedBlrCp005Question["metadata"] & {
    localizationRuntimeVersion: typeof BLR_CP005_MULTILINGUAL_RUNTIME_VERSION;
    localizationVersion: typeof BLR_CP005_LOCALIZATION_VERSION;
    localizationAuthority: typeof BLR_CP005_HI_PA_LOCALISATION_REVIEW_CANDIDATE;
    localizationStatus: "EXECUTABLE_REVIEW_REQUIRED";
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
    canonicalItemId: string;
    canonicalSemanticFingerprint: string;
    semanticParity: "EXECUTABLE_PROVED";
    learnerTextLocalized: true;
    humanLanguageReviewRequired: true;
    activeEditorialBlockers: readonly [typeof BLR_CP005_HUMAN_REVIEW_BLOCKER];
    productDeliveryUnlocked: false;
    productionStagingApproved: false;
  };
};

type Locale = BlrCp005TranslatedLocale;

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

function namesFor(record: GeneratedBlrCp005Question): Map<string, string> {
  const names = new Map<string, string>();
  for (const tree of record.explanation.familyTrees) {
    for (const node of tree.nodes) names.set(node.id, node.label);
  }
  return names;
}

function nameGetter(record: GeneratedBlrCp005Question): (id: string) => string {
  const names = namesFor(record);
  return (id) => names.get(id) ?? id;
}

function localizedSharedPrompt(record: GeneratedBlrCp005Question, locale: Locale): string {
  const name = nameGetter(record);
  switch (record.scenarioId) {
    case "BLR-CP005-SCN-UNKNOWN-ONLY-CHILD-GENDER":
      return localeText(locale, `${name("F")} और ${name("M")} विवाहित हैं। ${name("C")} उनकी एकमात्र संतान है।`, `${name("F")} ਅਤੇ ${name("M")} ਵਿਆਹੇ ਹੋਏ ਹਨ। ${name("C")} ਉਹਨਾਂ ਦੀ ਇਕੱਲੀ ਸੰਤਾਨ ਹੈ।`);
    case "BLR-CP005-SCN-UNKNOWN-PARENT-SIDE":
      return localeText(locale, `${name("P")} ${name("T")} के माता-पिता में से एक हैं। ${name("U")} ${name("P")} का भाई है।`, `${name("P")} ${name("T")} ਦੇ ਮਾਤਾ-ਪਿਤਾ ਵਿੱਚੋਂ ਇੱਕ ਹੈ। ${name("U")} ${name("P")} ਦਾ ਭਰਾ ਹੈ।`);
    case "BLR-CP005-SCN-OLD-WOMAN-POINTER":
      return localeText(locale, `${name("O")} की ओर इशारा करते हुए ${name("A")} ने कहा, “उसकी बेटी मेरी बेटी की मौसी/बुआ है।”`, `${name("O")} ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦਿਆਂ ${name("A")} ਨੇ ਕਿਹਾ, “ਉਸਦੀ ਧੀ ਮੇਰੀ ਧੀ ਦੀ ਮਾਸੀ/ਭੂਆ ਹੈ।”`);
    case "BLR-CP005-SCN-THREE-WAY-MALE-RELATIVE":
      return localeText(locale, `${name("S")} ${name("R")} का भाई, ${name("R")} के भाई/बहन का पुत्र, या ${name("R")} के जीवनसाथी का पिता हो सकता है।`, `${name("S")} ${name("R")} ਦਾ ਭਰਾ, ${name("R")} ਦੇ ਭਰਾ/ਭੈਣ ਦਾ ਪੁੱਤਰ, ਜਾਂ ${name("R")} ਦੇ ਜੀਵਨਸਾਥੀ ਦਾ ਪਿਤਾ ਹੋ ਸਕਦਾ ਹੈ।`);
    case "BLR-CP005-SCN-BROTHER-IN-LAW-ROUTE-OPEN":
      return localeText(locale, `${name("S")} या तो ${name("R")} की बहन का पति है या ${name("R")} के पति का भाई है।`, `${name("S")} ਜਾਂ ਤਾਂ ${name("R")} ਦੀ ਭੈਣ ਦਾ ਪਤੀ ਹੈ ਜਾਂ ${name("R")} ਦੇ ਪਤੀ ਦਾ ਭਰਾ ਹੈ।`);
    case "BLR-CP005-SCN-SPOUSE-ONE-OF-TWO":
    case "BLR-CP005-SCN-SPOUSE-ONE-OF-THREE": {
      const ids = record.modelSpace.variables.find((entry) => entry.variableId === "husbandId")?.values ?? [];
      const people = ids.map(name);
      const joined = locale === "hi-IN"
        ? people.length === 2 ? `${people[0]} या ${people[1]}` : `${people.slice(0, -1).join(", ")} या ${people.at(-1)}`
        : people.length === 2 ? `${people[0]} ਜਾਂ ${people[1]}` : `${people.slice(0, -1).join(", ")} ਜਾਂ ${people.at(-1)}`;
      return localeText(locale, `${name("W")} का विवाह ${joined} में से किसी एक से हुआ है।`, `${name("W")} ਦਾ ਵਿਆਹ ${joined} ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਨਾਲ ਹੋਇਆ ਹੈ।`);
    }
    case "BLR-CP005-SCN-FIXED-SPOUSE-OPEN-CHILD-GENDER":
      return localeText(locale, `${name("H")} ${name("W")} का पति है। उनकी एक संतान ${name("C")} है। ${name("O")}, ${name("P")}, ${name("B")} अन्य नामित पुरुष रिश्तेदार हैं; इनमें से कोई भी ${name("W")} का जीवनसाथी नहीं है।`, `${name("H")} ${name("W")} ਦਾ ਪਤੀ ਹੈ। ਉਹਨਾਂ ਦੀ ਇੱਕ ਸੰਤਾਨ ${name("C")} ਹੈ। ${name("O")}, ${name("P")}, ${name("B")} ਹੋਰ ਨਾਮਿਤ ਪੁਰਸ਼ ਰਿਸ਼ਤੇਦਾਰ ਹਨ; ਇਹਨਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ${name("W")} ਦਾ ਜੀਵਨਸਾਥੀ ਨਹੀਂ ਹੈ।`);
    case "BLR-CP005-SCN-BOUNDED-CHILD-COUNT":
      return localeText(locale, `${name("F")} और ${name("M")} विवाहित हैं और उनकी एक, दो या तीन संतानें हैं। ${name("C1")} उनमें से एक है।`, `${name("F")} ਅਤੇ ${name("M")} ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਹਨਾਂ ਦੀ ਇੱਕ, ਦੋ ਜਾਂ ਤਿੰਨ ਸੰਤਾਨਾਂ ਹਨ। ${name("C1")} ਉਹਨਾਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ।`);
    case "BLR-CP005-SCN-FIXED-TOTAL-OPEN-GENDER":
      return localeText(locale, `${name("F")} और ${name("M")} विवाहित हैं। ${name("D")} उनकी बेटी है और ${name("C")} उनकी दूसरी संतान है। इस प्रश्न में केवल ये चार नामित सदस्य हैं।`, `${name("F")} ਅਤੇ ${name("M")} ਵਿਆਹੇ ਹੋਏ ਹਨ। ${name("D")} ਉਹਨਾਂ ਦੀ ਧੀ ਹੈ ਅਤੇ ${name("C")} ਉਹਨਾਂ ਦੀ ਦੂਜੀ ਸੰਤਾਨ ਹੈ। ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਕੇਵਲ ਇਹ ਚਾਰ ਨਾਮਿਤ ਮੈਂਬਰ ਹਨ।`);
    default:
      throw new Error(`CP-005 localization: unsupported scenario ${record.scenarioId}.`);
  }
}

function localizedGender(value: string, locale: Locale): string {
  return value === "MALE"
    ? localeText(locale, "पुरुष", "ਪੁਰਸ਼")
    : localeText(locale, "महिला", "ਮਹਿਲਾ");
}

function assignmentSummary(record: GeneratedBlrCp005Question, assignment: Readonly<Record<string, string>>, locale: Locale): string {
  const name = nameGetter(record);
  return Object.entries(assignment).map(([key, value]) => {
    if (key === "childGender" || key === "secondChildGender") return localeText(locale, `खुली संतान ${localizedGender(value, locale)} है`, `ਖੁੱਲੀ ਸੰਤਾਨ ${localizedGender(value, locale)} ਹੈ`);
    if (key === "parentGender") return localeText(locale, `माता-पिता वाला व्यक्ति ${localizedGender(value, locale)} है`, `ਮਾਤਾ-ਪਿਤਾ ਵਾਲਾ ਵਿਅਕਤੀ ${localizedGender(value, locale)} ਹੈ`);
    if (key === "auntRoute") return value === "SPEAKER_SISTER"
      ? localeText(locale, "मौसी/बुआ वक्ता की बहन है", "ਮਾਸੀ/ਭੂਆ ਬੋਲਣ ਵਾਲੇ ਦੀ ਭੈਣ ਹੈ")
      : localeText(locale, "मौसी/बुआ पति की बहन है", "ਮਾਸੀ/ਭੂਆ ਪਤੀ ਦੀ ਭੈਣ ਹੈ");
    if (key === "role") return localeText(locale, `पुरुष रिश्तेदार ${localizedRelationLabel(value, locale)} है`, `ਪੁਰਸ਼ ਰਿਸ਼ਤੇਦਾਰ ${localizedRelationLabel(value, locale)} ਹੈ`);
    if (key === "affinalRoute") return value === "SISTERS_HUSBAND"
      ? localeText(locale, "रास्ता बहन के पति से है", "ਰਸਤਾ ਭੈਣ ਦੇ ਪਤੀ ਰਾਹੀਂ ਹੈ")
      : localeText(locale, "रास्ता पति के भाई से है", "ਰਸਤਾ ਪਤੀ ਦੇ ਭਰਾ ਰਾਹੀਂ ਹੈ");
    if (key === "husbandId") return localeText(locale, `${name(value)} पति है`, `${name(value)} ਪਤੀ ਹੈ`);
    if (key === "childCount") return localeText(locale, `दंपति की संतानों की संख्या ${value} है`, `ਜੋੜੇ ਦੀਆਂ ਸੰਤਾਨਾਂ ਦੀ ਗਿਣਤੀ ${value} ਹੈ`);
    return localeText(locale, `खुला मान ${value}`, `ਖੁੱਲਾ ਮੁੱਲ ${value}`);
  }).join(localeText(locale, "; ", "; "));
}

function graphFromTree(tree: BlrCp005FamilyTreeDiagram): FamilyGraph {
  return {
    persons: tree.nodes.map((node) => ({
      personId: node.id,
      name: node.label,
      gender: node.gender === "male" ? "MALE" : node.gender === "female" ? "FEMALE" : "UNKNOWN",
    })),
    spouseEdges: tree.edges.filter((edge) => edge.type === "marriage").map((edge) => ({ personAId: edge.sourceId, personBId: edge.targetId })),
    parentEdges: tree.edges.filter((edge) => edge.type === "parent-child").map((edge) => ({ parentId: edge.sourceId, childId: edge.targetId })),
    siblingEdges: tree.edges.filter((edge) => edge.type === "sibling").map((edge) => ({ personAId: edge.sourceId, personBId: edge.targetId })),
  };
}

function modelsFor(record: GeneratedBlrCp005Question): BlrCp005Model[] {
  return record.explanation.familyTrees.map((tree, index) => ({
    modelId: `LOCALIZED-AUDIT-${index + 1}`,
    assignment: record.modelSpace.assignments[index] ?? {},
    graph: graphFromTree(tree),
  }));
}

function relationMatches(exact: string, target: BlrCp005RelationAnswerId): boolean {
  return exact === target || broadRelation(exact as never) === target;
}

function renderPredicate(record: GeneratedBlrCp005Question, predicate: BlrCp005Predicate, locale: Locale): string {
  const name = nameGetter(record);
  if (predicate.kind === "RELATION") {
    const relation = localizedRelationLabel(predicate.relationId, locale);
    return localeText(locale, `${name(predicate.subjectId)} ${name(predicate.referenceId)} का ${relation} है।`, `${name(predicate.subjectId)} ${name(predicate.referenceId)} ਦਾ ${relation} ਹੈ।`);
  }
  if (predicate.kind === "SIDE_RELATION") {
    const relation = localizedRelationLabel(predicate.relationId, locale);
    const side = localizedLineageSide(predicate.lineageSide, locale);
    return localeText(locale, `${name(predicate.subjectId)} ${name(predicate.referenceId)} का ${side} ${relation} है।`, `${name(predicate.subjectId)} ${name(predicate.referenceId)} ਦਾ ${side} ${relation} ਹੈ।`);
  }
  if (predicate.kind === "GENDER") {
    return localeText(locale, `${name(predicate.personId)} ${localizedGender(predicate.gender, locale)} है।`, `${name(predicate.personId)} ${localizedGender(predicate.gender, locale)} ਹੈ।`);
  }
  const count = localizedCountDescription(predicate.countSpec, locale, name);
  return localeText(locale, `${count} ${predicate.value} है।`, `${count} ${predicate.value} ਹੈ।`);
}

function localizedOptionText(record: GeneratedBlrCp005Question, option: BlrCp005Option, locale: Locale): string {
  const key = option.semanticKey;
  const name = nameGetter(record);
  if (key === "INDETERMINATE") return localizedCannotDetermine(locale);
  if (key.startsWith("NUMBER:")) return key.slice("NUMBER:".length);
  if (key.startsWith("RELATION:")) return localizedRelationLabel(key.slice("RELATION:".length), locale);
  if (key.startsWith("RELATION_SET:")) {
    const labels = key.slice("RELATION_SET:".length).split(":").map((id) => localizedRelationLabel(id, locale));
    return labels.join(localeText(locale, " या ", " ਜਾਂ "));
  }
  if (key.startsWith("PERSON:")) return name(key.slice("PERSON:".length));
  if (key.startsWith("PERSON_SET:")) {
    return key.slice("PERSON_SET:".length).split(":").map(name).join(localeText(locale, " या ", " ਜਾਂ "));
  }
  if (key.startsWith("CLAIM:")) {
    if (record.querySpec.kind !== "CLAIM_STATUS") throw new Error(`${record.itemId}: CLAIM option outside claim query.`);
    const claimId = key.slice("CLAIM:".length);
    const claim = record.querySpec.claims.find((entry) => entry.claimId === claimId);
    if (!claim) throw new Error(`${record.itemId}: missing claim ${claimId}.`);
    return renderPredicate(record, claim.predicate, locale);
  }
  throw new Error(`${record.itemId}: unsupported option semantic key ${key}.`);
}

function localizedModelAudit(record: GeneratedBlrCp005Question, locale: Locale): readonly string[] {
  const query = record.querySpec;
  const models = modelsFor(record);
  const name = nameGetter(record);
  const lines: string[] = [];
  if (query.kind === "INVARIANT_RELATION" || query.kind === "RELATION_UNCERTAINTY") {
    for (const [index, model] of models.entries()) {
      const exact = relationInModel(model, query.subjectId, query.referenceId);
      lines.push(localeText(
        locale,
        `मॉडल ${index + 1} (${assignmentSummary(record, model.assignment, locale)}): ${name(query.subjectId)}, ${name(query.referenceId)} का ${localizedRelationLabel(exact, locale)} है।`,
        `ਮਾਡਲ ${index + 1} (${assignmentSummary(record, model.assignment, locale)}): ${name(query.subjectId)}, ${name(query.referenceId)} ਦਾ ${localizedRelationLabel(exact, locale)} ਹੈ।`,
      ));
    }
    if (record.answer.kind === "RELATION") {
      lines.push(localeText(locale, `सभी मॉडलों में सुरक्षित साझा संबंध: ${localizedRelationLabel(record.answer.relationId, locale)}।`, `ਸਾਰੇ ਮਾਡਲਾਂ ਵਿੱਚ ਕਾਇਮ ਸਾਂਝਾ ਰਿਸ਼ਤਾ: ${localizedRelationLabel(record.answer.relationId, locale)}।`));
    } else if (record.answer.kind === "RELATION_SET") {
      const set = record.answer.relationIds.map((id) => localizedRelationLabel(id, locale)).join(localeText(locale, " या ", " ਜਾਂ "));
      lines.push(localeText(locale, `पूरा संभावित संबंध-समूह: ${set}। दोनों परिणाम बनाए रखने होंगे।`, `ਪੂਰਾ ਸੰਭਵ ਰਿਸ਼ਤਾ-ਸਮੂਹ: ${set}। ਦੋਵੇਂ ਨਤੀਜੇ ਕਾਇਮ ਰੱਖਣੇ ਹੋਣਗੇ।`));
    } else {
      const values = record.answer.survivingValues.map((value) => localizedRelationLabel(String(value), locale)).join(", ");
      lines.push(localeText(locale, `कई अलग संबंध संभव हैं: ${values}। इसलिए सटीक संबंध निर्धारित नहीं होता।`, `ਕਈ ਵੱਖਰੇ ਰਿਸ਼ਤੇ ਸੰਭਵ ਹਨ: ${values}। ਇਸ ਲਈ ਸਟੀਕ ਰਿਸ਼ਤਾ ਨਿਰਧਾਰਤ ਨਹੀਂ ਹੁੰਦਾ।`));
    }
    return lines;
  }

  if (query.kind === "CLAIM_STATUS") {
    for (const [index, model] of models.entries()) {
      const trueClaims = query.claims.filter((claim) => evaluatePredicate(model, claim.predicate)).map((claim) => renderPredicate(record, claim.predicate, locale));
      lines.push(localeText(locale, `मॉडल ${index + 1} (${assignmentSummary(record, model.assignment, locale)}): सत्य कथन — ${trueClaims.join(" ") || "कोई विकल्प सत्य नहीं।"}`, `ਮਾਡਲ ${index + 1} (${assignmentSummary(record, model.assignment, locale)}): ਸੱਚੇ ਕਥਨ — ${trueClaims.join(" ") || "ਕੋਈ ਵਿਕਲਪ ਸੱਚ ਨਹੀਂ।"}`));
    }
    const statusParts = query.claims.map((claim) => {
      const option = record.options.find((entry) => entry.semanticKey === `CLAIM:${claim.claimId}`);
      return `${renderPredicate(record, claim.predicate, locale)} ${localizedTruthStatus(option?.modelStatus ?? "IMPOSSIBLE", locale)}`;
    });
    lines.push(localeText(locale, `सभी मॉडलों के बाद स्थिति: ${statusParts.join(" | ")}`, `ਸਾਰੇ ਮਾਡਲਾਂ ਤੋਂ ਬਾਅਦ ਸਥਿਤੀ: ${statusParts.join(" | ")}`));
    return lines;
  }

  if (query.kind === "PERSON_STATUS" || query.kind === "PERSON_UNCERTAINTY") {
    for (const [index, model] of models.entries()) {
      const matches = [...new Set(query.candidatePersonIds)].filter((id) => {
        try { return relationMatches(relationInModel(model, id, query.referenceId), query.relationId); } catch { return false; }
      }).map(name);
      const rendered = matches.length ? matches.join(localeText(locale, " या ", " ਜਾਂ ")) : localeText(locale, "कोई नहीं", "ਕੋਈ ਨਹੀਂ");
      lines.push(localeText(locale, `मॉडल ${index + 1} (${assignmentSummary(record, model.assignment, locale)}): भूमिका से मेल खाने वाले उम्मीदवार — ${rendered}।`, `ਮਾਡਲ ${index + 1} (${assignmentSummary(record, model.assignment, locale)}): ਭੂਮਿਕਾ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਉਮੀਦਵਾਰ — ${rendered}।`));
    }
    if (query.kind === "PERSON_STATUS") {
      const status = [...new Set(query.candidatePersonIds)].map((id) => {
        const option = record.options.find((entry) => entry.semanticKey === `PERSON:${id}`);
        return `${name(id)} = ${localizedTruthStatus(option?.modelStatus ?? "IMPOSSIBLE", locale)}`;
      }).join(" | ");
      lines.push(localeText(locale, `उम्मीदवार स्थिति: ${status}।`, `ਉਮੀਦਵਾਰ ਸਥਿਤੀ: ${status}।`));
    } else if (record.answer.kind === "PERSON_SET") {
      const set = record.answer.personIds.map(name).join(localeText(locale, " या ", " ਜਾਂ "));
      lines.push(localeText(locale, `पूरा बचा हुआ पहचान-समूह: ${set}।`, `ਪੂਰਾ ਬਚਿਆ ਪਛਾਣ-ਸਮੂਹ: ${set}।`));
    } else {
      const set = record.answer.kind === "INDETERMINATE" ? record.answer.survivingValues.map((id) => name(String(id))).join(", ") : "";
      lines.push(localeText(locale, `कम-से-कम तीन नामित उम्मीदवार संभव हैं: ${set}।`, `ਘੱਟੋ-ਘੱਟ ਤਿੰਨ ਨਾਮਿਤ ਉਮੀਦਵਾਰ ਸੰਭਵ ਹਨ: ${set}।`));
    }
    return lines;
  }

  const counts = models.map((model) => evaluateCount(model, query.countSpec));
  for (const [index, model] of models.entries()) {
    lines.push(localeText(locale, `मॉडल ${index + 1} (${assignmentSummary(record, model.assignment, locale)}): मांगी गई संख्या = ${counts[index]}।`, `ਮਾਡਲ ${index + 1} (${assignmentSummary(record, model.assignment, locale)}): ਮੰਗੀ ਗਿਣਤੀ = ${counts[index]}।`));
  }
  const attainable = [...new Set(counts)].sort((a, b) => a - b).join(", ");
  lines.push(localeText(locale, `संभव संख्या-समूह: {${attainable}}।`, `ਸੰਭਵ ਗਿਣਤੀ-ਸਮੂਹ: {${attainable}}।`));
  if (query.kind === "COUNT_STATUS") {
    const status = query.candidateValues.map((value) => `${value} = ${localizedTruthStatus(counts.includes(value) ? "POSSIBLE" : "IMPOSSIBLE", locale)}`).join(" | ");
    lines.push(localeText(locale, `विकल्प स्थिति: ${status}।`, `ਵਿਕਲਪ ਸਥਿਤੀ: ${status}।`));
  }
  return lines;
}

function localizedConclusion(record: GeneratedBlrCp005Question, locale: Locale, correctText: string): string {
  const count = record.modelSpace.modelCount;
  switch (record.solveAuthority) {
    case "RESOLVE_INVARIANT_RELATION": return localeText(locale, `${correctText} सभी ${count} वैध परिवार-मॉडलों में बना रहता है।`, `${correctText} ਸਾਰੇ ${count} ਵੈਧ ਪਰਿਵਾਰਕ ਮਾਡਲਾਂ ਵਿੱਚ ਕਾਇਮ ਰਹਿੰਦਾ ਹੈ।`);
    case "RESOLVE_RELATION_UNCERTAINTY": return record.answer.kind === "RELATION_SET"
      ? localeText(locale, `पूरे मॉडल-समूह में ठीक दो संबंध बचते हैं: ${correctText}।`, `ਪੂਰੇ ਮਾਡਲ-ਸਮੂਹ ਵਿੱਚ ਠੀਕ ਦੋ ਰਿਸ਼ਤੇ ਬਚਦੇ ਹਨ: ${correctText}।`)
      : localeText(locale, "कई अलग संबंध संभव हैं, इसलिए सटीक संबंध निर्धारित नहीं किया जा सकता।", "ਕਈ ਵੱਖਰੇ ਰਿਸ਼ਤੇ ਸੰਭਵ ਹਨ, ਇਸ ਲਈ ਸਟੀਕ ਰਿਸ਼ਤਾ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।");
    case "SELECT_CLAIM_BY_MODEL_STATUS": return localeText(locale, `${correctText} ही प्रश्न में मांगी गई सत्य-स्थिति रखता है।`, `${correctText} ਹੀ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੀ ਸੱਚ-ਸਥਿਤੀ ਰੱਖਦਾ ਹੈ।`);
    case "IDENTIFY_PERSON_BY_MODEL_STATUS": return localeText(locale, `${correctText} ही ऐसा उम्मीदवार है जिसकी भूमिका मांगी गई स्थिति से मेल खाती है।`, `${correctText} ਹੀ ਉਹ ਉਮੀਦਵਾਰ ਹੈ ਜਿਸਦੀ ਭੂਮਿਕਾ ਮੰਗੀ ਸਥਿਤੀ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ।`);
    case "RESOLVE_PERSON_IDENTITY_UNCERTAINTY": return record.answer.kind === "PERSON_SET"
      ? localeText(locale, `पूरा संभावित पहचान-समूह ${correctText} है।`, `ਪੂਰਾ ਸੰਭਵ ਪਛਾਣ-ਸਮੂਹ ${correctText} ਹੈ।`)
      : localeText(locale, "कम-से-कम तीन पहचान संभव हैं, इसलिए एक व्यक्ति निश्चित नहीं किया जा सकता।", "ਘੱਟੋ-ਘੱਟ ਤਿੰਨ ਪਛਾਣਾਂ ਸੰਭਵ ਹਨ, ਇਸ ਲਈ ਇੱਕ ਵਿਅਕਤੀ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।");
    case "DETERMINE_COUNT_BOUND": return localeText(locale, `${correctText} संभव संख्या-समूह की मांगी गई सीमा है।`, `${correctText} ਸੰਭਵ ਗਿਣਤੀ-ਸਮੂਹ ਦੀ ਮੰਗੀ ਹੱਦ ਹੈ।`);
    case "SELECT_COUNT_BY_MODEL_STATUS": return localeText(locale, `${correctText} ही मांगी गई संभव/असंभव स्थिति वाला विकल्प है।`, `${correctText} ਹੀ ਮੰਗੀ ਸੰਭਵ/ਅਸੰਭਵ ਸਥਿਤੀ ਵਾਲਾ ਵਿਕਲਪ ਹੈ।`);
    case "RESOLVE_COUNT_DETERMINACY": return record.answer.kind === "NUMBER"
      ? localeText(locale, `हर वैध मॉडल में संख्या ${correctText} ही है।`, `ਹਰ ਵੈਧ ਮਾਡਲ ਵਿੱਚ ਗਿਣਤੀ ${correctText} ਹੀ ਹੈ।`)
      : localeText(locale, "वैध मॉडलों में अलग-अलग संख्याएँ आती हैं, इसलिए सटीक संख्या निर्धारित नहीं की जा सकती।", "ਵੈਧ ਮਾਡਲਾਂ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਗਿਣਤੀਆਂ ਆਉਂਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਸਟੀਕ ਗਿਣਤੀ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ।");
  }
}

function localizedOptionAnalysis(
  record: GeneratedBlrCp005Question,
  options: readonly BlrCp005Option[],
  locale: Locale,
): GeneratedBlrCp005Question["explanation"]["optionAnalysis"] {
  const requested = record.querySpec.kind === "CLAIM_STATUS" || record.querySpec.kind === "PERSON_STATUS" || record.querySpec.kind === "COUNT_STATUS"
    ? record.querySpec.requestedStatus
    : undefined;
  return options.map((option, index) => {
    const label = optionLabel(index);
    let explanation: string;
    if (option.isCorrect) {
      explanation = option.modelStatus
        ? localeText(locale, `विकल्प ${label} पूरे मॉडल-समूह में ${localizedTruthStatus(option.modelStatus, locale)} है, ठीक वही स्थिति जो प्रश्न में मांगी गई है।`, `ਵਿਕਲਪ ${label} ਪੂਰੇ ਮਾਡਲ-ਸਮੂਹ ਵਿੱਚ ${localizedTruthStatus(option.modelStatus, locale)} ਹੈ, ਠੀਕ ਉਹੀ ਸਥਿਤੀ ਜੋ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੀ ਗਈ ਹੈ।`)
        : localeText(locale, `विकल्प ${label} सभी ${record.modelSpace.modelCount} वैध मॉडलों की तुलना से मिले उत्तर से मेल खाता है।`, `ਵਿਕਲਪ ${label} ਸਾਰੇ ${record.modelSpace.modelCount} ਵੈਧ ਮਾਡਲਾਂ ਦੀ ਤੁਲਨਾ ਤੋਂ ਮਿਲੇ ਉੱਤਰ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`);
    } else if (option.modelStatus && requested) {
      explanation = localeText(locale, `विकल्प ${label} ${localizedTruthStatus(option.modelStatus, locale)} है, ${localizedTruthStatus(requested, locale)} नहीं।`, `ਵਿਕਲਪ ${label} ${localizedTruthStatus(option.modelStatus, locale)} ਹੈ, ${localizedTruthStatus(requested, locale)} ਨਹੀਂ।`);
    } else {
      explanation = localeText(locale, `विकल्प ${label} पूरे वैध मॉडल-समूह की शर्त पूरी नहीं करता।`, `ਵਿਕਲਪ ${label} ਪੂਰੇ ਵੈਧ ਮਾਡਲ-ਸਮੂਹ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਕਰਦਾ।`);
    }
    return { optionLabel: label, optionText: option.text, isCorrect: option.isCorrect, explanation };
  });
}

function localizedFamilyTrees(
  record: GeneratedBlrCp005Question,
  locale: Locale,
  correctText: string,
): readonly BlrCp005FamilyTreeDiagram[] {
  return record.explanation.familyTrees.map((tree, index) => {
    const rows = [...new Set(tree.nodes.map((node) => node.generation))].sort((a, b) => b - a);
    const ascii = rows.map((row) => {
      const members = tree.nodes.filter((node) => node.generation === row).map((node) => `[${node.label}]${node.gender === "male" ? "(+)" : node.gender === "female" ? "(-)" : "(?)"}`).join("   ");
      return localeText(locale, `पीढ़ी ${row >= 0 ? "+" : ""}${row}: ${members}`, `ਪੀੜ੍ਹੀ ${row >= 0 ? "+" : ""}${row}: ${members}`);
    }).join("\n");
    const assignment = assignmentSummary(record, record.modelSpace.assignments[index] ?? {}, locale);
    return {
      ...tree,
      title: localeText(locale, "वैध परिवार-मॉडल", "ਵੈਧ ਪਰਿਵਾਰਕ ਮਾਡਲ"),
      modelLabel: localeText(locale, `मॉडल ${index + 1} / ${record.modelSpace.modelCount}`, `ਮਾਡਲ ${index + 1} / ${record.modelSpace.modelCount}`),
      query: { ...tree.query, answerLabel: correctText },
      accessibleSummary: localeText(locale, `${tree.nodes.length} सदस्यों वाला वैध परिवार-मॉडल; कुल ${rows.length} पीढ़ियाँ।`, `${tree.nodes.length} ਮੈਂਬਰਾਂ ਵਾਲਾ ਵੈਧ ਪਰਿਵਾਰਕ ਮਾਡਲ; ਕੁੱਲ ${rows.length} ਪੀੜ੍ਹੀਆਂ।`),
      asciiFallback: `${ascii}\n\n${localeText(locale, "खुली शर्त", "ਖੁੱਲੀ ਸ਼ਰਤ")}: ${assignment}`,
    };
  });
}

export function localizeBlrCp005Question(record: GeneratedBlrCp005Question, locale: Locale): GeneratedBlrCp005LocalizedQuestion {
  const name = nameGetter(record);
  const options = record.options.map((option) => ({ ...option, text: localizedOptionText(record, option, locale) }));
  const correctText = options[record.correctIndex]!.text;
  const suffix = locale === "hi-IN" ? "hi" : "pa";
  return {
    ...record,
    locale,
    canonicalLocale: "en-IN",
    canonicalItemId: record.itemId,
    itemId: `${record.itemId}-${suffix}`,
    questionLanguageId: `${record.itemId}:${locale}`,
    sharedPrompt: localizedSharedPrompt(record, locale),
    stem: localizedStem(record, locale, name),
    options,
    explanation: {
      coreConcept: localizedCoreConcept(record.solveAuthority, locale),
      modelAudit: localizedModelAudit(record, locale),
      conclusion: localizedConclusion(record, locale, correctText),
      examShortcut: localizedShortcut(record.solveAuthority, locale),
      optionAnalysis: localizedOptionAnalysis(record, options, locale),
      familyTrees: localizedFamilyTrees(record, locale, correctText),
    },
    metadata: {
      ...record.metadata,
      localizationRuntimeVersion: BLR_CP005_MULTILINGUAL_RUNTIME_VERSION,
      localizationVersion: BLR_CP005_LOCALIZATION_VERSION,
      localizationAuthority: BLR_CP005_HI_PA_LOCALISATION_REVIEW_CANDIDATE,
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
      canonicalItemId: record.itemId,
      canonicalSemanticFingerprint: record.metadata.semanticFingerprint,
      semanticParity: "EXECUTABLE_PROVED",
      learnerTextLocalized: true,
      humanLanguageReviewRequired: true,
      activeEditorialBlockers: [BLR_CP005_HUMAN_REVIEW_BLOCKER],
      productDeliveryUnlocked: false,
      productionStagingApproved: false,
    },
  };
}

const cache = new Map<Locale, readonly GeneratedBlrCp005LocalizedQuestion[]>();
export function generateBlrCp005LocalizedReviewBank(locale: Locale): readonly GeneratedBlrCp005LocalizedQuestion[] {
  const existing = cache.get(locale);
  if (existing) return existing;
  const bank = generateBlrCp005FrozenBank().map((record) => localizeBlrCp005Question(record, locale));
  cache.set(locale, bank);
  return bank;
}

export function blrCp005CanonicalParityProjection(record: GeneratedBlrCp005Question | GeneratedBlrCp005LocalizedQuestion) {
  return {
    packageId: record.packageId,
    checkpointId: record.checkpointId,
    qlId: record.qlId,
    permanentQlId: record.permanentQlId,
    solveAuthority: record.solveAuthority,
    sourcePrototypeId: record.sourcePrototypeId,
    seed: record.seed,
    scenarioId: record.scenarioId,
    topologyId: record.topologyId,
    groupKey: record.groupKey,
    answerType: record.answerType,
    querySpec: record.querySpec,
    answer: record.answer,
    modelSpace: record.modelSpace,
    optionSemantics: record.options.map((option) => ({ semanticKey: option.semanticKey, isCorrect: option.isCorrect, errorLabel: option.errorLabel, modelStatus: option.modelStatus })),
    correctIndex: record.correctIndex,
    familyTreeStructures: record.explanation.familyTrees.map((tree) => ({
      nodes: tree.nodes,
      edges: tree.edges,
      query: { subjectId: tree.query.subjectId, referenceId: tree.query.referenceId, pathPersonIds: tree.query.pathPersonIds },
    })),
    semanticFingerprint: record.metadata.semanticFingerprint,
  };
}
