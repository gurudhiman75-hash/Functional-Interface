import { getFractionEquivalent } from './fraction-equivalent-service';

console.assert(getFractionEquivalent('20%') === '1/5');
console.assert(getFractionEquivalent('25%') === '1/4');
console.assert(getFractionEquivalent('17%') === null);
