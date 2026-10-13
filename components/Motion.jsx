'use client';
import {useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
gsap.registerPlugin(useGSAP,ScrollTrigger);
export default function Motion({children}) {
  const scope = useRef(null);
  useGSAP(()=>{
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      const heroElement = scope.current.querySelector('.orbital-hero');
      if (heroElement) {
        const hero = gsap.timeline({defaults:{ease:'power3.out',duration:1}});
        hero.from('.hero-copy-line',{y:28,opacity:0,stagger:.12,clearProps:'all'}).from('.satellite .floater',{opacity:0,stagger:.06,clearProps:'opacity'},'<.15');
      }
      gsap.utils.toArray('[data-reveal]').forEach(element => {
        gsap.from(element,{y:35,opacity:0,duration:.8,ease:'power2.out',clearProps:'all',scrollTrigger:{trigger:element,start:'top 91%',once:true}});
      });
      const floaters = gsap.utils.toArray('.floater');
      floaters.forEach((element,i)=>gsap.to(element,{y:i%2?10:-12,rotation:i%2?1:-1,duration:4+i*.4,ease:'sine.inOut',repeat:-1,yoyo:true}));
      gsap.utils.toArray('.orbit-spinner').forEach(element=>gsap.to(element,{rotation:360,duration:95,repeat:-1,ease:'none',transformOrigin:'50% 50%'}));
      if (heroElement) {
        const satellites = gsap.utils.toArray('.satellite');
        gsap.to(satellites,{x:(_,el)=> heroElement.clientWidth/2-el.offsetLeft-el.offsetWidth/2,y:(_,el)=> heroElement.clientHeight*.74-el.offsetTop-el.offsetHeight/2,scale:.14,opacity:0,ease:'power2.in',scrollTrigger:{trigger:heroElement,start:'top top',end:'bottom 15%',scrub:.7,invalidateOnRefresh:true}});
        gsap.to('.hero-orbits',{scale:.75,opacity:0,scrollTrigger:{trigger:heroElement,start:'top top',end:'bottom 15%',scrub:1}});
        gsap.from('.dashboard-arrival',{y:60,scale:.95,opacity:.3,scrollTrigger:{trigger:'.dashboard-arrival',start:'top bottom',end:'top 40%',scrub:.7}});
      }
      gsap.utils.toArray('.connection-pulse').forEach(element=>gsap.to(element,{strokeDashoffset:-100,duration:2.5,repeat:-1,ease:'none'}));
    },scope);
    const visibilityHandler = () => { gsap.globalTimeline.paused(document.hidden); };
    document.addEventListener('visibilitychange',visibilityHandler);
    return ()=>{document.removeEventListener('visibilitychange',visibilityHandler);gsap.globalTimeline.paused(false);mm.revert();};
  },{scope});
  return <div ref={scope}>{children}</div>;
}
