import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source = readFileSync('artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx', 'utf8');
const itemComponent = source.slice(source.indexOf('function ReviewItem('), source.indexOf('function RevisionEditor('));

test('each question offers a labeled, accessible, stateful inspection toggle', () => {
  assert.match(itemComponent, /aria-label={`\$\{expanded \? "Hide" : "View"\} options and explanation for item/);
  assert.match(itemComponent, /onClick={onExpanded} aria-expanded={expanded}/);
  assert.match(itemComponent, /View options & explanation/);
  assert.match(itemComponent, /Hide options & explanation/);
  assert.match(itemComponent, /onClick={onExpanded} aria-expanded={expanded} className="mt-2 block/);
  assert.match(itemComponent, /{expanded && <ItemInspection item={item}/);
});

test('initial review opens first inspection once without trapping reviewer', () => {
  assert.match(source, /const initialInspectionShown = useRef\(false\)/);
  assert.match(source, /reviewRuns\[0\]\?\.items\?\.\[0\]/);
  assert.match(source, /!initialInspectionShown\.current/);
  assert.match(source, /setExpandedItems\(\(current\) => new Set\(current\)\.add\(firstItem\.id\)\)/);
});

test('expanded inspection exposes answer options, explanation and quality gates', () => {
  assert.match(itemComponent, /function ItemInspection\(/);
  assert.match(itemComponent, /itemOptionValues\(item\.payload\)/);
  assert.match(itemComponent, /itemExplanation\(item\.payload\)/);
  assert.match(itemComponent, /Production quality gate/);
});
