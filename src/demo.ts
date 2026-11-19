// Synthetic, deterministic fixtures. This preview never reads or writes shop data.
export const DEMO_TODAY = '2026-11-10';
export const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
export const shortMoney = (value: number) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value / 1_000_000) + 'tr';
export const states = ['Chờ xác nhận', 'Đang chuẩn bị', 'Chờ lấy hàng', 'Đang giao', 'Đã giao', 'Đã hủy'] as const;
export type OrderState = typeof states[number];
export type Order = { id: string; date: string; updatedAt: string; name: string; initials: string; product: string; qty: number; amount: number; state: OrderState; channel: string; cod: boolean; refund: boolean; customerDue: number; codPending: number; refundDue: number };
const products = ['Mô hình phi hành gia', 'Chậu cây hình học', 'Giá đỡ tai nghe', 'Móc khóa cá nhân hóa', 'Mô hình rồng khớp động', 'Đèn ngủ mặt trăng'];
const names = ['Minh Anh', 'Hoàng Nam', 'Thảo Nguyên', 'Đức Huy', 'Quỳnh Chi', 'Gia Bảo'];
const assignedStates: OrderState[] = ['Chờ xác nhận', 'Đang chuẩn bị', 'Chờ lấy hàng', 'Đang giao', 'Đã giao', 'Đang chuẩn bị', 'Chờ xác nhận', 'Đang chuẩn bị', 'Đã giao', 'Chờ lấy hàng', 'Đang giao', 'Đã giao', 'Đang chuẩn bị', 'Đã giao', 'Chờ xác nhận', 'Đang chuẩn bị', 'Chờ lấy hàng', 'Đã giao', 'Đang giao', 'Đang chuẩn bị', 'Đã giao', 'Chờ lấy hàng', 'Đang chuẩn bị', 'Đã hủy'];
const assignedDays = [
  10, 10, 10,
  9, 9,
  8, 8, 8, 8, 8,
  7, 7,
  6, 6, 6, 6,
  5, 5,
  4, 4, 4,
  3,
  2, 2,
];
export const orders: Order[] = assignedStates.map((state, i) => {
  const day = String(assignedDays[i]).padStart(2, '0');
  const updateDay = String(Math.min(10, assignedDays[i] + (state === 'Chờ xác nhận' ? 0 : 1))).padStart(2, '0');
  const hour = String(9 + ((i * 2) % 10)).padStart(2, '0');
  const minute = String((i * 15) % 60).padStart(2, '0');
  return {
    id: `PO-${String(1048 - i).padStart(4, '0')}`,
    date: `2026-11-${day}`,
    updatedAt: `2026-11-${updateDay}T${hour}:${minute}:00+07:00`,
    name: names[i % names.length], initials: names[i % names.length].split(' ').map(x => x[0]).join(''),
    product: products[i % products.length], qty: i % 4 === 3 ? 3 : 1,
    amount: [450_000, 285_000, 320_000, 180_000, 650_000, 520_000][i % 6],
    state, channel: ['Facebook', 'Zalo', 'Trực tiếp', 'Instagram'][i % 4],
    cod: [3, 10, 18].includes(i), refund: i === 23,
    customerDue: [0, 1, 2, 5].includes(i) ? [225_000, 142_500, 160_000, 0, 0, 260_000][i % 6] : 0,
    codPending: ({ 3: 180_000, 10: 650_000, 18: 450_000 } as Record<number, number>)[i] ?? 0,
    refundDue: i === 23 ? 200_000 : 0,
  };
});
export const recentOrders: Order[] = [...orders].sort(
  (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
);
export const payments = [
  { key: 'cod', label: 'COD chờ đối soát', balance: 'codPending' },
  { key: 'receivable', label: 'Khách còn phải trả', balance: 'customerDue' },
  { key: 'refund', label: 'Chờ hoàn tiền', balance: 'refundDue' },
] as const;
export const attention = [
  { key: 'confirm', label: 'Chờ xác nhận', note: 'Đơn mới cần kiểm tra', count: orders.filter(o => o.state === 'Chờ xác nhận').length, tone: 'amber' },
  { key: 'prepare', label: 'Đang chuẩn bị', note: 'Đơn cần hoàn thiện', count: orders.filter(o => o.state === 'Đang chuẩn bị').length, tone: 'blue' },
  { key: 'delivery', label: 'Cần giao / đang giao', note: 'Theo dõi giao nhận', count: orders.filter(o => ['Chờ lấy hàng', 'Đang giao'].includes(o.state)).length, tone: 'neutral' },
  { key: 'cod', label: 'COD chờ đối soát', note: 'Chờ hãng đối soát', count: orders.filter(o => o.codPending > 0).length, tone: 'amber' },
  { key: 'refund', label: 'Chờ hoàn tiền', note: 'Cần thực hiện hoàn', count: orders.filter(o => o.refundDue > 0).length, tone: 'red' },
];
export function attentionOrders(key: string) {
  const payment = payments.find(p => p.key === key);
  if (payment) return orders.filter(o => o[payment.balance] > 0);
  return orders.filter(o => key === 'confirm' ? o.state === 'Chờ xác nhận' : key === 'prepare' ? o.state === 'Đang chuẩn bị' : key === 'delivery' ? ['Chờ lấy hàng', 'Đang giao'].includes(o.state) : false);
}
export const cash = [
  [450_000, 180_000], [780_000, 400_000], [520_000, 150_000], [1_200_000, 520_000], [950_000, 250_000],
  [650_000, 320_000], [1_400_000, 650_000], [1_080_000, 400_000], [1_550_000, 580_000], [820_000, 300_000],
].map(([received, paid], i) => ({ date: `2026-11-${String(i + 1).padStart(2, '0')}`, received, paid }));
export function report(from: string, to: string) {
  const selected = orders.filter(o => o.date >= from && o.date <= to);
  const recognized = selected.filter(o => o.state === 'Đã giao');
  const deliveredCount = recognized.length;
  const canceledCount = selected.filter(o => o.state === 'Đã hủy').length;
  const revenue = recognized.reduce((s, o) => s + o.amount, 0);
  const transactions = cash.filter(c => c.date >= from && c.date <= to);
  const received = transactions.reduce((s, c) => s + c.received, 0);
  const paid = transactions.reduce((s, c) => s + c.paid, 0);
  // ponytail: fixtures only, same-day recognition and illustrative costs; replace with spec 06 API before using shop data.
  const profit = Math.round(revenue * .56);
  const difference = received - paid;

  const ordersSeries: number[] = [];
  const revenueSeries: number[] = [];
  const profitSeries: number[] = [];
  const cashSeries: number[] = [];

  const fromMs = Date.parse(`${from}T00:00:00Z`);
  const toMs = Date.parse(`${to}T00:00:00Z`);
  if (Number.isFinite(fromMs) && Number.isFinite(toMs) && fromMs <= toMs) {
    const daySpan = Math.round((toMs - fromMs) / 86_400_000) + 1;
    const bucketCount = Math.min(30, daySpan);
    for (let i = 0; i < bucketCount; i++) {
      const startOffset = Math.floor((i * daySpan) / bucketCount);
      const endOffset = Math.floor(((i + 1) * daySpan) / bucketCount);
      const bucketStart = new Date(fromMs + startOffset * 86_400_000).toISOString().slice(0, 10);
      const bucketEnd = new Date(fromMs + endOffset * 86_400_000).toISOString().slice(0, 10);

      const bucketOrders = selected.filter(o => o.date >= bucketStart && o.date < bucketEnd);
      const bucketRev = bucketOrders
        .filter(o => o.state === 'Đã giao')
        .reduce((s, o) => s + o.amount, 0);
      const bucketCash = transactions.filter(c => c.date >= bucketStart && c.date < bucketEnd);
      const bucketRec = bucketCash.reduce((s, c) => s + c.received, 0);
      const bucketPaid = bucketCash.reduce((s, c) => s + c.paid, 0);

      ordersSeries.push(bucketOrders.length);
      revenueSeries.push(bucketRev);
      profitSeries.push(Math.round(bucketRev * 0.56));
      cashSeries.push(bucketRec - bucketPaid);
    }
  }

  return {
    selected,
    deliveredCount,
    canceledCount,
    revenue,
    profit,
    received,
    paid,
    difference,
    transactions,
    trends: {
      orders: ordersSeries,
      revenue: revenueSeries,
      profit: profitSeries,
      difference: cashSeries,
    },
  };
}
const pad2 = (n: number) => String(n).padStart(2, '0');
export function chartPoints(from: string, to: string) {
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return [];
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  const step = days <= 31 ? 'day' : days <= 180 ? 'week' : 'month';
  const points: { label: string; fullLabel: string; received: number; paid: number }[] = [];
  for (let date = new Date(start); date <= end;) {
    const next = new Date(date);
    if (step === 'month') next.setUTCMonth(next.getUTCMonth() + 1, 1);
    else next.setUTCDate(next.getUTCDate() + (step === 'week' ? 7 : 1));
    const dateKey = date.toISOString().slice(0, 10);
    const nextKey = next.toISOString().slice(0, 10);
    const rows = cash.filter(c => c.date >= dateKey && c.date < nextKey && c.date <= to);
    const bucketEnd = new Date(Math.min(next.getTime() - 86_400_000, end.getTime()));
    const fullLabel =
      step === 'week'
        ? `Tuần ${pad2(date.getUTCDate())}/${pad2(date.getUTCMonth() + 1)} – ${pad2(bucketEnd.getUTCDate())}/${pad2(bucketEnd.getUTCMonth() + 1)}/${bucketEnd.getUTCFullYear()}`
        : step === 'month'
          ? `Tháng ${pad2(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`
          : new Intl.DateTimeFormat('vi-VN', { timeZone: 'UTC', dateStyle: 'long' }).format(date);
    points.push({
      label:
        step === 'month'
          ? `${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`
          : `${pad2(date.getUTCDate())}/${pad2(date.getUTCMonth() + 1)}`,
      fullLabel,
      received: rows.reduce((s, c) => s + c.received, 0),
      paid: rows.reduce((s, c) => s + c.paid, 0),
    });
    date = next;
  }
  return points;
}
