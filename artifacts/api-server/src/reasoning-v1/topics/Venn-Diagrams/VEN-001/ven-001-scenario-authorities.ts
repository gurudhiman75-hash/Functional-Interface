import type { VennPairRelation, VennSetId } from "./logical-venn-topology.ts";
import type { VennTopologyId } from "./logical-venn-renderer.ts";

export type VennLocale = "en-IN" | "hi-IN" | "pa-IN";

export type VennCategorySet = Readonly<{
  setId: VennSetId;
  labels: Readonly<Record<VennLocale, string>>;
}>;

export type VennScenarioAuthority = Readonly<{
  authorityId: string;
  domain:
    | "ANIMAL_CLASSIFICATION"
    | "GEOMETRY"
    | "NUMBER_CLASSIFICATION"
    | "LANGUAGE_CLASSIFICATION";
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
      {
        setId: "A",
        labels: { "en-IN": "Sparrows", "hi-IN": "गौरैयाँ", "pa-IN": "ਗੌਰੀਆਂ" },
      },
      {
        setId: "B",
        labels: { "en-IN": "Birds", "hi-IN": "पक्षी", "pa-IN": "ਪੰਛੀ" },
      },
      {
        setId: "C",
        labels: { "en-IN": "Animals", "hi-IN": "जानवर", "pa-IN": "ਜਾਨਵਰ" },
      },
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
      {
        setId: "A",
        labels: { "en-IN": "Snakes", "hi-IN": "साँप", "pa-IN": "ਸੱਪ" },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Lizards",
          "hi-IN": "छिपकलियाँ",
          "pa-IN": "ਛਿਪਕਲੀਆਂ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Reptiles",
          "hi-IN": "सरीसृप",
          "pa-IN": "ਰੇਂਗਣ ਵਾਲੇ ਜੀਵ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "DISJOINT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_TWO_DISJOINT_SUBSETS",
    rationale:
      "Snakes and lizards are separate reptile groups in the conventional school-level classification used by exam questions.",
  },
  {
    authorityId: "VEN-AUTH-003-SQUARE-RECTANGLE-QUADRILATERAL",
    domain: "GEOMETRY",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: { "en-IN": "Squares", "hi-IN": "वर्ग", "pa-IN": "ਵਰਗ" },
      },
      {
        setId: "B",
        labels: { "en-IN": "Rectangles", "hi-IN": "आयत", "pa-IN": "ਆਇਤ" },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Quadrilaterals",
          "hi-IN": "चतुर्भुज",
          "pa-IN": "ਚਤੁਰਭੁਜ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "LEFT_SUBSET_RIGHT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_NESTED",
    rationale:
      "Under the standard Euclidean definitions, every square is a rectangle and every rectangle is a quadrilateral.",
  },
  {
    authorityId: "VEN-AUTH-004-SQUARE-CIRCLE-PLANE-FIGURE",
    domain: "GEOMETRY",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: { "en-IN": "Squares", "hi-IN": "वर्ग", "pa-IN": "ਵਰਗ" },
      },
      {
        setId: "B",
        labels: { "en-IN": "Circles", "hi-IN": "वृत्त", "pa-IN": "ਵ੍ਰਿਤ" },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Plane figures",
          "hi-IN": "समतलीय आकृतियाँ",
          "pa-IN": "ਸਮਤਲੀ ਆਕ੍ਰਿਤੀਆਂ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "DISJOINT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_TWO_DISJOINT_SUBSETS",
    rationale:
      "Squares and circles are distinct plane figures; neither has members in the other class.",
  },
  {
    authorityId: "VEN-AUTH-005-PRIME-ODD-NATURAL",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: {
          "en-IN": "Prime numbers",
          "hi-IN": "अभाज्य संख्याएँ",
          "pa-IN": "ਅਭਾਜ ਸੰਖਿਆਵਾਂ",
        },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Odd natural numbers",
          "hi-IN": "विषम प्राकृतिक संख्याएँ",
          "pa-IN": "ਟਾਂਕ ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Natural numbers",
          "hi-IN": "प्राकृतिक संख्याएँ",
          "pa-IN": "ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "PARTIAL_OVERLAP" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    threeWayIntersection: "REQUIRED",
    topologyId: "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
    rationale:
      "Prime numbers and odd natural numbers overlap but neither contains the other; both are subsets of natural numbers.",
  },
  {
    authorityId: "VEN-AUTH-006-EVEN-ODD-INTEGERS",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: {
          "en-IN": "Even integers",
          "hi-IN": "सम पूर्णांक",
          "pa-IN": "ਸਮ ਪੂਰਨ ਅੰਕ",
        },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Odd integers",
          "hi-IN": "विषम पूर्णांक",
          "pa-IN": "ਟਾਂਕ ਪੂਰਨ ਅੰਕ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Integers",
          "hi-IN": "पूर्णांक",
          "pa-IN": "ਪੂਰਨ ਅੰਕ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "DISJOINT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_TWO_DISJOINT_SUBSETS",
    rationale:
      "Even and odd integers are disjoint classes contained within the integers.",
  },
  {
    authorityId: "VEN-AUTH-007-RIGHT-ISOSCELES-TRIANGLES",
    domain: "GEOMETRY",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: {
          "en-IN": "Right triangles",
          "hi-IN": "समकोण त्रिभुज",
          "pa-IN": "ਸਮਕੋਣੀ ਤਿਕੋਣ",
        },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Isosceles triangles",
          "hi-IN": "समद्विबाहु त्रिभुज",
          "pa-IN": "ਸਮਦੋਬਾਹੂ ਤਿਕੋਣ",
        },
      },
      {
        setId: "C",
        labels: { "en-IN": "Triangles", "hi-IN": "त्रिभुज", "pa-IN": "ਤਿਕੋਣ" },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "PARTIAL_OVERLAP" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    threeWayIntersection: "REQUIRED",
    topologyId: "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
    rationale:
      "Some triangles are both right and isosceles; right and isosceles triangles each also include triangles outside the other class.",
  },
  {
    authorityId: "VEN-AUTH-008-MULTIPLES-2-3-NATURAL",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: {
          "en-IN": "Positive multiples of 2",
          "hi-IN": "2 के धनात्मक गुणज",
          "pa-IN": "2 ਦੇ ਧਨਾਤਮਕ ਗੁਣਜ",
        },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Positive multiples of 3",
          "hi-IN": "3 के धनात्मक गुणज",
          "pa-IN": "3 ਦੇ ਧਨਾਤਮਕ ਗੁਣਜ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Natural numbers",
          "hi-IN": "प्राकृतिक संख्याएँ",
          "pa-IN": "ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "PARTIAL_OVERLAP" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    threeWayIntersection: "REQUIRED",
    topologyId: "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
    rationale:
      "Positive multiples of 2 and 3 overlap at positive multiples of 6; each class also has members outside the other.",
  },
  {
    authorityId: "VEN-AUTH-009-INTEGER-RATIONAL-REAL",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: {
          "en-IN": "Integers",
          "hi-IN": "पूर्णांक",
          "pa-IN": "ਪੂਰਨ ਅੰਕ",
        },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Rational numbers",
          "hi-IN": "परिमेय संख्याएँ",
          "pa-IN": "ਪਰਿਮੇਯ ਸੰਖਿਆਵਾਂ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Real numbers",
          "hi-IN": "वास्तविक संख्याएँ",
          "pa-IN": "ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "LEFT_SUBSET_RIGHT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_NESTED",
    rationale: "Every integer is rational, and every rational number is real.",
  },
  {
    authorityId: "VEN-AUTH-010-WHOLE-INTEGER-RATIONAL",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: {
          "en-IN": "Whole numbers",
          "hi-IN": "पूर्ण संख्याएँ",
          "pa-IN": "ਸੰਪੂਰਨ ਸੰਖਿਆਵਾਂ",
        },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Integers",
          "hi-IN": "पूर्णांक",
          "pa-IN": "ਪੂਰਨ ਅੰਕ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Rational numbers",
          "hi-IN": "परिमेय संख्याएँ",
          "pa-IN": "ਪਰਿਮੇਯ ਸੰਖਿਆਵਾਂ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "LEFT_SUBSET_RIGHT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_NESTED",
    rationale:
      "Whole numbers form a subset of integers, which form a subset of rational numbers.",
  },
  {
    authorityId: "VEN-AUTH-011-RECTANGLE-RHOMBUS-QUADRILATERAL",
    domain: "GEOMETRY",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: { "en-IN": "Rectangles", "hi-IN": "आयत", "pa-IN": "ਆਇਤ" },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Rhombi",
          "hi-IN": "समचतुर्भुज",
          "pa-IN": "ਸਮਚਤੁਰਭੁਜ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Quadrilaterals",
          "hi-IN": "चतुर्भुज",
          "pa-IN": "ਚਤੁਰਭੁਜ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "PARTIAL_OVERLAP" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    threeWayIntersection: "REQUIRED",
    topologyId: "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
    rationale:
      "Rectangles and rhombi overlap at squares; each also contains quadrilaterals outside the other class.",
  },
  {
    authorityId: "VEN-AUTH-012-MULTIPLES-4-6-NATURAL",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: {
          "en-IN": "Positive multiples of 4",
          "hi-IN": "4 के धनात्मक गुणज",
          "pa-IN": "4 ਦੇ ਧਨਾਤਮਕ ਗੁਣਜ",
        },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Positive multiples of 6",
          "hi-IN": "6 के धनात्मक गुणज",
          "pa-IN": "6 ਦੇ ਧਨਾਤਮਕ ਗੁਣਜ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Natural numbers",
          "hi-IN": "प्राकृतिक संख्याएँ",
          "pa-IN": "ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "PARTIAL_OVERLAP" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    threeWayIntersection: "REQUIRED",
    topologyId: "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
    rationale:
      "Positive multiples of 4 and 6 overlap at positive multiples of 12; each also has members outside the other class.",
  },
  {
    authorityId: "VEN-AUTH-013-SQUARE-EVEN-NATURAL",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: {
          "en-IN": "Perfect squares",
          "hi-IN": "पूर्ण वर्ग संख्याएँ",
          "pa-IN": "ਪੂਰਨ ਵਰਗ ਸੰਖਿਆਵਾਂ",
        },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Even natural numbers",
          "hi-IN": "सम प्राकृतिक संख्याएँ",
          "pa-IN": "ਸਮ ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Natural numbers",
          "hi-IN": "प्राकृतिक संख्याएँ",
          "pa-IN": "ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "PARTIAL_OVERLAP" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    threeWayIntersection: "REQUIRED",
    topologyId: "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
    rationale:
      "Some perfect squares are even; odd squares and nonsquare even natural numbers establish both exclusive regions.",
  },
  {
    authorityId: "VEN-AUTH-014-BIRDS-MAMMALS-ANIMALS",
    domain: "ANIMAL_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: { "en-IN": "Birds", "hi-IN": "पक्षी", "pa-IN": "ਪੰਛੀ" },
      },
      {
        setId: "B",
        labels: { "en-IN": "Mammals", "hi-IN": "स्तनधारी", "pa-IN": "ਥਣਧਾਰੀ" },
      },
      {
        setId: "C",
        labels: { "en-IN": "Animals", "hi-IN": "जानवर", "pa-IN": "ਜਾਨਵਰ" },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "DISJOINT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_TWO_DISJOINT_SUBSETS",
    rationale: "Birds and mammals are separate animal classes.",
  },
  {
    authorityId: "VEN-AUTH-015-SPIDERS-INSECTS-ARTHROPODS",
    domain: "ANIMAL_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: { "en-IN": "Spiders", "hi-IN": "मकड़ियाँ", "pa-IN": "ਮੱਕੜੀਆਂ" },
      },
      {
        setId: "B",
        labels: { "en-IN": "Insects", "hi-IN": "कीट", "pa-IN": "ਕੀੜੇ-ਮਕੌੜੇ" },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Arthropods",
          "hi-IN": "संधिपाद",
          "pa-IN": "ਸੰਧੀਪਾਦ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "DISJOINT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_TWO_DISJOINT_SUBSETS",
    rationale: "Spiders and insects are separate arthropod classes.",
  },
  {
    authorityId: "VEN-AUTH-016-FROGS-REPTILES-VERTEBRATES",
    domain: "ANIMAL_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: { "en-IN": "Frogs", "hi-IN": "मेंढक", "pa-IN": "ਡੱਡੂ" },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Reptiles",
          "hi-IN": "सरीसृप",
          "pa-IN": "ਰੇਂਗਣ ਵਾਲੇ ਜੀਵ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Vertebrates",
          "hi-IN": "कशेरुकी",
          "pa-IN": "ਰੀੜ੍ਹਧਾਰੀ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "DISJOINT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_TWO_DISJOINT_SUBSETS",
    rationale:
      "Frogs are amphibians, not reptiles; both groups are vertebrates.",
  },
  {
    authorityId: "VEN-AUTH-017-PRIMES-EVEN-NATURAL",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: {
          "en-IN": "Prime numbers",
          "hi-IN": "अभाज्य संख्याएँ",
          "pa-IN": "ਅਭਾਜ ਸੰਖਿਆਵਾਂ",
        },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Even natural numbers",
          "hi-IN": "सम प्राकृतिक संख्याएँ",
          "pa-IN": "ਸਮ ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Natural numbers",
          "hi-IN": "प्राकृतिक संख्याएँ",
          "pa-IN": "ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "PARTIAL_OVERLAP" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    threeWayIntersection: "REQUIRED",
    topologyId: "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
    rationale:
      "The prime number 2 is even; other primes are odd and other even natural numbers are composite.",
  },
  {
    authorityId: "VEN-AUTH-018-PROSE-POETRY-LITERATURE",
    domain: "LANGUAGE_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: { "en-IN": "Prose", "hi-IN": "गद्य", "pa-IN": "ਵਾਰਤਕ" },
      },
      {
        setId: "B",
        labels: { "en-IN": "Poetry", "hi-IN": "कविता", "pa-IN": "ਕਵਿਤਾ" },
      },
      {
        setId: "C",
        labels: { "en-IN": "Literature", "hi-IN": "साहित्य", "pa-IN": "ਸਾਹਿਤ" },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "DISJOINT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_TWO_DISJOINT_SUBSETS",
    rationale:
      "Prose and poetry are distinct literary forms, each within literature.",
  },
  {
    authorityId: "VEN-AUTH-019-WHOLE-RATIONAL-REAL",
    domain: "NUMBER_CLASSIFICATION",
    sourceKind: "CURATED_CANONICAL_FACT_CANDIDATE",
    reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
    sets: [
      {
        setId: "A",
        labels: {
          "en-IN": "Whole numbers",
          "hi-IN": "पूर्ण संख्याएँ",
          "pa-IN": "ਸੰਪੂਰਨ ਸੰਖਿਆਵਾਂ",
        },
      },
      {
        setId: "B",
        labels: {
          "en-IN": "Rational numbers",
          "hi-IN": "परिमेय संख्याएँ",
          "pa-IN": "ਪਰਿਮੇਯ ਸੰਖਿਆਵਾਂ",
        },
      },
      {
        setId: "C",
        labels: {
          "en-IN": "Real numbers",
          "hi-IN": "वास्तविक संख्याएँ",
          "pa-IN": "ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ",
        },
      },
    ],
    relations: [
      { left: "A", right: "B", relation: "LEFT_SUBSET_RIGHT" },
      { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
      { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
    ],
    topologyId: "THREE_NESTED",
    rationale:
      "Every whole number is rational, and every rational number is real.",
  },
];
