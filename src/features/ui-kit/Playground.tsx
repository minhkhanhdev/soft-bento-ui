import { useState } from 'react';
import { PreviewDialog, type DialogState } from '../../soft-bento';
import { KitPage } from '../../kit/KitPage';

export default function Playground({dark,onDark}:{dark:boolean;onDark:(dark:boolean)=>void}) {
  const [dialog,setDialog]=useState<DialogState>(null);
  return <div className="docs-playground"><div className="docs-note">Mẫu minh họa giao diện, không phải dữ liệu vận hành. Các adapter nghiệp vụ PrintOS không thuộc lõi portable.</div><KitPage dark={dark} onDark={onDark} onDialog={setDialog}/><PreviewDialog dialog={dialog} onClose={()=>setDialog(null)}/></div>;
}
