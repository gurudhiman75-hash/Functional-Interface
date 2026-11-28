#!/usr/bin/env python3
"""Expand authoring rows into one exact-wording row per English wording.

Authoring file (separated by ¦):  patternId#slotCount ¦ match ¦ Hindi ¦ Punjabi
  match = plain text that must occur in the English wording. Empty match = every wording of that
  pattern#slotCount not claimed by an earlier row. Rows are applied top to bottom.
Output (tab separated):           patternId|English skeleton <TAB> Hindi <TAB> Punjabi

Usage: expand_authoring.py work/men002-todo.tsv sources/men002.authoring.tsv sources/men002.tsv
Fails if a row claims nothing or a wording in the todo list is left without a template.
"""
import sys
from collections import OrderedDict

partial = "--partial" in sys.argv
argv = [a for a in sys.argv[1:] if a != "--partial"]
todo_path, auth_path, out_path = argv[:3]
words = OrderedDict()  # (pattern, slots) -> list of [skeleton, claimed]
for line in open(todo_path, encoding="utf-8"):
    key, slots, _count, skeleton = line.rstrip("\n").split("\t")
    pattern = key.split("|", 1)[0]
    words.setdefault((pattern, int(slots)), []).append([skeleton, False])

out, errors = [], []
for no, line in enumerate(open(auth_path, encoding="utf-8"), 1):
    line = line.rstrip("\n")
    if not line.strip() or line.startswith("#"):
        continue
    cols = line.split("¦")
    if len(cols) != 4:
        errors.append(f"authoring line {no}: need 4 columns separated by ¦, got {len(cols)}")
        continue
    ref, match, hi, pa = cols
    optional = ref.startswith("?")
    ref = ref.lstrip("?")
    pid, n = ref.split("#")
    pid = "MEN-002-QL-" + pid[2:] if pid.startswith("2.") else ("MEN-CP011-PROT-" + pid[2:] if pid.startswith("P.") else pid)
    rows = words.get((pid, int(n)))
    if rows is None:
        if optional:
            continue
        errors.append(f"authoring line {no}: no wording for {pid}#{n}")
        continue
    claimed = 0
    for row in rows:
        if row[1]:
            continue
        if match == "" or all(m in row[0] for m in match.split("&&")):
            row[1] = True
            claimed += 1
            out.append(f"{pid}|{row[0]}\t{hi}\t{pa}")
    if claimed == 0 and not optional:
        errors.append(f"authoring line {no}: {ref} match {match!r} claimed nothing")
for (pid, n), rows in words.items():
    for skeleton, claimed in rows:
        if not claimed and not partial:
            errors.append(f"UNCOVERED {pid}#{n}: {skeleton}")
if errors:
    print("\n".join(errors[:60]))
    print(f"{len(errors)} problems")
    sys.exit(1)
open(out_path, "w", encoding="utf-8").write("\n".join(out) + "\n")
print(f"{len(out)} exact templates -> {out_path}")
