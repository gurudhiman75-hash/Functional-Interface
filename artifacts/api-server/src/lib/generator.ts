// Orchestration entrypoint only.
// The concrete generator implementation now lives in the domain-oriented
// core engine so callers can keep importing from this stable module path.

export * from "./core/generator-engine";
export * from "./bulk-generation";
export * from "./core/quality-filter";
export * from "./core/topic-config";
export * from "./pattern-registry";
