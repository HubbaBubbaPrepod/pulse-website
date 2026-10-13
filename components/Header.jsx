'use client';
import {useState,useSyncExternalStore,useRef} from 'react';
import Link from 'next/link';
import {Mark} from './Graphics';
import {copy,url,github} from '../lib/site';
const subscribe = callback => { window.addEventListener('pulse-theme',callback); return () => window.removeEventListener('pulse-theme',callback); };
export default function Header({lang,slug}) {
  const t = copy[lang];
  const [open,setOpen] = useState(false);
  const menuButton = useRef(null);
  const theme = useSyncExternalStore(subscribe,()=>document.documentElement.dataset.theme || 'dark',()=> 'dark');
  function changeTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('pulse-site-theme',next); } catch {}
    window.dispatchEvent(new Event('pulse-theme'));
  }
  return <header className="header"><div className="container header-inner"><Link href={url(lang)} className="brand" aria-label="Pulse"><Mark/>PULSE</Link>
    <nav id="navigation" aria-label={lang === 'ru' ? 'Главная навигация' : 'Main navigation'} className={'nav'+(open?' open':'')} onKeyDown={event=>{if(event.key==='Escape'){setOpen(false);menuButton.current?.focus();}}}>
      {['features','modules','install'].map((page,i)=><Link key={page} href={url(lang,page)} aria-current={slug===page?'page':undefined} onClick={()=>setOpen(false)}>{t.nav[i]}</Link>)}
      <a href={github+'/pulse-monitor'}>GitHub ↗</a>
    </nav>
    <div className="header-tools"><button className="icon-button" aria-label={t.theme} onClick={changeTheme} aria-pressed={theme==='light'}>{theme==='dark'?'☼':'☾'}</button><a className="language" href={url(lang==='ru'?'en':'ru',slug)} lang={lang==='ru'?'en':'ru'} hrefLang={lang==='ru'?'en':'ru'}>{lang==='ru'?'EN':'RU'}</a><button ref={menuButton} className="icon-button menu" aria-label={t.menu} aria-controls="navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>☰</button></div>
  </div></header>;
}
