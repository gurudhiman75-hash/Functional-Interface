#!/usr/bin/env python3
"""Read-only Examtree encrypted daily-backup freshness watchdog.

Runs at 06:30 IST, after the 03:30 IST backup. A missing backup job
execution has no failure log, so we independently inspect GCS objects.
Only metadata is read; neither DB credentials nor encryption keys are used.
"""
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

BUCKET = "sarbedutech"
PREFIX = "neon-backups/daily/"
SUFFIX = ".dump.gpg"
INDIA = timezone(timedelta(hours=5, minutes=30))
METADATA_TOKEN_URL = (
    "http://metadata.google.internal/computeMetadata/v1/"
    "instance/service-accounts/default/token"
)
OBJECTS_URL = "https://storage.googleapis.com/storage/v1/b/sarbedutech/o"
MAX_PAGES = 20


def fetch_json(url, headers):
    req = Request(url, headers=headers)
    with urlopen(req, timeout=25) as response:
        return json.load(response)


def list_backup_objects():
    auth = fetch_json(METADATA_TOKEN_URL, {"Metadata-Flavor": "Google"})
    token = auth.get("access_token")
    if not token or not isinstance(token, str):
        raise RuntimeError("Cloud Run identity token unavailable")
    headers = {"Authorization": "Bearer " + token}
    objects = []
    page_token = None
    for _ in range(MAX_PAGES):
        query = {"prefix": PREFIX, "fields": "nextPageToken,items(name,size,timeCreated)"}
        if page_token:
            query["pageToken"] = page_token
        response = fetch_json(OBJECTS_URL + "?" + urlencode(query), headers)
        objects.extend(response.get("items", []))
        page_token = response.get("nextPageToken")
        if not page_token:
            return objects
    raise RuntimeError("Too many backup metadata pages; refusing incomplete result")


def parse_created(value):
    if not isinstance(value, str):
        raise ValueError("Backup timestamp missing")
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)


def check_freshness(objects, now):
    """Return safe-to-log backup name when today's encrypted dump + manifest exist."""
    if now.tzinfo is None:
        raise ValueError("Now must include a time zone")
    now_utc = now.astimezone(timezone.utc)
    today_ist = now_utc.astimezone(INDIA).date()
    by_name = {}
    for row in objects:
        name = row.get("name")
        if isinstance(name, str) and name.startswith(PREFIX):
            by_name[name] = row

    for name, encrypted in sorted(by_name.items(), reverse=True):
        if not name.startswith(PREFIX + "examtree-neon-daily-") or not name.endswith(SUFFIX):
            continue
        manifest = by_name.get(name + ".sha256")
        if manifest is None:
            continue
        try:
            created = parse_created(encrypted.get("timeCreated"))
            manifest_created = parse_created(manifest.get("timeCreated"))
            dump_size = int(encrypted.get("size", 0))
            manifest_size = int(manifest.get("size", 0))
        except (TypeError, ValueError):
            continue
        if (
            created.astimezone(INDIA).date() == today_ist
            and manifest_created.astimezone(INDIA).date() == today_ist
            and created <= now_utc + timedelta(minutes=2)
            and manifest_created <= now_utc + timedelta(minutes=2)
            and manifest_created >= created - timedelta(minutes=10)
            and dump_size >= 4096
            and manifest_size >= 65
        ):
            return name
    raise RuntimeError(
        "No encrypted Neon backup + SHA256 manifest pair uploaded today (Asia/Kolkata). "
        "Check the 03:30 IST Cloud Run backup job, Scheduler and private GCS bucket."
    )


def main():
    if os.environ.get("BACKUP_BUCKET") != BUCKET or os.environ.get("BACKUP_PREFIX") != PREFIX.rstrip("/"):
        raise RuntimeError("Refusing unexpected backup bucket or prefix")
    objects = list_backup_objects()
    now = datetime.now(timezone.utc)
    name = check_freshness(objects, now)
    # No customer data, DB connection strings, keys, or service tokens in logs.
    print("PASS: encrypted Neon backup freshness verified: gs://" + BUCKET + "/" + name)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("EXAMTREE_NEON_BACKUP_FRESHNESS_FAILED: " + str(exc), file=sys.stderr)
        sys.exit(1)
