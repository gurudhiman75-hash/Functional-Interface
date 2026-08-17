import type { TmwLanguage } from "./types";

type AnyQuestion = Record<string, any>;

function tr(language: TmwLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function structuredGivens(question: AnyQuestion): string[] {
  const block = question.presentationBlocks?.[0];
  if (!block) return [];
  if (block.type === "table") {
    const columns = Array.isArray(block.columns) ? block.columns : [];
    const rows = Array.isArray(block.rows) ? block.rows : [];
    return rows.map((row: unknown[]) => row.map((cell, index) => `${columns[index] ?? `C${index + 1}`}: ${String(cell)}`).join("; "));
  }
  if (block.type === "caselet") {
    return Array.isArray(block.paragraphs) ? [...block.paragraphs] : [];
  }
  return [];
}

function governingFormula(mode: string, language: TmwLanguage): string {
  switch (mode) {
    case "tableWorkforceSchedule":
      return tr(
        language,
        "Work = workers × days; fresh-crew time = total worker-days ÷ fresh workers.",
        "काम = कामगार × दिन; नई टीम का समय = कुल कामगार-दिन ÷ नई टीम के कामगार।",
        "ਕੰਮ = ਮਜ਼ਦੂਰ × ਦਿਨ; ਨਵੀਂ ਟੀਮ ਦਾ ਸਮਾਂ = ਕੁੱਲ ਮਜ਼ਦੂਰ-ਦਿਨ ÷ ਨਵੀਂ ਟੀਮ ਦੇ ਮਜ਼ਦੂਰ।",
      );
    case "tableHeterogeneousContribution":
      return tr(
        language,
        "Row contribution = count × relative efficiency × days; total contribution = sum of row contributions.",
        "पंक्ति का योगदान = संख्या × सापेक्ष दक्षता × दिन; कुल योगदान = सभी पंक्तियों के योगदानों का योग।",
        "ਕਤਾਰ ਦਾ ਯੋਗਦਾਨ = ਗਿਣਤੀ × ਸਾਪੇਖ ਕੁਸ਼ਲਤਾ × ਦਿਨ; ਕੁੱਲ ਯੋਗਦਾਨ = ਸਾਰੀਆਂ ਕਤਾਰਾਂ ਦੇ ਯੋਗਦਾਨਾਂ ਦਾ ਜੋੜ।",
      );
    case "tablePipeOperatingSchedule":
      return tr(
        language,
        "Filled fraction = Σ(interval net rate × duration); with both pipes open, net rate = filling-pipe rate − emptying-pipe rate.",
        "भरा भाग = Σ(हर अंतराल की शुद्ध दर × समय); दोनों पाइप खुले हों तो शुद्ध दर = भराव पाइप की दर − निकासी पाइप की दर।",
        "ਭਰਿਆ ਹਿੱਸਾ = Σ(ਹਰ ਅੰਤਰਾਲ ਦੀ ਸ਼ੁੱਧ ਦਰ × ਸਮਾਂ); ਦੋਵੇਂ ਪਾਈਪ ਖੁੱਲ੍ਹੇ ਹੋਣ ਤਾਂ ਸ਼ੁੱਧ ਦਰ = ਭਰਾਵ ਪਾਈਪ ਦੀ ਦਰ − ਨਿਕਾਸੀ ਪਾਈਪ ਦੀ ਦਰ।",
      );
    case "caseletStageOneOutput":
      return tr(
        language,
        "First-stage work = Team A's daily rate × first-stage days.",
        "पहले चरण का काम = टीम A की दैनिक दर × पहले चरण के दिन।",
        "ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ = ਟੀਮ A ਦੀ ਰੋਜ਼ਾਨਾ ਦਰ × ਪਹਿਲੇ ਪੜਾਅ ਦੇ ਦਿਨ।",
      );
    default:
      return tr(
        language,
        "Remaining work = total work − first-stage work; additional time = remaining work ÷ (rate A + rate B).",
        "शेष काम = कुल काम − पहले चरण का काम; अतिरिक्त समय = शेष काम ÷ (A की दर + B की दर)।",
        "ਬਾਕੀ ਕੰਮ = ਕੁੱਲ ਕੰਮ − ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ; ਵਾਧੂ ਸਮਾਂ = ਬਾਕੀ ਕੰਮ ÷ (A ਦੀ ਦਰ + B ਦੀ ਦਰ)।",
      );
  }
}

export function finalizeTmwCp014ExplanationDepth(question: AnyQuestion, language: TmwLanguage): AnyQuestion {
  if (question?.canonicalProblemId !== "TMW-CP-014") return question;
  const mode = question.solveMode ?? "";
  const givens = structuredGivens(question);
  const formula = governingFormula(mode, language);
  return {
    ...question,
    explanation: {
      ...question.explanation,
      opening: question.learnerExplanation?.method ?? question.explanation?.opening ?? "",
      givens,
      formula,
    },
  };
}
