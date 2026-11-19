import { useState } from 'react';
import { FolderKanban, Layers3, Plus } from 'lucide-react';
import {
  AppShell, BentoButton, BentoCard, DataTable, HorizontalBarChart, PageHeader,
  PanelTitle, PreviewDialog, StatCard, StatGlowBadge, StatusPill, useTheme, type DialogState,
} from './soft-bento';

const initialRows=[{id:'DEMO-01',name:'Design system',status:'Đang làm'},{id:'DEMO-02',name:'Website của nhóm',status:'Hoàn tất'}];
export default function App(){
  const {dark,setDark}=useTheme({storageKey:'my-app-theme'});
  const [collapsed,setCollapsed]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [rows,setRows]=useState(initialRows);
  const [dialog,setDialog]=useState<DialogState>(null);
  const [page,setPage]=useState('dashboard');
  const navItems=[{id:'dashboard',label:'Tổng quan',icon:Layers3,isActive:page==='dashboard',onPress:()=>setPage('dashboard')},
    {id:'projects',label:'Dự án',icon:FolderKanban,isActive:page==='projects',onPress:()=>setPage('projects')}];
  return <AppShell brand={<strong>My Workspace</strong>} currentPageLabel={page==='dashboard'?'Tổng quan':'Dự án'}
    navItems={navItems} collapsed={collapsed} onCollapsed={setCollapsed}
    mobileOpen={mobileOpen} onMobileOpen={setMobileOpen} themeToggle={{dark,onDark:setDark}}>
    <div className="starter-page">
      <PageHeader title={page==='dashboard'?'Không gian của bạn':'Dự án'} description="Starter UI, dùng dữ liệu mẫu trong trình duyệt."
        actions={<BentoButton variant="primary" onPress={()=>setRows(current=>[...current,{id:`DEMO-${String(current.length+1).padStart(2,'0')}`,name:`Dự án mẫu ${current.length+1}`,status:'Đang làm'}])}><Plus size={16}/>Thêm dự án mẫu</BentoButton>}/>
      <div className="starter-stats"><StatCard icon={FolderKanban} label="Dự án" value={String(rows.length)} trend={[2,4,3,6,5,8]} note={<StatGlowBadge level="info" dot>Dữ liệu mẫu</StatGlowBadge>}/>
        <StatCard icon={Layers3} label="Hoàn tất" value={String(rows.filter(row=>row.status==='Hoàn tất').length)} tone="emerald" note={<StatGlowBadge level="positive">Trong không gian</StatGlowBadge>}/></div>
      {page==='dashboard'&&<BentoCard><BentoCard.Header><PanelTitle title="Trạng thái công việc"/></BentoCard.Header><BentoCard.Content>
        <HorizontalBarChart ariaLabel="Trạng thái dự án mẫu" items={[{key:'active',label:'Đang làm',count:rows.filter(row=>row.status!=='Hoàn tất').length,tone:'blue'},{key:'done',label:'Hoàn tất',count:rows.filter(row=>row.status==='Hoàn tất').length,tone:'emerald'}]}/>
      </BentoCard.Content></BentoCard>}
      <BentoCard><BentoCard.Header><PanelTitle title="Dự án gần đây"/></BentoCard.Header><BentoCard.Content><DataTable ariaLabel="Dự án mẫu" rows={rows} getRowKey={row=>row.id}
        columns={[{key:'id',label:'Mã',isRowHeader:true,render:row=>row.id},{key:'name',label:'Tên dự án',render:row=>row.name},
          {key:'status',label:'Trạng thái',render:row=><StatusPill tone={row.status==='Hoàn tất'?'emerald':'blue'}>{row.status}</StatusPill>}]}
        onRowPress={row=>setDialog({title:row.name,content:<p>Đây là dự án mẫu {row.id}. Thay phần này bằng adapter của ứng dụng.</p>})}/></BentoCard.Content></BentoCard>
      <p className="starter-note">Không có backend hoặc kết nối cơ sở dữ liệu. Dữ liệu mẫu được đặt lại khi tải lại trang.</p>
      <PreviewDialog dialog={dialog} onClose={()=>setDialog(null)}/>
    </div>
  </AppShell>;
}
