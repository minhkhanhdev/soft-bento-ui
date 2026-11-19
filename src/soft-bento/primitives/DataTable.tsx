import { BentoIcon } from './Icon';
import type { ReactNode } from 'react';
import { Table } from '@heroui/react';
import { ChevronRight } from 'lucide-react';

export interface DataTableColumn<T> {
  key: string;
  label: ReactNode;
  headerAriaLabel?: string;
  align?: 'left' | 'right';
  isRowHeader?: boolean;
  className?: string;
  headerClassName?: string;
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  ariaLabel: string;
  compact?: boolean;
  className?: string;
  onRowPress?: (row: T, trigger?: HTMLElement) => void;
  showChevron?: boolean;
  actionHeaderAriaLabel?: string;
  emptyState?: ReactNode;
  footer?: ReactNode;
}

/**
 * Quiet-Chrome table built on HeroUI v3 Table (`variant="secondary"`), supporting
 * selection-safe row click/keyboard navigation and crisp transparent column headers.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  ariaLabel,
  compact = false,
  className,
  onRowPress,
  showChevron = Boolean(onRowPress),
  actionHeaderAriaLabel = 'Xem chi tiết',
  emptyState,
  footer,
}: DataTableProps<T>) {
  return (
    <Table
      variant="secondary"
      className={`bento-table ${compact ? 'bento-table-compact' : ''} ${className ?? ''}`.trim()}
    >
      <Table.ScrollContainer>
        <Table.Content aria-label={ariaLabel}>
          <Table.Header>
            {columns.map(col => (
              <Table.Column
                key={col.key}
                isRowHeader={col.isRowHeader}
                aria-label={col.headerAriaLabel}
                className={`${col.align === 'right' ? 'bento-col-right' : ''} ${col.headerClassName ?? col.className ?? ''}`.trim()}
              >
                {col.label}
              </Table.Column>
            ))}
            {showChevron && <Table.Column aria-label={actionHeaderAriaLabel} className="bento-col-action" />}
          </Table.Header>
          <Table.Body renderEmptyState={emptyState ? () => emptyState : undefined}>
            {rows.map(row => {
              const rowKey = getRowKey(row);
              return (
                <Table.Row
                  key={rowKey}
                  id={rowKey}
                  className={onRowPress ? 'bento-row-interactive' : undefined}
                  ref={
                    onRowPress
                      ? el => {
                          if (!el) return;
                          el.onclick = e => {
                            if (window.getSelection()?.toString()) return;
                            if (!(e.target as HTMLElement).closest('button, a')) {
                              onRowPress(row, el);
                            }
                          };
                          el.onkeydown = e => {
                            if (
                              (e.key === 'Enter' || e.key === ' ') &&
                              !(e.target as HTMLElement).closest('button, a')
                            ) {
                              e.preventDefault();
                              onRowPress(row, el);
                            }
                          };
                          return () => {
                            el.onclick = null;
                            el.onkeydown = null;
                          };
                        }
                      : undefined
                  }
                >
                  {columns.map(col => (
                    <Table.Cell
                      key={col.key}
                      className={`${col.align === 'right' ? 'bento-col-right' : ''} ${col.className ?? ''}`.trim()}
                    >
                      {col.render(row)}
                    </Table.Cell>
                  ))}
                  {showChevron && (
                    <Table.Cell className="bento-col-action action-cell">
                      <span className="row-chevron" aria-hidden="true">
                        <BentoIcon icon={ChevronRight} size={16} />
                      </span>
                    </Table.Cell>
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      {footer ? <Table.Footer className="bento-table-footer">{footer}</Table.Footer> : null}
    </Table>
  );
}
