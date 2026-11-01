import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=readFileSync('artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx','utf8');
const run=source.slice(source.indexOf('function RunSection('),source.indexOf('function ReviewItem('));
const item=source.slice(source.indexOf('function ReviewItem('),source.indexOf('function RevisionEditor('));

test('the first run is opened once, not re-expanded after manual collapse',()=>{
  assert.match(source,/const initialReviewOpened = useRef\(false\)/);
  assert.match(source,/if \(initialReviewOpened\.current \|\| !reviewRuns\[0\]\) return/);
  assert.match(source,/initialReviewOpened\.current = true/);
  assert.doesNotMatch(source,/if \(reviewRuns\[0\] && expandedRuns\.size === 0\)/);
});

test('run and each item have independent accessible collapse controls',()=>{
  assert.match(run,/aria-label={`\$\{expanded \? "Collapse" : "Expand"\} run/);
  assert.match(item,/aria-label={`\$\{expanded \? "Collapse" : "Expand"\} item/);
  assert.match(item,/Hide options & explanation/);
  assert.match(item,/View options & explanation/);
  assert.match(item,/{expanded && <section/);
  assert.match(item,/<ItemInspection item={item} quality={quality} duplicate={duplicate} \/><\/section>/);
});

test('expanded details still include answers and explanations',()=>{
  assert.match(item,/itemOptionValues\(item\.payload\)/);
  assert.match(item,/itemCorrectIndex\(item\.payload\)/);
  assert.match(item,/itemExplanation\(item\.payload\)/);
  assert.match(item,/Production quality gate/);
});
