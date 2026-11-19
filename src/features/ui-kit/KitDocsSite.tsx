import { useEffect, useRef, useState } from 'react';
import { Button, Chip, Drawer, Kbd, Modal, SearchField } from '@heroui/react';
import { ArrowUpRight, BookOpen, ChevronRight, Layers, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { BentoIcon, useTheme } from '../../soft-bento';
import { assetHref, components, docHref, guides, readDocId, fold } from './catalog';
import { DocArticle } from './DocArticle';
import './kit-docs.css';

const navGroups = ['Get started', 'Foundation', 'AI & workflow', 'Patterns & reuse'];
const searchEntries = [
  ...guides.map(page => ({
    id: page.id,
    title: page.title,
    group: page.group,
    text: page.description + ' ' + page.sections.map(s => s.title + ' ' + (s.paragraphs ?? []).join(' ')).join(' '),
  })),
  {
    id: 'components',
    title: 'All Components',
    group: 'Get started',
    text: 'component catalog HeroUI Soft Bento primitives patterns',
  },
  ...components.map(component => ({
    id: `components/${component.id}`,
    title: component.name,
    group: component.group,
    text: component.description + ' ' + component.exports.join(' '),
  })),
];

export default function KitDocsSite() {
  const [id, setId] = useState(() => readDocId(window.location.pathname));
  const [mobile, setMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const { dark, setDark, toggleDark } = useTheme({ storageKey: 'soft-bento-docs-theme' });
  const articleRef = useRef<HTMLElement>(null);
  const navigationRef = useRef(false);
  const component = components.find(c => `components/${c.id}` === id);
  const guide = guides.find(g => g.id === id);
  const toc = component
    ? [
        { id: 'example', title: 'Ví dụ trực tiếp' },
        { id: 'usage', title: 'Cách dùng' },
        { id: 'api', title: 'Props chính' },
        { id: 'implementation', title: 'Lưu ý triển khai' },
      ]
    : id === 'components'
      ? [
          { id: 'soft-bento-components', title: 'Soft Bento & adapters' },
        ]
      : (guide?.sections ?? []).map(section => ({ id: section.id, title: section.title }));
  const normalized = fold(query.trim());
  const results = searchEntries
    .filter(entry => !normalized || fold(entry.title + ' ' + entry.text).includes(normalized))
    .slice(0, 10);

  function navigate(next: string) {
    if (id !== next) window.history.pushState({}, '', docHref(next));
    navigationRef.current = true;
    setId(next);
    setMobile(false);
    setSearchOpen(false);
    setQuery('');
    if (id === next) {
      window.scrollTo({ top: 0 });
      articleRef.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
    }
  }

  function follow(event: React.MouseEvent<HTMLAnchorElement>, next: string) {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      navigate(next);
    }
  }

  useEffect(() => {
    const listener = () => {
      navigationRef.current = true;
      setId(readDocId(window.location.pathname));
      setMobile(false);
      setSearchOpen(false);
    };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(open => !open);
      }
    };
    window.addEventListener('popstate', listener);
    window.addEventListener('keydown', shortcut);
    return () => {
      window.removeEventListener('popstate', listener);
      window.removeEventListener('keydown', shortcut);
    };
  }, []);

  useEffect(() => {
    const label = component?.name ?? guide?.title ?? (id === 'components' ? 'All Components' : 'Tài liệu');
    document.title = `${label} · PrintOS Soft Bento UI`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        component?.description ?? guide?.description ?? 'Tài liệu UI/UX kit Soft Bento trên nền HeroUI v3.',
      );
    if (navigationRef.current) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      articleRef.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
      navigationRef.current = false;
    } else if (window.location.hash) {
      requestAnimationFrame(() =>
        document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView(),
      );
    }
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
      },
      { rootMargin: '-90px 0px -60% 0px' },
    );
    articleRef.current?.querySelectorAll('section[id]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [id, component, guide]);

  const nav = (
    <nav aria-label="Điều hướng tài liệu" className="docs-nav">
      <a className="docs-nav-overview" href="/ui-kit" onClick={e => follow(e, 'introduction')}>
        <BentoIcon icon={BookOpen} size={16} />
        <span>Tài liệu bộ kit</span>
        <Chip size="sm" variant="soft" color="accent">
          v3.2
        </Chip>
      </a>
      {navGroups.map(group => (
        <div className="docs-nav-group" key={group}>
          <h2>{group}</h2>
          {guides
            .filter(page => page.group === group)
            .map(page => (
              <a
                key={page.id}
                href={docHref(page.id)}
                aria-current={id === page.id ? 'page' : undefined}
                onClick={e => follow(e, page.id)}
              >
                <span>{page.title}</span>
                {page.id === 'quick-start' && <span className="docs-nav-dot" aria-hidden="true" />}
              </a>
            ))}
          {group === 'Get started' && (
            <a
              href={docHref('components')}
              aria-current={id === 'components' ? 'page' : undefined}
              onClick={e => follow(e, 'components')}
            >
              <span>All Components</span>
              <span className="docs-nav-counter">{components.length}</span>
            </a>
          )}
        </div>
      ))}
      <div className="docs-nav-group">
        <h2>Components</h2>
        {['Primitives', 'Patterns', 'Adapters', 'PrintOS'].map(group => (
          <div className="docs-nav-components" key={group}>
            <h3>{group}</h3>
            {components
              .filter(c => c.group === group)
              .map(c => (
                <a
                  key={c.id}
                  href={docHref(`components/${c.id}`)}
                  aria-current={id === `components/${c.id}` ? 'page' : undefined}
                  onClick={e => follow(e, `components/${c.id}`)}
                >
                  {c.name}
                </a>
              ))}
          </div>
        ))}
      </div>
      <a
        href="https://heroui.com/docs/react/getting-started/quick-start"
        className="docs-nav-external"
        target="_blank"
        rel="noreferrer"
      >
        <span>HeroUI chính thức</span>
        <ArrowUpRight size={14} />
      </a>
    </nav>
  );

  return (
    <div className="docs-root">
      <a href="#docs-main" className="docs-skip-link">
        Đến nội dung tài liệu
      </a>
      <header className="docs-header">
        <div className="docs-brand-group">
          <Button
            variant="ghost"
            isIconOnly
            size="sm"
            className="docs-mobile-toggle"
            aria-label="Mở menu tài liệu"
            onPress={() => setMobile(true)}
          >
            <BentoIcon icon={Menu} size={18} />
          </Button>
          <a className="docs-brand" href="/ui-kit" onClick={e => follow(e, 'introduction')}>
            <span className="brand-mark docs-brand-mark" aria-hidden="true">
              <BentoIcon icon={Layers} size={18} />
            </span>
            <span>
              print<span className="brand-os">os</span>
              <span className="brand-dot">.</span>
              <span className="docs-brand-ui">ui kit</span>
            </span>
          </a>
          <Chip size="sm" variant="soft" color="accent" className="docs-version">
            HeroUI v3
          </Chip>
        </div>
        <div className="docs-header-right">
          <button
            type="button"
            className="docs-search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Tìm trong tài liệu"
          >
            <BentoIcon icon={Search} size={15} />
            <span>Tìm trong tài liệu…</span>
            <Kbd className="docs-search-kbd">⌘K</Kbd>
          </button>
          <a className="docs-app-link" href="/">
            Ứng dụng
            <ArrowUpRight size={14} />
          </a>
          <span className="docs-header-divider" />
          <Button
            variant="ghost"
            isIconOnly
            size="sm"
            aria-label={dark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            onPress={toggleDark}
          >
            <BentoIcon icon={dark ? Sun : Moon} size={17} />
          </Button>
          <a className="docs-header-download" href={assetHref("downloads/soft-bento-starter.zip")} download>
            Tải bộ kit
            <ArrowUpRight size={14} />
          </a>
        </div>
      </header>
      <aside className="docs-sidebar">{nav}</aside>
      <div className="docs-mobile-context">
        <span>{component?.name ?? guide?.title ?? 'All Components'}</span>
        <span>
          PrintOS UI Kit
          <ChevronRight size={13} />
        </span>
      </div>
      <div className="docs-content-layout">
        <main id="docs-main" ref={articleRef}>
          <DocArticle key={id} id={id} onNavigate={navigate} dark={dark} onDark={setDark} />
        </main>
        <aside className="docs-toc" aria-label="Mục lục bài">
          <span className="docs-toc-label">Trong trang này</span>
          {toc.map(section => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={activeSection === section.id ? 'location' : undefined}
            >
              {section.title}
            </a>
          ))}
          <div className="docs-toc-help bento-subsurface">
            <span className="panel-icon-badge panel-icon-blue">
              <BentoIcon icon={Layers} size={15} />
            </span>
            <strong>Mang thiết kế đi cùng bạn</strong>
            <p>Mã nguồn, nguyên tắc và skills đóng gói sẵn trong một bộ kit.</p>
            <a href={docHref('resources')} onClick={e => follow(e, 'resources')}>
              Xem tài nguyên
              <ChevronRight size={14} />
            </a>
          </div>
        </aside>
      </div>
      <Drawer>
        <Drawer.Backdrop isOpen={mobile} onOpenChange={setMobile}>
          <Drawer.Content placement="left">
            <Drawer.Dialog className="docs-mobile-dialog">
              <Drawer.Heading className="sr-only">Menu tài liệu Soft Bento</Drawer.Heading>
              <div className="docs-mobile-dialog-header">
                <strong>PrintOS Soft Bento UI</strong>
                <Button
                  variant="ghost"
                  isIconOnly
                  size="sm"
                  aria-label="Đóng menu tài liệu"
                  onPress={() => setMobile(false)}
                >
                  <BentoIcon icon={X} />
                </Button>
              </div>
              {nav}
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
      <Modal isOpen={searchOpen} onOpenChange={setSearchOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="preview-dialog docs-search-dialog" aria-label="Tìm kiếm tài liệu">
              <Modal.Header>
                <Modal.Heading>Tìm trong tài liệu</Modal.Heading>
                <Modal.CloseTrigger aria-label="Đóng tìm kiếm" />
              </Modal.Header>
              <Modal.Body>
                <SearchField aria-label="Từ khóa tài liệu" value={query} onChange={setQuery}>
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input autoFocus placeholder="Component, theme, agents…" />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <ul className="docs-search-results" aria-label="Kết quả tìm kiếm">
                  {results.map(result => (
                    <li key={result.id}>
                      <a href={docHref(result.id)} onClick={e => follow(e, result.id)}>
                        <span>
                          <strong>{result.title}</strong>
                          <small>{result.group}</small>
                        </span>
                        <ChevronRight size={15} />
                      </a>
                    </li>
                  ))}
                </ul>
                {results.length === 0 && (
                  <p role="status" className="docs-no-results">
                    Không tìm thấy kết quả. Thử component hoặc từ khóa khác.
                  </p>
                )}
                <div className="docs-search-hint">
                  <Kbd>Tab</Kbd> chọn kết quả <Kbd>Enter</Kbd> mở <Kbd>Esc</Kbd> đóng
                </div>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
