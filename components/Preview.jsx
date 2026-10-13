'use client';
import {useState,useRef} from 'react';
import {Chart,Mark} from './Graphics';
import {copy} from '../lib/site';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
gsap.registerPlugin(useGSAP);
export default function Preview({lang}) {
  const t=copy[lang];
  const [active,setActive]=useState(0);
  const scope=useRef(null);
  useGSAP(()=>{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.from('.preview-panel',{opacity:.1,y:12,duration:.35,clearProps:'all'});},{scope,dependencies:[active],revertOnUpdate:true});
  return <div className="preview" ref={scope}><div className="preview-bar"><div className="window-dots"><i/><i/><i/></div><span>pulse / eu-node-01</span><span>{lang==='ru'?'ПРИМЕР':'PREVIEW'}</span></div><div className="preview-body"><aside className="preview-sidebar"><div className="brand"><Mark/>PULSE</div><div className="preview-tabs" aria-label={lang==='ru'?'Разделы превью':'Preview sections'}>{t.demoTabs.map((label,i)=><button key={label} aria-pressed={active===i} aria-controls="demo-panel" onClick={()=>setActive(i)}>{label}</button>)}</div></aside><div className="preview-content"><div className="preview-title">{t.demoTitle}<span className="tag">LINUX · eu-node-01</span></div><div id="demo-panel" className="preview-panel" key={active}>
    {active===0?<><div className="metrics">{[['CPU','23%','8 vCPU'],['RAM','12.4 GB','20 GB'],['DISK','41%','256 GB'],['NETWORK','125 Mb/s','↓ 125  ↑ 48']].map(([label,value,note])=><div key={label} className="metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div><div className="graph"><div className="graph-label"><span>CPU / RAM</span><span>60s</span></div><Chart/></div></>:active===1?<div className="table-wrap"><table><thead><tr><th>PID</th><th>{lang==='ru'?'ПРОЦЕСС':'PROCESS'}</th><th>CPU</th><th>RAM ↓</th></tr></thead><tbody>{[['2141','postgres','4.8%','512 MB'],['3026','node','0.7%','328 MB'],['1147','nginx','1.3%','152 MB'],['2708','pulse-agent','0.3%','64 MB']].map(row=><tr key={row[0]}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>:active===2?<><div className="metrics"><div className="metric"><span>DOWNLOAD</span><strong>125 Mb/s</strong><small>eth0</small></div><div className="metric"><span>UPLOAD</span><strong>48 Mb/s</strong><small>eth0</small></div></div><div className="graph"><Chart variant={2}/></div><p className="connection-example">192.0.2.10:443 ⇄ 198.51.100.20:51432 · TCP</p></>:<div className="log-lines"><div><span>12:41:03 INFO nginx</span> GET /health 200</div><div><span>12:41:01 INFO systemd</span> Started nginx.service</div><div><span>12:40:58 INFO docker</span> Container web started</div><div><span>12:40:52 INFO postgres</span> Database system is ready</div><div><span>12:40:49 INFO pulse-agent</span> Connected to monitor</div></div>}
  </div></div></div></div>;
}
