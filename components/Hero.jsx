import Link from 'next/link';
import Image from 'next/image';
import {Chart} from './Graphics';
import {copy,url} from '../lib/site';
function TelemetryCard({label,value,variant=0}) { return <div className="telemetry-card floater"><div className="telemetry-head">{label}<span>···</span></div><div className="telemetry-value">{value}<small>{label==='CPU'?'2.8 GHz':label==='RAM'?'12.4 / 20 GB':'DOWNLOAD'}</small></div><Chart variant={variant}/><div className="graph-time"><span>60s</span><span>30s</span><span>0s</span></div></div>; }
export default function Hero({lang}) {
  const t=copy[lang];
  return <section className="orbital-hero" aria-labelledby="hero-title">
    <div className="hero-orbits" aria-hidden="true"><svg viewBox="0 0 1400 850" preserveAspectRatio="xMidYMid meet"><g fill="none" stroke="currentColor"><ellipse cx="700" cy="425" rx="655" ry="365"/><ellipse cx="700" cy="425" rx="540" ry="292"/><ellipse cx="700" cy="425" rx="420" ry="226" strokeDasharray="2 13"/><ellipse cx="700" cy="425" rx="325" ry="165"/></g><g className="orbit-spinner" fill="currentColor"><circle cx="55" cy="480" r="5"/><circle cx="1160" cy="187" r="4"/><circle cx="700" cy="717" r="6"/><circle cx="340" cy="425" r="3"/></g></svg></div>
    <div className="satellite server-satellite" aria-hidden="true"><Image src="/assets/server.webp" alt="" width={1774} height={887} priority className="floater hardware"/></div>
    <div className="satellite cpu-satellite" aria-hidden="true"><TelemetryCard label="CPU" value="23%"/></div>
    <div className="satellite network-satellite" aria-hidden="true"><TelemetryCard label="NETWORK" value="125 Mb/s" variant={2}/></div>
    <div className="satellite ram-satellite" aria-hidden="true"><TelemetryCard label="RAM" value="62%" variant={1}/></div>
    <div className="satellite process-satellite" aria-hidden="true"><div className="telemetry-card floater"><div className="telemetry-head">PROCESSES<span>···</span></div><table><thead><tr><th>NAME</th><th>CPU</th><th>RAM</th></tr></thead><tbody>{[['nginx','1.3%','152 MB'],['postgres','4.8%','512 MB'],['node','0.7%','328 MB'],['pulse-agent','0.3%','64 MB']].map(row=><tr key={row[0]}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></div>
    <div className="satellite containers-satellite" aria-hidden="true"><Image src="/assets/containers.webp" alt="" width={1536} height={1024} className="floater hardware"/></div>
    <div className="hero-center"><div className="eyebrow hero-copy-line">SELF-HOSTED · OPEN SOURCE</div><div className="hero-wordmark hero-copy-line" aria-hidden="true">PULSE</div><h1 id="hero-title" className="hero-copy-line">{t.heading[0]}<br/>{t.heading[1]}</h1><p className="hero-copy-line">{t.intro}</p><div className="actions hero-copy-line"><Link href={url(lang,'install')} className="button">{t.install}<span aria-hidden="true">→</span></Link><a href="#overview" className="button secondary">{t.explore}</a></div><div className="hero-spec hero-copy-line">LINUX + WINDOWS <i/> GO AGENT <i/> MIT LICENSE</div></div>
    <a href="#overview" className="scroll-hint"><span className="scroll-mouse"/>{t.scroll}<span aria-hidden="true">⌄</span></a>
  </section>;
}
