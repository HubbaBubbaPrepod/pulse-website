import {themeScript} from '../../components/Root';
import Script from 'next/script';
export default function Layout({children}) { return <html lang="ru" suppressHydrationWarning><body><Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{__html:themeScript}}/>{children}</body></html>; }
