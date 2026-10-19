#!/usr/bin/env python3
"""Offline tests for Examtree production alert email channel eligibility.

No gcloud call, no resource mutation, no secret or email output.
"""
import importlib.util
import pathlib
import unittest
from unittest.mock import patch

SCRIPT = pathlib.Path(__file__).with_name("configure-examtree-qs-prod-alerts.py")
spec = importlib.util.spec_from_file_location("qs_prod_alerts", SCRIPT)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
NAME = "projects/sarbedutech/notificationChannels/example"

def channel(status=None, *, enabled=True, type_="email", include_status=True):
    obj = {"name": NAME, "type": type_, "enabled": enabled}
    if include_status:
        obj["verificationStatus"] = status
    return obj

class EmailChannelTest(unittest.TestCase):
    def resolve(self, entries, chosen=None):
        with patch.object(module, "gjson", return_value=entries):
            return module.resolve_channel(chosen)

    def test_missing_status_accepted(self):
        self.assertEqual(self.resolve([channel(include_status=False)]), NAME)

    def test_blank_status_accepted(self):
        self.assertEqual(self.resolve([channel("")]), NAME)

    def test_unspecified_status_accepted(self):
        self.assertEqual(self.resolve([channel("VERIFICATION_STATUS_UNSPECIFIED")]), NAME)

    def test_verified_status_accepted(self):
        self.assertEqual(self.resolve([channel("VERIFIED")]), NAME)

    def test_explicit_unverified_rejected(self):
        with self.assertRaises(RuntimeError):
            self.resolve([channel("UNVERIFIED")])

    def test_disabled_rejected(self):
        with self.assertRaises(RuntimeError):
            self.resolve([channel("VERIFIED", enabled=False)])

    def test_non_email_rejected(self):
        with self.assertRaises(RuntimeError):
            self.resolve([channel("VERIFIED", type_="sms")])

    def test_ambiguous_channels_rejected(self):
        second = dict(channel("VERIFIED"))
        second["name"] = NAME + "2"
        with self.assertRaises(RuntimeError):
            self.resolve([channel("VERIFIED"), second])

    def test_explicit_qualified_selection(self):
        second = dict(channel("VERIFIED"))
        second["name"] = NAME + "2"
        self.assertEqual(self.resolve([channel("VERIFIED"), second], second["name"]),
                         second["name"])

    def test_cannot_force_unverified_by_name(self):
        with self.assertRaises(RuntimeError):
            self.resolve([channel("UNVERIFIED")], NAME)

if __name__ == "__main__":
    unittest.main()
