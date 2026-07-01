const fs = require('fs');

const paths = [
  'artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/validator.ts',
  'artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/validator.ts',
  'artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/validator.ts'
];

paths.forEach(p => {
    let code = fs.readFileSync(p, 'utf8');
    code = code.replace('check("explanationTaskSpecific", true, "Explanation placeholders must be resolved."),', 'check("explanationTaskSpecific", !pkg.explanation.lines.some(l => /\\{[a-zA-Z0-9_]+\\}/.test(l)), "Explanation placeholders must be resolved."),');
    fs.writeFileSync(p, code, 'utf8');
});
console.log('Done');
