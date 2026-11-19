import type { ReactNode } from 'react';
import { FolderOpen } from 'lucide-react';
import { BentoIcon, type BentoIconComponent } from '../soft-bento/primitives/Icon';
import {
  EmptyAccessoriesIllustration,
  EmptyContentIllustration,
  EmptyFilamentsIllustration,
  EmptyFinanceIllustration,
  EmptyOrdersIllustration,
  EmptyPrintersIllustration,
  EmptyProductsIllustration,
  EmptySearchIllustration,
  EmptyWorksheetsIllustration,
} from './illustrations';

export type EmptyStateKind =
  | 'orders'
  | 'search'
  | 'products'
  | 'printers'
  | 'filaments'
  | 'accessories'
  | 'finance'
  | 'worksheets'
  | 'content'
  | 'generic';

const STUDIO_ILLUSTRATIONS: Partial<Record<EmptyStateKind, () => ReactNode>> = {
  orders: () => <EmptyOrdersIllustration />,
  search: () => <EmptySearchIllustration />,
  printers: () => <EmptyPrintersIllustration />,
  filaments: () => <EmptyFilamentsIllustration />,
  accessories: () => <EmptyAccessoriesIllustration />,
  products: () => <EmptyProductsIllustration />,
  finance: () => <EmptyFinanceIllustration />,
  worksheets: () => <EmptyWorksheetsIllustration />,
  content: () => <EmptyContentIllustration />,
};

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  search?: boolean;
  kind?: EmptyStateKind;
  icon?: BentoIconComponent;
  illustration?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  search = false,
  kind = 'generic',
  icon,
  illustration,
}: EmptyStateProps) {
  const effectiveKind: EmptyStateKind = search ? 'search' : kind;
  const renderStudio = STUDIO_ILLUSTRATIONS[effectiveKind];

  const visual = illustration ? (
    illustration
  ) : renderStudio ? (
    renderStudio()
  ) : (
    <span className="empty-state-stage bento-subsurface" aria-hidden="true">
      <BentoIcon icon={icon ?? FolderOpen} size={28} />
    </span>
  );

  return (
    <div className="empty-state" data-empty-kind={effectiveKind}>
      {visual}
      <strong>{title}</strong>
      <p>{description}</p>
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  );
}
