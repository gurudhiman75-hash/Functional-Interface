#!/usr/bin/env python3
"""Prepare narrowly-scoped Examtree QS production alert policies.

CHECK-ONLY BY DEFAULT. --apply creates only missing, named Cloud Monitoring
alert policies using an existing verified email channel. Never creates or edits
notification channels, IAM, budgets, Cloud Run, queues, jobs or schedulers.
Never invokes any service or enables Question Studio generation.
"""
import argparse
import json
import subprocess
import sys

PROJECT = "sarbedutech"
RECEIVER = "examtree-qs-receiver-prod"
WORKER = "examtree-universal-prod"
DISPATCHER = "examtree-qs-dispatch-prod"
PREFIX = "Examtree QS PROD"
POLICIES = (
    ("Receiver 5xx", "run.googleapis.com/request_count", "cloud_run_revision", "service_name", RECEIVER, 'metric.labels.response_code_class="5xx"'),
    ("Worker 5xx", "run.googleapis.com/request_count", "cloud_run_revision", "service_name", WORKER, 'metric.labels.response_code_class="5xx"'),
    ("Dispatcher failed executions", "run.googleapis.com/job/completed_execution_count", "cloud_run_job", "job_name", DISPATCHER, 'metric.labels.result="failed"'),
)


def cli(*args, timeout=90):
    try:
        run = subprocess.run(args, text=True, capture_output=True, timeout=timeout)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise RuntimeError("command unavailable or timed out") from exc
    if run.returncode != 0:
        # Avoid emitting account identifiers, recipient emails, logs or tokens.
        raise RuntimeError("gcloud operation failed (command=" + " ".join(args[1:4])
                           + ", exit=" + str(run.returncode) + "); details withheld")
    return run.stdout


def gjson(*args):
    return json.loads(cli("gcloud", *args, "--project="+PROJECT, "--format=json"))


def check_safety():
    if cli("gcloud", "config", "get-value", "project").strip() != PROJECT:
        raise RuntimeError("active project is not sarbedutech")
    # Full independent, fail-closed preflight protects paused queue, disabled
    # receiver/worker/dispatcher, production Neon binding and IAM contracts.
    output = cli(sys.executable, "scripts/prepare-qs-prod-disabled-only.py", timeout=240)
    if "RESULT: PREFLIGHT PASSED; NO CHANGES" not in output:
        raise RuntimeError("disabled-only preflight did not pass")
    print("PASS: project, paused queue and disabled-only preflight", flush=True)


def desired(name, metric, resource, key, target, extra, channel):
    predicate = (
        'metric.type="'+metric+'" AND resource.type="'+resource+'"'
        ' AND resource.labels.'+key+'="'+target+'" AND '+extra
    )
    return {
        "displayName": PREFIX + " " + name,
        "enabled": True,
        "combiner": "OR",
        "conditions": [{
            "displayName": PREFIX + " " + name + " threshold",
            "conditionThreshold": {
                "filter": predicate,
                "comparison": "COMPARISON_GT",
                "thresholdValue": 0,
                "duration": "60s",
                "aggregations": [{
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_RATE",
                    "crossSeriesReducer": "REDUCE_SUM"
                }],
                "trigger": {"count": 1}
            }
        }],
        "notificationChannels": [channel],
        "documentation": {
            "content": ("Examtree Question Studio production monitoring. "
                        "Inspect the affected private service/job and incident logs. "
                        "Do not enable generation, resume queues or retry jobs automatically."),
            "mimeType": "text/markdown"
        }
    }


def matches(existing, expected):
    if existing.get("enabled") is not True:
        return False
    if set(existing.get("notificationChannels", [])) != set(expected["notificationChannels"]):
        return False
    conditions = existing.get("conditions") or []
    if len(conditions) != 1:
        return False
    old = conditions[0].get("conditionThreshold") or {}
    want = expected["conditions"][0]["conditionThreshold"]
    for field in ("filter", "comparison", "duration"):
        if old.get(field) != want[field]:
            return False
    if float(old.get("thresholdValue", -1)) != 0:
        return False
    original = old.get("aggregations") or []
    if len(original) != 1:
        return False
    required = want["aggregations"][0]
    if any(original[0].get(k) != v for k, v in required.items()):
        return False
    return True


def resolve_channel(proposed):
    data = gjson("beta", "monitoring", "channels", "list")
    if not isinstance(data, list):
        raise RuntimeError("notification channel listing unavailable")
    qualified = [c for c in data
                 if c.get("type") == "email"
                 and c.get("enabled") is True
                 and c.get("verificationStatus") == "VERIFIED"
                 and isinstance(c.get("name"), str)]
    if proposed:
        matches_proposed = [c for c in qualified if c["name"] == proposed]
        if len(matches_proposed) != 1:
            raise RuntimeError("selected notification channel not a verified enabled email channel")
        return proposed
    if len(qualified) != 1:
        raise RuntimeError("require exactly one verified enabled email channel, or pass --channel=projects/.../notificationChannels/...; "
                           "found " + str(len(qualified)))
    return qualified[0]["name"]


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--apply", action="store_true", help="create missing alert policies ONLY after reviewing scope")
    p.add_argument("--channel", help="existing verified enabled email channel RESOURCE NAME")
    a = p.parse_args()
    print("EXAMTREE QS PROD MONITORING ALERTS: "+("APPLY" if a.apply else "CHECK ONLY"), flush=True)
    check_safety()
    channel = resolve_channel(a.channel)
    existing = gjson("monitoring", "policies", "list")
    if not isinstance(existing, list):
        raise RuntimeError("monitoring policies listing unavailable")
    to_create = []
    for args in POLICIES:
        obj = desired(*args, channel)
        found = [z for z in existing if z.get("displayName") == obj["displayName"]]
        if len(found) > 1 or (found and not matches(found[0], obj)):
            raise RuntimeError("unexpected existing policy with same name: "+obj["displayName"]+
                               "; no policy will be replaced")
        if found:
            print("PASS: existing matching policy: "+obj["displayName"], flush=True)
        else:
            print("MISSING: "+obj["displayName"], flush=True)
            to_create.append(obj)
    if not a.apply:
        print("RESULT: CHECK ONLY, "+str(len(to_create))+" policies missing; no changes made")
        return 0
    if not to_create:
        print("RESULT: All three alerts configured; nothing to change")
        return 0
    # Fail-closed after any partial create; rerun is safe and idempotent.
    for obj in to_create:
        cli("gcloud", "monitoring", "policies", "create",
            "--policy="+json.dumps(obj, separators=(",", ":")),
            "--project="+PROJECT, "--format=json", "--quiet")
        print("CONFIGURED: "+obj["displayName"], flush=True)
    new_list = gjson("monitoring", "policies", "list")
    if not isinstance(new_list, list):
        raise RuntimeError("cannot verify policies after creation")
    for args in POLICIES:
        obj = desired(*args, channel)
        got = [v for v in new_list if v.get("displayName") == obj["displayName"]]
        if len(got) != 1 or not matches(got[0], obj):
            raise RuntimeError("post-create policy verification failed for "+obj["displayName"])
    check_safety()
    print("RESULT: THREE QS PROD ALERT POLICIES VERIFIED. GENERATION DISABLED; QUEUE PAUSED.")
    print("NOTE: Test real email delivery separately; Monitoring alerts do not enforce a spending cap.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (RuntimeError, ValueError, KeyError) as exc:
        print("STOP: "+str(exc), file=sys.stderr)
        print("No generation enabled; if --apply was used, inspect possible partial alert-policy creations.", file=sys.stderr)
        sys.exit(2)
