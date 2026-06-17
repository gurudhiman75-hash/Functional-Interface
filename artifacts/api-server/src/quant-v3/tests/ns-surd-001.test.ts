import { strict as assert } from "node:assert";
import { NS_SURD_001 } from "../topics/NumberSystem/subtopics/SurdsAndRationalization/NS-SURD-001/package";

type SurdQuestionLanguageItem = {
  id: string;
  cpId: string;
  stem: string;
};

type SurdQuestion = {
  cpId: string;
  qlId: string;
  variables: Record<string, number | string>;
};

const questionItems = NS_SURD_001.questionLanguageLibrary.items as SurdQuestionLanguageItem[];
const qlByCp = new Map<string, SurdQuestionLanguageItem[]>();

for (const item of questionItems) {
  const current = qlByCp.get(item.cpId) ?? [];
  current.push(item);
  qlByCp.set(item.cpId, current);
}

function makeQuestion(cpId: string, qlId: string): SurdQuestion {
  const variables = NS_SURD_001.generator(cpId, qlId);
  return { cpId, qlId, variables };
}

function assertPackageCase(question: SurdQuestion) {
  const validation = NS_SURD_001.validator(question.cpId, question.qlId, question.variables);
  assert.equal(validation.valid, true, `${question.cpId}/${question.qlId}: ${validation.reason ?? "invalid"}`);

  const solved = NS_SURD_001.solver(question);
  assert.equal(typeof solved.answer, "string", `${question.cpId}/${question.qlId}: answer type`);
  assert.ok(solved.answer.trim().length > 0, `${question.cpId}/${question.qlId}: empty answer`);
  assert.ok(!/undefined|NaN|Infinity/.test(solved.answer), `${question.cpId}/${question.qlId}: invalid answer ${solved.answer}`);
}

for (const cpId of NS_SURD_001.activeCps) {
  const qlItems = qlByCp.get(cpId) ?? [];
  assert.ok(qlItems.length > 0, `${cpId}: missing question language items`);

  for (const item of qlItems) {
    assertPackageCase(makeQuestion(cpId, item.id));
  }
}

for (let index = 0; index < 1000; index += 1) {
  const cpId = NS_SURD_001.activeCps[index % NS_SURD_001.activeCps.length]!;
  const qlItems = qlByCp.get(cpId) ?? [];
  const item = qlItems[index % qlItems.length]!;
  assertPackageCase(makeQuestion(cpId, item.id));
}

console.log("NS-SURD-001 package harness passed.");
