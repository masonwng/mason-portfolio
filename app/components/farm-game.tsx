"use client";
import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
const Scene = dynamic(() => import('./farm-scene'), { ssr: false, loading: () => <p className="piggy-loading">Loading the farm…</p> });
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
 state = { failed: false };
 static getDerivedStateFromError() { return { failed: true }; }
 render() { return this.state.failed ? <p className="piggy-loading">The farm needs a browser with WebGL.</p> : this.props.children; }
}
export function FarmGame() {
 const [seen,setSeen] = useState(false), [active,setActive] = useState(false), [reducedMotion,setReducedMotion] = useState(false);
 const [push,setPush] = useState(0), [harvest,setHarvest] = useState(0), [reset,setReset] = useState(0), [status,setStatus] = useState('');
 const root = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)'); let onscreen = false;
  const sync = () => { setActive(onscreen && document.visibilityState === 'visible'); setReducedMotion(motion.matches); };
  const observer = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; if(onscreen) setSeen(true); sync(); }, {rootMargin:'100px'});
  if(root.current) observer.observe(root.current);
  sync(); motion.addEventListener('change',sync); document.addEventListener('visibilitychange',sync);
  return () => { observer.disconnect(); motion.removeEventListener('change',sync); document.removeEventListener('visibilitychange',sync); };
 },[]);
 return <div className="farm-game" ref={root} tabIndex={0} aria-label="Interactive farm. Click pigs and carrots, drag animals, or drag the ground to rotate. Keyboard: P pushes a pig, C picks a carrot, R resets."
  onKeyDown={e => { if(e.target!==e.currentTarget)return; if(e.key.toLowerCase()==='p'){e.preventDefault();setPush(v=>v+1);} if(e.key.toLowerCase()==='c'){e.preventDefault();setHarvest(v=>v+1);} if(e.key.toLowerCase()==='r'){e.preventDefault();setReset(v=>v+1);} }}>
  <div className="farm-game-canvas">{seen && <Boundary><Scene active={active} reducedMotion={reducedMotion} pushToken={push} harvestToken={harvest} resetToken={reset} onStatus={setStatus}/></Boundary>}</div>
  <div className="farm-game-footer"><span>click to play · drag to explore</span><button aria-label="Reset farm" title="Reset farm" onClick={()=>{setReset(v=>v+1);setStatus('Farm reset.');}}>↺</button></div>
  <span className="sr-only" role="status">{status}</span>
 </div>;
}
