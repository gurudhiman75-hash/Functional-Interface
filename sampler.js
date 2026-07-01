const fs = require('fs');

function sampleCSV(file, count) {
    if (!fs.existsSync(file)) {
        console.log(file + ' not found');
        return;
    }
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    const data = lines.slice(1);
    
    // Shuffle
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = data[i];
        data[i] = data[j];
        data[j] = temp;
    }
    
    console.log('--- ' + file + ' ---');
    data.slice(0, count).forEach(l => {
        // very basic regex to split csv ignoring commas inside quotes
        const match = l.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || l.split(',');
        // For viewing purposes, let's just parse the line manually or print it raw.
        // It's easier to just print the raw line to see the shape.
        console.log(l);
    });
}

sampleCSV('artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/pct-001-human-review-en.csv', 15);
sampleCSV('artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/pct-002-human-review-en.csv', 15);
sampleCSV('artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/rap-001-human-review-en.csv', 15);
