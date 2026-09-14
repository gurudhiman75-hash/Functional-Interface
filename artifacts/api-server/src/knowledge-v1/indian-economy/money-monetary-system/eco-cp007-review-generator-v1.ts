import type { KnowledgeV1Difficulty } from "../../types";
import {
  ECO_CP007_AGGREGATE_ROWS_V1,
  ECO_CP007_CONCEPT_ROWS_V1,
  ECO_CP007_DEPOSIT_SCENARIOS_V1,
  ECO_CP007_FUNCTION_SCENARIOS_V1,
  ECO_CP007_MULTIPLIER_CASES_V1,
} from "./eco-cp007-facts";
import type { EcoCp007ReviewQuestion } from "./eco-cp007-review-types";

const concepts = ECO_CP007_CONCEPT_ROWS_V1;
const aggregates = ECO_CP007_AGGREGATE_ROWS_V1;

const qlNames: Record<number, string> = {
  1: "Barter and double coincidence of wants",
  2: "Identify functions of money",
  3: "Apply functions of money",
  4: "Distinguish fiat money and legal tender",
  5: "Distinguish demand and time deposits",
  6: "Understand money supply as a stock",
  7: "Identify M1, M2, M3 and M4 components",
  8: "Distinguish narrow and broad money",
  9: "Apply liquidity ordering",
  10: "Understand reserve or high-powered money",
  11: "Apply basic money-multiplier relation",
  12: "Evaluate mixed monetary-system statements",
};

function difficultyForVariant(ql: number, rowIndex: number): KnowledgeV1Difficulty {
  if (ql === 1 || ql === 2 || ql === 3 || ql === 5 || ql === 6) return rowIndex < 2 ? "Easy" : "Medium";
  if (ql === 4) return rowIndex < 2 ? "Easy" : rowIndex === 2 ? "Medium" : "Hard";
  if (ql === 7) return rowIndex < 2 ? "Medium" : "Hard";
  if (ql === 8) return rowIndex === 0 ? "Easy" : "Medium";
  if (ql === 9 || ql === 10) return rowIndex === 0 ? "Medium" : "Hard";
  if (ql === 11) return rowIndex < 2 ? "Medium" : "Hard";
  return rowIndex < 2 ? "Medium" : "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function concept(id: string) {
  const row = concepts.find((item) => item.id === id);
  if (!row) throw new Error(`Unknown ECO-CP-007 concept ${id}`);
  return row;
}

function aggregate(id: string) {
  const row = aggregates.find((item) => item.id === id);
  if (!row) throw new Error(`Unknown ECO-CP-007 aggregate ${id}`);
  return row;
}

function sourceBundle(...rows: readonly { sourceIds: readonly string[]; sourceFactIds: readonly string[] }[]) {
  return {
    sourceIds: [...new Set(rows.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(rows.flatMap((row) => row.sourceFactIds))],
  };
}

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): EcoCp007ReviewQuestion {
  const qlId = `ECO-007-QL-${String(ql).padStart(3, "0")}`;
  const target = globalIndex % 4;
  const difficulty = difficultyForVariant(ql, rowIndex);
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let metadata = sourceBundle(concept("medium"));

  if (ql === 1) {
    const rows = [
      {
        stem: "Direct exchange of goods without using money is called:",
        correct: "Barter exchange",
        explanation: "Barter is the direct exchange of one good or service for another. Money is not used as the intermediate medium of exchange.",
        facts: [concept("barter")],
      },
      {
        stem: "In barter, each side must want exactly what the other offers. This problem is called:",
        correct: "Double coincidence of wants",
        explanation: "A barter trade works only when each person wants what the other person is offering. Money removes this need for a matching pair of wants.",
        facts: [concept("double-coincidence"), concept("barter")],
      },
      {
        stem: "A wheat farmer wants shoes, but the shoemaker does not want wheat. The barter exchange fails mainly because of:",
        correct: "Lack of double coincidence of wants",
        explanation: "The farmer and shoemaker do not have matching wants. A generally accepted medium of exchange solves this barter problem.",
        facts: [concept("double-coincidence"), concept("medium")],
      },
      {
        stem: "Why does money make exchange easier than barter?",
        correct: "It removes the need for double coincidence of wants",
        explanation: "With money, a seller does not need to find someone who both wants the seller's good and offers the exact good the seller wants. Money separates the sale from the later purchase.",
        facts: [concept("double-coincidence"), concept("medium")],
      },
    ];
    const row = rows[rowIndex];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([
      correct,
      "Need for a fixed maturity period",
      "Need for all prices to be identical",
      "Need for every good to have intrinsic value",
    ], correct, target);
    if (rowIndex === 0) options = moveCorrect(["Barter exchange", "Credit creation", "Legal tender", "Time deposit"], correct, target);
    if (rowIndex === 1) options = moveCorrect(["Double coincidence of wants", "Money multiplier", "Broad money", "Deferred payment"], correct, target);
    if (rowIndex === 2) options = moveCorrect(["Lack of double coincidence of wants", "Excess liquidity", "Time maturity", "Legal tender requirement"], correct, target);
    explanation = row.explanation;
    metadata = sourceBundle(...row.facts);
  } else if (ql === 2) {
    const rows = [concept("medium"), concept("unit"), concept("store"), concept("deferred")];
    const row = rows[rowIndex];
    stem = `Which function of money means that ${row.meaning.replace(/^money /, "money ")}?`;
    correct = row.term;
    options = moveCorrect(["Medium of exchange", "Unit of account", "Store of value", "Standard of deferred payment"], correct, target);
    explanation = `${row.term} means that ${row.meaning}. This is one of the basic functions that makes money useful in an economy.`;
    metadata = sourceBundle(row);
  } else if (ql === 3) {
    const row = ECO_CP007_FUNCTION_SCENARIOS_V1[rowIndex];
    stem = `${row.stem} Which function of money is shown?`;
    correct = row.answer;
    options = moveCorrect(["Medium of exchange", "Unit of account", "Store of value", "Standard of deferred payment"], correct, target);
    explanation = row.explanation;
    const map: Record<string, string> = {
      "Medium of exchange": "medium",
      "Unit of account": "unit",
      "Store of value": "store",
      "Standard of deferred payment": "deferred",
    };
    metadata = sourceBundle(concept(map[correct]));
  } else if (ql === 4) {
    const rows = [
      {
        stem: "Money accepted because of the authority behind its issue rather than its material value is:",
        correct: "Fiat money",
        explanation: "Fiat money does not need intrinsic commodity value equal to its face value. Its acceptability comes from the monetary authority and the legal framework.",
      },
      {
        stem: "Money that cannot legally be refused for settlement of a transaction is called:",
        correct: "Legal tender",
        explanation: "Legal tender has legal status for settling transactions. This is different from a cheque, which a seller may refuse to accept.",
      },
      {
        stem: "Which is not legal tender even though it can be used to make payments?",
        correct: "A cheque drawn on a bank account",
        explanation: "A cheque can be refused by the person receiving payment, so it is not legal tender. Currency designated as legal tender cannot be refused in the same way for settlement.",
      },
      {
        stem: "Which statement correctly separates fiat money from legal tender?",
        correct: "Fiat money refers to value based on issuing authority; legal tender refers to legal acceptability for settlement",
        explanation: "Fiat money describes why the money is accepted despite low intrinsic value. Legal tender describes its legal status in settling transactions.",
      },
    ];
    const row = rows[rowIndex];
    stem = row.stem;
    correct = row.correct;
    options = rowIndex < 2
      ? moveCorrect(["Fiat money", "Legal tender", "Time deposit", "Barter good"], correct, target)
      : rowIndex === 2
        ? moveCorrect(["A cheque drawn on a bank account", "A legal-tender currency note", "A legal-tender coin", "Currency accepted under law"], correct, target)
        : moveCorrect([
            correct,
            "Fiat money and legal tender always mean exactly the same thing",
            "Fiat money means only deposits; legal tender means only time deposits",
            "Legal tender depends on intrinsic metal value; fiat money depends on maturity",
          ], correct, target);
    explanation = row.explanation;
    metadata = sourceBundle(concept("fiat"), concept("legal-tender"));
  } else if (ql === 5) {
    const row = ECO_CP007_DEPOSIT_SCENARIOS_V1[rowIndex];
    stem = row.stem;
    correct = row.answer;
    options = moveCorrect(["Demand deposit", "Time deposit", "Legal tender", "Reserve money"], correct, target);
    explanation = row.explanation;
    metadata = sourceBundle(concept(correct === "Demand deposit" ? "demand-deposit" : "time-deposit"));
  } else if (ql === 6) {
    const rows = [
      {
        stem: "Money supply is best described as:",
        correct: "A stock measured at a point of time",
        explanation: "Money supply measures how much money exists with the public at a particular point of time. It is therefore a stock variable, not a flow over a period.",
      },
      {
        stem: "Which item is part of money supply in the basic Indian definition?",
        correct: "Currency held by the public",
        explanation: "Currency held by the public is a direct component of monetary aggregates such as M1. Cash held inside banks is not counted as currency with the public.",
      },
      {
        stem: "Why is cash held by banks deducted when calculating currency with the public?",
        correct: "Because currency with the public excludes cash kept by banks themselves",
        explanation: "The measure aims to capture currency held outside the banking system by the public. Cash still in bank vaults is therefore excluded from currency with the public.",
      },
      {
        stem: "Which statement about money supply is correct?",
        correct: "It can include currency and certain bank deposits held by the public",
        explanation: "Modern money supply is not limited to notes and coins. Certain bank deposits are included because they can perform monetary functions and are liabilities to the public.",
      },
    ];
    const row = rows[rowIndex];
    stem = row.stem;
    correct = row.correct;
    options = rowIndex === 0
      ? moveCorrect([correct, "A flow measured only over a financial year", "Only the value of newly printed notes", "Only bank credit issued during a month"], correct, target)
      : rowIndex === 1
        ? moveCorrect([correct, "Cash held in bank vaults only", "Interbank deposits only", "Physical gold held by households"], correct, target)
        : rowIndex === 2
          ? moveCorrect([correct, "Because bank cash is always a time deposit", "Because bank cash is part of barter", "Because all bank cash is foreign currency"], correct, target)
          : moveCorrect([correct, "It consists only of coins", "It excludes all deposits", "It is always measured as a yearly flow"], correct, target);
    explanation = row.explanation;
    metadata = sourceBundle(concept("money-supply"));
  } else if (ql === 7) {
    const row = aggregates[rowIndex];
    if (rowIndex < 2) {
      stem = `${row.aggregate} is defined as:`;
      correct = row.shortFormula;
      options = moveCorrect([
        aggregate("m1").shortFormula,
        aggregate("m2").shortFormula,
        aggregate("m3").shortFormula,
        aggregate("m4").shortFormula,
      ], correct, target);
    } else {
      stem = rowIndex === 2
        ? "Which monetary aggregate adds time deposits with banks to M1?"
        : "Which monetary aggregate adds total post-office deposits, excluding NSCs, to M3?";
      correct = row.aggregate;
      options = moveCorrect(["M1", "M2", "M3", "M4"], correct, target);
    }
    explanation = `${row.aggregate} is ${row.shortFormula}. The added component is what distinguishes it from the preceding narrower aggregate.`;
    metadata = sourceBundle(row);
  } else if (ql === 8) {
    const rows = [
      { stem: "Which pair is classified as narrow money in the NCERT definition?", correct: "M1 and M2", explanation: "M1 and M2 are the narrower monetary aggregates. They contain the most liquid forms of money compared with M3 and M4." },
      { stem: "Which pair is classified as broad money?", correct: "M3 and M4", explanation: "M3 and M4 are broad money because they include less liquid deposit components in addition to narrow money." },
      { stem: "Why is M3 broader than M1?", correct: "Because M3 adds time deposits with banks to M1", explanation: "M1 contains currency, demand deposits and other deposits with RBI. M3 adds bank time deposits, so its coverage is broader." },
    ];
    const row = rows[rowIndex];
    stem = row.stem;
    correct = row.correct;
    options = rowIndex < 2
      ? moveCorrect(["M1 and M2", "M3 and M4", "M1 and M4", "M2 and M3"], correct, target)
      : moveCorrect([correct, "Because M3 excludes all deposits", "Because M3 contains only coins", "Because M3 removes demand deposits from M1"], correct, target);
    explanation = row.explanation;
    metadata = sourceBundle(aggregate("m1"), aggregate("m3"));
  } else if (ql === 9) {
    const rows = [
      { stem: "Among M1, M2, M3 and M4, which is the most liquid?", correct: "M1", explanation: "M1 contains the most readily spendable components and is therefore the most liquid aggregate. Liquidity decreases as less immediately usable deposits are added." },
      { stem: "Which ordering shows decreasing liquidity?", correct: "M1 → M2 → M3 → M4", explanation: "NCERT presents these aggregates in decreasing order of liquidity. M1 is easiest to use for transactions, while M4 is the least liquid of the four." },
      { stem: "Why is M4 less liquid than M1?", correct: "Because M4 includes additional deposit components that are less immediately spendable", explanation: "M4 contains the components of M3 plus post-office deposits. These extra components are less immediately usable for transactions than the core components of M1." },
    ];
    const row = rows[rowIndex];
    stem = row.stem;
    correct = row.correct;
    options = rowIndex === 0
      ? moveCorrect(["M1", "M2", "M3", "M4"], correct, target)
      : rowIndex === 1
        ? moveCorrect([correct, "M4 → M3 → M2 → M1", "M1 → M3 → M2 → M4", "M2 → M1 → M4 → M3"], correct, target)
        : moveCorrect([correct, "Because M4 contains no money", "Because M1 consists only of time deposits", "Because liquidity rises automatically with every added component"], correct, target);
    explanation = row.explanation;
    metadata = sourceBundle(...aggregates);
  } else if (ql === 10) {
    const rows = [
      { stem: "High-powered money is another name for:", correct: "Reserve money", explanation: "High-powered money, reserve money and the monetary base refer to the base money created by the monetary authority. It supports the wider money-creation process." },
      { stem: "Reserve money consists mainly of currency in circulation plus:", correct: "Bankers' deposits with RBI and other deposits with RBI", explanation: "RBI defines reserve money as currency in circulation plus bankers' deposits with RBI and other deposits with RBI. These central-bank liabilities form the monetary base." },
      { stem: "Why is reserve money called high-powered money?", correct: "Because it forms the base on which a larger money supply can be supported", explanation: "Reserve money is the monetary base held as currency or reserves. Through the banking system, a given base can support a larger stock of money." },
    ];
    const row = rows[rowIndex];
    stem = row.stem;
    correct = row.correct;
    options = rowIndex === 0
      ? moveCorrect(["Reserve money", "Time deposit", "M4 only", "Barter money"], correct, target)
      : rowIndex === 1
        ? moveCorrect([correct, "Only household time deposits", "Only post-office deposits", "Only commercial-bank loans"], correct, target)
        : moveCorrect([correct, "Because it is always the largest aggregate", "Because it contains every financial asset", "Because it has no relation to bank reserves"], correct, target);
    explanation = row.explanation;
    metadata = sourceBundle(concept("reserve-money"));
  } else if (ql === 11) {
    const row = ECO_CP007_MULTIPLIER_CASES_V1[rowIndex];
    if (rowIndex < 3) {
      stem = `Reserve money is ${row.reserve} and money supply is ${row.money}. The simple money multiplier is:`;
      correct = String(row.multiplier);
      const candidates = [...new Set([row.multiplier, row.multiplier + 1, Math.max(1, row.multiplier - 1), row.multiplier + 2])].map(String);
      while (candidates.length < 4) candidates.push(String(Number(candidates[candidates.length - 1]) + 1));
      options = moveCorrect(candidates.slice(0, 4), correct, target);
      explanation = `Money multiplier = money supply ÷ reserve money. Here, ${row.money} ÷ ${row.reserve} = ${row.multiplier}.`;
    } else {
      stem = "If money supply is four times reserve money, the simple money multiplier is:";
      correct = "4";
      options = moveCorrect(["2", "3", "4", "5"], correct, target);
      explanation = "The simple multiplier is the ratio of money supply to reserve money. If money supply is four times the monetary base, the ratio is 4.";
    }
    metadata = sourceBundle(concept("reserve-money"), concept("money-supply"));
  } else {
    const rows = [
      {
        stem: "Consider the statements:\nI. Demand deposits are payable on demand.\nII. Demand deposits are legal tender.\nWhich is correct?",
        correct: "I only",
        explanation: "Statement I is correct because demand deposits can be withdrawn on demand. Statement II is false because a cheque or deposit-based payment can be refused and is not legal tender.",
      },
      {
        stem: "Consider the statements:\nI. M1 is classified as narrow money.\nII. M3 adds time deposits with banks to M1.\nWhich is correct?",
        correct: "Both I and II",
        explanation: "Statement I is correct because M1 is narrow money. Statement II is also correct because bank time deposits are the main component added to M1 to obtain M3.",
      },
      {
        stem: "Consider the statements:\nI. Money supply is a stock variable.\nII. M4 is more liquid than M1.\nWhich is correct?",
        correct: "I only",
        explanation: "Statement I is correct because money supply is measured at a point of time. Statement II is false because M1 is the most liquid and M4 the least liquid among these four aggregates.",
      },
      {
        stem: "Which statement correctly distinguishes reserve money from M3?",
        correct: "Reserve money is the monetary base, while M3 is a broad money aggregate that includes bank time deposits",
        explanation: "Reserve money is central-bank base money. M3 is broader because it includes M1 plus time deposits with the banking system.",
      },
    ];
    const row = rows[rowIndex];
    stem = row.stem;
    correct = row.correct;
    options = rowIndex < 3
      ? moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, target)
      : moveCorrect([
          correct,
          "Reserve money and M3 are always identical",
          "M3 contains only currency and no deposits",
          "Reserve money means only post-office deposits",
        ], correct, target);
    explanation = row.explanation;
    metadata = sourceBundle(concept("reserve-money"), concept("money-supply"), concept("demand-deposit"), concept("legal-tender"), aggregate("m1"), aggregate("m3"), aggregate("m4"));
  }

  return {
    questionId: `ECO-CP007-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "ECO-001",
    cpId: "ECO-CP-007",
    qlId,
    qlName: qlNames[ql],
    difficulty,
    stem,
    options,
    correctIndex: target,
    canonicalAnswer: correct,
    explanation,
    ...metadata,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateEcoCp007ReviewBatchV1() {
  const countsByQl: Record<number, number> = {
    1: 4,
    2: 4,
    3: 4,
    4: 4,
    5: 4,
    6: 3,
    7: 4,
    8: 3,
    9: 3,
    10: 3,
    11: 4,
    12: 4,
  };

  const questions: EcoCp007ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 12; ql += 1) {
    for (let rowIndex = 0; rowIndex < countsByQl[ql]; rowIndex += 1) {
      questions.push(makeQuestion(ql, rowIndex, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}
