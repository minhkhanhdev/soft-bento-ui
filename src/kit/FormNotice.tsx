import { forwardRef } from 'react';
import { Alert } from '@heroui/react';

export const FormNotice = forwardRef<HTMLDivElement, { message: string; title?: string }>(
  function FormNotice({ message, title = 'Chưa thể hoàn tất thao tác' }, ref) {
    return <Alert ref={ref} status="danger" role="alert" tabIndex={-1}>
      <Alert.Indicator />
      <Alert.Content><Alert.Title>{title}</Alert.Title><Alert.Description>{message}</Alert.Description></Alert.Content>
    </Alert>;
  }
);
