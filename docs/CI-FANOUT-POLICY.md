# ExamTree CI Fanout Policy

This policy exists to keep GitHub Actions proportional to the code being changed. The target is normally one to four meaningful workflow runs per pull request update, not dozens of unrelated chapter validations.

## Non-negotiable branch topology

`New-main` is the integration target and must not be used as the head/source branch of a pull request.

Bad:

```text
New-main -> integration/some-chapter
```

Every future commit to `New-main` updates that pull request and re-evaluates the pull request's accumulated historical diff, which can trigger unrelated chapter workflows repeatedly.

Safe reverse-sync procedure:

```text
integration/some-chapter
  -> create sync/some-chapter-current-main
  -> merge New-main into sync/some-chapter-current-main
  -> PR sync/some-chapter-current-main -> integration/some-chapter
```

For normal feature work:

```text
feature/... -> New-main
```

The repository-wide `Guard pull request branch topology` workflow rejects any PR whose head is `New-main`.

## Automatic PR workflow contract

New or edited automatic PR workflows must:

1. target `New-main` explicitly with `pull_request.branches` unless a non-main-base workflow is deliberately documented;
2. use `paths` or `paths-ignore` so unrelated PRs do not start the workflow;
3. define `concurrency` with `cancel-in-progress: true`;
4. not list their own workflow YAML file in `pull_request.paths`;
5. avoid 20/25-minute timeout caps; use a deliberate fast guard (`<=15`) or a normal/long validation cap (`>=30`).

A deliberately tiny all-PR guard may use:

```text
CI-FANOUT-ALLOW: global-pr
```

A deliberately stacked/non-main-base workflow may use:

```text
CI-FANOUT-ALLOW: non-main-base
```

These markers are exceptions, not defaults.

## Automatic push workflow contract

Automatic push workflows must be path-scoped unless they are a genuinely global, lightweight production guard. The exceptional marker is:

```text
CI-FANOUT-ALLOW: global-push
```

## Workflow-definition edits

Do not include `.github/workflows/<same-file>.yml` in a chapter workflow's own `paths` list. Editing ten validator definitions should not execute ten expensive validators merely because their YAML changed.

Workflow-definition changes are validated centrally by `Enforce workflow CI hygiene policy`.

## Completed phase workflows

Historical discovery, review, freeze, or evidence-generation workflows should be converted to manual execution (`workflow_dispatch`) once a newer authoritative gate supersedes them. Only the current authoritative validation gate for an active checkpoint should remain automatic.

## Desired steady state

Typical frontend PR:

```text
Branch topology guard
Workflow hygiene (only when CI files change)
Frontend production quality
Render production build (only deploy-affecting changes)
```

Typical chapter PR:

```text
Branch topology guard
One chapter/checkpoint authority workflow
API/runtime integration gate when required
Render production build only when deployment/runtime files require it
```

A documentation-only or unrelated change should not awaken historical NUM, SPA, Mensuration, Interest, PNC, Ranking, or other chapter validators.
