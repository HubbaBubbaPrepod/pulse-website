import gsap from 'gsap';

const specs = new WeakMap();
function readSpec(el) {
  if (!specs.has(el)) {
    const text = el.textContent;
    const match = /^\s*(-?\d+(?:\.\d+)?)(.*)$/s.exec(text);
    specs.set(el, match ? {text,value:Number(match[1]),decimals:(match[1].split('.')[1]||'').length,suffix:match[2]} : null);
  }
  return specs.get(el);
}
const writer = (el,spec) => value => {el.textContent=value.toFixed(spec.decimals)+spec.suffix;};
export function restoreNumbers(root) {
  root?.querySelectorAll('.num,.metric strong').forEach(el=>{const spec=specs.get(el);if(spec)el.textContent=spec.text;});
}
export function countUp(el,{duration=1.4,delay=0}={}) {
  const spec=readSpec(el);if(!spec)return null;
  const write=writer(el,spec),state={v:0};write(0);
  return gsap.to(state,{v:spec.value,duration,delay,ease:'power3.out',onUpdate:()=>write(state.v),onComplete:()=>{el.textContent=spec.text;}});
}
export function liveValue(el,{spread=.1,steps=6,delay=0}={}) {
  const spec=readSpec(el);if(!spec)return null;
  const write=writer(el,spec),state={v:spec.value};
  const timeline=gsap.timeline({repeat:-1,delay});
  const add=value=>timeline.to(state,{v:value,duration:1.1,ease:'sine.inOut',onUpdate:()=>write(state.v)},'+='+(0.9+Math.random()*1.4));
  for(let i=0;i<steps;i++)add(spec.value*(1+(Math.random()*2-1)*spread));
  add(spec.value);return timeline;
}
export function drawPath(path,{duration=1.4,delay=0,ease='power2.inOut'}={}) {
  const length=path.getTotalLength();
  return gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration,delay,ease,clearProps:'strokeDasharray,strokeDashoffset'});
}
