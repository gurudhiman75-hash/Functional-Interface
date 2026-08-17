import type { SurfacePremise, SylLocale, TermId } from "../foundation/types";
import type { SylStructuredProofV3 } from "./structured-proof-v3-types";

interface StatementPolishInput {
  locale: SylLocale;
  displayedPremises: readonly SurfacePremise[];
  termLabels: Readonly<Record<TermId, string>>;
}

function label(term: TermId, input: StatementPolishInput): string {
  return input.termLabels[term] ?? term;
}

function englishMeaning(premise: SurfacePremise, input: StatementPolishInput): {
  meaning: string;
  normalizedRelation: string;
} {
  const subject = label(premise.subject, input);
  const predicate = label(premise.predicate, input);
  switch (premise.form) {
    case "ALL":
      return { meaning: `Every member of ${subject} is inside ${predicate}.`, normalizedRelation: `All ${subject} → ${predicate}` };
    case "NO":
      return { meaning: `No member can belong to both ${subject} and ${predicate}.`, normalizedRelation: `${subject} and ${predicate} are separate` };
    case "SOME":
    case "A_FEW":
      return { meaning: `At least one member belongs to both ${subject} and ${predicate}.`, normalizedRelation: `${subject} ∩ ${predicate}: one member` };
    case "SOME_NOT":
    case "NOT_ALL":
      return { meaning: `At least one member of ${subject} stays outside ${predicate}.`, normalizedRelation: `one member of ${subject} outside ${predicate}` };
    case "ONLY":
      return { meaning: `“Only” reverses the direction: every member of ${predicate} belongs to ${subject}.`, normalizedRelation: `All ${predicate} → ${subject}` };
    case "ARE_ONLY":
      return { meaning: `Every member of ${subject} belongs to ${predicate}.`, normalizedRelation: `All ${subject} → ${predicate}` };
    case "ONLY_A_FEW":
      return { meaning: `One member of ${subject} is inside ${predicate}, and another member of ${subject} stays outside ${predicate}.`, normalizedRelation: `one member inside + another member outside` };
    case "IDENTITY":
      return { meaning: `${subject} and ${predicate} are the same group.`, normalizedRelation: `${subject} = ${predicate}` };
    case "FEW":
      throw new Error("Plain FEW is not supported by V3.");
  }
}

function hindiMeaning(premise: SurfacePremise, input: StatementPolishInput): {
  meaning: string;
  normalizedRelation: string;
} {
  const subject = label(premise.subject, input);
  const predicate = label(premise.predicate, input);
  switch (premise.form) {
    case "ALL": return { meaning: `${subject} का हर सदस्य ${predicate} के अंदर है।`, normalizedRelation: `सभी ${subject} → ${predicate}` };
    case "NO": return { meaning: `कोई सदस्य ${subject} और ${predicate} दोनों नहीं हो सकता।`, normalizedRelation: `${subject} और ${predicate} अलग` };
    case "SOME":
    case "A_FEW": return { meaning: `कम-से-कम एक सदस्य ${subject} और ${predicate} दोनों में है।`, normalizedRelation: `${subject} ∩ ${predicate}: एक सदस्य` };
    case "SOME_NOT":
    case "NOT_ALL": return { meaning: `${subject} का कम-से-कम एक सदस्य ${predicate} से बाहर है।`, normalizedRelation: `${subject} का एक सदस्य ${predicate} से बाहर` };
    case "ONLY": return { meaning: `‘केवल’ दिशा पलटता है: ${predicate} का हर सदस्य ${subject} में है।`, normalizedRelation: `सभी ${predicate} → ${subject}` };
    case "ARE_ONLY": return { meaning: `${subject} का हर सदस्य ${predicate} में है।`, normalizedRelation: `सभी ${subject} → ${predicate}` };
    case "ONLY_A_FEW": return { meaning: `${subject} का एक सदस्य ${predicate} में है और दूसरा सदस्य ${predicate} से बाहर है।`, normalizedRelation: `एक सदस्य अंदर + दूसरा बाहर` };
    case "IDENTITY": return { meaning: `${subject} और ${predicate} एक ही समूह हैं।`, normalizedRelation: `${subject} = ${predicate}` };
    case "FEW": throw new Error("Plain FEW is not supported by V3.");
  }
}

function punjabiMeaning(premise: SurfacePremise, input: StatementPolishInput): {
  meaning: string;
  normalizedRelation: string;
} {
  const subject = label(premise.subject, input);
  const predicate = label(premise.predicate, input);
  switch (premise.form) {
    case "ALL": return { meaning: `${subject} ਦਾ ਹਰ ਮੈਂਬਰ ${predicate} ਦੇ ਅੰਦਰ ਹੈ।`, normalizedRelation: `ਸਾਰੇ ${subject} → ${predicate}` };
    case "NO": return { meaning: `ਕੋਈ ਮੈਂਬਰ ${subject} ਅਤੇ ${predicate} ਦੋਵੇਂ ਨਹੀਂ ਹੋ ਸਕਦਾ।`, normalizedRelation: `${subject} ਅਤੇ ${predicate} ਵੱਖ` };
    case "SOME":
    case "A_FEW": return { meaning: `ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${subject} ਅਤੇ ${predicate} ਦੋਵੇਂ ਵਿੱਚ ਹੈ।`, normalizedRelation: `${subject} ∩ ${predicate}: ਇੱਕ ਮੈਂਬਰ` };
    case "SOME_NOT":
    case "NOT_ALL": return { meaning: `${subject} ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${predicate} ਤੋਂ ਬਾਹਰ ਹੈ।`, normalizedRelation: `${subject} ਦਾ ਇੱਕ ਮੈਂਬਰ ${predicate} ਤੋਂ ਬਾਹਰ` };
    case "ONLY": return { meaning: `‘ਕੇਵਲ’ ਦਿਸ਼ਾ ਉਲਟਦਾ ਹੈ: ${predicate} ਦਾ ਹਰ ਮੈਂਬਰ ${subject} ਵਿੱਚ ਹੈ।`, normalizedRelation: `ਸਾਰੇ ${predicate} → ${subject}` };
    case "ARE_ONLY": return { meaning: `${subject} ਦਾ ਹਰ ਮੈਂਬਰ ${predicate} ਵਿੱਚ ਹੈ।`, normalizedRelation: `ਸਾਰੇ ${subject} → ${predicate}` };
    case "ONLY_A_FEW": return { meaning: `${subject} ਦਾ ਇੱਕ ਮੈਂਬਰ ${predicate} ਵਿੱਚ ਹੈ ਅਤੇ ਦੂਜਾ ਮੈਂਬਰ ${predicate} ਤੋਂ ਬਾਹਰ ਹੈ।`, normalizedRelation: `ਇੱਕ ਮੈਂਬਰ ਅੰਦਰ + ਦੂਜਾ ਬਾਹਰ` };
    case "IDENTITY": return { meaning: `${subject} ਅਤੇ ${predicate} ਇੱਕੋ ਸਮੂਹ ਹਨ।`, normalizedRelation: `${subject} = ${predicate}` };
    case "FEW": throw new Error("Plain FEW is not supported by V3.");
  }
}

export function polishStructuredProofV3Statements(
  proof: SylStructuredProofV3,
  input: StatementPolishInput,
): SylStructuredProofV3 {
  const statementMeanings = proof.statementMeanings.map((entry, index) => {
    const premise = input.displayedPremises[index];
    if (!premise) throw new Error(`Missing displayed premise for statement ${index + 1}.`);
    const polished = input.locale === "en-IN"
      ? englishMeaning(premise, input)
      : input.locale === "hi-IN"
        ? hindiMeaning(premise, input)
        : punjabiMeaning(premise, input);
    return { ...entry, ...polished };
  });
  const meaningById = new Map(statementMeanings.map((entry) => [entry.premiseId, entry.meaning]));
  const reasoningSteps = proof.combinedReasoning.reasoningSteps.map((step, index, all) => {
    if (index === all.length - 1 || step.premiseIds.length !== 1) return step;
    return { ...step, text: meaningById.get(step.premiseIds[0]) ?? step.text };
  });
  return {
    ...proof,
    statementMeanings,
    combinedReasoning: {
      ...proof.combinedReasoning,
      reasoningSteps,
    },
  };
}
