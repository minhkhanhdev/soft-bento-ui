import { BentoIcon } from '../soft-bento/primitives/Icon';
import { Avatar, Typography } from '@heroui/react';
import { Box } from 'lucide-react';
import { money, type Order } from '../demo';
import { DataTable, MoneyText, type DataTableColumn } from '../soft-bento';
import { StatusChip } from './StatusChip';
import { EmptyState } from './EmptyState';

/** Format ISO YYYY-MM-DD dates as DD/MM/YYYY for Vietnamese display. */
function formatDateVi(date: string): string {
  const parts = date.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return date;
}

/** Format ISO timestamp as DD/MM/YYYY · HH:mm for Vietnamese order detail display. */
function formatDateTimeVi(iso: string): string {
  const datePart = formatDateVi(iso.slice(0, 10));
  const timeMatch = iso.match(/T(\d{2}:\d{2})/);
  return timeMatch ? `${datePart} · ${timeMatch[1]}` : datePart;
}

export function OrderTable({
  data,
  onOpen,
  summary = false,
}: {
  data: Order[];
  onOpen: (order: Order, trigger?: HTMLElement) => void;
  summary?: boolean;
}) {
  const columns: DataTableColumn<Order>[] = [
    {
      key: 'id',
      label: 'Mã đơn',
      isRowHeader: true,
      render: o => (
        <div className="order-code-stack">
          <span className="order-id-text">{o.id}</span>
          <span className="cell-sub order-id-sub">{formatDateVi(o.date)}</span>
        </div>
      ),
    },
    {
      key: 'customer',
      label: 'Khách hàng',
      render: o => (
        <span className="customer">
          {!summary && (
            <Avatar size="sm" color="default">
              <Avatar.Fallback>{o.initials}</Avatar.Fallback>
            </Avatar>
          )}
          <span className="customer-meta">
            <span className="customer-name" title={o.name}>
              {o.name}
            </span>
            <span className="cell-sub">{o.channel}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'product',
      label: 'Sản phẩm',
      render: o => (
        <div className="product-stack">
          <span className="product-name" title={o.product}>
            {o.product}
          </span>
          <span className="cell-sub">{o.qty} sản phẩm</span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Tiền hàng',
      align: 'right',
      className: 'amount-cell',
      render: o => <MoneyText value={money(o.amount)} />,
    },
    {
      key: 'state',
      label: 'Trạng thái',
      className: 'status-cell',
      render: o => <StatusChip state={o.state} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={data}
      getRowKey={o => o.id}
      compact={summary}
      className={`orders-table ${summary ? 'summary-table' : ''}`.trim()}
      ariaLabel={summary ? 'Đơn gần đây' : 'Danh sách đơn hàng'}
      onRowPress={onOpen}
      emptyState={
        <EmptyState search title="Không tìm thấy đơn hàng" description="Thử tên, mã đơn hoặc bộ lọc khác." />
      }
    />
  );
}

export function MobileOrderList({
  data,
  onOpen,
}: {
  data: Order[];
  onOpen: (order: Order, trigger?: HTMLElement) => void;
}) {
  return (
    <div className="mobile-orders">
      {data.map(o => (
        <div
          role="button"
          tabIndex={0}
          className="mobile-order-item"
          key={o.id}
          onClick={e => {
            if (window.getSelection()?.toString()) return;
            onOpen(o, e.currentTarget);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen(o, e.currentTarget);
            }
          }}
        >
          <span className="mobile-order-top">
            <strong>{o.id}</strong>
            <StatusChip state={o.state} />
          </span>
          <span className="mobile-order-product">{o.product}</span>
          <span className="mobile-order-bottom">
            <span>
              {o.name} · {o.qty} sản phẩm
            </span>
            <b>
              <MoneyText value={money(o.amount)} />
            </b>
          </span>
        </div>
      ))}
    </div>
  );
}

export function OrderDetailView({ order }: { order: Order }) {
  return (
    <div className="detail-view">
      <div className="detail-top">
        <Avatar color="default">
          <Avatar.Fallback>{order.initials}</Avatar.Fallback>
        </Avatar>
        <div>
          <Typography type="h5" render={props => <h3 {...props} />}>
            {order.name}
          </Typography>
          <Typography type="body-sm">
            {order.channel} · Tạo ngày {formatDateVi(order.date)}
          </Typography>
        </div>
        <StatusChip state={order.state} showIcon />
      </div>
      <div className="detail-product">
        <span className="product-icon" aria-hidden="true">
          <BentoIcon icon={Box} size={24} />
        </span>
        <div>
          <strong>{order.product}</strong>
          <Typography type="body-sm">Số lượng: {order.qty}</Typography>
        </div>
        <b>
          <MoneyText value={money(order.amount)} />
        </b>
      </div>
      <dl>
        <div>
          <dt>Tiền hàng chưa gồm ship</dt>
          <dd>
            <MoneyText value={money(order.amount)} />
          </dd>
        </div>
        <div>
          <dt>Cập nhật gần nhất</dt>
          <dd>{formatDateTimeVi(order.updatedAt)}</dd>
        </div>
        <div>
          <dt>Giao nhận</dt>
          <dd>{order.cod ? 'Qua đơn vị vận chuyển' : 'Lấy trực tiếp'}</dd>
        </div>
        {order.cod && (
          <div>
            <dt>Đối soát COD</dt>
            <dd>Đang chờ hãng</dd>
          </div>
        )}
        {order.refund && (
          <div>
            <dt>Hoàn tiền</dt>
            <dd>Chưa thực trả</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
