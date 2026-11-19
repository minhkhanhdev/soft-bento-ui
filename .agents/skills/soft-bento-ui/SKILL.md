---
name: soft-bento-ui
description: Use when building, styling, or refactoring modern SaaS dashboard cards, KPI metrics, teaser showcases, and dense layouts with HeroUI v3 and Tailwind CSS v4, especially when avoiding boxy opaque borders, missing dark theme hierarchy, or ad-hoc SVG illustrations.
---

# Soft Bento UI System

Soft Bento is a modern, airy design layer built on top of **HeroUI v3 (Tailwind CSS v4 + React Aria)**. It combines soft hairline borders, dual-layer elevation, pastel glow badges, and studio 3D asset showcases to deliver clean, dense SaaS interfaces.

## Core Philosophy

1. **HeroUI v3 as Foundation:** HeroUI v3 handles accessible DOM anatomy, keyboard navigation, and focus management. Never bypass or rewrite HeroUI core primitives.
2. **Compound Anatomy Only:** HeroUI v3 uses compound slots (`Card.Header`, `Card.Content`, `Card.Footer`, `Card.Title`). Never use obsolete v2 props like `CardBody`, `CardHeader`, `variant="flat"`, or `startContent`.
3. **Restrained Elevation Over Heavy Borders:** Visual separation is achieved via hairline micro-borders (`rgba 6.5%` light / `7.5%` dark) and 2-layer ambient shadows (`--card-shadow`), not harsh opaque 1px lines.
4. **Zero Raw Hex Literals:** All color roles resolve via semantic CSS tokens. Never hardcode hex codes or raw Tailwind grays (`zinc-*`, `sky-*`) in TSX or component CSS.

---

## Token System (Basic Blue & Soft Bento)

All styles must consume domain-agnostic CSS variables defined in [references/tokens-template.css](references/tokens-template.css):

| Token Role | Light Theme (`[data-theme="light"]`) | Dark Theme (`[data-theme="dark"]`) | Description |
| :--- | :--- | :--- | :--- |
| `--canvas` | `#f7f8fc` | `#0b101b` | Deepest viewport background layer |
| `--sidebar` | `#ffffff` | `#0e1524` | Navigation panel surface |
| `--topbar-bg` | `rgba(255, 255, 255, 0.88)` | `#101828` | Floating utility topbar token (prefer translucent `--canvas` over `.topbar` when ambient canvas gradient runs underneath) |
| `--surface` | `#ffffff` | `#121927` | Bento card and content panel surface |
| `--overlay` | `#ffffff` | `#161f31` | Popover, Tooltip, and Dialog overlay surface |
| `--surface-secondary` | `#f3f5fa` | `#182235` | Subtle secondary hover / flat list header fill |
| `--bento-subsurface-bg` | Airy 135deg white -> cool blue gradient | Deep slate -> subtle blue gradient | Smooth subsurface gradient for feature stages & inset sections |
| `--border` | `rgba(15, 23, 42, 0.065)` | `rgba(255, 255, 255, 0.075)` | Hairline panel separation border |
| `--accent` | `#2563eb` (Basic Blue) | `#60a5fa` | Primary brand accent and interactive states |
| `--success-text` / `--danger-text` / `--warning-text` | `#047857` / `#be123c` / `#b45309` (WCAG AA) | `#34d399` / `#fb7185` / `#fbbf24` | Semantic text colors |

> [!IMPORTANT]
> **Dark Mode Layering Rule:** Dark theme strictly maintains 4 distinct luminance tiers (`--canvas: #0b101b` < `--sidebar: #0e1524` < `--topbar-bg: #101828` < `--surface: #121927`). Never collapse dark mode into a single flat background.

---

## Surface Hierarchy, Restraint & Anti-Card-Overuse Rules

- **Unified Header Language & Icon Restraint:** Dashboard panel headers use `<PanelTitle>`, keeping soft pastel icon badges (`.panel-icon-badge` / `.stat-icon`) strictly on priority KPI `StatCard`s (or selective showcase sections), while structural charts/tables/lists use crisp plain titles (`icon` omitted on `PanelTitle`) to avoid icon saturation. When passing `subtitle`, `.panel-title-stack` aligns secondary text cleanly under the title.
- **Page-Level Primary Action Placement Rule:** Primary page actions (`Lưu`, `+ Thêm`, `Tạo đơn`, `Xuất dữ liệu`) MUST live in the top-right `actions` slot of `<PageHeader>` so users never have to scroll to the bottom of a long form or settings page to save. Card-scoped additive actions (e.g. `+ Thêm kênh`, `+ Thêm mẫu in`) belong in the right side of `<Card.Header>` opposite `<PanelTitle>`. Bottom-right action footers are reserved strictly for `Modal` / `AlertDialog` / `Drawer` containers.
- **Anti-Card-Overuse & Hairline-First Rule:** Reserve bordered/shadowed `<Card>` chrome for top-level Bento modules—do NOT wrap every list item, typography row, switch row, empty beta page, or table header cell in miniature bordered cards. Use flat hairline dividers (`1px solid var(--separator)`) for dense rows, plain centered empty states for upcoming pages, and a completely transparent `.topbar` at scroll top so the ambient workspace gradient has zero horizontal tint seam.
- **Data Selectability & Chart Focus:** Preserve `user-select: text` on all copyable business data (IDs, names, amounts) and guard clickable rows against text-drag selection; restrict `user-select: none` to interactive chrome and SVG charts, and suppress raw browser `:focus` rectangles on SVG plot clicks.
- **Glow & Badges:** Use `StatGlowBadge` (`.stat-glow-badge`) for metrics. Glow is created with soft pastel fills (`var(--green-soft)`) and subtle box-shadows (`var(--success-glow)`). **ZERO `text-shadow` glow on light text**, which harms legibility.

---

## 3D Asset & FeatureTeaser Policy

- **NEVER Hand-Code Inline "3D" SVGs:** Do not generate complex multi-stop gradient SVGs (clouds, globes, coins) with dashed orbital lines inside JSX. They look amateurish, bloat code, and lack real lighting depth.
- **NEVER Generate Infinite Animation Loops:** No continuous keyframe rotations, pulsing scale oscillations, or orbiting blobs. Motion must be restrained (150–200ms) and user-initiated.
- **The FeatureTeaser Standard:** Use `<FeatureTeaser>` with:
  1. A transparent, alpha-isolated studio 3D PNG asset passed to the `illustration` prop, OR
  2. A crisp Lucide icon fallback (e.g. `<Sparkles size={32} />`),
  3. Rendered on an airy 3–5% tinted stage (`--teaser-stage-bg`, `--radius-stage: 14px`).

---

## Rationalization & Red-Flags Table (Addressing Anti-Patterns)

| Red-Flag Rationalization | Reality & Why It Fails | Soft Bento Requirement |
| :--- | :--- | :--- |
| *"HeroUI v2 props like `CardBody` or `variant='flat'` are quicker to scaffold."* | HeroUI v3 uses React Aria compound anatomy. Mixing v2 props causes silent layout breaks or hydration errors. | Always use `<Card.Header>`, `<Card.Content>`, `<Card.Footer>`, `<Card.Title>` with valid `<Card>` variants (`default` or `secondary`); note that `variant="soft"` belongs to `<Chip>`, not `<Card>`. |
| *"I drew a 3D cloud with SVG gradients and dashed rings to save time on asset sourcing."* | Hand-drawn SVGs look flat and cartoonish; inline SVG blobs bloat the component bundle by hundreds of lines. | Use `<FeatureTeaser>` with a real alpha-isolated 3D PNG or clean Lucide icon fallback. |
| *"Tailwind `border-zinc-200` and `sky-500` are standard and look fine."* | Breaks the Bộ 1 Basic Blue/Soft Bento design system and fails completely in dark mode. | Use semantic tokens (`var(--accent)`, `var(--indigo)`, `var(--border)`, `var(--blue-soft)`). |
| *"Shadcn utility classes like `bg-primary/10`, `text-muted-foreground`, `bg-card` work everywhere."* | Those theme tokens do NOT exist in Soft Bento + HeroUI v3, leaving text uncolored and cards transparent. | Always use Soft Bento CSS variables (`var(--accent)`, `var(--blue-soft)`, `var(--muted)`, `var(--surface)`). |
| *"I reused the shipping-box empty state PNG across Printers, Finance, and Search."* | Showing a cardboard order box on a Printer or Ledger screen confuses domain context. | Pass explicit contextual `kind` / icon / illustration matching the entity being displayed; never reuse a single domain illustration blindly. |
| *"I built custom `<button>` pagination and `<div className='overflow-x-auto'>` around Table."* | Duplicates scroll containers, loses ARIA pagination navigation, and fractures table footers across pages. | Compose HeroUI v3 `<Table>` (`Table.ScrollContainer` + `Table.Content` + `Table.Footer` with `<Pagination size="sm">`), paired with `<SearchField>` and `<Dropdown>`/`<Select>` in the card toolbar. |
| *"Using Tailwind's `dark:` utility class is enough for dark mode."* | HeroUI overlays (Modals, Popovers, Selects, Drawers) mount via React portals directly under `<body>` and miss localized `.dark` classes. | Style via `[data-theme="dark"]` CSS variables on `<html>` or `<body>`. |
| *"I added text-shadow to make the stat percentage glow."* | `text-shadow` blurs character edges, impairs readability, and fails WCAG contrast standards. | Use `StatGlowBadge` with soft background tint and micro-border; never blur text. |
| *"I put the icon in an unstyled box on the top-right of the card."* | Inconsistent icon positions fracture the visual scanning pattern across the dashboard. | Card headers must use `<PanelTitle>` with a 28×28 `.panel-icon-badge` on the left. |
| *"Using a flat 100% pastel or slate fill for nested rows or intro banners is fine."* | Flat 100% fills look heavy and disconnected from airy `FeatureTeaser` gradient stages. | Use `var(--bento-subsurface-bg)` (`.bento-subsurface`) with hairline borders for all nested rows, banners, and showcase sub-cards. |
| *"I overrode the button scale transform to make it stationary."* | Breaks HeroUI v3's tactile feedback curve (`[data-pressed]`). | Preserve `[data-pressed]` scale; style only background, border, and micro-shadow. |

---

## Component Primitives & Usage Examples

### 1. Bento Card with Unified PanelTitle

```tsx
import { Card } from '@heroui/react';
import { Cloud } from 'lucide-react';
import { PanelTitle } from './PanelTitle';

export function CloudSyncCard() {
  return (
    <Card className="panel">
      <Card.Header className="panel-heading">
        <PanelTitle icon={Cloud} tone="blue" title="Đồng bộ Đám mây" />
        <span className="feature-teaser-status">Tự động</span>
      </Card.Header>
      <Card.Content className="panel-body">
        <p className="text-sm text-[var(--muted)]">Dữ liệu được sao lưu liên tục theo thời gian thực.</p>
      </Card.Content>
    </Card>
  );
}
```

### 2. KPI Metric Card with StatGlowBadge

```tsx
import { Database } from 'lucide-react';
import { StatCard, StatGlowBadge } from './StatCard';

export function StorageMetric() {
  return (
    <StatCard
      icon={Database}
      tone="indigo"
      label="Dung lượng đã dùng"
      value="48.2 GB"
      currencySuffix=""
      trend={[20, 28, 35, 42, 48]}
      note={
        <StatGlowBadge level="positive" trend="up">
          +12% so với tháng trước
        </StatGlowBadge>
      }
    />
  );
}
```

### 3. FeatureTeaser Showcase with Alpha-Isolated 3D Asset or Fallback

```tsx
import { Sparkles, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { FeatureTeaser } from './FeatureTeaser';

export function EnterpriseTeaser() {
  return (
    <FeatureTeaser
      ariaLabel="Tính năng Đồng bộ Đám mây Doanh nghiệp"
      title="Đồng bộ Đám mây"
      titleIcon={Sparkles}
      titleTone="blue"
      statusBadge="Sắp ra mắt"
      stageBadge="BETA"
      heading="Sao lưu đa điểm không giới hạn"
      description="Tự động đồng bộ hóa tất cả tài liệu và nhật ký hoạt động lên hạ tầng điện toán đám mây bảo mật cao."
      illustration={<img src="/assets/3d/cloud-sync-3d.png" alt="" className="feature-teaser-img" />}
      highlights={[
        { label: 'Mã hóa E2E', icon: ShieldCheck },
        { label: 'Tốc độ 10Gbps', icon: Zap },
        { label: 'Khôi phục 1 chạm', icon: RefreshCw },
      ]}
    />
  );
}
```

---

## Deep References & Adoption

- **Full Design Tokens:** See [references/tokens-template.css](references/tokens-template.css) for Light/Dark CSS variables.
- **HeroUI Slot Overrides & Motion:** See [references/heroui-overrides.md](references/heroui-overrides.md) for slot classes, active button scaling, and motion guards.
- **Cross-Project Setup:** See [references/portable-adoption.md](references/portable-adoption.md) for the 5-step checklist to adopt Soft Bento UI in any new React + HeroUI v3 + Tailwind v4 project and install it globally.
