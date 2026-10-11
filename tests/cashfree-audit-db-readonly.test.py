#!/usr/bin/env python3
import ast
import pathlib
import unittest

SOURCE = pathlib.Path(__file__).resolve().parent.parent / "scripts/audit-cashfree-sandbox-readonly.py"
tree = ast.parse(SOURCE.read_text(encoding="utf-8"))


class TestReadOnlyInventoryGuards(unittest.TestCase):
    def test_read_only_transaction_and_timeout(self):
        source = SOURCE.read_text(encoding="utf-8")
        self.assertIn("BEGIN TRANSACTION READ ONLY;", source)
        self.assertIn("SET LOCAL statement_timeout", source)
        self.assertIn('env.pop("PGOPTIONS", None)', source)
        self.assertIn('"VERBOSITY=sqlstate"', source)
        self.assertIn("stderr=subprocess.PIPE", source)

    def test_inventory_does_not_embed_writes(self):
        source = SOURCE.read_text(encoding="utf-8")
        sql = source.split('INVENTORY_SQL = r"""', 1)[1].split('"""', 1)[0]
        self.assertEqual(sql.strip().split()[0], "SELECT")
        for forbidden in ("INSERT INTO", "UPDATE ", "DELETE FROM", "DROP ", "ALTER ", "TRUNCATE "):
            self.assertNotIn(forbidden, sql.upper())


if __name__ == "__main__":
    unittest.main()
