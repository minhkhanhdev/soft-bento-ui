import { PrintOSIcons } from './icons';
import { BentoIcon } from '../soft-bento/primitives/Icon';
import { useState } from 'react';
import {
  Description,
  FieldError,
  Input,
  Label,
  Switch,
  Tabs,
  TextField,
  Typography,
  toast,
} from '@heroui/react';
import { Box, Check, Coins, Layers3, Package2, Sparkles, TrendingUp, Wallet, Zap } from 'lucide-react';
import printer3dImg from '../assets/printer-3d.png';
import { states } from '../demo';
import {
  BentoButton,
  BentoCard,
  BentoSubsurface,
  DataTable,
  FeatureTeaser,
  HorizontalBarChart,
  MoneyText,
  PanelTitle,
  StatCard,
  StatGlowBadge,
  StatusPill,
  type DataTableColumn,
  type DialogState,
  type HorizontalBarItem,
  type PanelTitleTone,
} from '../soft-bento';
import { StatusChip } from './StatusChip';
import { EmptyState } from './EmptyState';
import { IconCatalog } from './IconCatalog';
import { MediaImage } from './MediaImage';
import { ActionDialog } from '../soft-bento/patterns/ActionDialog';

type KitLevel = 'all' | 'foundation' | 'motion' | 'primitives' | 'table-form' | 'patterns';
const kitLevels: KitLevel[] = ['all', 'foundation', 'motion', 'primitives', 'table-form', 'patterns'];

type DemoSpecRow = {
  id: string;
  component: string;
  layer: string;
  metric: string;
  tone: 'emerald' | 'blue' | 'amber';
  status: string;
};

const demoTableRows: DemoSpecRow[] = [
  { id: 'SB-01', component: 'useTheme + Tokens', layer: 'Foundation', metric: '4 tầng tối', tone: 'emerald', status: 'Sẵn sàng' },
  { id: 'SB-02', component: 'DataTable Quiet Chrome', layer: 'Primitives', metric: '11px header', tone: 'blue', status: 'Dùng chung' },
  { id: 'SB-03', component: 'HorizontalBarChart', layer: 'Patterns', metric: 'Tỷ lệ thực', tone: 'amber', status: 'Tương tác' },
];

const tokenSwatches = [
  { label: 'Nền trang', token: 'canvas', role: 'Canvas' },
  { label: 'Mặt thẻ bento', token: 'surface', role: 'Card' },
  { label: 'Mặt phụ 2', token: 'surface-secondary', role: 'Subtle' },
  { label: 'Mặt phụ 3', token: 'surface-tertiary', role: 'Tertiary' },
  { label: 'Xanh Basic', token: 'accent', role: 'Primary' },
  { label: 'Chờ lấy hàng', token: 'state-pickup', role: 'Pickup' },
  { label: 'Thành công', token: 'success', role: 'Success' },
  { label: 'Cảnh báo', token: 'warning', role: 'Warning' },
  { label: 'Nguy hiểm', token: 'danger', role: 'Danger' },
  { label: 'Xanh trạng thái', token: 'state-shipping', role: 'Sky' },
] as const;

const elevationSpecimens = [
  { label: 'Hairline Card', shadowVar: 'var(--card-shadow)', note: 'Panel & Card mặc định' },
  { label: 'Card Hover', shadowVar: 'var(--card-shadow-hover)', note: 'Hiệu ứng tương tác' },
  { label: 'Bento Floating', shadowVar: 'var(--bento-shadow-float)', note: 'Modal, Popover & Toast' },
];

const panelIconSwatches: { label: string; tone: PanelTitleTone; icon: typeof TrendingUp }[] = [
  { label: 'Blue', tone: 'blue', icon: TrendingUp },
  { label: 'Indigo', tone: 'indigo', icon: Box },
  { label: 'Emerald', tone: 'emerald', icon: Coins },
  { label: 'Amber', tone: 'amber', icon: Zap },
  { label: 'Sky', tone: 'sky', icon: Sparkles },
];

const iconBoxSwatches = [
  { label: 'Chàm', tone: 'indigo' as const, token: '--indigo-soft', icon: Package2 },
  { label: 'Xanh lá', tone: 'emerald' as const, token: '--green-soft', icon: Coins },
  { label: 'Cam', tone: 'amber' as const, token: '--amber-soft', icon: TrendingUp },
  { label: 'Xanh dương', tone: 'blue' as const, token: '--blue-soft', icon: Wallet },
];

const stateNotes: Record<string, string> = {
  'Chờ xác nhận': 'Mới tiếp nhận',
  'Đang chuẩn bị': 'Đang in / gia công',
  'Chờ lấy hàng': 'Sẵn sàng bàn giao',
  'Đang giao': 'Đơn vị vận chuyển',
  'Đã giao': 'Hoàn tất đơn',
  'Đã hủy': 'Dừng thực hiện',
};

const barPresetA: HorizontalBarItem[] = [
  { key: 'blue', label: 'Đang hoạt động', count: 14, tone: 'blue' },
  { key: 'emerald', label: 'Hoàn tất', count: 9, tone: 'emerald' },
  { key: 'amber', label: 'Chờ xử lý', count: 5, tone: 'amber' },
];

const barPresetB: HorizontalBarItem[] = [
  { key: 'blue', label: 'Đang hoạt động', count: 6, tone: 'blue' },
  { key: 'emerald', label: 'Hoàn tất', count: 18, tone: 'emerald' },
  { key: 'amber', label: 'Chờ xử lý', count: 4, tone: 'amber' },
];

export function KitPage({
  dark,
  onDark,
  onDialog,
}: {
  dark: boolean;
  onDark: (value: boolean) => void;
  onDialog: (value: DialogState) => void;
}) {
  const [level, setLevel] = useState<KitLevel>(() => {
    if (typeof window === 'undefined') return 'all';
    try {
      const saved = sessionStorage.getItem('printos-ui-kit-level') as KitLevel | null;
      return saved && kitLevels.includes(saved) ? saved : 'all';
    } catch { return 'all'; }
  });
  const [demoOpen, setDemoOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [name, setName] = useState('Mô hình phi hành gia');
  const [invalid, setInvalid] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState(false);
  const [altBars, setAltBars] = useState(false);

  const show = (section: Exclude<KitLevel, 'all'>) => level === 'all' || level === section;

  const demoColumns: DataTableColumn<DemoSpecRow>[] = [
    {
      key: 'id',
      label: 'Mã',
      isRowHeader: true,
      render: row => <span className="order-id-text">{row.id}</span>,
    },
    {
      key: 'component',
      label: 'Thành phần',
      render: row => (
        <div className="product-stack">
          <span className="product-name">{row.component}</span>
          <span className="cell-sub">{row.layer}</span>
        </div>
      ),
    },
    {
      key: 'metric',
      label: 'Quy chuẩn',
      align: 'right',
      className: 'amount-cell',
      render: row => row.metric,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: row => <StatusPill tone={row.tone}>{row.status}</StatusPill>,
    },
  ];

  return (
    <div className="kit-layout">
      <section className="kit-intro">
        <div>
          <span className="kit-eyebrow">@SOFT-BENTO/UI · HEROUI v3 LAYERED SYSTEM</span>
          <Typography type="h5" render={props => <h2 {...props} />}>
            Hệ thống thiết kế phân tầng: Foundation, Primitives & Patterns dùng lại đa dự án.
          </Typography>
          <Typography type="body-sm">
            Tổ chức độc lập trong <code>src/soft-bento/</code> (Theme, Motion, Card, Button, Quiet Chrome Table, Charts). Dự án mới chỉ cần clone hoặc cài gói nội bộ là dùng ngay.
          </Typography>
        </div>
        <div className="kit-brand-art" aria-hidden="true">
          <BentoIcon icon={Layers3} size={56} />
          <span>HeroUI v3 · Tailwind v4</span>
        </div>
      </section>

      <Tabs
        selectedKey={level}
        onSelectionChange={key => {
          const next = String(key) as KitLevel;
          if (!kitLevels.includes(next)) return;
          setLevel(next);
          try { sessionStorage.setItem('printos-ui-kit-level', next); } catch { /* Optional preference. */ }
        }}
        className="kit-level-tabs"
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label="Phân tầng Bộ UI kit">
            <Tabs.Tab id="all">
              Tất cả
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="foundation">
              01 · Theme &amp; Chữ
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="motion">
              02 · Animation
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="primitives">
              03 · Card &amp; Button
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="table-form">
              04 · Table &amp; Form
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="patterns">
              05 · Chart &amp; Pattern
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div className="kit-columns">
        {show('foundation') && (
          <>
            <BentoCard className="kit-section kit-section-full">
              <BentoCard.Header className="kit-section-header">
                <span>01</span>
                <div>
                  <BentoCard.Title>Foundation · Theme &amp; Bề mặt</BentoCard.Title>
                  <BentoCard.Description>Xanh dương Basic + Soft Bento, Dark mode 4 lớp &amp; Panel Badges</BentoCard.Description>
                </div>
              </BentoCard.Header>
              <BentoCard.Content>
                <div className="swatches">
                  {tokenSwatches.map(({ label, token, role }) => (
                    <div className="swatch" key={token}>
                      <span className="swatch-color" style={{ background: `var(--${token})` }}>
                        <i>{role}</i>
                      </span>
                      <div className="swatch-meta">
                        <strong>{label}</strong>
                        <small>--{token}</small>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="kit-elevation-showcase">
                  <span className="type-spec">Bento Elevation (Độ nổi phân tầng 2 cấp)</span>
                  <div className="kit-elevation-grid">
                    {elevationSpecimens.map(item => (
                      <div
                        key={item.label}
                        className="kit-elevation-card"
                        style={{ boxShadow: item.shadowVar }}
                      >
                        <strong>{item.label}</strong>
                        <small>{item.note}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="kit-panel-icons-showcase">
                  <span className="type-spec">Huy hiệu tiêu đề Panel (PanelTitle Icon Badges · 5 sắc thái)</span>
                  <div className="kit-panel-icons-row">
                    {panelIconSwatches.map(({ label, tone, icon: Icon }) => (
                      <div className="kit-panel-icon-item" key={tone}>
                        <span className={`panel-icon-badge panel-icon-${tone}`} aria-hidden="true">
                          <BentoIcon icon={Icon} size={16} />
                        </span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="kit-icon-showcase">
                  <span className="type-spec">Khối icon chỉ số KPI (--*-soft · viền hairline 1px solid)</span>
                  <div className="kit-icon-grid">
                    {iconBoxSwatches.map(({ label, tone, token, icon: Icon }) => (
                      <div className="kit-icon-item" key={tone}>
                        <span className={`stat-icon stat-icon-${tone}`} aria-hidden="true">
                          <BentoIcon icon={Icon} size={18} />
                        </span>
                        <div>
                          <strong>{label}</strong>
                          <small>{token}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="kit-theme-switch">
                  <div>
                    <strong>useTheme · Chế độ tối (4 tầng bề mặt)</strong>
                    <Typography type="body-sm">
                      Hook dùng chung đồng bộ [data-theme], localStorage và meta theme-color.
                    </Typography>
                  </div>
                  <Switch isSelected={dark} onChange={onDark}>
                    <Switch.Content>
                      <Label className="sr-only">
                        {dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
                      </Label>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Content>
                  </Switch>
                </div>
              </BentoCard.Content>
            </BentoCard>

            <BentoCard className="kit-section kit-section-full">
              <BentoCard.Header className="kit-section-header">
                <span>02</span>
                <div>
                  <BentoCard.Title>Foundation · Chữ &amp; Con số</BentoCard.Title>
                  <BentoCard.Description>Inter · Phân cấp rõ &amp; chữ số thẳng cột (tabular-nums)</BentoCard.Description>
                </div>
              </BentoCard.Header>
              <BentoCard.Content className="type-example">
                <div className="type-scale-list">
                  <div className="type-scale-row">
                    <span className="type-spec">Tiêu đề · 15/600</span>
                    <strong className="type-sample-title">Tổng quan hoạt động xưởng in</strong>
                  </div>
                  <div className="type-scale-row">
                    <span className="type-spec">Nội dung · 13.5/500</span>
                    <span className="type-sample-body">Mô hình phi hành gia · Minh Anh</span>
                  </div>
                  <div className="type-scale-row">
                    <span className="type-spec">Nhãn phụ · 12/400</span>
                    <span className="type-sample-muted">Kỳ báo cáo: 01/11 – 10/11/2026 · Đã trừ chi phí</span>
                  </div>
                </div>
                <div className="type-numeric-grid">
                  <div className="type-numeric-box">
                    <span className="type-spec">Số liệu KPI · 24/700 · 27px màn rộng</span>
                    <div className="stat-value">
                      <MoneyText value="2.615.000 ₫" />
                    </div>
                    <small>Đơn vị ₫ thu nhỏ 0.72em, tách khỏi dãy số</small>
                  </div>
                  <div className="type-numeric-box">
                    <span className="type-spec">Mã &amp; Tiền bảng · Tabular</span>
                    <div className="type-table-sample">
                      <span className="type-order-code">PO-1048</span>
                      <span className="amount-cell">
                        <MoneyText value="450.000 ₫" />
                      </span>
                    </div>
                    <small>Chữ số đều độ rộng · Căn phải trong bảng</small>
                  </div>
                </div>
              </BentoCard.Content>
            </BentoCard>
          </>
        )}

        {show('motion') && (
          <BentoCard className="kit-section kit-section-full">
            <BentoCard.Header className="kit-section-header">
              <span>03</span>
              <div>
                <BentoCard.Title>Foundation · Animation, Hover &amp; Tactile Motion</BentoCard.Title>
                <BentoCard.Description>
                  Chuyển động CSS tiết chế từ motion.css, giữ nguyên hiệu ứng nhấn [data-pressed] của HeroUI v3
                </BentoCard.Description>
              </div>
            </BentoCard.Header>
            <BentoCard.Content>
              <div className="kit-motion-grid">
                <BentoSubsurface className="kit-motion-box">
                  <div>
                    <strong>Tactile Press &amp; Toast Feedback</strong>
                    <small>Giữ nguyên scale [data-pressed] của HeroUI, không ghi đè transform.</small>
                  </div>
                  <div className="button-examples">
                    <BentoButton
                      size="sm"
                      onPress={() =>
                        toast.success('Đã kích hoạt phản hồi', {
                          description: 'Animation CSS mượt, tôn trọng reduced-motion.',
                        })
                      }
                    >
                      Nhấn thử Toast
                    </BentoButton>
                  </div>
                </BentoSubsurface>

                <BentoSubsurface interactive className="kit-motion-box">
                  <div>
                    <strong>BentoSubsurface Hover</strong>
                    <small>Rê chuột lên khối này để xem viền xanh dịu &amp; lớp nền 135° sáng lên mượt mà.</small>
                  </div>
                  <span className="type-spec">--motion-fast: 150ms</span>
                </BentoSubsurface>

                <BentoSubsurface className="kit-motion-box">
                  <div>
                    <strong>Bar &amp; State Transition</strong>
                    <small>Đổi bộ số liệu để xem thanh HorizontalBarChart co giãn theo --ease-bar.</small>
                  </div>
                  <div>
                    <BentoButton
                      size="sm"
                      variant="secondary"
                      onPress={() => setAltBars(prev => !prev)}
                    >
                      <BentoIcon icon={PrintOSIcons.refresh} size={16} />
                      Đổi tỷ lệ mẫu
                    </BentoButton>
                  </div>
                </BentoSubsurface>
              </div>
              <div className="kit-motion-tokens">
                <span className="kit-token-chip">--motion-fast: 150ms</span>
                <span className="kit-token-chip">--motion-base: 200ms</span>
                <span className="kit-token-chip">--ease-smooth: cubic-bezier(0.2, 0.8, 0.2, 1)</span>
                <span className="kit-token-chip">--ease-bar: cubic-bezier(0.22, 1, 0.36, 1)</span>
                <span className="kit-token-chip">@media (prefers-reduced-motion: reduce)</span>
              </div>
            </BentoCard.Content>
          </BentoCard>
        )}

        {show('primitives') && (
          <BentoCard className="kit-section">
            <BentoCard.Header className="kit-section-header">
              <span>04</span>
              <div>
                <BentoCard.Title>Primitives · Card, Button &amp; Badge</BentoCard.Title>
                <BentoCard.Description>BentoCard, BentoSubsurface, 4 cấp nút &amp; StatusPill</BentoCard.Description>
              </div>
            </BentoCard.Header>
            <BentoCard.Content>
              <div className="kit-card-compare">
                <BentoCard className="kit-card-specimen">
                  <strong>BentoCard (.panel)</strong>
                  <small>Viền hairline 1px + shadow 2 tầng cho khối chính.</small>
                </BentoCard>
                <BentoSubsurface interactive className="kit-card-specimen rounded-[14px]">
                  <strong>BentoSubsurface</strong>
                  <small>Nền gradient 135° lồng bên trong card, không bọc card nặng.</small>
                </BentoSubsurface>
              </div>
              <div className="kit-subblock">
                <span className="type-spec">Phân cấp nút thao tác (BentoButton · HeroUI v3)</span>
                <div className="button-examples">
                  <BentoButton
                    size="sm"
                    onPress={() =>
                      onDialog({
                        title: 'Thao tác chính',
                        content: (
                          <Typography type="body-sm">
                            Bấm Escape hoặc nút đóng để quay lại; dữ liệu không thay đổi.
                          </Typography>
                        ),
                      })
                    }
                  >
                    <BentoIcon icon={PrintOSIcons.add} size={16} />
                    Thao tác chính
                  </BentoButton>
                  <BentoButton size="sm" variant="secondary" onPress={() => setSelected(!selected)}>
                    <BentoIcon icon={Check} size={16} />
                    {selected ? 'Đã chọn' : 'Thao tác phụ'}
                  </BentoButton>
                  <BentoButton size="sm" variant="tertiary" onPress={() => setSelected(false)}>
                    Đặt lại
                  </BentoButton>
                  <BentoButton size="sm" isDisabled>
                    Vô hiệu hóa
                  </BentoButton>
                </div>
              </div>
              <div className="kit-subblock">
                <span className="type-spec">Nhãn chỉ số &amp; mức độ phát sáng (--*-text / --*-soft / --*-glow)</span>
                <div className="glow-examples">
                  <StatGlowBadge level="positive" trend="up">+18,4%</StatGlowBadge>
                  <StatGlowBadge level="info" trend="up">+22,8%</StatGlowBadge>
                  <StatGlowBadge level="indigo" trend="up">+14,2%</StatGlowBadge>
                  <StatGlowBadge level="warning" dot>1 đã hủy</StatGlowBadge>
                  <StatGlowBadge level="danger" trend="down">-4,5%</StatGlowBadge>
                </div>
              </div>
              <div className="kit-subblock">
                <span className="type-spec">StatusPill · Áp dụng cho 6 trạng thái PrintOS</span>
                <div className="status-examples">
                  {states.map(s => (
                    <div className="status-showcase-item" key={s}>
                      <StatusChip state={s} />
                      <small>{stateNotes[s]}</small>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard.Content>
          </BentoCard>
        )}

        {show('table-form') && (
          <BentoCard className="kit-section">
            <BentoCard.Header className="kit-section-header">
              <span>05</span>
              <div>
                <BentoCard.Title>Primitives · Quiet Chrome Table &amp; Form</BentoCard.Title>
                <BentoCard.Description>DataTable header trong suốt, bôi đen copy an toàn &amp; TextField</BentoCard.Description>
              </div>
            </BentoCard.Header>
            <BentoCard.Content>
              <div className="kit-subblock">
                <span className="type-spec">DataTable (bấm dòng mở chi tiết, bôi đen mã để copy)</span>
                <DataTable
                  columns={demoColumns}
                  rows={demoTableRows}
                  getRowKey={row => row.id}
                  compact
                  className="kit-demo-table"
                  ariaLabel="Bảng mẫu Quiet Chrome"
                  onRowPress={row =>
                    onDialog({
                      title: `${row.id} · ${row.component}`,
                      description: `Thuộc tầng ${row.layer} trong @soft-bento/ui`,
                      content: (
                        <Typography type="body-sm">
                          Quy chuẩn áp dụng: {row.metric}. Trạng thái: {row.status}.
                        </Typography>
                      ),
                    })
                  }
                />
              </div>

              <div className="kit-subblock">
                <span className="type-spec">TextField · Kiểm tra dữ liệu trực tiếp &amp; Toast</span>
                <form
                  className="kit-form"
                  onSubmit={e => {
                    e.preventDefault();
                    setInvalid(!name.trim());
                    setSaved(!!name.trim());
                    if (name.trim()) toast.success('Dữ liệu hợp lệ', { description: 'Chưa lưu.' });
                    else toast.danger('Vui lòng nhập tên sản phẩm');
                  }}
                  noValidate
                >
                  <TextField
                    value={name}
                    onChange={value => {
                      setName(value);
                      setInvalid(false);
                      setSaved(false);
                    }}
                    isInvalid={invalid}
                    isRequired
                  >
                    <Label>Tên sản phẩm</Label>
                    <Input placeholder="Nhập tên sản phẩm" />
                    <Description>Nhãn luôn hiển thị khi nhập liệu.</Description>
                    <FieldError>Vui lòng nhập tên sản phẩm.</FieldError>
                  </TextField>
                  <div className="kit-form-footer">
                    <BentoButton type="submit" size="sm">
                      Thử kiểm tra
                    </BentoButton>
                    <span role="status">
                      {invalid
                        ? ''
                        : saved
                          ? 'Dữ liệu hợp lệ. Chưa lưu.'
                          : 'Thử bỏ trống để xem trạng thái lỗi.'}
                    </span>
                  </div>
                </form>
              </div>
            </BentoCard.Content>
          </BentoCard>
        )}

        {show('patterns') && (
          <BentoCard className="kit-section kit-section-full">
            <BentoCard.Header className="kit-section-header">
              <span>06</span>
              <div>
                <BentoCard.Title>Patterns · StatCard KPI &amp; HorizontalBarChart</BentoCard.Title>
                <BentoCard.Description>
                  Các khối ghép hoàn chỉnh sẵn sàng lắp cho dashboard của bất kỳ dự án nào
                </BentoCard.Description>
              </div>
            </BentoCard.Header>
            <BentoCard.Content>
              <div className="kit-card-compare">
                <StatCard
                  icon={Coins}
                  tone="emerald"
                  label="Doanh thu mẫu (StatCard)"
                  value="2.615.000 ₫"
                  trend={[42, 58, 51, 79, 68, 92, 86]}
                  note={
                    <>
                      <StatGlowBadge level="positive" trend="up">
                        +18,4%
                      </StatGlowBadge>
                      <span className="stat-sub-status">Tự co dãn sparkline</span>
                    </>
                  }
                />
                <div className="kit-bar-demo">
                  <HorizontalBarChart
                    items={altBars ? barPresetB : barPresetA}
                    unitLabel="mục"
                    ariaLabel="Biểu đồ thanh ngang mẫu"
                    onSelectItem={item =>
                      toast(`${item.label}: ${item.count} mục`, {
                        description: 'Bấm thanh để lọc danh sách theo ngữ cảnh.',
                      })
                    }
                  />
                </div>
              </div>
            </BentoCard.Content>
          </BentoCard>
        )}
      </div>

      {show('primitives') && <IconCatalog />}

      {show('patterns') && (
        <BentoCard>
          <BentoCard.Header>
            <PanelTitle title="Trạng thái rỗng" subtitle="Ảnh studio và hành động theo chuẩn Dashboard" />
          </BentoCard.Header>
          <BentoCard.Content className="kit-empty-state-grid">
            <EmptyState title="Chưa có dữ liệu" description="Thêm mục đầu tiên để bắt đầu." action={<BentoButton onPress={() => toast('Ví dụ tạo mới trong UI kit')}>Tạo mới</BentoButton>} />
            <EmptyState search title="Không tìm thấy kết quả" description="Thử từ khóa khác hoặc xóa bộ lọc." action={<BentoButton variant="secondary" onPress={() => toast('Ví dụ xóa bộ lọc trong UI kit')}>Xóa bộ lọc</BentoButton>} />
          </BentoCard.Content>
        </BentoCard>
      )}

      {show('patterns') && (
        <div className="kit-feature-specimen">
          <FeatureTeaser
            ariaLabel="Mẫu Bento FeatureTeaser"
            title="Minh họa tính năng mới (Soft Bento FeatureTeaser)"
            titleIcon={Sparkles}
            titleTone="indigo"
            statusBadge="Bento Primitives"
            stageBadge="Phiên bản 3.0"
            heading="Khối giới thiệu tính năng độc lập"
            description="Thiết kế bo góc mềm, khung nổi 2 tầng và biểu trưng 3D tích hợp hoàn toàn độc lập, không phụ thuộc ngữ cảnh nghiệp vụ."
            illustration={<img src={printer3dImg} alt="" className="feature-teaser-img" />}
            highlights={[
              { label: 'Độc lập', icon: Package2 },
              { label: 'Tương thích', icon: Layers3 },
              { label: 'Chuẩn hoá', icon: TrendingUp },
            ]}
          />
        </div>
      )}
      {show('patterns') && (
        <BentoCard>
          <BentoCard.Header>
            <PanelTitle title="Trạng thái cần phục hồi" subtitle="Mẫu thực dùng để kiểm tra ảnh thiếu và hộp thoại lồng" />
          </BentoCard.Header>
          <BentoCard.Content className="space-y-4">
            <div className="kit-empty-state-grid">
              <MediaImage alt="Sản phẩm minh họa chưa có ảnh" />
              <MediaImage alt="QR minh họa chưa được cấu hình" kind="qr" readyCaption="Quét mã QR bằng ứng dụng ngân hàng" />
            </div>
            <BentoButton variant="secondary" onPress={() => setDemoOpen(true)}>Thử hộp thoại lồng</BentoButton>
          </BentoCard.Content>
        </BentoCard>
      )}
      {demoOpen && (
        <ActionDialog title="Minh họa chi tiết" onClose={() => { setDemoOpen(false); setChildOpen(false); }}>
          <h2>Minh họa chi tiết</h2>
          <p>Mở form con rồi dùng Escape để kiểm tra trả focus, giữ nguyên lớp chi tiết.</p>
          <BentoButton onPress={() => setChildOpen(true)}>Mở form minh họa</BentoButton>
          <BentoButton variant="secondary" onPress={() => setDemoOpen(false)}>Đóng minh họa chi tiết</BentoButton>
        </ActionDialog>
      )}
      {childOpen && (
        <ActionDialog title="Form minh họa" onClose={() => setChildOpen(false)}>
          <h2>Form minh họa</h2>
          <p>Escape chỉ đóng form này và trả focus về nút mở trong chi tiết.</p>
          <BentoButton variant="secondary" onPress={() => setChildOpen(false)}>Đóng form minh họa</BentoButton>
        </ActionDialog>
      )}
    </div>
  );
}
