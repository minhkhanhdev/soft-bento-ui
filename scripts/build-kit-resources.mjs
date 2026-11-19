// Curated, local source distribution. Never reads env, backend, private docs or data exports.
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, dirname, isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';
import { deflateRawSync } from 'node:zlib';

const root=process.cwd();
const resource='src/features/ui-kit/resources';
const out='public';
const files=new Map();
const put=(name,value)=>{if(name.startsWith('/')||name.includes('\\')||name.split('/').includes('..'))throw Error('Unsafe archive path');files.set(name,Buffer.isBuffer(value)?value:Buffer.from(value));};
function walk(folder){return readdirSync(folder,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(folder,entry.name)):[join(folder,entry.name)]);}
for(const file of walk('src/soft-bento')){
  if(!/\.(ts|tsx|css|json|md)$/.test(file)||/\.test\./.test(file))continue;
  put(file.replaceAll('\\','/'),readFileSync(file));
}
for(const file of ['EmptyState.tsx','SelectControl.tsx','CalendarFields.tsx','FormNotice.tsx','MediaImage.tsx','customIcons.tsx','icons.ts','IconCatalog.tsx'])put(`src/kit/${file}`,readFileSync(`src/kit/${file}`));
for(const file of walk('src/kit/illustrations'))put(file.replaceAll('\\','/'),readFileSync(file));
for(const file of ['empty-box-3d.png','empty-search-3d.png'])put(`src/assets/${file}`,readFileSync(`src/assets/${file}`));
put('src/kit/adapters.css',readFileSync(`${resource}/adapters.css`));
put('src/App.tsx',readFileSync(`${resource}/starter/App.tsx.txt`));
put('src/styles.css',readFileSync(`${resource}/starter/styles.css`));
put('src/main.tsx',`import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport '@fontsource/inter/400.css';\nimport '@fontsource/inter/500.css';\nimport '@fontsource/inter/600.css';\nimport '@fontsource/inter/700.css';\nimport { Toast } from '@heroui/react';\nimport App from './App';\nimport './styles.css';\nReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/><Toast.Provider placement="bottom end"/></React.StrictMode>);\n`);
put('src/vite-env.d.ts','/// <reference types="vite/client" />\n');
put('index.html','<!doctype html><html lang="vi"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Soft Bento Starter</title><meta name="description" content="A reusable HeroUI v3 and Soft Bento UI starter."/></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n');
put('vite.config.ts',"import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';\nexport default defineConfig({plugins:[react(),tailwindcss()]});\n");
const packageVersion=name=>JSON.parse(readFileSync(`node_modules/${name}/package.json`,'utf8')).version;
const deps=['@fontsource/inter','@heroui/react','@heroui/styles','@internationalized/date','lucide-react','react','react-dom','react-aria-components','simple-icons','tailwind-variants'];
const devDeps=['@tailwindcss/vite','@types/react','@types/react-dom','@vitejs/plugin-react','tailwindcss','typescript','vite'];
put('package.json',JSON.stringify({name:'soft-bento-starter',version:'1.0.0',private:true,type:'module',engines:{node:'^20.19.0 || >=22.12.0'},scripts:{dev:'vite --host 127.0.0.1',build:'tsc -b && vite build',preview:'vite preview --host 127.0.0.1'},dependencies:Object.fromEntries(deps.map(name=>[name,packageVersion(name)])),devDependencies:Object.fromEntries(devDeps.map(name=>[name,packageVersion(name)])),overrides:{rollup:packageVersion('rollup')}},null,2)+'\n');
put('tsconfig.json',JSON.stringify({compilerOptions:{target:'ES2022',lib:['ES2022','DOM','DOM.Iterable'],module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',strict:true,skipLibCheck:true,noEmit:true,allowImportingTsExtensions:true,types:['vite/client']},include:['src','vite.config.ts']},null,2)+'\n');
put('.gitignore','node_modules/\ndist/\n*.tsbuildinfo\n.env\n.env.*\n');
put('README.md','# Soft Bento Starter\n\nSource starter: React 19 + HeroUI v3 + Tailwind CSS v4.\n\n```bash\nnpm install\nnpm run dev\nnpm run build\n```\n\nNode 20.19+ or 22.12+ is required by Vite 7. Synthetic example data stays in the browser and resets on reload. There is no backend, account or environment setup.\n\nPortable core: src/soft-bento. Optional generic adapters: src/kit.\nCSS order: Tailwind, HeroUI, Soft Bento, application layout.\nMerge AGENTS.md and DESIGN.md into existing project instructions; do not overwrite them.\n\nThis is a source distribution, not a claim of publication on npm. Upstream dependencies keep their own licenses; see https://github.com/minhkhanhdev/soft-bento-ui .\n');

const agentFiles=new Map();
for(const file of ['AGENTS.md','DESIGN.md'])agentFiles.set(file,readFileSync(`${resource}/${file}`));
for(const file of walk(`${resource}/skills`))agentFiles.set(`.agents/skills/${relative(`${resource}/skills`,file).replaceAll('\\','/')}`,readFileSync(file));
for(const [path,buffer] of agentFiles)put(path,buffer);

// ZIP with deterministic headers, UTF-8 names and per-entry CRC32. Built-in modules only.
const crcTable=Array.from({length:256},(_,value)=>{for(let i=0;i<8;i++)value=value&1?0xedb88320^(value>>>1):value>>>1;return value>>>0;});
const crc32=buffer=>{let value=0xffffffff;for(const byte of buffer)value=crcTable[(value^byte)&255]^(value>>>8);return (value^0xffffffff)>>>0;};
function zip(entries){const parts=[],central=[];let offset=0;for(const [path,data] of entries){const name=Buffer.from(path),compressed=deflateRawSync(data),crc=crc32(data);const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);header.writeUInt16LE(8,8);header.writeUInt16LE(33,12);header.writeUInt32LE(crc,14);header.writeUInt32LE(compressed.length,18);header.writeUInt32LE(data.length,22);header.writeUInt16LE(name.length,26);parts.push(header,name,compressed);const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(8,10);c.writeUInt16LE(33,14);c.writeUInt32LE(crc,16);c.writeUInt32LE(compressed.length,20);c.writeUInt32LE(data.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(offset,42);central.push(c,name);offset+=header.length+name.length+compressed.length;}const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.size,8);end.writeUInt16LE(entries.size,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...parts,directory,end]);}
function save(file,data){const base=resolve(root,out),target=resolve(base,file),path=relative(base,target);if(path.startsWith('..')||isAbsolute(path))throw Error('Unsafe resource output path');mkdirSync(dirname(target),{recursive:true});writeFileSync(target,data);}
save('downloads/soft-bento-starter.zip',zip(files));
save('downloads/soft-bento-agent-skills.zip',zip(agentFiles));
for(const [path,data] of agentFiles){const target=path.startsWith('.agents/')?path.slice('.agents/'.length):path;save(`files/${target}`,data);}
const manifest={name:'Soft Bento UI',sourceVersion:'3.0.0',heroUiVersion:packageVersion('@heroui/react'),distribution:'source-only',files:[...files].map(([path,data])=>({path,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')}))};
save('files/manifest.json',JSON.stringify(manifest,null,2)+'\n');
save('llms.txt','# Soft Bento UI\n\nPublic documentation for the portable UI layer used by PrintOS. React 19, HeroUI v3 and Tailwind CSS v4.\n\n- Introduction: /ui-kit\n- Quick Start: /soft-bento-ui/quick-start\n- All Components: /soft-bento-ui/components\n- Design Principles: /soft-bento-ui/principles\n- Theming: /soft-bento-ui/theming\n- Accessibility: /soft-bento-ui/accessibility\n- Agents: /soft-bento-ui/agents\n- Skills: /soft-bento-ui/skills\n- MCP: /soft-bento-ui/mcp\n- Resources: /soft-bento-ui/resources\n- Agent instructions: /soft-bento-ui/files/AGENTS.md\n- Design contract: /soft-bento-ui/files/DESIGN.md\n- HeroUI v3: https://github.com/minhkhanhdev/soft-bento-ui . @soft-bento/ui is not claimed to be published on npm. Merge instructions into the host repository; never overwrite its permissions or product rules. All examples are synthetic. No credentials or business data are required.\n');
// Optional local smoke workspace: explicit fixed destination, no deletion or shell interpolation.
if(process.argv.includes('--smoke-workspace'))for(const [path,data] of files){const target=resolve('.artifacts/kit-starter-smoke',path);if(!target.startsWith(resolve('.artifacts/kit-starter-smoke')+'/')&&!target.startsWith(resolve('.artifacts/kit-starter-smoke')+'\\'))throw Error('Unsafe smoke path');mkdirSync(dirname(target),{recursive:true});writeFileSync(target,data);}
console.log(JSON.stringify({publicFilesRoot:out,starterFiles:files.size,agentFiles:agentFiles.size,heroUi:manifest.heroUiVersion}));
