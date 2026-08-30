import assert from 'node:assert/strict';

import { approvedContentHash, localizationContentHash } from './approval-versioning';
import {
  localizedResourceMatchesFrozenVersion,
  sourceResourceMatchesFrozenVersion,
  successorJobTitle,
} from './release-lineage';

const source = {
  title: 'Indian Polity: Parliament',
  summary: 'A concise learner note.',
  bodyMarkdown: '## Parliament\n\nArticle 79 provides for Parliament.',
};
const sourceHash = approvedContentHash(source);
assert.equal(sourceResourceMatchesFrozenVersion({ frozenContentHash: sourceHash, resource: source }), true);
assert.equal(sourceResourceMatchesFrozenVersion({
  frozenContentHash: sourceHash,
  resource: { ...source, bodyMarkdown: `${source.bodyMarkdown}\n\nSilent drift.` },
}), false);

const versionId = '00000000-0000-4000-8000-000000000099';
const localized = {
  title: 'भारतीय राजव्यवस्था: संसद',
  summary: 'एक संक्षिप्त शिक्षार्थी नोट।',
  bodyMarkdown: '## संसद\n\nअनुच्छेद 79 संसद का प्रावधान करता है।',
};
const localizedHash = localizationContentHash({
  approvedVersionId: versionId,
  sourceContentHash: sourceHash,
  languageCode: 'hi',
  ...localized,
});
assert.equal(localizedResourceMatchesFrozenVersion({
  approvedVersionId: versionId,
  sourceContentHash: sourceHash,
  frozenContentHash: localizedHash,
  languageCode: 'hi',
  resource: localized,
}), true);
assert.equal(localizedResourceMatchesFrozenVersion({
  approvedVersionId: versionId,
  sourceContentHash: sourceHash,
  frozenContentHash: localizedHash,
  languageCode: 'hi',
  resource: { ...localized, title: `${localized.title} बदला हुआ` },
}), false);

assert.equal(successorJobTitle('Parliament master note', 2), 'Parliament master note — revision 2');
assert.equal(successorJobTitle(' '.repeat(4), 3), 'Notes Studio note — revision 3');

console.log('Notes Studio NS-007 release integrity contracts passed');
