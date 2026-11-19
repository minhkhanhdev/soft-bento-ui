# `@soft-bento/ui`

Layered Soft Bento design system built on top of **HeroUI v3 (`@heroui/react` + `@heroui/styles`)**, **Tailwind CSS v4**, and **Lucide React**. Contains zero domain logic so any React project can reuse it after `git clone`.

## Layered Architecture

- **`foundation/`**: Theme tokens (`tokens.css` Light/Dark 4-tier surfaces + Basic Blue), motion timing (`motion.css`), and `useTheme`.
- **`primitives/`**: HeroUI v3 BEM overrides (`heroui.css`), `BentoButton` / `BentoIconButton`, compound `BentoCard` & `BentoSubsurface`, `StatGlowBadge` & `StatusPill`, and Quiet-Chrome `DataTable`.
- **`patterns/`**: `AppShell`, `PageHeader`, `PanelTitle`, `StatCard` (KPI + sparkline), proportional `HorizontalBarChart`, `FeatureTeaser`, and `PreviewDialog`.

## Quick Reuse in Another Project

1. Install peer dependencies in your target project:
   ```bash
   npm install @heroui/react @heroui/styles lucide-react
   ```
   Or reference this cloned folder directly via `npm install ../<repo>/src/soft-bento` (or copy `src/soft-bento/` into your project).

2. Import Tailwind v4, HeroUI styles, and `@soft-bento/ui/styles.css` in your root CSS (`src/styles.css`):
   ```css
   @import "tailwindcss";
   @import "@heroui/styles";
   @import "@soft-bento/ui/styles.css"; /* or "./soft-bento/styles.css" */
   ```

3. Use primitives and patterns in React:
   ```tsx
   import { useTheme, AppShell, BentoCard, DataTable, StatCard, HorizontalBarChart } from '@soft-bento/ui';
   ```
