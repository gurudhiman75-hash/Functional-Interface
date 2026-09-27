export type MisSemanticAuthorityDisposition =
  | 'CANONICAL'
  | 'RENDERER_OR_ROLE_VARIANT'
  | 'INVERSE_QUERY_VARIANT'
  | 'RULE_COMPETITION_VARIANT'
  | 'ALGEBRAIC_DUPLICATE';

export interface MisSemanticAuthorityAlias {
  readonly runtimeCandidateId: string;
  readonly canonicalCandidateId: string;
  readonly disposition: MisSemanticAuthorityDisposition;
  readonly reason: string;
}

/**
 * Chapter-wide merge/split registry.
 *
 * A permanent authority represents the semantic arithmetic relation. Renderer,
 * position names, pairing orientation, missing position and evidence density are
 * runtime dimensions unless they materially change the inference rule.
 */
export const MIS_SEMANTIC_AUTHORITY_ALIASES: readonly MisSemanticAuthorityAlias[] = Object.freeze([
  // CP004 algebraic duplicates of CP003 using the same visible a,b inputs.
  { runtimeCandidateId:'MIS-CAND-028', canonicalCandidateId:'MIS-CAND-021', disposition:'ALGEBRAIC_DUPLICATE', reason:'a(a+b) = a² + ab for the same two visible inputs.' },
  { runtimeCandidateId:'MIS-CAND-029', canonicalCandidateId:'MIS-CAND-022', disposition:'ALGEBRAIC_DUPLICATE', reason:'b(a+b) = ab + b² for the same two visible inputs.' },

  // CP005 triangle relations are positional/rendering variants of existing arithmetic.
  { runtimeCandidateId:'MIS-CAND-035', canonicalCandidateId:'MIS-CAND-011', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'top×left+right is pair-product-adjust-third with triangle role labels.' },
  { runtimeCandidateId:'MIS-CAND-036', canonicalCandidateId:'MIS-CAND-011', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'top×left−right is pair-product-adjust-third with triangle role labels.' },
  { runtimeCandidateId:'MIS-CAND-037', canonicalCandidateId:'MIS-CAND-011', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'left×right+top is the same pair-product-adjust-third authority with permuted roles.' },
  { runtimeCandidateId:'MIS-CAND-038', canonicalCandidateId:'MIS-CAND-011', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'left×right−top is the same pair-product-adjust-third authority with permuted roles.' },
  { runtimeCandidateId:'MIS-CAND-039', canonicalCandidateId:'MIS-CAND-009', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'sum of three triangle vertices is three-input sum.' },
  { runtimeCandidateId:'MIS-CAND-040', canonicalCandidateId:'MIS-CAND-012', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'(top+left)×right is pair-sum-times-third.' },
  { runtimeCandidateId:'MIS-CAND-041', canonicalCandidateId:'MIS-CAND-012', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'(left+right)×top is pair-sum-times-third with permuted roles.' },
  { runtimeCandidateId:'MIS-CAND-042', canonicalCandidateId:'MIS-CAND-019', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'left²+right² is sum-of-squares.' },

  // CP006 wheel relations that are existing arithmetic with circular position labels.
  { runtimeCandidateId:'MIS-CAND-043', canonicalCandidateId:'MIS-CAND-009', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'sum of three surrounding values is three-input sum.' },
  { runtimeCandidateId:'MIS-CAND-044', canonicalCandidateId:'MIS-CAND-050', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'sum of four surrounding values is four-input sum, same relation as four-corner sum.' },
  { runtimeCandidateId:'MIS-CAND-045', canonicalCandidateId:'MIS-CAND-011', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'top×right−bottom is pair-product-adjust-third.' },
  { runtimeCandidateId:'MIS-CAND-047', canonicalCandidateId:'MIS-CAND-053', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'difference of opposite pair products is the pair-product-difference authority.' },
  { runtimeCandidateId:'MIS-CAND-048', canonicalCandidateId:'MIS-CAND-051', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'sum of opposite pair products is the pair-product-sum authority.' },
  { runtimeCandidateId:'MIS-CAND-049', canonicalCandidateId:'MIS-CAND-067', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'product of opposite-pair sums is product-of-two-pair-sums.' },

  // CP007 pairing orientation is a role-map dimension, not a separate authority.
  { runtimeCandidateId:'MIS-CAND-052', canonicalCandidateId:'MIS-CAND-051', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'column pair-products sum differs from row pair-products sum only by authoritative pairing map.' },
  { runtimeCandidateId:'MIS-CAND-055', canonicalCandidateId:'MIS-CAND-051', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'diagonal pair-products sum differs only by pairing map.' },
  { runtimeCandidateId:'MIS-CAND-056', canonicalCandidateId:'MIS-CAND-053', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'diagonal pair-products difference differs only by pairing map.' },

  // CP008 inverse query variants.
  { runtimeCandidateId:'MIS-CAND-057', canonicalCandidateId:'MIS-CAND-001', disposition:'INVERSE_QUERY_VARIANT', reason:'missing position/query direction does not create a new semantic rule.' },
  { runtimeCandidateId:'MIS-CAND-058', canonicalCandidateId:'MIS-CAND-003', disposition:'INVERSE_QUERY_VARIANT', reason:'missing position/query direction does not create a new semantic rule.' },
  { runtimeCandidateId:'MIS-CAND-060', canonicalCandidateId:'MIS-CAND-017', disposition:'INVERSE_QUERY_VARIANT', reason:'inverse a²+b reuses the forward authority.' },
  { runtimeCandidateId:'MIS-CAND-061', canonicalCandidateId:'MIS-CAND-012', disposition:'INVERSE_QUERY_VARIANT', reason:'inverse (a+b)×c reuses the forward authority.' },
  { runtimeCandidateId:'MIS-CAND-062', canonicalCandidateId:'MIS-CAND-011', disposition:'INVERSE_QUERY_VARIANT', reason:'inverse triangle left×right−top ultimately reuses pair-product-adjust-third.' },

  // CP009 exact duplicates / role-map variants of earlier box authorities.
  { runtimeCandidateId:'MIS-CAND-063', canonicalCandidateId:'MIS-CAND-051', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'ab+cd is the existing pair-product-sum authority.' },
  { runtimeCandidateId:'MIS-CAND-065', canonicalCandidateId:'MIS-CAND-051', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'ac+bd is the same pair-product-sum authority under a column pairing map.' },
  { runtimeCandidateId:'MIS-CAND-066', canonicalCandidateId:'MIS-CAND-051', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'ad+bc is the same pair-product-sum authority under a diagonal pairing map.' },
  { runtimeCandidateId:'MIS-CAND-068', canonicalCandidateId:'MIS-CAND-054', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'(a−b)(c+d) and (a+b)(c−d) share one add-pair/one subtract-pair then multiply authority with permuted roles.' },

  // CP012 adds evidence competition, not new arithmetic semantics.
  { runtimeCandidateId:'MIS-CAND-079', canonicalCandidateId:'MIS-CAND-001', disposition:'RULE_COMPETITION_VARIANT', reason:'hardness comes from competing evidence, while the surviving rule is SUM.' },
  { runtimeCandidateId:'MIS-CAND-080', canonicalCandidateId:'MIS-CAND-017', disposition:'RULE_COMPETITION_VARIANT', reason:'surviving semantic rule is a²+b.' },
  { runtimeCandidateId:'MIS-CAND-081', canonicalCandidateId:'MIS-CAND-051', disposition:'RULE_COMPETITION_VARIANT', reason:'surviving semantic rule is pair-product sum.' },
  { runtimeCandidateId:'MIS-CAND-082', canonicalCandidateId:'MIS-CAND-075', disposition:'RULE_COMPETITION_VARIANT', reason:'surviving semantic rule is ab−c².' },
  { runtimeCandidateId:'MIS-CAND-083', canonicalCandidateId:'MIS-CAND-051', disposition:'RULE_COMPETITION_VARIANT', reason:'surviving semantic rule is pair-product sum.' },

  // CP014 source-backed missing-corner presentation.
  { runtimeCandidateId:'MIS-CAND-086', canonicalCandidateId:'MIS-CAND-050', disposition:'INVERSE_QUERY_VARIANT', reason:'PSPCL repeated-square missing-corner form reuses the four-corner-sum semantic authority; invariant total and blank position are query dimensions.' },

  // CP019 stable pre-product subtraction is the same parameterized family as MIS-CAND-059.
  { runtimeCandidateId:'MIS-CAND-097', canonicalCandidateId:'MIS-CAND-059', disposition:'ALGEBRAIC_DUPLICATE', reason:'(a−2)b and ab−b=(a−1)b share the same subtract-a-stable-constant-from-first, then multiply-by-second semantic family; the constant is rule context.' },

  // CP025 RRB linked-product figure repeats the existing PRODUCT relation on two adjacent pairs.
  { runtimeCandidateId:'MIS-CAND-109', canonicalCandidateId:'MIS-CAND-003', disposition:'RENDERER_OR_ROLE_VARIANT', reason:'RRB linked-product figure applies the same multiplication authority to left×shared and shared×right; the shared-factor topology is a renderer/role dimension, not a new arithmetic semantic.' },
]);

const DIRECT = new Map(MIS_SEMANTIC_AUTHORITY_ALIASES.map((entry) => [entry.runtimeCandidateId, entry.canonicalCandidateId]));

export function canonicalMisSemanticAuthorityId(candidateId: string): string {
  let current = candidateId;
  const seen = new Set<string>();
  while (DIRECT.has(current)) {
    if (seen.has(current)) throw new Error('Cycle in MIS semantic authority registry at ' + current);
    seen.add(current);
    current = DIRECT.get(current)!;
  }
  return current;
}

export function misCandidateCreatesSemanticAuthority(candidateId: string): boolean {
  return canonicalMisSemanticAuthorityId(candidateId) === candidateId;
}

export function misSemanticAlias(candidateId: string): MisSemanticAuthorityAlias | null {
  return MIS_SEMANTIC_AUTHORITY_ALIASES.find((entry) => entry.runtimeCandidateId === candidateId) ?? null;
}
