"""Fail-closed, read-only Cloud Run serving-revision validation.

A retired, zero-traffic latest-created revision is not evidence that the
100%-serving revision is unhealthy. Check what actually serves traffic and
that its immutable configuration matches the service's desired template.
No GCP API calls, permissions, or modifications occur in this module.
"""
import re

def serving_revision_name(service, expected_service):
    status = service.get("status") or {}
    traffic = status.get("traffic")
    if not isinstance(traffic, list):
        raise ValueError("expected traffic targets")
    # Cloud Run includes tagged revisions in status.traffic with 0% ordinary
    # traffic. Ignore those entries when determining which revision serves
    # requests, while still requiring exactly one 100% positive target.
    traffic = [target for target in traffic
               if isinstance(target, dict) and (target.get("percent") or 0) > 0]
    if len(traffic) != 1:
        raise ValueError("expected exactly one positive traffic target")
    target = traffic[0]
    name = target.get("revisionName")
    if target.get("percent") != 100 or not isinstance(name, str) or not name.startswith(expected_service + "-"):
        raise ValueError("100% traffic must target a named revision of the expected service")
    if not status.get("latestReadyRevisionName"):
        raise ValueError("service has no latest ready revision")
    return name


def _single_container(spec):
    containers = spec.get("containers") if isinstance(spec, dict) else None
    if not isinstance(containers, list) or len(containers) != 1 or not isinstance(containers[0], dict):
        raise ValueError("expected one declared container")
    return containers[0]


def _env(container):
    items = container.get("env") or []
    if not isinstance(items, list):
        raise ValueError("invalid environment configuration")
    values = {}
    for item in items:
        if not isinstance(item, dict) or not isinstance(item.get("name"), str) or not item["name"]:
            raise ValueError("invalid environment entry")
        name = item["name"]
        if name in values:
            raise ValueError("duplicate environment key")
        # Compare both plaintext values and Secret Manager references; no
        # secret values are accessed, printed or returned.
        values[name] = (item.get("value"), item.get("valueFrom"))
    return values


def verify_serving_revision(service, revision, expected_service):
    name = serving_revision_name(service, expected_service)
    if not isinstance(revision, dict) or (revision.get("metadata") or {}).get("name") != name:
        raise ValueError("serving revision metadata does not match traffic target")
    conditions = (revision.get("status") or {}).get("conditions") or []
    if not any(c.get("type") == "Ready" and c.get("status") == "True"
               for c in conditions if isinstance(c, dict)):
        raise ValueError("serving revision is not Ready=True")
    intended = (((service.get("spec") or {}).get("template") or {}).get("spec") or {})
    serving = revision.get("spec") or {}
    if not intended.get("serviceAccountName") or intended.get("serviceAccountName") != serving.get("serviceAccountName"):
        raise ValueError("serving runtime identity differs from service template")
    intended_container = _single_container(intended)
    live_container = _single_container(serving)
    if not intended_container.get("image") or intended_container.get("image") != live_container.get("image"):
        raise ValueError("serving image differs from service template")
    for key in ("command", "args"):
        if (intended_container.get(key) or []) != (live_container.get(key) or []):
            raise ValueError("serving startup command differs from service template")
    if _env(intended_container) != _env(live_container):
        raise ValueError("serving environment or secret references differ from service template")
    return name


def verify_pinned_disabled_revision(service, revision, expected_service,
                                    expected_revision, expected_identity):
    """Validate an explicit disabled baseline while a candidate is staged.

    A staged template may contain a different image and additional plaintext
    feature settings. It must retain the baseline identity, secret bindings,
    startup overrides and disabled generation approvals. Both desired and
    observed ordinary traffic must explicitly name the reviewed baseline.
    """
    name = serving_revision_name(service, expected_service)
    if name != expected_revision:
        raise ValueError("serving revision is not the pinned disabled baseline")
    desired = (service.get("spec") or {}).get("traffic")
    if not isinstance(desired, list):
        raise ValueError("desired traffic must explicitly pin the baseline")
    positive = [x for x in desired if isinstance(x, dict) and
                (x.get("percent") or 0) > 0]
    if len(positive) != 1 or positive[0].get("percent") != 100 or \
       positive[0].get("revisionName") != expected_revision or \
       positive[0].get("latestRevision") is True:
        raise ValueError("desired traffic is not pinned to the disabled baseline")
    if not isinstance(revision, dict) or \
       (revision.get("metadata") or {}).get("name") != name:
        raise ValueError("serving revision metadata does not match baseline")
    if not any(x.get("type") == "Ready" and x.get("status") == "True"
               for x in (revision.get("status") or {}).get("conditions") or []
               if isinstance(x, dict)):
        raise ValueError("disabled baseline is not Ready=True")
    digest = (revision.get("status") or {}).get("imageDigest") or ""
    if not re.search(r"@sha256:[0-9a-f]{64}$", digest):
        raise ValueError("disabled baseline immutable image digest missing")
    template = (((service.get("spec") or {}).get("template") or {}).get("spec") or {})
    serving = revision.get("spec") or {}
    containers = []
    secret_bindings = []
    for spec in (template, serving):
        if spec.get("serviceAccountName") != expected_identity:
            raise ValueError("disabled baseline or candidate runtime identity differs")
        container = _single_container(spec)
        if not container.get("image"):
            raise ValueError("disabled baseline or candidate image missing")
        values = _env(container)
        for key, (value, reference) in values.items():
            if key.startswith("EXAMTREE_QS_PRODUCTION_") and key.endswith("_APPROVED"):
                if value != "false" or reference is not None:
                    raise ValueError("generation approval is not disabled")
        containers.append(container)
        secret_bindings.append({k: v for k, v in values.items() if v[1] is not None})
    if secret_bindings[0] != secret_bindings[1]:
        raise ValueError("disabled baseline and candidate secret bindings differ")
    for key in ("command", "args"):
        if (containers[0].get(key) or []) != (containers[1].get(key) or []):
            raise ValueError("disabled baseline and candidate startup overrides differ")
    return name
