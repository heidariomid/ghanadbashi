---
name: feature
description: Manage current feature workflow - start, pre-review, after-review, explain or complete
argument-hint: load|pre-review|start|after-review|test|explain|complete
---

# Feature Workflow

Manages the full lifecycle of a feature from spec to merge.

## Working File

@context/current-feature.md

Project overlay (this repo only): [project.md](project.md). Read it before
pre-review or after-review. Copy the skill to another repo → replace that
file; do not put client names or Notion URLs in the action files.

### File Structure

current-feature.md has these sections:

- `# Current Feature` - H1 heading with feature name when active
- `## Status` - Not Started | In Progress | Complete
- `## Goals` - Bullet points of what success looks like
- `## Notes` - Additional context, constraints, or details from spec
- `## History` - Completed features (append only)

## Pipeline

Usual order. `pre-review` and `after-review` are **optional** — useful, not
a gate. `start` and `complete` must not wait for them.

```
load → start → complete
         ↑         ↑
    optional   optional
   pre-review  after-review
```

| Step | Action | When |
| ---- | ------ | ---- |
| 1 | `load` | Spec chosen; fill Goals and Notes |
| 2 | `start` | Create branch; implement; list leftover setup |
| 3 | `complete` | Commit, merge, push — when the user asks |
| optional | `pre-review` | Before start — spec vs repo; team votes on Notion |
| optional | `after-review` | After implementation — lint, build, browser, admin QA on Notion |
| optional | `test` | Unit tests — this project rarely uses |
| optional | `explain` | Document changes for handoff |

Verification details: @context/ai-interaction.md sections A–C.
Pre-review procedure: [actions/pre-review.md](actions/pre-review.md).
After-review procedure: [actions/after-review.md](actions/after-review.md).

**`/feature pre-review` is not `/feature after-review`.** Pre-review does
not lint, build, or open the browser. Both save the write-up to Notion;
chat is the verdict + URL only.

## Task

Execute the requested action: $ARGUMENTS

| Action         | Description                                               |
| -------------- | --------------------------------------------------------- |
| `load`         | Load a feature spec or inline description                 |
| `pre-review`   | Optional. Spec vs repo; save the briefing to Notion       |
| `start`        | Create branch, implement, then list leftover setup steps  |
| `after-review` | Optional. Lint, build, browser, admin QA; save to Notion  |
| `test`         | Unit tests for server actions/utilities (rare here)       |
| `explain`      | Document what changed and why                             |
| `complete`     | Commit, push, merge, reset                                |

See [actions/](actions/) for detailed instructions.

If no action provided, explain the available options.
