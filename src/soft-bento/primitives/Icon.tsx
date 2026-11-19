import type { ComponentType } from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';

export type BentoIconComponent = LucideIcon | ComponentType<LucideProps>;

export type BentoIconProps = Omit<LucideProps, 'ref' | 'strokeWidth'> & {
  icon: BentoIconComponent;
};

/** One stroke and sizing policy for UI glyphs; labels belong to their controls. */
export function BentoIcon({ icon: Icon, size = 16, className, ...props }: BentoIconProps) {
  return (
    <Icon
      size={size}
      strokeWidth={1.75}
      aria-hidden={props['aria-label'] ? undefined : true}
      focusable="false"
      className={`bento-icon ${className ?? ''}`.trim()}
      {...props}
    />
  );
}
