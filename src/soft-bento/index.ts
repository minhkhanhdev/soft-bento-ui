/* Foundation */
export { useTheme, type ThemeMode, type UseThemeOptions } from './foundation/useTheme';

/* Primitives (HeroUI v3-Aligned) */
export { BentoIcon, type BentoIconProps } from './primitives/Icon';
export { BentoButton, BentoIconButton, Button, type BentoButtonProps } from './primitives/Button';
export { BentoCard, BentoSubsurface, Card, type BentoCardProps, type BentoSubsurfaceProps } from './primitives/Card';
export { StatGlowBadge, StatusPill, type GlowLevel, type StatusPillProps, type StatusPillTone } from './primitives/Badge';
export { DataTable, type DataTableColumn, type DataTableProps } from './primitives/DataTable';
export { TablePagination, type TablePaginationProps } from './primitives/TablePagination';

/* Patterns & Data Visualization */
export {
  AppShell,
  PageHeader,
  type AppNavItem,
  type AppShellProfile,
  type AppShellProps,
  type AppShellThemeToggle,
  type PageHeaderProps,
} from './patterns/AppShell';
export { PanelTitle, type PanelTitleProps, type PanelTitleTone } from './patterns/PanelTitle';
export { MoneyText, StatCard, buildSparklinePath, type StatCardProps, type StatTone } from './patterns/StatCard';
export {
  HorizontalBarChart,
  type HorizontalBarChartProps,
  type HorizontalBarItem,
} from './patterns/HorizontalBarChart';
export { FeatureTeaser, type FeatureTeaserHighlight, type FeatureTeaserProps } from './patterns/FeatureTeaser';
export { PreviewDialog, type DialogState, type PreviewDialogProps } from './patterns/Dialogs';
export { ActionDialog } from './patterns/ActionDialog';
