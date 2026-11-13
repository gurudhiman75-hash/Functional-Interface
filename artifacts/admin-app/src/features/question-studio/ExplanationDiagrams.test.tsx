import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExplanationDiagrams, decodeAlligationMarker, splitAlligationExplanation, derivePureAdditionCross } from './ExplanationDiagrams';

const cross = {
  version: 1, kind: 'cross', title: 'Alligation Cross',
  lower: { label: 'regular tea leaves', value: '₹48 per kg', quantity: '3 kg' },
  higher: { label: 'premium tea leaves', value: '₹81 per kg', quantity: '6 kg' },
  mean: { label: 'Target mean', value: '₹70 per kg' },
  lowerPart: { label: 'regular tea leaves part', value: '11', expression: '81 - 70' },
  higherPart: { label: 'premium tea leaves part', value: '22', expression: '70 - 48' },
} as const;

function marker(value: unknown) {
  const binary = Array.from(new TextEncoder().encode(JSON.stringify(value)), b => String.fromCharCode(b)).join('');
  return '[[EXAMTREE_ALLIGATION_SVG_V1:' + btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '') + ']]';
}

describe('Question Studio explanation diagrams', () => {
  it('decodes an existing versioned alligation cross, including Unicode currency', () => {
    const encoded = marker(cross).slice('[[EXAMTREE_ALLIGATION_SVG_V1:'.length, -2);
    expect(decodeAlligationMarker(encoded)).toEqual(cross);
  });

  it('renders the SVG in place without dropping preceding or following explanation text', () => {
    const explanation = 'Method 1 — Simple Method\n₹630 − ₹486 = ₹144.\nMethod 2 — Alligation Cross\n' +
      marker(cross) + '\nAnswer: ₹48 per kg.';
    const fragments = splitAlligationExplanation(explanation);
    expect(fragments.map(fragment => fragment.kind)).toEqual(['text','diagram','text']);
    const markup = renderToStaticMarkup(<ExplanationDiagrams explanation={explanation} />);
    expect(markup).toContain('<svg');
    expect(markup).toContain('regular tea leaves');
    expect(markup).toContain('₹48 per kg');
    expect(markup).toContain('₹81 per kg');
    expect(markup).toContain('₹70 per kg');
    expect(markup).toContain('81 - 70');
    expect(markup).toContain('70 - 48');
    expect(markup).toContain('Method 1');
    expect(markup).toContain('Answer: ₹48 per kg');
    expect(markup).not.toContain('EXAMTREE_ALLIGATION_SVG_V1');
  });

  it('accepts standard Base64 with optional padding as well as Base64URL', () => {
    const ascii = { ...cross, title: 'Alligation Cross' };
    const binary = Array.from(new TextEncoder().encode(JSON.stringify(ascii)), byte => String.fromCharCode(byte)).join('');
    const raw = btoa(binary);
    const text = 'Before\\n[[EXAMTREE_ALLIGATION_SVG_V1:' + raw + ']]\\nAfter';
    const parts = splitAlligationExplanation(text);
    expect(parts.map(part => part.kind)).toEqual(['text', 'diagram', 'text']);
    expect(renderToStaticMarkup(<ExplanationDiagrams explanation={text} />)).toContain('<svg');
    expect(renderToStaticMarkup(<ExplanationDiagrams explanation={text} />)).not.toContain('EXAMTREE_ALLIGATION_SVG_V1');
  });

  it('renders ratio adjustment directives and leaves normal text in place', () => {
    const ratio = {
      version: 1, kind: 'TWO_COMPONENT', title: 'Ratio adjustment',
      quantityUnit: 'litres',
      before: [{ label: 'Milk', quantity: '7 litres' }, { label: 'Water', quantity: '5 litres' }],
      operation: 'Remove 2 litres of water',
      after: [{ label: 'Milk', quantity: '7 litres' }, { label: 'Water', quantity: '3 litres' }],
      beforeRatio: '7 : 5', afterRatio: '7 : 3',
      targetRatio: '7 : 3', note: 'Only water decreases',
    };
    const text = 'Original composition\n' +
      marker(ratio).replace('EXAMTREE_ALLIGATION_SVG_V1', 'EXAMTREE_RATIO_ADJUSTMENT_SVG_V1')
      + '\nFinal composition';
    const pieces = splitAlligationExplanation(text);
    expect(pieces.map(piece => piece.kind)).toEqual(['text', 'ratio-adjustment', 'text']);
    const html = renderToStaticMarkup(<ExplanationDiagrams explanation={text} />);
    expect(html).toContain('<svg');
    expect(html).toContain('7 : 3');
    expect(html).toContain('Original composition');
    expect(html).toContain('Final composition');
    expect(html).not.toContain('EXAMTREE_RATIO_ADJUSTMENT_SVG_V1');
  });

  it('offers accessible enlargement for alligation cross and ratio diagrams', () => {
    const crossHtml = renderToStaticMarkup(<ExplanationDiagrams explanation={marker(cross)} />);
    expect(crossHtml).toContain('aria-label="Enlarge diagram"');
    expect(crossHtml).toContain('min-w-[480px]');
    expect(crossHtml).toContain('overflow-auto');
    const ratio = {
      version: 1, kind: 'TWO_COMPONENT', title: 'Conserved-part ratio method',
      quantityUnit: 'kg', operation: 'Remove Darjeeling tea', note: 'Only Darjeeling tea changes',
      before: [{ label: 'Assam tea', quantity: '79 kg' }, { label: 'Darjeeling tea', quantity: '79 kg' }],
      after: [{ label: 'Assam tea', quantity: '79 kg' }, { label: 'Darjeeling tea', quantity: '53 kg' }],
      beforeRatio: '1 : 1', afterRatio: '79 : 53',
    };
    const html = renderToStaticMarkup(<ExplanationDiagrams explanation={
      marker(ratio).replace('EXAMTREE_ALLIGATION_SVG_V1', 'EXAMTREE_RATIO_ADJUSTMENT_SVG_V1')
    } />);
    expect(html).toContain('aria-label="Enlarge diagram"');
    expect(html).toContain('Conserved-part ratio method');
    expect(html).toContain('79 : 53');
  });

  it('displays a true exact alligation cross for the 72-litre milk-water addition', () => {
    const ratio = {
      version: 1 as const, kind: 'TWO_COMPONENT' as const, title: 'Conserved-part ratio method',
      quantityUnit: 'litres', operation: 'Add 11 litres milk',
      before: [{ label: 'milk', quantity: '40 litres' }, { label: 'water', quantity: '32 litres' }],
      after: [{ label: 'milk', quantity: '51 litres' }, { label: 'water', quantity: '32 litres' }],
      beforeRatio: '5 : 4', afterRatio: '51 : 32', note: 'Water remains unchanged',
    };
    const actual = derivePureAdditionCross(ratio);
    expect(actual).not.toBeNull();
    expect(actual?.lower.value).toBe('5/9');
    expect(actual?.mean.value).toBe('51/83');
    expect(actual?.lowerPart.value).toBe('32/83');
    expect(actual?.higherPart.value).toBe('44/747');
    expect(actual?.quantityRatio).toContain('72 : 11');
    const html = renderToStaticMarkup(<ExplanationDiagrams explanation={
      marker(ratio).replace('EXAMTREE_ALLIGATION_SVG_V1', 'EXAMTREE_RATIO_ADJUSTMENT_SVG_V1')
    } />);
    expect(html).toContain('Alligation Cross');
    expect(html).toContain('72 : 11');
    expect(html).toContain('51/83');
    expect(html).not.toContain('Conserved-part ratio method');
    expect(derivePureAdditionCross({
      ...ratio, operation: 'Remove 11 litres milk',
      after: [{ label: 'milk', quantity: '29 litres' }, { label: 'water', quantity: '32 litres' }],
    })).toBeNull();
    expect(derivePureAdditionCross({
      ...ratio, after: [{ label: 'milk', quantity: '51 litres' }, { label: 'water', quantity: '30 litres' }],
    })).toBeNull();
  });

  it('does not execute HTML or SVG code supplied through an explanation marker', () => {
    const malicious = { ...cross, title: '<img src=x onerror=alert(1)>' };
    const markup = renderToStaticMarkup(<ExplanationDiagrams explanation={marker(malicious)} />);
    expect(markup).not.toContain('<img');
    expect(markup).toContain('&lt;img');
  });

  it('rejects malformed and oversized markers without hiding the editor source', () => {
    expect(decodeAlligationMarker('%%%')).toBeNull();
    expect(decodeAlligationMarker('x'.repeat(32769))).toBeNull();
    const markup = renderToStaticMarkup(
      <ExplanationDiagrams explanation={'Before\n[[EXAMTREE_ALLIGATION_SVG_V1:abc]]\nAfter'} />,
    );
    expect(markup).toContain('Diagram data could not be displayed');
    expect(markup).toContain('Before');
    expect(markup).toContain('After');
    expect(markup).not.toContain('EXAMTREE_ALLIGATION_SVG_V1');
  });

  it('supports cross sequences and deviation diagrams', () => {
    const sequence = { version: 1, kind: 'sequence', title: 'Stages',
      stages: [{ label: 'Stage one', diagram: cross }, { label: 'Stage two', diagram: cross }] };
    const deviation = { version: 1, kind: 'deviation', title: 'Deviation',
      target: { label: 'Mean', value: '5' },
      below: [{ label: 'First', value: '3', quantity: '2', deviation: '2' }],
      above: [{ label: 'Second', value: '7', quantity: '2', deviation: '2' }] };
    expect(renderToStaticMarkup(<ExplanationDiagrams explanation={marker(sequence)} />)).toContain('Stage two');
    expect(renderToStaticMarkup(<ExplanationDiagrams explanation={marker(deviation)} />)).toContain('Below target');
  });
});
