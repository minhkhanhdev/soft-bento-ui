import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Typography } from '@heroui/react';

export type DialogState = { title: string; description?: string; content: ReactNode } | null;

export interface PreviewDialogProps {
  dialog: DialogState;
  onClose: () => void;
  closeAriaLabel?: string;
}

export function PreviewDialog({
  dialog,
  onClose,
  closeAriaLabel = 'Đóng hộp thoại',
}: PreviewDialogProps) {
  const [cachedDialog, setCachedDialog] = useState<DialogState>(dialog);

  useEffect(() => {
    if (dialog !== null) {
      setCachedDialog(dialog);
    }
  }, [dialog]);

  const activeDialog = dialog ?? cachedDialog;

  return (
    <Modal
      isOpen={dialog !== null}
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="preview-dialog">
            <Modal.CloseTrigger aria-label={closeAriaLabel} />
            <Modal.Header>
              <Modal.Heading>{activeDialog?.title}</Modal.Heading>
              {activeDialog?.description && (
                <Typography type="body-xs" color="muted" className="dialog-description">
                  {activeDialog.description}
                </Typography>
              )}
            </Modal.Header>
            <Modal.Body>{activeDialog?.content}</Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
