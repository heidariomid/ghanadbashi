# Feature skill — this project only

The action files are reusable. **This file is not.** Copy the `feature`
skill to another repo and replace these values. Do not put client names
or Notion URLs in the action files.

## Who we write for

- **Visitor** — a customer on the public site
- **Client** — the baker (she). Use “she” / “the baker” in Notion briefings
- **Admin language** — Persian. Every new CMS field needs a Persian `label`

## Notion

- **Parent:** https://app.notion.com/p/3c192338f5f58199b801c323268b0990
- **Index:** https://app.notion.com/p/3c092338f5f5819ca8cdf2bb6ac18afc
- **Title prefix:** Bakery
- **Title shape:** `{prefix} {feature from H1} — Pre-Review` or `After-Review`

Search the index before creating a page. Same subject → update. New page
goes under Parent and is linked from Index.

## QA

- **Production:** ghanadbashi.vercel.app
- **Build:** `pnpm build` needs the database. Use a VPN if Shecan blocks Neon
- **Known QA story:** Lexical `horizontalrule` in **درباره من** — looked
  fine in code, broke only when someone typed in the admin field
