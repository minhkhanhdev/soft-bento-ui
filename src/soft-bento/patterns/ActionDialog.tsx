import type { ReactNode } from 'react';
import { Modal } from '@heroui/react';

export function ActionDialog({ title, onClose, busy = false, children }: {
  title: string;
  onClose: () => void;
  busy?: boolean;
  children: ReactNode;
}) {
  if (typeof document === 'undefined') {
    return <section role="dialog" aria-label={title}>{children}</section>;
  }
  return (
    <Modal isOpen onOpenChange={open => { if (!open && !busy) onClose(); }}>
      <Modal.Backdrop isDismissable={!busy} isKeyboardDismissDisabled={busy}>
        <Modal.Container>
          <Modal.Dialog className="action-dialog" aria-label={title}>
            {children}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
