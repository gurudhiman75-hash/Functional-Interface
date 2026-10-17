import { describe, expect, it } from 'vitest';
import { generationChapter, packageMainTopic, sortMainTopics } from './package-hierarchy';
import type { GenerationPackage } from './api';

function pkg(id: string, chapter: string, subject = 'Quantitative Aptitude', topic = ''): GenerationPackage {
  return {
    engineId: subject === 'Reasoning Ability' ? 'reasoning-v1' : 'quant-v4',
    packageId: id, subject, topic, chapter, subtopic: chapter, label: chapter,
    enabled: true, cpIds: ['CP-001'], supportedLanguages: ['en'],
  };
}

// Snapshot the exact 64-package set from the audited merged catalog.
// New registrations not listed here remain visible using their declared topic.
const ARITHMETIC = [
  'AVG-001', 'INT-001', 'MAL-001', 'NUM-001', 'NUM-002',
  'PCT-001', 'PCT-002', 'PCT-003', 'PCT-004', 'PCT-005', 'PCT-006', 'PCT-007',
  'PNL-001', 'PRT-001', 'RAP-001', 'RAP-002', 'RAP-003',
  'SAP', 'SRI-001', 'SRI-002', 'TMW-001', 'TSD-001', 'TSD-002', 'TSD-AUDIT-REVIEW',
];
const ADVANCED = [
  'ALGEBRA', 'GEO-001', 'MEN-002', 'MENSURATION',
  'PNC-001', 'PNC-002', 'PNC-SOURCE-REVIEW',
  'PRB-001', 'PRB-002', 'TRG-001', 'TRG-002',
];
const DI = Array.from({ length: 14 }, (_, i) => `DI-${String(i + 1).padStart(3, '0')}`).concat('DI-MIX-001');
const STATS = Array.from({ length: 14 }, (_, i) => `STAT-${String(i + 1).padStart(3, '0')}`);

describe('Question Studio hierarchy: 64 package Quant catalog', () => {
  it('places every audited Quant package into one of the four main topics', () => {
    const cases = [
      ...ARITHMETIC.map((id) => [id, 'Arithmetic']),
      ...ADVANCED.map((id) => [id, 'Advanced Mathematics']),
      ...DI.map((id) => [id, 'Data Interpretation']),
      ...STATS.map((id) => [id, 'Statistics']),
    ];
    expect(cases).toHaveLength(64);
    expect(new Set(cases.map(([id]) => id)).size).toBe(64);
    for (const [id, expected] of cases) {
      expect(packageMainTopic(pkg(id!, 'Arbitrary Chapter'))).toBe(expected);
    }
    expect(sortMainTopics('Quantitative Aptitude',
      ['Statistics', 'Arithmetic', 'Data Interpretation', 'Advanced Mathematics']))
      .toEqual(['Arithmetic', 'Advanced Mathematics', 'Data Interpretation', 'Statistics']);
  });

  it('keeps unknown registered Quant packages discoverable', () => {
    expect(packageMainTopic(pkg('NEW-900', 'Pilot', 'Quantitative Aptitude', 'New Math Topic'))).toBe('New Math Topic');
    expect(packageMainTopic(pkg('NEW-900', 'Pilot'))).toBe('Other Quantitative Aptitude');
  });

  it('keeps Reasoning out of Quant while refining generic chapter labels', () => {
    const c = pkg('IOP-001', 'Input Output', 'Reasoning Ability', 'Reasoning');
    expect(packageMainTopic(c)).toBe('Reasoning');
    expect(generationChapter(c)).toBe('Input Output');
    const clock = {...pkg('CLK-001', 'Reasoning', 'Reasoning Ability', 'Reasoning'), subtopic: 'Reasoning'};
    expect(generationChapter(clock)).toBe('Clocks');
  });

  it('does not mutate engine request fields, package selection or lifecycle gates', () => {
    const source = pkg('GEO-001', 'Geometry', 'Quantitative Aptitude', 'Advanced Mathematics');
    source.runtimeMode = 'QUESTION_STUDIO_ACTIVE';
    source.cpIds = ['GEO-CP-001'];
    const frozen = JSON.stringify(source);
    expect(packageMainTopic(source)).toBe('Advanced Mathematics');
    expect(generationChapter(source)).toBe('Geometry');
    expect(JSON.stringify(source)).toBe(frozen);
    expect(source.runtimeMode).toBe('QUESTION_STUDIO_ACTIVE');
  });
});
