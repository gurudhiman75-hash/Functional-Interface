# Rollback And Recovery

## Restore Production Snapshot

Use the immutable release tag after it has been created:

```bash
git fetch --tags
git checkout v1-production-multilingual-stable
```

## Validate Recovery Integrity

Run:

```bash
pnpm --dir artifacts/api-server run production:validate
pnpm --dir artifacts/api-server run production:compare
pnpm --dir artifacts/api-server run test:quant-v2
```

## Restore Regression Goldens

Regenerate only when intentionally refreshing the production freeze:

```bash
pnpm --dir artifacts/api-server run production:validate
```

Then review:

- `production-freeze/release-manifest.json`
- `production-freeze/validation-report.json`
- `production-freeze/goldens/`
- `production-freeze/freeze-report.md`

## Recovery Rules

- Do not patch reasoning logic during rollback.
- Do not mutate semantic contracts to force validation.
- Compare regenerated goldens before accepting recovery.
- Keep equations language-neutral.
- Keep SVG rendering semantic-graph driven.

