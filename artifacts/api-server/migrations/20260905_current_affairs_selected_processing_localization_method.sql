-- CP-063 production hotfix: allow the deterministic compatibility localization
-- method emitted by the selected-affairs blocker-closure runtime.
-- This expands provenance metadata only; it does not weaken localization quality,
-- parity, verification, approval, publication, or Question Bank gates.

ALTER TABLE content.current_affairs_localizations
  DROP CONSTRAINT IF EXISTS current_affairs_localizations_localization_method_check;

ALTER TABLE content.current_affairs_localizations
  ADD CONSTRAINT current_affairs_localizations_localization_method_check
  CHECK (
    localization_method IN (
      'deterministic_template_v1',
      'deterministic_template_compat_v1',
      'manual'
    )
  );
