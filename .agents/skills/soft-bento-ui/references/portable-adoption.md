# Portable Multi-Project Adoption Guide for Soft Bento UI

This guide outlines how to adopt Soft Bento UI into any modern React project (Vite, Next.js App Router, Astro, etc.) and how to register the skill globally for cross-project AI agent discovery.

## Contents
- [Prerequisites & Compatibility](#prerequisites--compatibility)
- [5-Step Project Setup Checklist](#5-step-project-setup-checklist)
  - [Step 1: Install Peer Dependencies](#step-1-install-peer-dependencies)
  - [Step 2: Copy CSS Tokens & Overrides](#step-2-copy-css-tokens--overrides)
  - [Step 3: Copy Portable Component Primitives](#step-3-copy-portable-component-primitives)
  - [Step 4: Configure Theme Switcher (`data-theme`)](#step-4-configure-theme-switcher-data-theme)
  - [Step 5: Verify Build & Slots](#step-5-verify-build--slots)
- [Registering the Skill Globally for Agents](#registering-the-skill-globally-for-agents)
  - [Option A: Global Agents Directory (`~/.agents/skills/`)](#option-a-global-agents-directory-agentsskills)
  - [Option B: Gemini / Superpowers Config (`~/.gemini/config/skills/`)](#option-b-gemini--superpowers-config-geminiconfigskills)
- [Cross-Project Verification Checklist](#cross-project-verification-checklist)

---

## Prerequisites & Compatibility

- **React:** React 19+ (the current HeroUI v3 requirement)
- **Tailwind CSS:** Tailwind CSS v4 (`@import "tailwindcss";`)
- **HeroUI:** HeroUI v3 (`@heroui/react` and `@heroui/styles`)
- **Icons:** `lucide-react` (recommended for standard 15px/18px stroke icons)

---

## 5-Step Project Setup Checklist

### Step 1: Install Peer Dependencies

In your target project root:

```bash
npm install @heroui/react @heroui/styles lucide-react
```

Ensure Tailwind CSS v4 is configured in your project (with `@tailwindcss/postcss` or Vite plugin).

### Step 2 & Step 3: Copy or Install `src/soft-bento/`

Copy the self-contained layered folder `src/soft-bento/` into your project (or run `git clone` and install locally via `npm install ../<repo>/src/soft-bento`):

```text
src/soft-bento/
├── index.ts                      # Single barrel export (foundation, primitives, patterns)
├── styles.css                    # Single CSS entry importing all 4 style layers
├── package.json                  # @soft-bento/ui exports & peerDependencies
├── README.md
├── foundation/
│   ├── tokens.css                # Light/Dark 4-tier surfaces, Basic Blue, shadows, radii
│   ├── motion.css                # Motion durations, easing curves & reduced-motion guard
│   └── useTheme.ts               # Portable theme hook ([data-theme], localStorage, meta)
├── primitives/
│   ├── heroui.css                # HeroUI v3 BEM slot overrides, StatusPill & Quiet-Chrome DataTable
│   ├── Button.tsx                # BentoButton & BentoIconButton (preserves [data-pressed])
│   ├── Card.tsx                  # Compound BentoCard & BentoSubsurface
│   ├── Badge.tsx                 # StatGlowBadge & StatusPill
│   └── DataTable.tsx             # Domain-neutral Quiet-Chrome table with selection guard
└── patterns/
    ├── shell.css                 # AppShell, PageHeader, Edge Toggle, Transparent Topbar & Breadcrumbs
    ├── AppShell.tsx
    ├── PanelTitle.tsx
    ├── StatCard.tsx
    ├── HorizontalBarChart.tsx
    ├── FeatureTeaser.tsx
    └── Dialogs.tsx
```

Reference it in your main stylesheet (`src/styles.css` or `src/globals.css`):

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "./soft-bento/styles.css"; /* or "@soft-bento/ui/styles.css" */
```

All layers have zero business logic and depend only on `react`, `@heroui/react`, `@heroui/styles`, and `lucide-react`.

#### Component Defaults & Internationalization (i18n)

The primitives provide sensible default strings and accessibility labels in Vietnamese, and allow clean prop overrides for internationalization or domain-neutral customization:

| Component | Prop / Feature | Default Value | Override Guidance |
| :--- | :--- | :--- | :--- |
| `FeatureTeaser` | `highlightsAriaLabel` | `'Các tính năng dự kiến'` | Pass custom localized label for the pills group (e.g. `'Upcoming Highlights'`). |
| `MoneyText` | `suffix` | `' ₫'` | Pass `suffix=""` for unitless metrics or non-VND currencies (e.g. `suffix=" USD"` or `suffix=""`). |
| `StatCard` | `currencySuffix` | `' ₫'` | Passed down to `MoneyText`. Set `currencySuffix=""` for general numbers or non-VND metrics. |
| `AppShell` | `workspaceLabel` | `'KHÔNG GIAN LÀM VIỆC'` | Set custom workspace name or `null` to omit. |
| `AppShell` | `footerSectionTitle` / `footerItems` | `undefined` | Optional bottom navigation section above the theme toggle (for settings/system links). In collapsed mode (`82px`), `.sidebar-brand` keeps brand mark and expand toggle on one single row. |
| `AppShell` | `drawerTitle` | `'Điều hướng'` | Screen-reader title for the mobile navigation drawer. |
| `AppShell` | `themeToggle.lightLabel` | `'Giao diện sáng'` | Label for light mode state. |
| `AppShell` | `themeToggle.darkLabel` | `'Giao diện tối'` | Label for dark mode state. |
| `AppShell` | `breadcrumbRoot` | `'Không gian quản trị'` (with `Layers3` icon) | Root breadcrumb element. |
| `AppShell` | Skip link text | `'Đến nội dung chính'` | Accessibility skip-link targeting `#main-content`. |
| `AppShell` | Button aria-labels | `'Mở menu'`, `'Thu gọn sidebar'`, `'Đóng menu'`, `'Mở rộng sidebar'`, `'Điều hướng chính'`, `'Đường dẫn'`, `'Chế độ tối'` | Built-in accessible labels for navigation landmarks and toggle triggers. |
| `PreviewDialog` | `closeAriaLabel` | `'Đóng hộp thoại'` | Accessible label for the modal close button. |

### Step 4: Configure Theme Switcher (`data-theme`)

Soft Bento uses the `data-theme` attribute on the root HTML element so that HeroUI portal overlays (Modals, Popovers, Drawers, Toasts) automatically inherit theme tokens:

```typescript
// Theme toggle utility
export function setTheme(theme: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
```

Ensure your initial HTML or layout includes `data-theme="light"` or `data-theme="dark"`.

### Step 5: Verify Build & Slots

Run your project build to verify zero CSS or TypeScript syntax errors:

```bash
npm run build
```

Confirm that cards render with hairline borders (`1px solid var(--border)`), dual-tier shadows (`var(--card-shadow)`), and that dark mode properly activates the 4-tier luminance ladder.

---

## Registering the Skill Globally for Agents

To make this skill discoverable by AI agents across any repository on your machine, copy the skill package to your user-level skills directory.

### Option A: Global Agents Directory (`~/.agents/skills/`)

#### Windows PowerShell:
```powershell
$target = "$HOME\.agents\skills\soft-bento-ui"
New-Item -ItemType Directory -Force -Path $target | Out-Null
Copy-Item -Recurse -Force ".agents\skills\soft-bento-ui\*" $target
```

#### macOS / Linux:
```bash
mkdir -p ~/.agents/skills/soft-bento-ui
cp -R .agents/skills/soft-bento-ui/* ~/.agents/skills/soft-bento-ui/
```

### Option B: Gemini / Superpowers Config (`~/.gemini/config/skills/`)

#### Windows PowerShell:
```powershell
$target = "$HOME\.gemini\config\skills\soft-bento-ui"
New-Item -ItemType Directory -Force -Path $target | Out-Null
Copy-Item -Recurse -Force ".agents\skills\soft-bento-ui\*" $target
```

#### macOS / Linux:
```bash
mkdir -p ~/.gemini/config/skills/soft-bento-ui
cp -R .agents/skills/soft-bento-ui/* ~/.gemini/config/skills/soft-bento-ui/
```

---

## Cross-Project Verification Checklist

When building or reviewing UI in any project, verify:

- [ ] All colors derive from CSS variables (`--accent`, `--indigo`, `--border`, `--surface`). Zero raw hex codes in JSX.
- [ ] Card headers use `<PanelTitle>` with a 28×28 rounded pastel badge (`panel-icon-badge`) and pass `subtitle` when a secondary line is needed.
- [ ] Inset rows, showcase banners, and interactive sub-cards use `var(--bento-subsurface-bg)` (`.bento-subsurface`) rather than flat 100% opaque pastel/slate fills.
- [ ] No HeroUI v2 props (`CardBody`, `CardHeader`, `variant="flat"`, `startContent`) are used.
- [ ] No inline code-drawn "3D" SVGs or infinite keyframe loops. Use `<FeatureTeaser>` with an alpha-isolated 3D PNG or Lucide fallback.
- [ ] Dark mode sets `data-theme="dark"` and leverages the 4-tier luminance hierarchy (`--canvas`, `--sidebar`, `--topbar-bg`, `--surface`).
