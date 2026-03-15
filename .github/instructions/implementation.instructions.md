# Implementation Instructions

These rules govern how the RichTextEditor project is built phase-by-phase. They apply to every contributor—human or AI agent—working through the [Implementation Plan](../../IMPLEMENTATION_PLAN.md).

---

## 1. One Phase at a Time

- Work on **exactly one phase** at a time, in the order defined by the plan.
- Do **not** start the next phase until the current phase is **fully completed** and **explicitly confirmed by the user**.
- "Explicitly confirmed" means the user has reviewed the work and given clear approval (e.g., "looks good", "confirmed", "move on").

## 2. No Skipping, No Partial Work

- Every sub-step within a phase must be completed before the phase is considered done.
- All checkpoint items (`- [ ]`) in the phase must be checked off (`- [x]`).
- If a step cannot be completed, mark the phase as `Blocked` in the progress dashboard and wait for user guidance. Do **not** move forward.

## 3. Todo List Required Per Phase

- At the **start** of every phase, create a todo list that breaks the phase into actionable items derived from its sub-steps.
- Each todo must be specific and verifiable (e.g., "Create `tsconfig.json` with strict mode" not "set up TypeScript").
- Track progress by marking todos as `in-progress` → `completed` as each item is done.
- Only **one** todo should be `in-progress` at any given time.
- The todo list must be fully completed before requesting user confirmation.

## 4. Progress Tracking Updates

After completing each phase:

1. Update the **Progress Dashboard** table at the top of `IMPLEMENTATION_PLAN.md`:
   - Set the phase status to `Complete`.
   - Fill in `Started` and `Completed` dates.
   - Add any relevant notes.
2. Update the **phase metadata table** (the status block under each phase heading):
   - Set `Status` to `Complete`.
   - Fill in `Started` and `Completed` dates.
3. Check off all **checkpoint items** in the phase (`- [x]`).
4. Update the **Overall counter** (e.g., `1 / 25 phases complete | 4% done`).
5. Add a row to **Appendix D — Progress Log**.
6. If the phase completes a milestone, update the **Milestone Markers** table.

## 5. User Confirmation Gate

After all todos and checkpoints for a phase are done:

1. Present a brief summary of what was accomplished.
2. List any deviations from the plan or decisions made during implementation.
3. **Ask the user for explicit confirmation** before proceeding to the next phase.
4. Do **not** interpret silence or ambiguous responses as confirmation. Wait for a clear signal.

## 6. Branch & Commit Discipline

- Each phase should be worked on in the branch specified in the plan (or the current working branch if not specified).
- Commit frequently with clear messages referencing the phase number (e.g., `chore(phase-1): initialize Yarn 4`).
- Do not squash progress—keep commits granular so each sub-step is traceable.

## 7. Error Handling

- If a build, test, or lint error occurs during a phase, **resolve it within that phase** before moving on.
- Do not defer errors to a later phase.
- If an error is caused by a dependency on a future phase (something not yet built), document it and consult the user.

## 8. Scope Control

- Do **not** implement features, fixes, or refactors that belong to a different phase.
- If you notice something that needs to change in a future phase's scope, add a note to the plan but do not act on it now.
- The only exception is fixing a blocking bug that prevents the current phase from completing.

---

> **Summary:** Complete one phase → make todos → finish all work → update tracking → get user confirmation → then and only then move to the next phase.
