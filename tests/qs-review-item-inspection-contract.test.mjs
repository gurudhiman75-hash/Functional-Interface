import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync('artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx', 'utf8');
const itemComponent = source.slice(source.indexOf('function ReviewItem('), source.indexOf('function RevisionEditor('));

test('every review item renders its options and explanation without an expansion control', () => {
  assert.match(itemComponent, /<section aria-label={`Options, correct answer, explanation and quality for item/);
  assert.match(itemComponent, /<ItemInspection item={item} quality={quality} duplicate={duplicate} \/><\/section>/);
  assert.doesNotMatch(itemComponent, /<details\b|<summary\b|{expanded && <ItemInspection/);
});

test('full question details include answers explanations and quality checks', () => {
  assert.match(itemComponent, /function ItemInspection\(/);
  assert.match(itemComponent, /itemOptionValues\(item\.payload\)/);
  assert.match(itemComponent, /itemCorrectIndex\(item\.payload\)/);
  assert.match(itemComponent, /itemExplanation\(item\.payload\)/);
  assert.match(itemComponent, /Production quality gate/);
});
