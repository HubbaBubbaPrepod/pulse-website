'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { countUp, liveValue, drawPath, restoreNumbers } from './motion-utils';
gsap.registerPlugin(useGSAP, ScrollTrigger);
export default function Motion({ children }) {
  const scope = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        '(prefers-reduced-motion: no-preference)',
        (context) => {
          const root = scope.current;
          const heroElement = root.querySelector('.orbital-hero');
          if (heroElement) {
            const hero = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
            hero
              .from('.hero-copy-line', { y: 28, opacity: 0, stagger: 0.12, clearProps: 'all' })
              .from(
                '.satellite .floater',
                { opacity: 0, stagger: 0.06, clearProps: 'opacity' },
                '<.15',
              );
            gsap.utils.toArray('.telemetry-card', heroElement).forEach((card, i) => {
              const start = 0.75 + i * 0.18,
                path = card.querySelector('.graph-path'),
                fill = card.querySelector('.graph-fill'),
                number = card.querySelector('.num');
              if (path) drawPath(path, { duration: 1.7, delay: start });
              if (fill) gsap.from(fill, { opacity: 0, duration: 1.2, delay: start + 0.6 });
              if (number) {
                countUp(number, { delay: start, duration: 1.5 });
                liveValue(number, {
                  spread: Number(number.dataset.spread) || 0.1,
                  delay: start + 2.4,
                });
              }
            });
            gsap.to('.scroll-hint', {
              opacity: 0,
              ease: 'none',
              scrollTrigger: { trigger: heroElement, start: 'top top', end: '+=180', scrub: true },
            });
          }
          gsap.set('[data-reveal]', { y: 32, opacity: 0 });
          ScrollTrigger.batch(root.querySelectorAll('[data-reveal]'), {
            start: 'top 91%',
            once: true,
            interval: 0.12,
            batchMax: 8,
            onEnter: (batch) =>
              context.add(() => {
                gsap.to(batch, {
                  y: 0,
                  opacity: 1,
                  duration: 0.85,
                  ease: 'power2.out',
                  stagger: 0.1,
                  overwrite: true,
                  clearProps: 'transform,opacity',
                });
              }),
          });
          const floaters = gsap.utils.toArray('.floater');
          floaters.forEach((element, i) =>
            gsap.to(element, {
              y: i % 2 ? 10 : -12,
              rotation: i % 2 ? 1 : -1,
              duration: 4 + i * 0.4,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            }),
          );
          gsap.utils.toArray('.orbit-spinner').forEach((element) =>
            gsap.to(element, {
              rotation: 360,
              duration: 95,
              repeat: -1,
              ease: 'none',
              transformOrigin: '50% 50%',
            }),
          );
          if (heroElement) {
            const satellites = gsap.utils.toArray('.satellite');
            gsap.to(satellites, {
              x: (_, el) => heroElement.clientWidth / 2 - el.offsetLeft - el.offsetWidth / 2,
              y: (_, el) => heroElement.clientHeight * 0.74 - el.offsetTop - el.offsetHeight / 2,
              scale: 0.14,
              opacity: 0,
              ease: 'power2.in',
              scrollTrigger: {
                trigger: heroElement,
                start: 'top top',
                end: 'bottom 15%',
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            });
            gsap.to('.hero-orbits', {
              scale: 0.75,
              opacity: 0,
              scrollTrigger: {
                trigger: heroElement,
                start: 'top top',
                end: 'bottom 15%',
                scrub: 1,
              },
            });
            gsap.from('.dashboard-arrival', {
              y: 60,
              scale: 0.95,
              opacity: 0.3,
              scrollTrigger: {
                trigger: '.dashboard-arrival',
                start: 'top bottom',
                end: 'top 40%',
                scrub: 0.7,
              },
            });
          }
          gsap.utils
            .toArray('.connection-pulse')
            .forEach((element) =>
              gsap.to(element, { strokeDashoffset: -100, duration: 2.5, repeat: -1, ease: 'none' }),
            );
          const arch = root.querySelector('.architecture');
          if (arch) {
            const nodes = arch.querySelectorAll('.node'),
              tracks = arch.querySelectorAll('.connection-track'),
              pulses = arch.querySelectorAll('.connection-pulse');
            if (nodes.length === 4 && tracks.length === 2) {
              tracks.forEach((path) => {
                const length = path.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
              });
              gsap.set(pulses, { opacity: 0 });
              gsap
                .timeline({
                  defaults: { ease: 'power2.out' },
                  scrollTrigger: { trigger: arch, start: 'top 78%', once: true },
                })
                .from(nodes[0], { opacity: 0, y: 16, duration: 0.6 })
                .to(tracks[0], { strokeDashoffset: 0, duration: 0.45, ease: 'none' }, '>-.1')
                .from(nodes[1], { opacity: 0, y: 16, duration: 0.6 }, '>-.1')
                .to(tracks[1], { strokeDashoffset: 0, duration: 0.5, ease: 'none' }, '>-.1')
                .from(
                  [nodes[2], nodes[3]],
                  { opacity: 0, y: 16, duration: 0.6, stagger: 0.12 },
                  '>-.1',
                )
                .to(pulses, { opacity: 1, duration: 0.6 }, '<');
            }
          }
          gsap.to('.scroll-progress', {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
          });
          return () => restoreNumbers(root);
        },
        scope,
      );
      mm.add(
        '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',
        () => {
          const hero = scope.current.querySelector('.orbital-hero');
          if (!hero) return;
          const orbits = hero.querySelector('.hero-orbits'),
            center = hero.querySelector('.hero-center');
          const layers = gsap.utils.toArray('.satellite .floater', hero).map((element, i) => ({
            to: gsap.quickTo(element, 'x', { duration: 1, ease: 'power3' }),
            depth: ((i % 3) + 1) * 18,
          }));
          const orbitX = gsap.quickTo(orbits, 'x', { duration: 1.2, ease: 'power3' }),
            orbitY = gsap.quickTo(orbits, 'y', { duration: 1.2, ease: 'power3' });
          const centerX = gsap.quickTo(center, 'x', { duration: 1.1, ease: 'power3' }),
            centerY = gsap.quickTo(center, 'y', { duration: 1.1, ease: 'power3' });
          const move = (event) => {
            const box = hero.getBoundingClientRect(),
              nx = (event.clientX - box.left) / box.width - 0.5,
              ny = (event.clientY - box.top) / box.height - 0.5;
            layers.forEach((layer) => layer.to(-nx * layer.depth));
            orbitX(nx * -16);
            orbitY(ny * -10);
            centerX(nx * 8);
            centerY(ny * 6);
          };
          const leave = () => {
            layers.forEach((layer) => layer.to(0));
            orbitX(0);
            orbitY(0);
            centerX(0);
            centerY(0);
          };
          hero.addEventListener('pointermove', move);
          hero.addEventListener('pointerleave', leave);
          return () => {
            hero.removeEventListener('pointermove', move);
            hero.removeEventListener('pointerleave', leave);
          };
        },
        scope,
      );
      const visibilityHandler = () => {
        gsap.globalTimeline.paused(document.hidden);
      };
      document.addEventListener('visibilitychange', visibilityHandler);
      return () => {
        document.removeEventListener('visibilitychange', visibilityHandler);
        gsap.globalTimeline.paused(false);
        mm.revert();
      };
    },
    { scope },
  );
  return (
    <div ref={scope}>
      <div className="scroll-progress" aria-hidden="true" />
      {children}
    </div>
  );
}
