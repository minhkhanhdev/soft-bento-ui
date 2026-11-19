import { useTheme } from '../../soft-bento';
import { ComponentPreview } from './ComponentPreview';

const requestedTheme=new URLSearchParams(window.location.search).get('theme');
if(requestedTheme==='light'||requestedTheme==='dark')document.documentElement.dataset.theme=requestedTheme;

export default function StandaloneShellPreview(){
  const {dark,setDark}=useTheme({storageKey:'soft-bento-preview-theme'});
  return <ComponentPreview id="app-shell" dark={dark} onDark={setDark} standalone/>;
}
