import { BentoIcon } from '../primitives/Icon';
import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import {
  Avatar,
  Breadcrumbs,
  Button,
  Chip,
  Drawer,
  Label,
  Switch,
  Tooltip,
  Typography,
} from '@heroui/react';
import {
  ChevronLeft,
  Layers3,
  Menu,
  Moon,
  Sun,
  X,
  type LucideIcon,
} from 'lucide-react';

export interface AppNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: ReactNode;
  badgeTooltip?: string;
  trailingIcon?: ReactNode;
  isActive?: boolean;
  ariaCurrent?: 'page' | undefined;
  onPress?: () => void;
}

export interface AppShellThemeToggle {
  dark: boolean;
  onDark: (dark: boolean) => void;
  lightLabel?: string;
  darkLabel?: string;
}

export interface AppShellProfile {
  initials: string;
  name: string;
  subtitle?: string;
}

export interface AppShellProps {
  brand: ReactNode;
  compactBrand?: ReactNode;
  workspaceLabel?: ReactNode;
  navItems: AppNavItem[];
  secondarySectionTitle?: string;
  secondaryItems?: AppNavItem[];
  footerSectionTitle?: string;
  footerItems?: AppNavItem[];
  footerActions?: ReactNode;
  themeToggle: AppShellThemeToggle;
  profile?: AppShellProfile;
  breadcrumbIcon?: ReactNode;
  breadcrumbRoot?: ReactNode;
  currentPageLabel: string;
  isHomePage?: boolean;
  onRootPress?: () => void;
  drawerTitle?: string;
  collapsed: boolean;
  onCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  onMobileOpen: (open: boolean) => void;
  onSelectItem?: (id: string) => void;
  topbarContext?: ReactNode;
  topbarActions?: ReactNode;
  topbarSearch?: ReactNode;
  topbarTools?: ReactNode;
  topbarClassName?: string;
  mainClassName?: string;
  children: ReactNode;
}

function NavButton({
  hint,
  showTooltip,
  ...props
}: { hint: string; showTooltip: boolean } & ComponentProps<typeof Button>) {
  return (
    <Tooltip delay={350} isDisabled={!showTooltip}>
      <Button {...props} />
      <Tooltip.Content placement="right">{hint}</Tooltip.Content>
    </Tooltip>
  );
}

export function AppShell({
  brand,
  compactBrand,
  workspaceLabel = 'KHÔNG GIAN LÀM VIỆC',
  navItems,
  secondarySectionTitle,
  secondaryItems,
  footerSectionTitle,
  footerItems,
  footerActions,
  themeToggle,
  profile,
  breadcrumbIcon,
  breadcrumbRoot,
  currentPageLabel,
  isHomePage = false,
  onRootPress,
  drawerTitle = 'Điều hướng',
  collapsed,
  onCollapsed,
  mobileOpen,
  onMobileOpen,
  onSelectItem,
  topbarContext,
  topbarActions,
  topbarSearch,
  topbarTools,
  topbarClassName,
  mainClassName,
  children,
}: AppShellProps) {
  const [scrolled, setScrolled] = useState(false);
  const sidebarContentRef = useRef<HTMLDivElement>(null);
  const hasIndicatorMountedRef = useRef(false);
  const [indicator, setIndicator] = useState<{
    top: number;
    height: number;
    animate: boolean;
  } | null>(null);

  const activeNavId =
    [...navItems, ...(secondaryItems ?? []), ...(footerItems ?? [])].find(item => item.isActive)
      ?.id ?? null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    const container = sidebarContentRef.current;
    const target =
      activeNavId && container
        ? container.querySelector<HTMLElement>(`[data-nav-id="${activeNavId}"]`)
        : null;

    if (!container || !target) {
      setIndicator(null);
      return;
    }

    const top =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;
    const height = target.offsetHeight;
    const animate = hasIndicatorMountedRef.current;
    hasIndicatorMountedRef.current = true;
    setIndicator({ top, height, animate });
  }, [activeNavId, collapsed]);

  const rootContent = breadcrumbRoot ?? <span>Trang chủ</span>;
  const rootIconNode =
    breadcrumbIcon === undefined ? <BentoIcon icon={Layers3} size={16} /> : breadcrumbIcon;

  const renderNavItem = (item: AppNavItem, isMobile = false) => {
    const renderedBadge =
      typeof item.badge === 'string' || typeof item.badge === 'number' ? (
        <Chip
          size="sm"
          variant="soft"
          className="nav-count"
          title={item.badgeTooltip}
          aria-label={item.badgeTooltip}
        >
          {item.badge}
        </Chip>
      ) : (
        item.badge
      );

    return (
      <NavButton
        key={item.id}
        data-nav-id={isMobile ? undefined : item.id}
        variant="ghost"
        className={`nav-item ${item.isActive ? 'nav-active' : ''}`.trim()}
        aria-label={item.label}
        aria-current={item.ariaCurrent ?? (item.isActive ? 'page' : undefined)}
        hint={item.label}
        showTooltip={collapsed && !isMobile}
        onPress={() => {
          item.onPress?.();
          onSelectItem?.(item.id);
        }}
      >
        <BentoIcon icon={item.icon} size={18} />
        <span className="nav-label">{item.label}</span>
        {renderedBadge}
        {item.trailingIcon}
      </NavButton>
    );
  };

  const renderSidebar = (isMobile = false) => (
    <div
      ref={isMobile ? undefined : sidebarContentRef}
      className={`sidebar-content ${!isMobile && indicator ? 'has-sliding-indicator' : ''}`.trim()}
    >
      {!isMobile && indicator && (
        <span
          className={`sidebar-active-indicator ${indicator.animate ? 'is-animated' : ''}`.trim()}
          style={{
            transform: `translate3d(0, ${indicator.top}px, 0)`,
            height: `${indicator.height}px`,
          }}
          aria-hidden="true"
        />
      )}
      <div className="sidebar-brand">
        {collapsed && !isMobile ? (compactBrand ?? brand) : brand}
        {isMobile && (
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            aria-label="Đóng menu"
            onPress={() => onMobileOpen(false)}
          >
            <BentoIcon icon={X} size={16} />
          </Button>
        )}
      </div>
      {workspaceLabel ? (
        <div className="workspace-label">
          <span className="workspace-dot" />
          <span>{workspaceLabel}</span>
        </div>
      ) : null}
      <nav aria-label="Điều hướng chính">{navItems.map(item => renderNavItem(item, isMobile))}</nav>
      {secondaryItems && secondaryItems.length > 0 && (
        <div className="sidebar-secondary">
          {secondarySectionTitle && (
            <div className="nav-section-title">{secondarySectionTitle}</div>
          )}
          {secondaryItems.map(item => renderNavItem(item, isMobile))}
        </div>
      )}
      <div className="sidebar-bottom">
        {footerSectionTitle && <div className="nav-section-title">{footerSectionTitle}</div>}
        {footerItems && footerItems.length > 0 && (
          <div className="sidebar-system-items">
            {footerItems.map(item => renderNavItem(item, isMobile))}
          </div>
        )}
        {footerActions}
        {collapsed && !isMobile ? (
          <div className="sidebar-theme-row is-collapsed-theme">
            <Tooltip delay={350}>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                className="theme-icon-button"
                aria-label={themeToggle.dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
                onPress={() => themeToggle.onDark(!themeToggle.dark)}
              >
                {themeToggle.dark ? <BentoIcon icon={Moon} size={16} /> : <BentoIcon icon={Sun} size={16} />}
              </Button>
              <Tooltip.Content placement="right">
                {themeToggle.dark
                  ? (themeToggle.darkLabel ?? 'Giao diện tối')
                  : (themeToggle.lightLabel ?? 'Giao diện sáng')}
              </Tooltip.Content>
            </Tooltip>
          </div>
        ) : (
          <div className="sidebar-theme-row">
            <span className="theme-row-icon" aria-hidden="true">
              {themeToggle.dark ? <BentoIcon icon={Moon} size={18} /> : <BentoIcon icon={Sun} size={18} />}
            </span>
            <Switch
              className="theme-toggle"
              isSelected={themeToggle.dark}
              onChange={themeToggle.onDark}
              aria-label="Chế độ tối"
            >
              <Switch.Content>
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Label className="nav-label">
                  {themeToggle.dark
                    ? (themeToggle.darkLabel ?? 'Giao diện tối')
                    : (themeToggle.lightLabel ?? 'Giao diện sáng')}
                </Label>
              </Switch.Content>
            </Switch>
          </div>
        )}
        {profile && (
          <div className="sidebar-profile">
            <Avatar size="sm" color="default">
              <Avatar.Fallback>{profile.initials}</Avatar.Fallback>
            </Avatar>
            <span className="profile-info">
              <strong>{profile.name}</strong>
              {profile.subtitle && <span>{profile.subtitle}</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`app-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <aside className="sidebar" aria-label="Thanh điều hướng">
        {renderSidebar()}
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          className="sidebar-edge-toggle"
          aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          aria-expanded={!collapsed}
          onPress={() => onCollapsed(!collapsed)}
        >
          <BentoIcon icon={ChevronLeft} size={16} />
        </Button>
      </aside>
      <div className="workspace">
        <header className={`topbar ${scrolled ? 'is-scrolled' : ''} ${topbarClassName ?? ''}`.trim()}>
          <div className="topbar-start">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              className="mobile-menu"
              aria-label="Mở menu"
              onPress={() => onMobileOpen(true)}
            >
              <BentoIcon icon={Menu} size={16} />
            </Button>
            <div className="topbar-breadcrumbs">
              {rootIconNode !== null && (
                <span className="breadcrumb-root-icon" aria-hidden="true">
                  {rootIconNode}
                </span>
              )}
              <Breadcrumbs aria-label="Đường dẫn">
                {isHomePage ? (
                  <Breadcrumbs.Item className="breadcrumb-root-current">{rootContent}</Breadcrumbs.Item>
                ) : (
                  <>
                    <Breadcrumbs.Item className="breadcrumb-parent" onPress={onRootPress}>
                      {rootContent}
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Item>{currentPageLabel}</Breadcrumbs.Item>
                  </>
                )}
              </Breadcrumbs>
            </div>
            {topbarContext}
          </div>
          <div className="topbar-end">
            {topbarActions}
            {topbarSearch}
            {topbarTools && <div className="topbar-tools">{topbarTools}</div>}
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className={`main-content ${mainClassName ?? ''}`.trim()}>
          {children}
        </main>
      </div>
      <Drawer>
        <Drawer.Backdrop isOpen={mobileOpen} onOpenChange={onMobileOpen}>
          <Drawer.Content placement="left">
            <Drawer.Dialog className="mobile-nav-dialog">
              <Drawer.Heading className="sr-only">{drawerTitle}</Drawer.Heading>
              {renderSidebar(true)}
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </div>
  );
}

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  titleLevel?: 1 | 2;
  badge?: ReactNode;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  titleLevel = 1,
  badge,
  description,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`page-heading ${className}`.trim()}>
      <div className="page-heading-main">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Typography
            type={titleLevel === 1 ? 'h1' : 'h2'}
            className="page-heading-title"
          >
            {title}
          </Typography>
          {badge}
        </div>
        {description && (
          <Typography type="body-sm" className="page-heading-description">
            {description}
          </Typography>
        )}
      </div>
      {actions && <div className="heading-actions">{actions}</div>}
    </div>
  );
}
