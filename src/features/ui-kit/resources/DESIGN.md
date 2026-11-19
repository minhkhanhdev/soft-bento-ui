# Soft Bento UI — design contract

This is a reusable presentation layer on HeroUI v3, not an application backend.

## Visual foundation

- Basic Blue accent, Inter typography and restrained translucent surfaces.
- Consume semantic tokens from `src/soft-bento/foundation/tokens.css`.
- Four dark levels: canvas, navigation, topbar and card. Overlay has its own level.
- Card radius 18px; controls 10px; spacing follows a 4px rhythm.
- Top-level modules may have a hairline border and two-layer shadow. Nested rows
  use whitespace, separators or a soft subsurface instead of another card.
- Main panel heading: 15px/600. Data headers: 11px. KPI values: 24–27px.
- Use tabular numbers and MoneyText where a monetary unit must be separated.

## Composition and interaction

- HeroUI owns accessible component anatomy. Prefer Card.Header/Content/Footer,
  Modal.Backdrop/Container/Dialog and the matching v3 APIs.
- One clear primary action per context. Use secondary for alternatives, tertiary
  for dismissal, danger for destructive actions and ghost for low emphasis.
- Keep data selectable; labels and focus rings must stay visible.
- Transition durations are 150–200ms. Respect prefers-reduced-motion. No loops.
- Lucide glyphs use the BentoIcon wrapper; actions need text or an accessible name.
- Use an existing image or a simple icon for empty states. Do not draw fake 3D SVGs.

## Product states

- Forms keep labels, units and user input through failures. Block duplicate saves.
- Tables use transparent headers, a subtle row divider, one hover layer, and
  `Table.Footer` + HeroUI `Pagination` for multi-page lists.
- Empty states must match the information context (never reuse an order-box
  illustration blindly on unrelated entities).
- Loading, empty, error and success are separate states; never show fake zero data
  after a failed request.
- All example data in the starter is synthetic and stays in the browser.

## Before delivery

Review 390px mobile and desktop in light/dark, keyboard focus, reduced motion,
long content, form validation and any overlay dismissal/return-focus behavior.
