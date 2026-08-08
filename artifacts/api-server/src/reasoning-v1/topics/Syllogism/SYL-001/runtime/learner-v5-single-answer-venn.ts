// Compatibility shim. The rejected force-layout implementation was removed because
// it could add unstated containment or separation. All callers must use the exact
// finite-template renderer below.
export {
  renderExactVennV5 as renderSingleAnswerVennV5,
  type ExactVennResultV5 as SingleAnswerVennResultV5,
} from "./learner-v5-exact-venn";
