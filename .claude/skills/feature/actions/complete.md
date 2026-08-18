# Complete Action

**Prerequisite:** `/feature review` must have returned **Ready to complete**.
If review found blockers, fix them and re-run review before this step.

Produces exactly ONE commit per feature. Do not create a separate
`chore: reset current-feature.md` commit — the reset is part of the feature
commit itself.

1. Reset current-feature.md FIRST, before staging anything:
   - Add the feature summary to the END of History (take the wording from
     `git log --oneline`, so History matches the real commit messages)
   - Change H1 back to `# Current Feature`
   - Clear the feature name, Status, Goals and Notes (keep placeholder comments)
2. Stage all changes — code and the reset doc together — and commit with a
   descriptive conventional-commit message
3. Switch to main and merge the feature branch (fast-forward, no merge commit)
4. Delete the local feature branch
5. Push main to origin ONCE
6. If the feature branch was previously pushed, delete it from origin
