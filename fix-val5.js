const fs = require('fs');

const p1 = 'artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/validator.ts';
const p2 = 'artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/validator.ts';
const p3 = 'artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/validator.ts';

[p1, p2, p3].forEach(p => {
    let code = fs.readFileSync(p, 'utf8');
    code = code.replace('"Explanation placeholders must be resolved."),', '');
    code = code.replace('     \n', '');
    fs.writeFileSync(p, code, 'utf8');
});
console.log('Fixed syntax error');