import type { ComponentProps } from 'react';
import { Button } from '@heroui/react';

export type BentoButtonProps = ComponentProps<typeof Button>;

/**
 * Semantic button wrapper built directly on HeroUI v3 Button,
 * preserving native tactile `[data-pressed]` scale feedback.
 */
export function BentoButton({ className, ...props }: BentoButtonProps) {
  return <Button className={`bento-button ${className ?? ''}`.trim()} {...props} />;
}

export function BentoIconButton({ className, ...props }: BentoButtonProps) {
  return <Button isIconOnly className={`bento-icon-button ${className ?? ''}`.trim()} {...props} />;
}

export { Button };
