import {
  CheckCircle2,
  Clock,
  PackageCheck,
  PackageOpen,
  Truck,
  Undo2,
  PackageX,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { StatusPill, type StatusPillTone } from '../soft-bento';

const stateConfigMap: Record<string, { tone: StatusPillTone; icon: LucideIcon }> = {
  'Chờ xác nhận': { tone: 'amber', icon: Clock },
  'Đang chuẩn bị': { tone: 'blue', icon: PackageOpen },
  'Chờ lấy hàng': { tone: 'indigo', icon: PackageCheck },
  'Đang giao': { tone: 'sky', icon: Truck },
  'Đã giao': { tone: 'emerald', icon: CheckCircle2 },
  'Đã hủy': { tone: 'danger', icon: XCircle },
  'Đang hoàn hàng': { tone: 'amber', icon: Undo2 },
  'Đã hoàn hàng': { tone: 'neutral', icon: PackageX },
};

export function StatusChip({
  state,
  showIcon = false,
}: {
  state: string;
  showIcon?: boolean;
}) {
  const config = stateConfigMap[state];
  return (
    <StatusPill
      tone={config?.tone ?? 'neutral'}
      dot={!showIcon}
      icon={showIcon ? config?.icon : undefined}
    >
      {state}
    </StatusPill>
  );
}
