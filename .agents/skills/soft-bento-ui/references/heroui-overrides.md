# HeroUI v3 Overrides & Slot Mapping Reference

This document details the CSS cascading architecture, HeroUI v3 slot mapping, dark mode luminance layering, and motion guards for the Soft Bento UI design system.

## Contents
- [CSS Import Order & Cascade Architecture](#css-import-order--cascade-architecture)
- [HeroUI v3 Slot & Compound Component Mapping](#heroui-v3-slot--compound-component-mapping)
  - [Card & Panel Slots](#card--panel-slots)
  - [Button & Active State Scale Protection](#button--active-state-scale-protection)
  - [Chip & Badges](#chip--badges)
  - [Overlays & Portals (Modal, Popover, Select, Toast)](#overlays--portals-modal-popover-select-toast)
  - [Table Slot Styling](#table-slot-styling)
- [Dark Mode Luminance Hierarchy](#dark-mode-luminance-hierarchy)
- [Motion & Accessibility Guards](#motion--accessibility-guards)

---

## CSS Import Order & Cascade Architecture

In your project CSS entry point (e.g., `src/index.css` or `src/globals.css`), load stylesheets in this exact sequence:

```css
/* 1. Tailwind CSS v4 Base */
@import "tailwindcss";

/* 2. HeroUI v3 Design System Styles */
@import "@heroui/styles";

/* 3. Soft Bento Semantic Tokens (Bộ 1) */
@import "./soft-bento-tokens.css";

/* 4. Soft Bento HeroUI Overrides & Primitives */
@import "./soft-bento-heroui.css";

/* 5. Soft Bento AppShell & Responsive Layout */
@import "./soft-bento-shell.css";
```

### Why this order matters:
1. `tailwindcss` & `@heroui/styles` define the foundational utility classes, CSS reset, and React Aria slot selectors.
2. `soft-bento-tokens.css` attaches domain-agnostic CSS custom properties to `:root`, `[data-theme="light"]`, and `[data-theme="dark"]`.
3. `soft-bento-heroui.css` applies Soft Bento aesthetic rules to HeroUI slots (`[data-slot="card"]`, `[data-slot="dialog"]`, `[data-slot="popover"]`, etc.) using pure CSS variables without hardcoding raw hex values.
4. `soft-bento-shell.css` provides domain-agnostic `AppShell`, `PageHeader`, responsive collapse, topbar, and mobile drawer styles.

---

## HeroUI v3 Slot & Compound Component Mapping

### Card & Panel Slots

HeroUI v3 uses React Aria compound anatomy. Never use v2 monolithic props (`CardHeader`, `CardBody`, `variant="flat"`). Valid `<Card>` variants in HeroUI v3 are `default`, `secondary`, `tertiary`, `transparent` (`variant="soft"` belongs to `<Chip>`).

| HeroUI v2 (Anti-Pattern) | HeroUI v3 Compound Slot | Soft Bento Class / Slot Target |
| :--- | :--- | :--- |
| `<CardHeader>` | `<Card.Header>` | Default vertical stacking: `.card__header` (`flex-col`); Horizontal bento row: `.panel-heading` (opt-in) |
| `<CardBody>` | `<Card.Content>` | `.panel-body`, `.card__content`, `[data-slot="card-content"]` |
| `<CardFooter>` | `<Card.Footer>` | `.stat-meta`, `[data-slot="card-footer"]` |
| `CardTitle` | `<Card.Title>` | `.panel-title-row`, `[data-slot="card-title"]` |
| `variant="flat"` | `variant="default"` / `"secondary"` | `[data-slot="card"]`, `.panel`, `.card` (note: `variant="soft"` belongs to `<Chip>`) |

#### Card Container Styling
```css
.panel,
[data-slot="card"],
.card {
  border-radius: var(--radius-panel); /* 18px */
  border: 1px solid var(--border);
  box-shadow: var(--card-shadow);
  background-color: var(--surface);
  transition: box-shadow 200ms ease, border-color 200ms ease;
}
```

#### Card Header Layout: Default Vertical vs Opt-In Horizontal (`.panel-heading`)

HeroUI v3's `<Card.Header>` renders with slot class `.card__header` and applies `@apply flex flex-col;` to stack `<Card.Title>` and `<Card.Description>` vertically.

- **Default `<Card.Header>` (`.card__header`):** Retains HeroUI v3's vertical column layout. Ideal for standard cards with stacked title and description.
- **Opt-in `.panel-heading` (`<Card.Header className="panel-heading">`):** Applies horizontal `flex-direction: row; justify-content: space-between; align-items: center; gap: 8px;` for dashboard bento panels pairing a `<PanelTitle>` on the left with status chips or action buttons on the right. Pass `subtitle` to `<PanelTitle>` to render `.panel-title-stack` so secondary text stays cleanly aligned with the title rather than dropping under `.panel-icon-badge`.
- **Airy Subsurface Blocks (`.bento-subsurface`):** Use `background: var(--bento-subsurface-bg)` (`--bento-subsurface-hover-bg` on interactive hover) with `1px solid var(--teaser-stage-border)` instead of flat 100% opaque pastel/slate fills for nested summary rows, showcase containers, or intro banners.
- **Section Headers (`.kit-section-header`):** For numbered section headings (like on `KitPage`), use `display: flex; flex-direction: row; justify-content: flex-start; align-items: flex-start; gap: 12px;` so the numbered badge and the title/description sit flush beside each other on the left.

### Button & Active State Scale Protection

HeroUI v3 natively handles tactile feedback via `[data-pressed="true"]` (scale transform: `scale(0.98)`).

> [!IMPORTANT]
> **Scale Protection Rule:** NEVER write `transform: none` or override button active transforms on `.button--secondary` or other button variants. Style only border, background, and micro-shadow.

```css
/* Button Secondary: Soft hairline border + micro-shadow */
.button--secondary {
  border: 1px solid var(--border);
  background-color: var(--surface);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  color: var(--foreground);
}

@media (hover: hover) {
  .button--secondary:hover,
  .button--secondary[data-hovered="true"] {
    background-color: var(--surface-secondary);
    border-color: var(--field-border);
  }
}
/* Notice: No transform override! HeroUI v3 preserves tactile pressed state */
```

### Chip & Badges

- Use `<Chip size="sm" variant="soft">` for status chips and labels.
- For metric KPI trend indicators, use `StatGlowBadge` (`.stat-glow-badge`).
- **Glow Rule:** Glow is produced by soft pastel tinted backgrounds (`var(--green-soft)`, `var(--amber-soft)`, `var(--blue-soft)`) and subtle box-shadows (`var(--success-glow)`). **NEVER apply `text-shadow` glow to light text**, as it blurs font rendering and violates WCAG contrast.

### Overlays & Portals (Modal, Popover, Select, Toast)

HeroUI overlays render into React portals attached directly to `<body>`. Because they mount outside regular page containers, they rely on CSS custom properties defined on `[data-theme="dark"]` / `[data-theme="light"]` on the root element.

```css
/* Popover & Flyouts */
.popover,
[data-slot="popover"] {
  border-radius: var(--radius-stage); /* 14px */
  border: 1px solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--bento-shadow-float);
  color: var(--foreground);
}

/* Tooltips (HeroUI v3 .tooltip) */
.tooltip,
[data-slot="tooltip-content"] {
  background-color: var(--overlay);
  color: var(--foreground);
  border: 1px solid var(--border);
  box-shadow: var(--bento-shadow-float);
  word-break: normal;
  overflow-wrap: break-word;
}

/* Modal & Dialogs */
.modal__dialog,
[data-slot="dialog"] {
  border-radius: var(--radius-panel); /* 18px */
  border: 1px solid var(--border);
  background-color: var(--surface);
  box-shadow: var(--bento-shadow-float);
  color: var(--foreground);
}

.modal__backdrop {
  background-color: rgba(11, 16, 27, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Select Trigger */
.select__trigger,
[data-slot="select-trigger"] {
  border-radius: 10px;
  border: 1px solid var(--field-border);
  background-color: var(--field-background);
  color: var(--field-foreground);
}

/* Segmented Tabs Track (HeroUI v3 .tabs__list-container / .tabs__indicator) */
.tabs__list-container {
  background-color: var(--surface-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 3px;
}

.tabs__indicator {
  background-color: var(--surface);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04);
}

/* RangeCalendar Modal Alignment
 * HeroUI v3 defaults .range-calendar to max-w-63 (252px) and uses 24px (rounded-3xl) corners.
 * Target the dialog element directly (.modal__dialog.range-dialog / .range-dialog[data-slot="dialog"]),
 * keep dialog compact so modal__body never spawns an unnecessary scrollbar, and enforce pill/circle radii.
 */
.modal__dialog.range-dialog,
.range-dialog[data-slot="dialog"] {
  width: min(328px, calc(100vw - 32px));
  max-width: 100%;
}

.range-dialog .range-calendar {
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
}

.range-dialog .range-calendar__cell .range-calendar__cell-button {
  border-radius: var(--radius-pill);
}

.range-dialog .range-calendar__cell[data-selected="true"]:not([data-outside-month="true"]) {
  border-radius: 0;
}

.range-dialog .range-calendar__cell[data-selected="true"]:not([data-outside-month="true"]):is(td:first-child > *, [aria-disabled] + td > *),
.range-dialog .range-calendar__cell[data-selection-start="true"]:not([data-outside-month="true"]) {
  border-start-start-radius: var(--radius-pill);
  border-end-start-radius: var(--radius-pill);
}

.range-dialog .range-calendar__cell[data-selected="true"]:not([data-outside-month="true"]):is(td:last-child > *, td:has(+ [aria-disabled]) > *),
.range-dialog .range-calendar__cell[data-selection-end="true"]:not([data-outside-month="true"]) {
  border-start-end-radius: var(--radius-pill);
  border-end-end-radius: var(--radius-pill);
}
```

### Table Slot Styling

Tables use hairline separators and subtle hover rows without heavy cell borders:

```css
.table-root {
  --table-border-color: var(--separator);
}

.table__column {
  color: var(--muted);
  border-bottom: 1px solid var(--separator);
}

.table__row {
  transition: background-color 150ms ease;
}

.table__row[data-hovered="true"],
.table__row:hover {
  background-color: var(--surface-secondary);
}

.table__cell {
  border-bottom: 1px solid var(--separator);
}
```

---

## Dark Mode Luminance Hierarchy

Do NOT collapse dark mode into a single flat dark background. Soft Bento defines a strict 4-tier luminance ladder that maintains spatial depth:

```
Tier 1: Canvas      (--canvas: #0b101b)           -> Deepest viewport foundation
Tier 2: Sidebar     (--sidebar: #0e1524)          -> Fixed navigation layer
Tier 3: Topbar      (--topbar-bg: #101828)        -> Floating utility header
Tier 4: Surface     (--surface: #121927)          -> Bento cards & panels
Nested: Secondary   (--surface-secondary: #182235)-> Table hovers, inset stages
Nested: Tertiary    (--surface-tertiary: #1f2c43) -> Active indicators, floating tooltips
```

### Dark Mode Selector Standard
- ALWAYS target `[data-theme="dark"]` on `<html>` or `<body>`.
- Do NOT rely on Tailwind's localized `.dark` class on parent wrappers, because HeroUI portals render at `<body>` root and would miss localized theme classes.

---

## Motion & Accessibility Guards

Soft Bento enforces restrained, professional micro-interactions:

1. **Duration Cap:** All micro-transitions are capped between `150ms` and `200ms` with `ease` timing.
2. **Hover Bounds:** Interactive cards may lift box-shadow (`var(--card-shadow-hover)`) and border color; do not execute jarring translateY jumps.
3. **Reduced Motion:** All transitions must honor `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

4. **Zero Continuous Loops:** Never generate continuous keyframe rotations, pulsing scale animations, or orbital SVG loops on dashboard cards. Motion should only be triggered by deliberate user interaction.
