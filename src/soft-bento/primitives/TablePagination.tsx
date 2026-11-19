import type { ReactNode } from 'react';
import { Pagination } from '@heroui/react';

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  itemLabel?: string;
  note?: ReactNode;
  isDisabled?: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

function buildPageItems(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const items: (number | 'ellipsis')[] = [1];
  if (page > 3) items.push('ellipsis');
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let current = start; current <= end; current += 1) {
    items.push(current);
  }
  if (page < totalPages - 2) items.push('ellipsis');
  items.push(totalPages);
  return items;
}

/**
 * Standardized table footer pagination built on HeroUI v3 Pagination.
 * Displays item range summary on the left and page links on the right when multiple pages exist.
 */
export function TablePagination({
  page,
  pageSize,
  total,
  itemLabel = 'bản ghi',
  note,
  isDisabled = false,
  onPageChange,
  className = '',
}: TablePaginationProps) {
  if (total <= 0 && !note) return null;

  const safeSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const start = total > 0 ? (clampedPage - 1) * safeSize + 1 : 0;
  const end = total > 0 ? Math.min(clampedPage * safeSize, total) : 0;
  const pages = buildPageItems(clampedPage, totalPages);

  return (
    <Pagination
      size="sm"
      className={`bento-pagination ${totalPages <= 1 ? 'bento-pagination-single' : ''} ${className}`.trim()}
    >
      <Pagination.Summary className="bento-pagination-summary">
        {total > 0 ? (
          <span>
            Hiển thị <strong>{start}–{end}</strong> trong <strong>{total}</strong> {itemLabel}
          </span>
        ) : null}
        {note ? (
          <span className="bento-pagination-note">
            {total > 0 ? ' · ' : ''}
            {note}
          </span>
        ) : null}
      </Pagination.Summary>

      {totalPages > 1 && (
        <Pagination.Content className="bento-pagination-controls">
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={isDisabled || clampedPage <= 1}
              aria-label="Trang trước"
              onPress={() => onPageChange(Math.max(1, clampedPage - 1))}
            >
              <Pagination.PreviousIcon />
              <span>Trước</span>
            </Pagination.Previous>
          </Pagination.Item>

          {pages.map((entry, idx) =>
            entry === 'ellipsis' ? (
              <Pagination.Item key={`ellipsis-${idx}`}>
                <Pagination.Ellipsis />
              </Pagination.Item>
            ) : (
              <Pagination.Item key={entry}>
                <Pagination.Link
                  isActive={entry === clampedPage}
                  isDisabled={isDisabled}
                  onPress={() => onPageChange(entry)}
                >
                  {entry}
                </Pagination.Link>
              </Pagination.Item>
            ),
          )}

          <Pagination.Item>
            <Pagination.Next
              isDisabled={isDisabled || clampedPage >= totalPages}
              aria-label="Trang sau"
              onPress={() => onPageChange(Math.min(totalPages, clampedPage + 1))}
            >
              <span>Sau</span>
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      )}
    </Pagination>
  );
}
