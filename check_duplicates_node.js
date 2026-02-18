const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib/data/questions.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Simple regex to extract questions. Assuming format: q: "Question text",
const questionRegex = /q:\s*"([^"]+)"/g;
let match;
const seenQuestions = new Map();
const duplicates = [];

let lineCount = 0;
const lines = content.split('\n');

lines.forEach((line, index) => {
    const match = /q:\s*"([^"]+)"/.exec(line);
    if (match) {
        const questionText = match[1].trim();
        if (seenQuestions.has(questionText)) {
            duplicates.push({
                text: questionText,
                line: index + 1,
                firstSeenLine: seenQuestions.get(questionText)
            });
        } else {
            seenQuestions.set(questionText, index + 1);
        }
    }
});

if (duplicates.length > 0) {
    console.log("Found duplicates:");
    duplicates.forEach(d => {
        console.log(`- Duplicate found at line ${d.line} (first seen at line ${d.firstSeenLine}): "${d.text}"`);
    });
} else {
    console.log("No duplicates found.");
}
