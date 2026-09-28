import type { VennPairRelation, VennSetId } from "./logical-venn-topology.ts";
import type { VennTopologyId } from "./logical-venn-renderer.ts";

export type VennLocale = "en-IN" | "hi-IN" | "pa-IN";

export type VennCategorySet = Readonly<{
  setId: VennSetId;
  labels: Readonly<Record<VennLocale, string>>;
}>;

export type VennScenarioAuthority = Readonly<{
  authorityId: string;
  domain: "ANIMAL_CLASSIFICATION" | "GEOMETRY" | "NUMBER_CLASSIFICATION";
  sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE";
  reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW";
  sets: readonly VennCategorySet[];
  relations: readonly Readonly<{
    left: VennSetId;
    right: VennSetId;
    relation: VennPairRelation;
  }>[];
  threeWayIntersection?: "UNSPECIFIED" | "REQUIRED" | "FORBIDDEN";
  topologyId: VennTopologyId;
  rationale: string;
}>;

export const VEN_001_SCENARIO_AUTHORITIES: readonly VennScenarioAuthority[] = [
  {
    authorityId: "VEN-AUTH-001-SPARROW-BIRD-ANIMAL",
    domain: "ANIMAL_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      { setId: "A", labels: { "en-IN": "Sparrows", "hi-IN": "गौरैयाँ", "pa-IN": "ਗੌਰੀਆਂ" } },
      { setId: "B", labels: { "en-IN": "Birds", "hi-IN": "पक्षी", "pa-IN": "ਪੰਛੀ" } },
      { setId: "C", labels: { "en-IN": "Animals", "hi-IN": "जानवर", "pa-IN": "ਜਾਨਵਰ" } },
    ],
    relations: [
      { left: "A", right: "B", relation: "LEFT_SUBSET_RIGHT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_NESTED",
    rationale: "Every sparrow is a bird, and every bird is an animal.",
  },
  {
    authorityId: "VEN-AUTH-002-SNAKE-LIZARD-REPTILE",
    domain: "ANIMAL_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      { setId: "A", labels: { "en-IN": "Snakes", "hi-IN": "साँप", "pa-IN": "ਸੱਪ" } },
      { setId: "B", labels: { "en-IN": "Lizards", "hi-IN": "छिपकलियाँ", "pa-IN": "ਛਿਪਕਲੀਆਂ" } },
      { setId: "C", labels: { "en-IN": "Reptiles", "hi-IN": "सरीसृप", "pa-IN": "ਰੇਂਗਣ ਵਾਲੇ ਜੀਵ" } },
    ],
    relations: [
      { left: "A", right: "B", relation: "DISJOINT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_TWO_DISJOINT_SUBSETS",
    rationale: "Snakes and lizards are separate reptile groups in the conventional school-level classification used by exam questions.",
  },
  {
    authorityId: "VEN-AUTH-003-SQUARE-RECTANGLE-QUADRILATERAL",
    domain: "GEOMETRY",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      { setId: "A", labels: { "en-IN": "Squares", "hi-IN": "वर्ग", "pa-IN": "ਵਰਗ" } },
      { setId: "B", labels: { "en-IN": "Rectangles", "hi-IN": "आयत", "pa-IN": "ਆਇਤ" } },
      { setId: "C", labels: { "en-IN": "Quadrilaterals", "hi-IN": "चतुर्भुज", "pa-IN": "ਚਤੁਰਭੁਜ" } },
    ],
    relations: [
      { left: "A", right: "B", relation: "LEFT_SUBSET_RIGHT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_NESTED",
    rationale: "Under the standard Euclidean definitions, every square is a rectangle and every rectangle is a quadrilateral.",
  },
  {
    authorityId: "VEN-AUTH-004-SQUARE-CIRCLE-PLANE-FIGURE",
    domain: "GEOMETRY",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      { setId: "A", labels: { "en-IN": "Squares", "hi-IN": "वर्ग", "pa-IN": "ਵਰਗ" } },
      { setId: "B", labels: { "en-IN": "Circles", "hi-IN": "वृत्त", "pa-IN": "ਵ੍ਰਿਤ" } },
      { setId: "C", labels: { "en-IN": "Plane figures", "hi-IN": "समतलीय आकृतियाँ", "pa-IN": "ਸਮਤਲੀ ਆਕ੍ਰਿਤੀਆਂ" } },
    ],
    relations: [
      { left: "A", right: "B", relation: "DISJOINT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_TWO_DISJOINT_SUBSETS",
    rationale: "Squares and circles are distinct plane figures; neither has members in the other class.",
  },
  {
    authorityId: "VEN-AUTH-005-PRIME-ODD-NATURAL",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      { setId: "A", labels: { "en-IN": "Prime numbers", "hi-IN": "अभाज्य संख्याएँ", "pa-IN": "ਅਭਾਜ ਸੰਖਿਆਵਾਂ" } },
      { setId: "B", labels: { "en-IN": "Odd natural numbers", "hi-IN": "विषम प्राकृतिक संख्याएँ", "pa-IN": "ਟਾਂਕ ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ" } },
      { setId: "C", labels: { "en-IN": "Natural numbers", "hi-IN": "प्राकृतिक संख्याएँ", "pa-IN": "ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ" } },
    ],
    relations: [
      { left: "A", right: "B", relation: "PARTIAL_OVERLAP" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    threeWayIntersection: "REQUIRED",
    topologyId: "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
    rationale: "Prime numbers and odd natural numbers overlap but neither contains the other; both are subsets of natural numbers.",
  },
  {
    authorityId: "VEN-AUTH-006-EVEN-ODD-INTEGERS",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      { setId: "A", labels: { "en-IN": "Even integers", "hi-IN": "सम पूर्णांक", "pa-IN": "ਸਮ ਪੂਰਨ ਅੰਕ" } },
      { setId: "B", labels: { "en-IN": "Odd integers", "hi-IN": "विषम पूर्णांक", "pa-IN": "ਟਾਂਕ ਪੂਰਨ ਅੰਕ" } },
      { setId: "C", labels: { "en-IN": "Integers", "hi-IN": "पूर्णांक", "pa-IN": "ਪੂਰਨ ਅੰਕ" } },
    ],
    relations: [
      { left: "A", right: "B", relation: "DISJOINT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_TWO_DISJOINT_SUBSETS",
    rationale: "Even and odd integers are disjoint classes contained within the integers.",
  },
  {
    authorityId: "VEN-AUTH-007-RIGHT-ISOSCELES-TRIANGLES",
    domain: "GEOMETRY",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      { setId: "A", labels: { "en-IN": "Right triangles", "hi-IN": "समकोण त्रिभुज", "pa-IN": "ਸਮਕੋਣੀ ਤਿਕੋਣ" } },
      { setId: "B", labels: { "en-IN": "Isosceles triangles", "hi-IN": "समद्विबाहु त्रिभुज", "pa-IN": "ਸਮਦੋਬਾਹੂ ਤਿਕੋਣ" } },
      { setId: "C", labels: { "en-IN": "Triangles", "hi-IN": "त्रिभुज", "pa-IN": "ਤਿਕੋਣ" } },
    ],
    relations: [
      { left: "A", right: "B", relation: "PARTIAL_OVERLAP" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    threeWayIntersection: "REQUIRED",
    topologyId: "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
    rationale: "Some triangles are both right and isosceles; right and isosceles triangles each also include triangles outside the other class.",
  },
  {
    authorityId: "VEN-AUTH-008-MULTIPLES-2-3-NATURAL",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      { setId: "A", labels: { "en-IN": "Positive multiples of 2", "hi-IN": "2 के धनात्मक गुणज", "pa-IN": "2 ਦੇ ਧਨਾਤਮਕ ਗੁਣਜ" } },
      { setId: "B", labels: { "en-IN": "Positive multiples of 3", "hi-IN": "3 के धनात्मक गुणज", "pa-IN": "3 ਦੇ ਧਨਾਤਮਕ ਗੁਣਜ" } },
      { setId: "C", labels: { "en-IN": "Natural numbers", "hi-IN": "प्राकृतिक संख्याएँ", "pa-IN": "ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ" } },
    ],
    relations: [
      { left: "A", right: "B", relation: "PARTIAL_OVERLAP" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    threeWayIntersection: "REQUIRED",
    topologyId: "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
    rationale: "Positive multiples of 2 and 3 overlap at positive multiples of 6; each class also has members outside the other.",
  },
];
