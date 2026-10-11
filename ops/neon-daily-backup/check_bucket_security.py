#!/usr/bin/env python3
"""Fail closed when the private Examtree GCS backup bucket is not secured.

Cloud SDK's 'gcloud storage buckets describe' normalizes fields to snake_case
by default. The raw Storage JSON API instead nests IAM under iamConfiguration.
Accept BOTH shapes without relaxing the required policy.
"""
import json
import sys


def main():
    try:
        data = json.load(sys.stdin)
        if not isinstance(data, dict):
            raise ValueError("Bucket metadata is not an object")
        if data.get("name") != "sarbedutech":
            raise ValueError("Wrong Cloud Storage bucket")

        config = data.get("iamConfiguration") or data.get("iam_configuration") or {}
        if not isinstance(config, dict):
            raise ValueError("Invalid bucket IAM configuration")

        pap = (
            data.get("public_access_prevention")
            or data.get("publicAccessPrevention")
            or config.get("publicAccessPrevention")
            or config.get("public_access_prevention")
        )
        if pap != "enforced":
            raise ValueError(
                "Public access prevention is not enforced on sarbedutech"
                + (f" (reported: {pap})" if pap else " (setting absent)")
            )

        uba = data.get("uniform_bucket_level_access")
        if uba is None:
            uba = data.get("uniformBucketLevelAccess")
        if uba is None:
            uba = config.get("uniformBucketLevelAccess")
        if uba is None:
            uba = config.get("uniform_bucket_level_access")
        if isinstance(uba, dict):
            uba = uba.get("enabled")
        if uba is not True and uba != "true":
            raise ValueError(
                "Uniform bucket-level access must be enabled on sarbedutech"
            )

        print("PASS: backup bucket Public Access Prevention and Uniform Bucket-Level Access verified.")
    except (ValueError, TypeError, json.JSONDecodeError) as exc:
        sys.exit(f"Backup bucket preflight failed: {exc}")


if __name__ == "__main__":
    main()
