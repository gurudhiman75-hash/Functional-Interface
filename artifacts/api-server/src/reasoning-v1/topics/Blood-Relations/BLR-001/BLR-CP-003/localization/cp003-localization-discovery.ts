import { generateBlrCp003FinalApprovedBank } from "../cp003-final-approved-bank";

const bank = generateBlrCp003FinalApprovedBank();

console.log(JSON.stringify({
  recordCount: bank.length,
  prototypes: [...new Set(bank.map((record) => record.sourcePrototypeId))].sort().map((sourcePrototypeId) => {
    const records = bank.filter((record) => record.sourcePrototypeId === sourcePrototypeId);
    const first = records[0]!;
    return {
      sourcePrototypeId,
      qlId: first.qlId,
      authority: first.finalAuthority,
      answerType: first.answerType,
      recordCount: records.length,
      exampleStem: first.stem,
    };
  }),
}, null, 2));
