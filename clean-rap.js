const fs = require('fs');

const p1 = 'artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/question-language.en.json';
const p2 = 'artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/question-language.hi.json';
const p3 = 'artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/question-language.pa.json';
const p4 = 'artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/coverage-targets.library.json';

[p1, p2, p3].forEach(p => {
    try {
        let data = JSON.parse(fs.readFileSync(p, 'utf8'));
        if(data['RAP-CP-002']) {
          delete data['RAP-CP-002'].families['RAP-QL-007'];
          fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
        }
    } catch(e) {}
});

try {
    let tData = JSON.parse(fs.readFileSync(p4, 'utf8'));
    // Filter it out wherever it appears
    tData.targets.forEach(t => {
        if(t.questionLanguageIds) {
            t.questionLanguageIds = t.questionLanguageIds.filter(id => id !== 'RAP-QL-007');
        }
    });
    fs.writeFileSync(p4, JSON.stringify(tData, null, 2), 'utf8');
} catch(e) {}

console.log('Cleaned up RAP-QL-007');