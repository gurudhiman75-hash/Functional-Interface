import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source = readFileSync('artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx', 'utf8');
const itemComponent = source.slice(source.indexOf('function ReviewItem('), source.indexOf('function RevisionEditor('));

test('each question has an independently accessible native disclosure', () => {
  assert.match(itemComponent, /<details className="ml-8 mt-4/);
  assert.match(itemComponent, /<summary className="cursor-pointer/);
  assert.match(itemComponent, /View full question — options, correct answer & explanation/);
  assert.match(itemComponent, /<ItemInspection item={item} quality={quality} duplicate={duplicate} \/><\/details>/);
  assert.doesNotMatch(itemComponent, /{expanded && <ItemInspection/);
});

test('native disclosure syncs its state without relying on click handlers', () => {
  assert.match(itemComponent, /onToggle={\(event\) => \{ if \(event\.currentTarget\.open !== expanded\) onExpanded\(\); \}}/);
  assert.doesNotMatch(itemComponent, /onClick={onExpanded}/);
});

test('expanded content contains answer options explanation and quality report', () => {
  assert.match(itemComponent, /function ItemInspection\(/);
  assert.match(itemComponent, /itemOptionValues\(item\.payload\)/);
  assert.match(itemComponent, /itemExplanation\(item\.payload\)/);
  assert.match(itemComponent, /Production quality gate/);
});
