import { recoverAllPnl001CanonicalContextsV2 } from "./question-studio-canonical-context-v2";

type Owner = Readonly<{
  qlId: string;
  path: string;
}>;

const owners = new Map<string, Owner[]>();

function collect(value: unknown, qlId: string, path: string): void {
  if (typeof value === "string") {
    if (!/[A-Za-z]/u.test(value)) return;
    const entries = owners.get(value) ?? [];
    entries.push({ qlId, path });
    owners.set(value, entries);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, qlId, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      collect(item, qlId, path ? `${path}.${key}` : key);
    }
  }
}

const recoveries = recoverAllPnl001CanonicalContextsV2();
for (const recovery of recoveries) {
  collect(recovery.context, recovery.qlId, "context");
}

const textValues = [...owners.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([value, valueOwners]) => ({
    value,
    owners: valueOwners.sort((left, right) =>
      `${left.qlId}:${left.path}`.localeCompare(`${right.qlId}:${right.path}`),
    ),
  }));

console.log(
  JSON.stringify(
    {
      qlCount: recoveries.length,
      distinctContextTextValues: textValues.length,
      textValues,
    },
    null,
    2,
  ),
);
