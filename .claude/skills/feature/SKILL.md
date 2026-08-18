---
name: feature
description: Manage current feature workflow - start, review, explain or complete
argument-hint: load|start|review|test|explain|complete
---

# Feature Workflow

Manages the full lifecycle of a feature from spec to merge.

## Working File

@context/current-feature.md

### File Structure

current-feature.md has these sections:

- `# Current Feature` - H1 heading with feature name when active
- `## Status` - Not Started | In Progress | Complete
- `## Goals` - Bullet points of what success looks like
- `## Notes` - Additional context, constraints, or details from spec
- `## History` - Completed features (append only)

## Pipeline

Every phase follows this order. Do not skip steps.

```
load → start → implement → review → complete
                              ↑
                    mandatory gate — run before commit/push
```

| Step | Action | When |
| ---- | ------ | ---- |
| 1 | `load` | Spec chosen; fill Goals and Notes |
| 2 | `start` | Create branch; set Status In Progress |
| 3 | *(implement)* | Build what Goals describe |
| 4 | **`review`** | **After implementation — browser + admin QA, lint, build** |
| 5 | `complete` | Only if review verdict is Ready; commit, merge, push |
| optional | `test` | Unit tests — this project rarely uses; prefer `review` |
| optional | `explain` | Document changes for handoff |

**`/feature review` is not optional.** Bugs like admin rich-text crashes, CMS
fields that save but never render, and delete guards that fail only from one
screen are found here — not by reading diffs.

Verification details: @context/ai-interaction.md sections A–C.
Review procedure: [actions/review.md](actions/review.md).

## Task

Execute the requested action: $ARGUMENTS

| Action     | Description                                               |
| ---------- | --------------------------------------------------------- |
| `load`     | Load a feature spec or inline description                 |
| `start`    | Begin implementation, create branch                       |
| `review`   | Verify goals, code, lint, build, browser, admin QA        |
| `test`     | Unit tests for server actions/utilities (rare here)       |
| `explain`  | Document what changed and why                             |
| `complete` | Commit, push, merge, reset — **only after review passes** |

See [actions/](actions/) for detailed instructions.

If no action provided, explain the available options.
