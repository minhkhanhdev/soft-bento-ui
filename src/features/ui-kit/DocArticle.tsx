import { lazy, Suspense, useState } from 'react';
import {
  Alert,
  Button,
  Chip,
  Input,
  Label,
  Table,
  Tabs,
  TextField,
} from '@heroui/react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Layers3,
  Package,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { BentoCard, BentoIcon } from '../../soft-bento';
import { assetHref, components, docHref, guides, fold, type GuideSection } from './catalog';
import { ComponentPreview, MiniDashboard } from './ComponentPreview';
import agentsText from './resources/AGENTS.md?raw';
import designText from './resources/DESIGN.md?raw';
import bentoSkill from './resources/skills/soft-bento-ui/SKILL.md?raw';

const sourceFiles = import.meta.glob('/src/soft-bento/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const adapterSources = import.meta.glob(
  '/src/kit/{EmptyState,SelectControl,CalendarFields,FormNotice,MediaImage,CashChart,OrderStatusChart,OrderTable,StatusChip,Dialogs,IconCatalog,Brand}.tsx',
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

const Playground = lazy(() => import('./Playground'));

export function CodeBlock({
  code,
  language = 'tsx',
  label = 'Mã ví dụ',
}: {
  code: string;
  language?: string;
  label?: string;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState('copied');
    } catch {
      setState('failed');
    }
  }
  return (
    <div className="docs-code">
      <div className="docs-code-toolbar">
        <span>{language}</span>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Sao chép ${label.toLowerCase()}`}
          onPress={() => void copy()}
        >
          <BentoIcon icon={state === 'copied' ? Check : Copy} size={14} />
          {state === 'copied' ? 'Đã sao chép' : 'Sao chép'}
        </Button>
      </div>
      <pre tabIndex={0} aria-label={label}>
        <code>{code}</code>
      </pre>
      {state === 'failed' && (
        <p role="status" className="docs-copy-error">
          Không thể sao chép tự động. Bạn có thể chọn nội dung mã để copy.
        </p>
      )}
    </div>
  );
}

export function ResourceLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'docs-resource-actions' : 'docs-download-grid'}>
      <a className="docs-action docs-action-primary" href={assetHref("downloads/soft-bento-starter.zip")} download>
        <BentoIcon icon={Download} size={16} />
        {compact ? 'Tải starter' : 'Soft Bento Starter · ZIP'}
        <ArrowUpRight size={15} />
      </a>
      <a className="docs-action" href={assetHref("downloads/soft-bento-agent-skills.zip")} download>
        <BentoIcon icon={Package} size={16} />
        {compact ? 'Agent & Skills' : 'Agent & Skills Pack · ZIP'}
        <ArrowUpRight size={15} />
      </a>
    </div>
  );
}

function Section({ section }: { section: GuideSection }) {
  return (
    <section id={section.id} className="docs-section">
      <h2>
        <a href={`#${section.id}`}>
          {section.title}
          <span aria-hidden="true">#</span>
        </a>
      </h2>
      {section.paragraphs?.map((text, i) => <p key={i}>{text}</p>)}
      {section.items && (
        <ul>
          {section.items.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {section.code && <CodeBlock code={section.code} language={section.language} label={section.title} />}
    </section>
  );
}

function Catalog({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const q = fold(query);
  const local = components.filter(
    item =>
      (filter === 'all' || item.group === filter) &&
      fold(item.name + ' ' + item.description + ' ' + item.exports.join(' ')).includes(q),
  );

  return (
    <>
      <BentoCard className="docs-catalog-controls">
        <TextField className="docs-catalog-search">
          <Label>Tìm component trong catalog</Label>
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Button, Table, Calendar…"
          />
        </TextField>
        <div className="docs-filter-buttons" role="group" aria-label="Lọc component">
          {[
            ['all', 'Tất cả'],
            ['Primitives', 'Primitives'],
            ['Patterns', 'Patterns'],
            ['Adapters', 'Adapters'],
            ['PrintOS', 'PrintOS'],
            ['core', 'HeroUI Core'],
          ].map(([id, label]) => (
            <Button
              key={id}
              size="sm"
              variant={filter === id ? 'primary' : 'secondary'}
              aria-pressed={filter === id}
              onPress={() => setFilter(id)}
            >
              {label}
            </Button>
          ))}
        </div>
      </BentoCard>

      {filter !== 'core' && (
        <section id="soft-bento-components" className="docs-section">
          <h2>
            Soft Bento &amp; adapters <span className="docs-count">{local.length}</span>
          </h2>
          <div className="docs-component-grid">
            {local.map(item => (
              <a
                key={item.id}
                href={docHref(`components/${item.id}`)}
                onClick={e => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate(`components/${item.id}`);
                  }
                }}
                className="docs-component-link"
              >
                <span className="docs-component-meta">
                  <Chip size="sm" variant="soft" color={item.group === 'PrintOS' ? 'warning' : 'accent'}>
                    {item.group}
                  </Chip>
                  <ArrowUpRight size={15} />
                </span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="docs-component-exports">{item.exports.join(' · ')}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {local.length === 0 && (
        <p role="status" className="docs-no-results">
          Không tìm thấy component. Thử tên khác hoặc chọn Tất cả.
        </p>
      )}
    </>
  );
}

const tokenNames = [
  'canvas',
  'sidebar',
  'topbar-bg',
  'surface',
  'overlay',
  'surface-secondary',
  'accent',
  'foreground',
  'field-background',
  'separator',
  'success',
  'warning',
];

function TokenSamples() {
  return (
    <div className="docs-token-grid">
      {tokenNames.map(token => (
        <div key={token} className="docs-token">
          <span style={{ background: `var(--${token})` }} />
          <code>--{token}</code>
        </div>
      ))}
    </div>
  );
}

export function DocArticle({
  id,
  onNavigate,
  dark,
  onDark,
}: {
  id: string;
  onNavigate: (id: string) => void;
  dark: boolean;
  onDark: (dark: boolean) => void;
}) {
  const component = id.startsWith('components/') ? components.find(c => `components/${c.id}` === id) : undefined;
  const guide = guides.find(g => g.id === id);
  const isCatalog = id === 'components';
  const [tab, setTab] = useState('preview');
  const title = component?.name ?? guide?.title ?? (isCatalog ? 'All Components' : 'Không tìm thấy trang');
  const description =
    component?.description ??
    guide?.description ??
    (isCatalog
      ? 'Tìm, xem thử và chọn đúng thành phần cho dự án tiếp theo.'
      : 'Đường dẫn tài liệu này chưa có. Bạn có thể mở mục lục hoặc tìm kiếm.');
  const sourcePath = component
    ? component.source.startsWith('src/')
      ? `/${component.source}`
      : `/src/soft-bento/${component.source}`
    : '';
  const source = sourceFiles[sourcePath] ?? adapterSources[sourcePath] ?? '';

  return (
    <article className={`docs-article ${id === 'introduction' ? 'docs-introduction' : ''}`}>
      <div className="docs-breadcrumb">
        PrintOS Soft Bento <span>/</span> {component ? 'Components' : guide?.group ?? 'Get started'}
      </div>

      {id === 'introduction' ? (
        <>
          <div className="docs-release">
            <Chip size="sm" variant="soft" color="accent">
              SOURCE KIT v3.2 · HEROUI v3.2.7
            </Chip>
          </div>
          <h1 tabIndex={-1}>
            Thiết kế nhất quán.
            <br />
            <span>Dùng lại ở mọi dự án.</span>
          </h1>
          <p className="docs-lead">
            Một hệ UI gọn gàng cho sản phẩm của bạn. Component thật từ PrintOS, nguyên tắc Soft Bento rõ ràng
            và bộ công cụ để cùng AI xây dựng giao diện có chất lượng.
          </p>
          <div className="docs-hero-actions">
            <a
              className="docs-action docs-action-primary"
              href={docHref('quick-start')}
              onClick={e => {
                e.preventDefault();
                onNavigate('quick-start');
              }}
            >
              Bắt đầu xây dựng
              <ArrowRight size={16} />
            </a>
            <a
              className="docs-action"
              href={docHref('components')}
              onClick={e => {
                e.preventDefault();
                onNavigate('components');
              }}
            >
              Khám phá components
              <Layers3 size={16} />
            </a>
          </div>
          <div className="docs-stack-line">
            <span>React 19</span>
            <span>HeroUI v3</span>
            <span>Tailwind v4</span>
            <span>Light &amp; Dark 4-Tier</span>
          </div>
          <div className="docs-hero-preview">
            <div className="docs-preview-top">
              <span>
                <i />
                <i />
                <i />
              </span>
              <span>Được ghép trực tiếp từ bộ kit PrintOS</span>
              <span className="docs-preview-label">LIVE PREVIEW</span>
            </div>
            <MiniDashboard />
          </div>
          <div className="docs-intro-features">
            {[
              [Layers3, 'blue', 'Thiết kế theo lớp', 'Foundation → primitives → patterns.'],
              [ShieldCheck, 'emerald', 'Hành vi có nền tảng', 'HeroUI & React Aria, kiểm tra thực tế.'],
              [Sparkles, 'indigo', 'Sẵn ngữ cảnh cho AI', 'Agents, skills và source dùng lại.'],
            ].map(([Icon, tone, heading, text]) => {
              const Glyph = Icon as typeof Layers3;
              return (
                <BentoCard key={String(heading)} className="docs-feature-card">
                  <span className={`panel-icon-badge panel-icon-${String(tone)}`}>
                    <BentoIcon icon={Glyph} size={16} />
                  </span>
                  <h3>{String(heading)}</h3>
                  <p>{String(text)}</p>
                </BentoCard>
              );
            })}
          </div>
        </>
      ) : (
        <header className="docs-page-heading">
          <div className="docs-page-kicker">
            {component ? component.group : isCatalog ? 'COMPONENT LIBRARY' : 'DOCUMENTATION'}
          </div>
          <h1 tabIndex={-1}>{title}</h1>
          <p className="docs-lead">{description}</p>
          {component && (
            <div className="docs-technical-meta">
              <Chip size="sm" variant="soft" color={component.group === 'PrintOS' ? 'warning' : 'accent'}>
                {component.group === 'PrintOS'
                  ? 'PrintOS adapter · ngoài starter'
                  : component.group === 'Adapters'
                    ? 'Generic adapter · tải trong starter'
                    : 'Portable core'}
              </Chip>
              <Chip size="sm" variant="soft">
                HeroUI v3
              </Chip>
              <Chip size="sm" variant="soft">
                TypeScript
              </Chip>
            </div>
          )}
        </header>
      )}

      {component && (
        <>
          {component.group === 'PrintOS' && (
            <Alert status="accent" className="mb-6">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Adapter nghiệp vụ PrintOS</Alert.Title>
                <Alert.Description>
                  Dùng dữ liệu minh họa. Không nằm trong starter portable; khi dùng lại cần thay model, nhãn và phụ
                  thuộc của domain.
                </Alert.Description>
              </Alert.Content>
            </Alert>
          )}

          <section id="example" className="docs-section docs-example-section">
            <h2>Ví dụ trực tiếp</h2>
            <Tabs selectedKey={tab} onSelectionChange={key => setTab(String(key))}>
              <Tabs.ListContainer>
                <Tabs.List aria-label="Chế độ ví dụ component">
                  <Tabs.Tab id="preview">
                    Preview
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="code">
                    Code
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="source">
                    Source
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel id="preview">
                <div
                  className={`docs-component-preview ${component.id === 'app-shell' ? 'docs-component-preview-shell' : ''}`}
                >
                  <ComponentPreview key={id} id={component.id} dark={dark} onDark={onDark} />
                </div>
              </Tabs.Panel>
              <Tabs.Panel id="code">
                <CodeBlock code={component.snippet} label={`Ví dụ ${component.name}`} />
              </Tabs.Panel>
              <Tabs.Panel id="source">
                <div className="docs-source-path">{sourcePath}</div>
                <CodeBlock code={source} label={`Nguồn ${component.name}`} />
              </Tabs.Panel>
            </Tabs>
          </section>

          <section id="usage" className="docs-section">
            <h2>Cách dùng</h2>
            <p>
              {component.group === 'PrintOS'
                ? 'Ví dụ mô tả adapter trong PrintOS. Source có phụ thuộc domain và không nằm trong starter; dùng pattern portable tương ứng để tạo adapter cho dự án mới.'
                : component.group === 'Adapters'
                  ? 'Adapter này nằm ngoài lõi. Starter có kèm source và asset cần thiết; tùy biến ngôn ngữ, dữ liệu và logic theo ứng dụng của bạn.'
                  : 'Import trực tiếp từ src/soft-bento trong source starter. Tất cả ví dụ dùng component thật và dữ liệu mẫu.'}
            </p>
            <CodeBlock code={component.snippet} label={`Cách dùng ${component.name}`} />
          </section>

          <section id="api" className="docs-section">
            <h2>Props chính</h2>
            <p>
              Bảng dưới ghi các props thường dùng. Xem tab Source để đọc toàn bộ TypeScript; wrapper HeroUI giữ thêm
              các props gốc của component tương ứng.
            </p>
            {component.props.length > 0 ? (
              <BentoCard className="bento-table-card docs-api-card">
                <Table variant="secondary" className="bento-table app-table">
                  <Table.ScrollContainer>
                    <Table.Content aria-label={`Props chính của ${component.name}`} className="docs-api-table">
                      <Table.Header>
                        <Table.Column isRowHeader>Prop</Table.Column>
                        <Table.Column>Kiểu</Table.Column>
                        <Table.Column>Mục đích</Table.Column>
                      </Table.Header>
                      <Table.Body>
                        {component.props.map(([prop, type, note]) => (
                          <Table.Row key={prop} id={prop}>
                            <Table.Cell>
                              <code className="docs-prop-name">{prop}</code>
                            </Table.Cell>
                            <Table.Cell>
                              <code className="docs-prop-type">{type}</code>
                            </Table.Cell>
                            <Table.Cell>{note}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              </BentoCard>
            ) : (
              <BentoCard className="p-4">
                <p className="m-0 text-sm" style={{ color: 'var(--muted)' }}>
                  Component hiển thị độc lập, không yêu cầu props bắt buộc.
                </p>
              </BentoCard>
            )}
          </section>

          <section id="implementation" className="docs-section">
            <h2>Lưu ý triển khai</h2>
            <ul>
              <li>Giữ label, focus và hành vi bàn phím; không ghi đè anatomy gốc.</li>
              <li>Dùng token và các trạng thái có thật; không gắn service vào lớp UI.</li>
              <li>Kiểm tra nội dung dài, mobile, light/dark và reduced-motion sau khi tùy biến.</li>
            </ul>
          </section>
        </>
      )}

      {isCatalog && <Catalog onNavigate={onNavigate} />}
      {guide?.sections.map(section => <Section key={section.id} section={section} />)}

      {id === 'theming' && (
        <section id="token-preview" className="docs-section">
          <h2>Token đang hiển thị</h2>
          <p>Mẫu màu này lấy trực tiếp từ CSS của theme hiện tại.</p>
          <TokenSamples />
        </section>
      )}

      {id === 'resources' && (
        <section id="downloads" className="docs-section">
          <h2>Tải tài nguyên</h2>
          <ResourceLinks />
          <div className="docs-file-links">
            {[
              ['AGENTS.md', 'AGENTS.md'],
              ['DESIGN.md', 'DESIGN.md'],
              ['llms.txt', '../llms.txt'],
              ['Manifest nguồn', 'manifest.json'],
            ].map(([label, file]) => (
              <a key={file} href={assetHref(`files/${file}`)} download>
                {label}
                <Download size={14} />
              </a>
            ))}
          </div>
        </section>
      )}

      {id === 'agents' && (
        <section id="agents-preview" className="docs-section">
          <h2>AGENTS.md portable</h2>
          <p>Có thể sao chép hoặc tải trong Resources. Hợp nhất với hướng dẫn hiện có của repo đích.</p>
          <CodeBlock code={agentsText} language="markdown" label="AGENTS.md portable" />
        </section>
      )}

      {id === 'skills' && (
        <section id="skill-files" className="docs-section">
          <h2>Skill files</h2>
          <div className="docs-file-links">
            <a href={assetHref("files/skills/soft-bento-ui/SKILL.md")} download>
              soft-bento-ui/SKILL.md
              <Download size={14} />
            </a>
          </div>
          <CodeBlock code={bentoSkill} language="markdown" label="Skill soft-bento-ui" />
        </section>
      )}

      

      {id === 'principles' && (
        <section id="design-contract" className="docs-section">
          <h2>Hợp đồng thiết kế tải về</h2>
          <CodeBlock code={designText} language="markdown" label="DESIGN.md portable" />
        </section>
      )}

      {id === 'playground' && (
        <Suspense fallback={<p>Đang tải bộ mẫu…</p>}>
          <Playground dark={dark} onDark={onDark} />
        </Suspense>
      )}

      {!component && !guide && !isCatalog && (
        <Button variant="primary" onPress={() => onNavigate('introduction')}>
          Về Introduction
        </Button>
      )}

      <footer className="docs-article-footer">
        <span>PrintOS Soft Bento UI · Tài liệu thiết kế trên nền HeroUI v3</span>
        <a href="https://heroui.com/docs/react/getting-started/quick-start" target="_blank" rel="noreferrer">
          HeroUI v3 docs
          <ArrowUpRight size={13} />
        </a>
      </footer>
    </article>
  );
}
