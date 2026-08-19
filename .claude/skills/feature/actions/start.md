# Start Action

1. Read current-feature.md - verify Goals are populated
2. If empty, error: "Run /feature load first"
3. Set Status to "In Progress"
4. Create and checkout the feature branch (derive name from H1 heading)
5. List the goals, then implement them one by one
6. After the code is in: list **leftovers**. If none, say so in one line.

`/feature pre-review` is optional. Do not refuse start if it is missing.
If Notes have an open Pre-review **Needs decisions**, mention it, then
still implement unless the user says wait.

## Leftovers (required at the end)

Code done is not feature done. Scan what you just shipped and tell the
user every step that is still on them. Do not wait for them to ask. Do
not hide a silent skip (missing env, unpaid API, empty CMS field) as
success.

Include only what this feature actually needs, for example:

- Env vars to set locally **and** on Vercel, with the exact names
- Accounts / API keys / domains to create (Resend, Blob, SMS, …)
- What happens if they skip a step (order saves, email does not send)
- Content she must add in `/admin`
- Anything that must not be merged yet

If a leftover is later (another phase), say that and do not mix it in
as if it blocks this one.

