import type { ComponentProps, ReactNode } from 'react';
import { Card } from '@heroui/react';

export type BentoCardProps = ComponentProps<typeof Card>;

function BentoCardRoot({ className, ...props }: BentoCardProps) {
  return <Card className={`panel ${className ?? ''}`.trim()} {...props} />;
}

/**
 * Compound Card primitive mirroring HeroUI v3's slot anatomy (`Header`, `Title`, `Description`, `Content`, `Footer`)
 * with Soft Bento hairline borders and dual-tier elevation.
 */
export const BentoCard = Object.assign(BentoCardRoot, {
  Header: Card.Header,
  Title: Card.Title,
  Description: Card.Description,
  Content: Card.Content,
  Footer: Card.Footer,
});

export interface BentoSubsurfaceProps {
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Airy 135deg subsurface container for nested rows, feature stages, and inset showcase blocks.
 */
export function BentoSubsurface({ interactive = false, className, children }: BentoSubsurfaceProps) {
  return (
    <div
      className={`bento-subsurface ${interactive ? 'bento-subsurface-interactive' : ''} ${className ?? ''}`.trim()}
    >
      {children}
    </div>
  );
}

export { Card };
