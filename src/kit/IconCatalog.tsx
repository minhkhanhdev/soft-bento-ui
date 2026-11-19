import { BentoCard, BentoIcon, PanelTitle } from '../soft-bento';
import { PrintOSIcons } from './icons';

const entries: [keyof typeof PrintOSIcons, string][] = [
  ['dashboard', 'Tổng quan'], ['orders', 'Đơn hàng'], ['products', 'Sản phẩm'],
  ['library', 'Thư viện tính giá'], ['printer3d', 'Máy in 3D'], ['material', 'Nhựa in 3D'], ['accessories', 'Phụ kiện'],
  ['pricing', 'Tính giá'], ['worksheet', 'Bảng tính'], ['printLines', 'Dòng in'],
  ['finance', 'Thu chi'], ['income', 'Tiền thực nhận'], ['expense', 'Khoản chi'],
  ['cod', 'COD chờ đối soát'], ['receivable', 'Khách còn phải trả'], ['refund', 'Hoàn tiền'],
  ['content', 'Hồ sơ & Nội dung'], ['contact', 'Liên hệ'], ['mail', 'Email hỗ trợ'], ['bank', 'Ngân hàng'],
  ['accountNumber', 'Số tài khoản'], ['backup', 'Sao lưu'], ['restore', 'Phục hồi'],
  ['retention', 'Mốc lưu giữ'], ['storage', 'Nơi lưu bản sao'], ['add', 'Tạo mới'],
  ['edit', 'Chỉnh sửa'], ['save', 'Lưu dữ liệu'], ['success', 'Đã hoàn tất'],
  ['delete', 'Xóa mục'], ['copy', 'Sao chép'], ['refresh', 'Tải lại'],
  ['reset', 'Đặt lại'], ['imageUpload', 'Chọn ảnh'], ['close', 'Đóng'],
  ['socialZalo', 'Zalo'], ['socialFacebook', 'Facebook'], ['socialTiktok', 'TikTok'],
  ['socialInstagram', 'Instagram'], ['socialThreads', 'Threads'], ['socialYoutube', 'YouTube'],
  ['socialX', 'X (Twitter)'], ['socialTelegram', 'Telegram'],
];

export function IconCatalog() {
  return (
    <BentoCard className="icon-catalog" aria-label="Bộ icon PrintOS">
      <BentoCard.Header>
        <PanelTitle title="Icon theo thông tin" subtitle="Lucide + Custom 3D Glyphs + Simple Icons MXH · nét 1,75 · thao tác 16px · điều hướng 18px" />
      </BentoCard.Header>
      <BentoCard.Content className="icon-catalog-grid">
        {entries.map(([role, label]) => (
          <div key={role} className="icon-catalog-item" data-icon-role={role}>
            <BentoIcon icon={PrintOSIcons[role]} size={18} />
            <span>{label}</span>
          </div>
        ))}
      </BentoCard.Content>
    </BentoCard>
  );
}
