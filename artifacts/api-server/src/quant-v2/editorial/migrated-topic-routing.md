# Quant V2 Migrated Topic Routing

Percentage and Profit, Loss & Discount are migrated Quant V2 topics. Admin generation, API generation, scheduler batches, category/test generation, question-bank generation, and bulk generation should resolve these topics to their Quant V2 domains.

Migrated aliases are mapped in `src/lib/quant-v2/migrated-quant-topics.ts`.

- Percentage: `percentage`, `percentages`, `percent`
- Profit/Loss: `profit-loss`, `profit_loss`, `profit-loss-discount`, `profit-loss-and-discount`, `profit loss`, `profit, loss & discount`

Legacy quant generation is disabled for these migrated topics. If a migrated topic reaches the legacy formula generator, generation throws:

`Legacy quant generation is disabled for Percentage and Profit/Loss. Use Quant V2.`

Future Quant topics should migrate by adding aliases to the routing utility, registering the V2 adapter/domain, then adding guard tests in `src/quant-v2/tests/quant-v2-admin-integration.test.ts`.

Current routing guards cover:

- registry alias resolution,
- `inferGenerationDomain`,
- legacy formula fallback blocking,
- mandatory scheduled batches for multi-question migrated topics,
- Quant V2 metadata/family/topology presence in generated output.
