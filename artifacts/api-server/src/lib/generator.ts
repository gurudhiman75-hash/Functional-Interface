// Orchestration entrypoint only.
// The concrete generator implementation now lives in the domain-oriented
// core engine so callers can keep importing from this stable module path.

export * from "./core/generator-engine";
