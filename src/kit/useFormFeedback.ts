import { useEffect, useRef } from 'react';

/** Bring failed submissions into view without moving focus during normal editing. */
export function useFormFeedback(error: string | null, attempt: number) {
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!error) return;
    const frame = requestAnimationFrame(() => {
      const fields = formRef.current?.querySelectorAll<HTMLElement>(
        'input[aria-invalid="true"], textarea[aria-invalid="true"], [aria-invalid="true"] input'
      );
      const target = Array.from(fields ?? []).find(field => field.getClientRects().length > 0)
        ?? errorRef.current;
      target?.focus();
      target?.scrollIntoView({ block: 'center' });
    });
    return () => cancelAnimationFrame(frame);
  }, [error, attempt]);
  return { formRef, errorRef };
}
