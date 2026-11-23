# Design: create-first-four-user-cases

## Context

See proposal.md - Why. The repository does not yet contain source code, framework, database or CI; requirements are concentrated in the SRS (E4) and documentation assets. Previously formalized UC slices (UC-01 to UC-04) were captured as deltas and archived.

## Goals / Non-Goals

**Goals:**

- Establish a stable, testable requirements baseline for UC-01 through UC-04 with WHEN/THEN scenarios.
- Preserve traceability to business rules (BR) and non-functional requirements (RNF).

**Non-Goals:**

- No implementation work or source code changes.
- No new business rules or non-functional requirements beyond the SRS.
- No scope for UC-05 and subsequent use cases.

## Decisions

- D1: Group the requirements in one spec file per user-case domain capability (`animais`, `consultas`, `monitorizacao`, `internamento`) instead of a single monolithic capability, following the project's established layout and keeping future use cases aligned to their own domain.
- D2: Reuse the SRS requirement wording and UC/BR/RNF/scenario identifiers, so requirement and scenario IDs remain stable across artifacts.
- D3: Use `## ADDED Requirements` deltas, since no main specs exist in the current working tree; the archive step will materialize the new main specs.

## Risks / Trade-offs

- Risk: divergence between the SRS and the OpenSpec artifacts. Mitigation: keep requirement and scenario IDs stable and reference BR/RNF identifiers inside scenarios.

## Migration Plan

Not applicable: requirements-only change with no runtime systems yet.

## Open Questions

Defer to future changes: E4b slices (e.g. UC-01.S1, UC-01.S2), alert thresholds (UC-08), insurance export (UC-05/UC-06).
