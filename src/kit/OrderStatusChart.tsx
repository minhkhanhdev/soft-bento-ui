import { states, type Order } from '../demo';
import { HorizontalBarChart, type HorizontalBarItem } from '../soft-bento';

const stateBarToneMap: Record<(typeof states)[number], HorizontalBarItem['tone']> = {
  'Chờ xác nhận': 'amber',
  'Đang chuẩn bị': 'blue',
  'Chờ lấy hàng': 'indigo',
  'Đang giao': 'sky',
  'Đã giao': 'emerald',
  'Đã hủy': 'danger',
};

export function OrderStatusChart({
  data,
  onOrders,
}: {
  data: Order[];
  onOrders: (filter: string) => void;
}) {
  const counts = states.map(state => data.filter(order => order.state === state).length);
  const total = data.length;

  const items: HorizontalBarItem[] = states.map((state, i) => {
    const count = counts[i];
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      key: state,
      label: state,
      count,
      tone: stateBarToneMap[state],
      ariaLabel: `${state}: ${count} đơn (${pct}%) trong kỳ. Xem tất cả đơn đang ${state.toLowerCase()}`,
    };
  });

  return (
    <HorizontalBarChart
      items={items}
      total={total}
      unitLabel="đơn"
      emptyText="Chưa có đơn trong kỳ"
      ariaLabel={`Trạng thái ${total} đơn hàng mới: ${states
        .map((state, i) => `${state} ${counts[i]}`)
        .join(', ')}`}
      onSelectItem={item => onOrders(`state:${item.key}`)}
    />
  );
}
