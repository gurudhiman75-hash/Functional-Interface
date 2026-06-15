# PCT-001 Pre-Freeze Coverage Audit

## Summary

- Question count: 500
- Generation failures: 0
- Validation failures: 0
- Render failures: 0
- Solver failures: 0
- Duplicate rate: 19.20%
- Library validation failures: 0

## Architectural Repair Status

- Task routing source: task-registry.library.json
- Language-derived task inference: removed
- Answer type propagation: active
- Placeholder completeness validation: active
- Cross-language placeholder validation: active
- Task consistency validation: active

## CP Coverage

```json
{
  "PCT-CP-001": 84,
  "PCT-CP-002": 84,
  "PCT-CP-003": 83,
  "PCT-CP-004": 83,
  "PCT-CP-005": 83,
  "PCT-CP-006": 83
}
```

## QL Coverage

```json
{
  "PCT-QL-001": 10,
  "PCT-QL-010": 9,
  "PCT-QL-020": 11,
  "PCT-QL-028": 11,
  "PCT-QL-036": 7,
  "PCT-QL-048": 11,
  "PCT-QL-002": 10,
  "PCT-QL-011": 9,
  "PCT-QL-021": 11,
  "PCT-QL-029": 11,
  "PCT-QL-037": 7,
  "PCT-QL-049": 11,
  "PCT-QL-003": 10,
  "PCT-QL-012": 9,
  "PCT-QL-022": 11,
  "PCT-QL-030": 11,
  "PCT-QL-038": 7,
  "PCT-QL-050": 11,
  "PCT-QL-004": 9,
  "PCT-QL-013": 9,
  "PCT-QL-023": 10,
  "PCT-QL-031": 10,
  "PCT-QL-039": 7,
  "PCT-QL-051": 10,
  "PCT-QL-005": 9,
  "PCT-QL-014": 8,
  "PCT-QL-024": 10,
  "PCT-QL-032": 10,
  "PCT-QL-040": 7,
  "PCT-QL-052": 10,
  "PCT-QL-006": 9,
  "PCT-QL-015": 8,
  "PCT-QL-025": 10,
  "PCT-QL-033": 10,
  "PCT-QL-041": 7,
  "PCT-QL-053": 10,
  "PCT-QL-007": 9,
  "PCT-QL-016": 8,
  "PCT-QL-026": 10,
  "PCT-QL-034": 10,
  "PCT-QL-042": 7,
  "PCT-QL-054": 10,
  "PCT-QL-008": 9,
  "PCT-QL-017": 8,
  "PCT-QL-027": 10,
  "PCT-QL-035": 10,
  "PCT-QL-043": 7,
  "PCT-QL-055": 10,
  "PCT-QL-009": 9,
  "PCT-QL-018": 8,
  "PCT-QL-044": 7,
  "PCT-QL-019": 8,
  "PCT-QL-045": 7,
  "PCT-QL-046": 7,
  "PCT-QL-047": 6
}
```

## ES Coverage

```json
{
  "PCT-ES-001": 84,
  "PCT-ES-002": 84,
  "PCT-ES-003": 83,
  "PCT-ES-004": 83,
  "PCT-ES-005": 83,
  "PCT-ES-006": 83
}
```

## Difficulty Coverage

```json
{
  "Easy": 127,
  "Medium": 248,
  "Hard": 125
}
```

## Unused IDs

- Unused QL IDs: None
- Unused ES IDs: None

## Top Repeated Questions

- 5x: If the price of sugar increases by 22%, by how much percent should a family reduce its consumption to keep the expenditure same?
- 5x: The price of petrol falls by 35%. By what percent can a person increase his consumption so that the total cost remains same?
- 5x: In an exam, A gets 80% more marks than B. If A gets 300, find the marks of B.
- 4x: If a car's speed increases by 62.5%, by what percent will the time taken decrease for the same distance?
- 4x: If the price of sugar increases by 18%, by how much percent should a family reduce its consumption to keep the expenditure same?
- 4x: The length of a rectangle increases by 22%. By what percent should the breadth be decreased to keep the area same?
- 4x: If a car's speed increases by 66.66%, by what percent will the time taken decrease for the same distance?
- 3x: The price of an item is increased by 45%. By what percent should the new price be reduced to bring it back to the original?
- 3x: The length of a rectangle increases by 18%. By what percent should the breadth be decreased to keep the area same?
- 3x: The price of an item is increased by 50%. By what percent should the new price be reduced to bring it back to the original?

## Verification

- generation failures = 0
- validation failures = 0
- render failures = 0
- solver failures = 0
- unused QL IDs = 0
- unused ES IDs = 0
- verdict = PASS
