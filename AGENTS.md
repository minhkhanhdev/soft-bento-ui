# Working with Soft Bento UI

Merge these instructions into your project's existing AGENTS.md. Preserve the host
repository's security, product, workflow and permission rules. Do not overwrite it.

## Foundation

- Use React 19+, HeroUI v3 Core, Tailwind CSS v4 and the local `src/soft-bento` layer.
- Read DESIGN.md and `.agents/skills/soft-bento-ui/SKILL.md` before changing UI.

  implementing a component. Prefer official docs or the HeroUI React MCP server.
- HeroUI v3 does not require HeroUIProvider. Use compound components and onPress.
- CSS order: Tailwind, HeroUI styles, Soft Bento styles, then application layout.

## Implementation

- Keep domain data and service calls outside the portable UI layer.
- Reuse tokens and existing primitives before creating a new abstraction.
- Use semantic variants, visible form labels and meaningful accessible names.
- Do not fake a successful network operation. Preserve input and support retry.
- Keep focus, keyboard navigation, text selection and reduced-motion behavior.
- Keep light fields white; preserve dark surface hierarchy. Keep the original
  HeroUI pressed behavior. No infinite decorative animation.
- Never use unmapped shadcn utility classes (`bg-primary`, `text-primary`, `bg-card`,
  `text-muted-foreground`), raw Tailwind palette colors (`amber-500`, `sky-500`, `zinc-*`),
  or `window.confirm`.
- Build data tables with the full HeroUI v3 compound ecosystem (`SearchField`, filter
  controls, `Table` Quiet Chrome with `Table.ScrollContainer`, `Table.Footer` +
  `Pagination`, and contextual `EmptyState` matching the domain entity).

## Verification

- Review desktop and mobile, both themes, and empty/loading/error/success states.
- Check keyboard operation, focus return, long text and page overflow.
- Run the project's build and relevant tests. Report only checks actually run.
- Never include credentials, private data or service configuration in UI examples.
- Do not publish, push, migrate a live database or enable paid services unless
  the host project's instructions and the user authorize that action.
