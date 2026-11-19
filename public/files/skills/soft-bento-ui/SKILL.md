---
name: soft-bento-ui
description: Build reusable React dashboards with the local Soft Bento layer, HeroUI v3 and Tailwind CSS v4.
---

# Soft Bento UI

Read the host project's AGENTS.md and DESIGN.md first. These skill instructions
supplement project rules; they do not replace permissions or product requirements.

1. Inspect existing `src/soft-bento/` exports and theme tokens.
2. Confirm React 19+, HeroUI v3 and Tailwind CSS v4. Verify component APIs using
   official HeroUI documentation or the project's HeroUI React MCP connection.
3. Compose existing primitives and patterns; keep service calls/domain models out
   of this folder. Use semantic tokens, not per-component hardcoded colors.
4. Preserve HeroUI pressed/focus/keyboard behavior. Keep data text selectable.
5. Use restrained 150–200ms transitions and reduced-motion. Avoid card nesting,
   decorative animation loops and complex hand-coded 3D SVG illustrations.
6. Build tables with HeroUI v3 compound anatomy (`SearchField` + filters + `Table`
   Quiet Chrome + `Table.Footer` with `Pagination` + contextual `EmptyState` matching
   the domain entity). Never use unmapped shadcn utility classes (`bg-primary`,
   `text-muted-foreground`, `bg-card`) or `window.confirm`.
7. Place page-level primary actions (`Save`, `+ Add`, `Create`) in the top-right
   `actions` slot of `PageHeader` (never at the bottom of long forms); place
   card-scoped actions in `Card.Header`; reserve bottom footers strictly for modals/drawers.
   Use `simple-icons` for official social brand glyphs instead of hand-drawn SVGs.
8. Test real interactions and review both themes at mobile and desktop sizes.

See [Adoption](references/adoption.md) for setup and export boundaries.
