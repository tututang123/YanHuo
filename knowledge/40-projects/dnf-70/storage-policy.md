# Storage Policy

This project may eventually contain large files, binaries, screenshots, game assets, extracted data, and private research materials.

## Safe to Store in Git

- Markdown notes
- Small CSV / JSON / YAML data tables
- Project plans
- Source inventory
- Technical decisions
- Publicly shareable documentation

## Be Careful

- Screenshots
- Extracted game data
- Decompiled or reverse-engineered notes
- Server/client binaries
- Large asset packs
- Files with unclear ownership

## Recommended Practice

- Put uncertain or large files under a local-only folder such as:

```text
private/dnf-70/
```

- Keep only indexes, summaries, and file references in this Git-tracked project folder.
- If a file is important but cannot be uploaded, record it in `01-references/source-inventory.md` with its local path.

## Why

This keeps the GitHub repository clean, searchable, and safer to maintain.

