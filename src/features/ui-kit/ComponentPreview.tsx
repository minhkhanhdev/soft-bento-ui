import { useState } from 'react';
import { Button, Card, Input, Label, Modal, TextField, toast } from '@heroui/react';
import { Check, Download, FolderKanban, Layers3, Plus, Sparkles } from 'lucide-react';
import {
  ActionDialog, AppShell, BentoButton, BentoCard, BentoIcon, BentoIconButton, BentoSubsurface,
  DataTable, FeatureTeaser, HorizontalBarChart, MoneyText, PageHeader, PanelTitle,
  PreviewDialog, StatCard, StatGlowBadge, StatusPill, TablePagination, type DialogState,
} from '../../soft-bento';
import { DateTimeControl, MonthControl } from '../../kit/CalendarFields';
import { EmptyState } from '../../kit/EmptyState';
import { FormNotice } from '../../kit/FormNotice';
import { MediaImage } from '../../kit/MediaImage';
import { SelectControl } from '../../kit/SelectControl';
import { CashChart } from '../../kit/CashChart';
import { OrderStatusChart } from '../../kit/OrderStatusChart';
import { OrderTable, MobileOrderList, OrderDetailView } from '../../kit/OrderTable';
import { StatusChip } from '../../kit/StatusChip';
import { RangeDialog } from '../../kit/Dialogs';
import { IconCatalog } from '../../kit/IconCatalog';
import { Brand } from '../../kit/Brand';
import { orders as demoOrders, states } from '../../demo';
import { assetHref } from './catalog';

const demoRows=[{id:'SB-01',name:'Website nhóm',status:'Đang làm'},{id:'SB-02',name:'Thư viện thiết kế',status:'Hoàn tất'}];

export function MiniDashboard() {
  return <div className="docs-mini-dashboard">
    <div className="docs-mini-heading"><span><BentoIcon icon={Layers3} size={15}/> Tổng quan không gian</span><span className="docs-live-dot">Dữ liệu mẫu</span></div>
    <div className="docs-mini-stats">
      <StatCard icon={FolderKanban} label="Dự án hoàn tất" value="24" tone="blue" trend={[4,6,5,9,8,14,18]} note={<StatGlowBadge level="positive" trend="up">+12,8%</StatGlowBadge>}/>
      <StatCard icon={Layers3} label="Mẫu dùng chung" value="48" tone="emerald" trend={[8,7,11,14,12,16,20]} note={<span className="docs-subtle">Trong không gian của bạn</span>}/>
    </div>
    <BentoCard className="docs-mini-panel"><BentoCard.Header><PanelTitle title="Tiến độ công việc"/></BentoCard.Header><BentoCard.Content>
      <HorizontalBarChart ariaLabel="Tiến độ công việc mẫu" items={[{key:'done',label:'Hoàn tất',count:18,tone:'emerald'},{key:'active',label:'Đang làm',count:9,tone:'blue'},{key:'wait',label:'Chờ xử lý',count:3,tone:'amber'}]}/>
    </BentoCard.Content></BentoCard>
  </div>;
}

export function ComponentPreview({ id, dark, onDark, standalone=false }: {id:string;dark:boolean;onDark:(dark:boolean)=>void;standalone?:boolean}) {
  const [count,setCount]=useState(0);
  const [open,setOpen]=useState(false);
  const [dialog,setDialog]=useState<DialogState>(null);
  const [value,setValue]=useState('normal');
  const [date,setDate]=useState('2026-11-18T10:30');
  const [month,setMonth]=useState('2026-11');
  const [collapsed,setCollapsed]=useState(false);
  const [mobile,setMobile]=useState(false);
  const [demoPage,setDemoPage]=useState(1);
  const [range,setRange]=useState({from:'2026-11-01',to:'2026-11-10'});
  switch(id) {
    case 'button':return <div className="docs-demo-stack"><BentoButton variant="primary" onPress={()=>setCount(c=>c+1)}><BentoIcon icon={Plus}/> Tạo mới {count>0&&`(${count})`}</BentoButton><BentoButton variant="secondary" onPress={()=>toast.success('Đã thử thao tác mẫu.')}><BentoIcon icon={Check}/> Thao tác phụ</BentoButton><BentoButton variant="tertiary">Hủy</BentoButton><BentoButton isDisabled>Vô hiệu hóa</BentoButton><BentoIconButton variant="secondary" aria-label="Tải ví dụ" onPress={()=>toast.info('Đây là nút minh họa.')}><BentoIcon icon={Download}/></BentoIconButton></div>;
    case 'card':return <BentoCard className="docs-example-card"><BentoCard.Header><BentoCard.Title>Không gian sáng tạo</BentoCard.Title><BentoCard.Description>Các mẫu dùng chung của nhóm.</BentoCard.Description></BentoCard.Header><BentoCard.Content><p>Một bề mặt rõ ràng, đủ khoảng thở và có thứ bậc.</p></BentoCard.Content><BentoCard.Footer><Button variant="secondary" size="sm" onPress={()=>toast.info('Bạn đang xem một ví dụ trong tài liệu.')}>Xem không gian</Button></BentoCard.Footer></BentoCard>;
    case 'subsurface':return <BentoSubsurface className="docs-example-card p-5"><PanelTitle title="Thông tin bổ sung" subtitle="Giữ chung ngữ cảnh, không thêm một lớp card."/></BentoSubsurface>;
    case 'icon':return <div className="docs-icon-row">{[Layers3,Plus,Check,Download,Sparkles,FolderKanban].map((icon,i)=><span key={i}><BentoIcon icon={icon} size={22}/></span>)}</div>;
    case 'glow-badge':return <div className="docs-demo-stack"><StatGlowBadge level="positive" trend="up">+12,8%</StatGlowBadge><StatGlowBadge level="info" dot>Đang cập nhật</StatGlowBadge><StatGlowBadge level="warning">Cần kiểm tra</StatGlowBadge><StatGlowBadge level="danger" trend="down">−4,2%</StatGlowBadge></div>;
    case 'status-pill':return <div className="docs-demo-stack"><StatusPill tone="blue">Đang làm</StatusPill><StatusPill tone="emerald">Hoàn tất</StatusPill><StatusPill tone="amber">Chờ xử lý</StatusPill><StatusPill tone="neutral">Bản nháp</StatusPill></div>;
    case 'data-table':return <div className="docs-demo-wide"><BentoCard className="bento-table-card"><DataTable ariaLabel="Dự án minh họa" getRowKey={row=>row.id} rows={demoRows} columns={[{key:'id',label:'Mã',isRowHeader:true,render:row=>row.id},{key:'name',label:'Dự án',render:row=>row.name},{key:'state',label:'Trạng thái',render:row=><StatusPill tone={row.id==='SB-01'?'blue':'emerald'}>{row.status}</StatusPill>}]} onRowPress={row=>setDialog({title:row.name,content:<p>Chi tiết minh họa của {row.id}. Không có dữ liệu thật.</p>})} footer={<TablePagination page={1} pageSize={10} total={demoRows.length} itemLabel="dự án" onPageChange={()=>{}}/>}/></BentoCard><PreviewDialog dialog={dialog} onClose={()=>setDialog(null)}/></div>;
    case 'table-pagination':return <div className="docs-demo-wide"><BentoCard className="p-4"><TablePagination page={demoPage} pageSize={10} total={24} itemLabel="đơn hàng" note="Sắp theo ngày tạo mới nhất" onPageChange={setDemoPage}/></BentoCard></div>;
    case 'stat-card':return <div className="docs-single-stat"><StatCard icon={FolderKanban} label="Dự án hoàn tất" value="24" tone="blue" trend={[4,6,5,8,7,12,16]} note={<StatGlowBadge level="positive" trend="up">+12,8%</StatGlowBadge>}/></div>;
    case 'money-text':return <div className="docs-money-demo"><MoneyText value="1.250.000 ₫"/></div>;
    case 'panel-title':return <PanelTitle title="Hoạt động gần đây" subtitle="Cập nhật trong không gian của bạn"/>;
    case 'horizontal-bar-chart':return <div className="docs-example-card"><HorizontalBarChart ariaLabel="Tiến độ dự án minh họa" items={[{key:'done',label:'Hoàn tất',count:8,tone:'emerald'},{key:'active',label:'Đang làm',count:4,tone:'blue'}]} onSelectItem={item=>toast.info(`Đã chọn ${item.label.toLowerCase()} trong ví dụ.`)}/></div>;
    case 'feature-teaser':return <div className="docs-example-card"><FeatureTeaser ariaLabel="Thư viện mẫu" title="Thư viện" heading="Tài nguyên trong một nơi" description="Lưu các mẫu dùng chung của nhóm." stageBadge="PREVIEW"/></div>;
    case 'page-header':return <div className="docs-demo-wide"><PageHeader titleLevel={2} title="Dự án" description="Quản lý công việc của nhóm." actions={<Button variant="primary" onPress={()=>toast.info('Ví dụ tạo dự án.')}><BentoIcon icon={Plus}/>Tạo dự án</Button>}/></div>;
    case 'app-shell':return standalone?<AppShell brand={<strong>Workspace</strong>} currentPageLabel="Tổng quan" navItems={[{id:'home',label:'Tổng quan',icon:Layers3,isActive:true,onPress:()=>toast.info('Ví dụ điều hướng.')}]} collapsed={collapsed} onCollapsed={setCollapsed} mobileOpen={mobile} onMobileOpen={setMobile} themeToggle={{dark,onDark}}><div className="p-5"><PageHeader title="Chào buổi sáng" description="Khung này không kèm dữ liệu hoặc xác thực."/></div></AppShell>:<div className="docs-demo-wide"><iframe className="docs-shell-frame" title="AppShell preview độc lập" src={assetHref(`preview/app-shell?theme=${dark ? 'dark' : 'light'}`)}/><a className="docs-inline-link" href={assetHref(`preview/app-shell?theme=${dark ? 'dark' : 'light'}`)} target="_blank" rel="noreferrer">Mở preview toàn trang</a></div>;
    case 'preview-dialog':return <><Button variant="secondary" onPress={()=>setDialog({title:'Xem trước',description:'Ví dụ hộp thoại có quản lý focus.',content:<p>Nhấn Escape hoặc nút đóng để trở về.</p>})}>Mở xem trước</Button><PreviewDialog dialog={dialog} onClose={()=>setDialog(null)}/></>;
    case 'action-dialog':return <><Button variant="primary" onPress={()=>setOpen(true)}>Mở xác nhận</Button>{open&&<ActionDialog title="Xác nhận thao tác mẫu" onClose={()=>setOpen(false)}><Modal.Header><Modal.Heading>Xác nhận thao tác mẫu</Modal.Heading></Modal.Header><Modal.Body>Ví dụ này chỉ đóng dialog và hiển thị toast.</Modal.Body><Modal.Footer><Button variant="tertiary" onPress={()=>setOpen(false)}>Hủy</Button><Button variant="primary" onPress={()=>{setOpen(false);toast.success('Đã xác nhận ví dụ.');}}>Xác nhận</Button></Modal.Footer></ActionDialog>}</>;
    case 'empty-state':return <div className="docs-demo-wide grid grid-cols-1 sm:grid-cols-2 gap-4"><BentoCard><EmptyState kind="orders" title="Chưa có đơn hàng nào" description="Đơn hàng mới sẽ xuất hiện tại đây." action={<Button variant="primary" size="sm" onPress={()=>toast.info('Ví dụ tạo đơn hàng.')}>Tạo đơn hàng</Button>}/></BentoCard><BentoCard><EmptyState kind="printers" title="Chưa có máy in nào" description="Khung icon ngữ nghĩa cho các phân hệ kỹ thuật." action={<Button variant="secondary" size="sm" onPress={()=>toast.info('Ví dụ thêm máy in.')}>Thêm máy in</Button>}/></BentoCard></div>;
    case 'select-control':return <div className="docs-field-demo"><label>Mức ưu tiên</label><SelectControl aria-label="Mức ưu tiên minh họa" value={value} onValueChange={setValue}><option value="normal">Bình thường</option><option value="high">Cao</option></SelectControl><p>Giá trị đã chọn: <code>{value}</code></p></div>;
    case 'calendar-fields':return <div className="docs-calendar-demo"><DateTimeControl label="Ngày thực hiện minh họa" value={date} onChange={setDate}/><MonthControl value={month} onChange={setMonth}/></div>;
    case 'form-notice':return <div className="docs-example-card"><FormNotice message="Chưa thể lưu ví dụ. Dữ liệu bạn đã nhập vẫn được giữ để thử lại."/></div>;
    case 'media-image':return <div className="docs-example-card"><MediaImage src={null} alt="Ảnh minh họa chưa có"/></div>;
    case 'text-field':return <div className="docs-field-demo"><TextField><Label>Tên dự án</Label><Input placeholder="Nhập tên dự án"/></TextField></div>;
    case 'cash-chart':return <div className="docs-cash-demo"><CashChart from="2026-11-01" to="2026-11-10"/></div>;
    case 'order-status-chart':return <div className="docs-example-card"><OrderStatusChart data={demoOrders} onOrders={filter=>toast.info(`Ví dụ bộ lọc: ${filter}`)}/></div>;
    case 'order-table':{const show=(order:typeof demoOrders[number])=>setDialog({title:order.id,content:<OrderDetailView order={order}/>});return <div className="docs-demo-wide"><div className="docs-domain-table"><OrderTable data={demoOrders.slice(0,3)} onOpen={show}/></div><div className="docs-domain-mobile"><MobileOrderList data={demoOrders.slice(0,3)} onOpen={show}/></div><PreviewDialog dialog={dialog} onClose={()=>setDialog(null)}/></div>;}
    case 'status-chip':return <div className="docs-demo-stack">{states.map(state=><StatusChip key={state} state={state}/>)}</div>;
    case 'range-dialog':return <><Button variant="secondary" onPress={()=>setOpen(true)}>Chọn khoảng ngày</Button><RangeDialog isOpen={open} onOpenChange={setOpen} pendingFrom={range.from} pendingTo={range.to} onChange={(from,to)=>setRange({from,to})} onApply={()=>{setOpen(false);toast.info(`Ví dụ kỳ ${range.from} – ${range.to}`);}}/></>;
    case 'icon-catalog':return <div className="docs-demo-wide"><IconCatalog/></div>;
    case 'brand':return <Brand/>;
    default:return <Card><Card.Content>Chọn một component trong catalog để xem ví dụ.</Card.Content></Card>;
  }
}
