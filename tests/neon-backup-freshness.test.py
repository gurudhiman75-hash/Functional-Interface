#!/usr/bin/env python3
"""Offline, network-free tests for the read-only backup-freshness watchdog."""
import importlib.util
import unittest
from datetime import datetime, timezone
from pathlib import Path

MODULE = Path(__file__).resolve().parent.parent / "ops/neon-backup-freshness/check_freshness.py"
spec = importlib.util.spec_from_file_location("examtree_backup_freshness", MODULE)
watchdog = importlib.util.module_from_spec(spec)
spec.loader.exec_module(watchdog)

NAME = "neon-backups/daily/examtree-neon-daily-20261011T051500Z-worker.dump.gpg"
NOW = datetime(2026, 10, 11, 6, 0, tzinfo=timezone.utc)  # 11:30 IST
# Valid run happened 10:45 IST, after 03:30 IST schedule, and shares IST date.
BASE = [
    {"name": NAME, "size": "8600000", "timeCreated": "2026-10-11T05:15:10Z"},
    {"name": NAME + ".sha256", "size": "130", "timeCreated": "2026-10-11T05:16:15Z"},
]


class TestFreshness(unittest.TestCase):
    def test_valid_pair(self):
        self.assertEqual(watchdog.check_freshness(BASE, NOW), NAME)

    def test_missing_daily_backup(self):
        with self.assertRaisesRegex(RuntimeError, "No encrypted Neon backup"):
            watchdog.check_freshness([], NOW)

    def test_only_archive(self):
        with self.assertRaises(RuntimeError):
            watchdog.check_freshness(BASE[:1], NOW)

    def test_old_archive(self):
        with self.assertRaises(RuntimeError):
            watchdog.check_freshness(BASE, datetime(2026, 10, 12, 2, tzinfo=timezone.utc))

    def test_previous_utc_date_but_today_ist(self):
        # 23:45 UTC on 10 Oct is 05:15 IST on 11 Oct.
        name = "neon-backups/daily/examtree-neon-daily-20261010T234500Z-demo.dump.gpg"
        pair = [
            {"name": name, "size": "9000", "timeCreated": "2026-10-10T23:45:01Z"},
            {"name": name + ".sha256", "size": "130", "timeCreated": "2026-10-10T23:46:01Z"},
        ]
        self.assertEqual(watchdog.check_freshness(pair, NOW), name)

    def test_missing_manifest_even_if_archive_is_new(self):
        with self.assertRaises(RuntimeError):
            watchdog.check_freshness([
                BASE[0],
                {"name": NAME + ".other.sha256", "size": "150", "timeCreated": "2026-10-11T05:16:15Z"},
            ], NOW)

    def test_wrong_prefix_or_filename(self):
        rows = [dict(record, name=record["name"].replace("neon-backups/daily/", "neon-backups/manual/"))
                for record in BASE]
        with self.assertRaises(RuntimeError):
            watchdog.check_freshness(rows, NOW)

    def test_zero_size_and_manifest(self):
        for part in (0, 1):
            records = [dict(item) for item in BASE]
            records[part]["size"] = "0"
            with self.assertRaises(RuntimeError):
                watchdog.check_freshness(records, NOW)

    def test_future_created_or_manifest_from_yesterday(self):
        for part, value in ((0, "2026-10-12T05:15:10Z"), (1, "2026-10-10T05:16:15Z")):
            records = [dict(item) for item in BASE]
            records[part]["timeCreated"] = value
            with self.assertRaises(RuntimeError):
                watchdog.check_freshness(records, NOW)


if __name__ == "__main__":
    unittest.main()
