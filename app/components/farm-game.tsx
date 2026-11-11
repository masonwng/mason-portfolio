"use client";
import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ACHIEVEMENTS, CARROTS, applyStatus, applyVisit, restoreProgress, skyPhase } from '../lib/farm-achievements.mjs';
const Scene = dynamic(() => import('./farm-scene'), { ssr: false, loading: () => <p className="piggy-loading">Loading the farm…</p> });
const STORAGE = 'farm:achievements:v1';
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
 state = { failed: false };
 static getDerivedStateFromError() { return { failed: true }; }
 render() { return this.state.failed ? <p className="piggy-loading">The farm needs a browser with WebGL.</p> : this.props.children; }
}
type Progress = ReturnType<typeof restoreProgress>;
export function FarmGame() {
 const [seen,setSeen] = useState(false), [active,setActive] = useState(false), [reducedMotion,setReducedMotion] = useState(false);
 const [push,setPush] = useState(0), [harvest,setHarvest] = useState(0), [reset,setReset] = useState(0), [status,setStatus] = useState('');
 // Client-only component (loaded with ssr:false), so reading the clock during render is safe.
 const hourNow = () => Number(new URLSearchParams(location.search).get('hour') ?? new Date().getHours());
 const [phase,setPhase] = useState<'day'|'golden'|'night'>(() => skyPhase(hourNow()));
 // Saved badges load on first render; visiting at night can unlock one right away.
 const [initial] = useState(() => {
  let saved = null; try { saved = JSON.parse(localStorage.getItem(STORAGE) ?? 'null'); } catch { /* ignore */ }
  return applyVisit(restoreProgress(saved), new Date().getHours());
 });
 const firstToast = initial.unlocked.length ? ACHIEVEMENTS.find(x => x.id === initial.unlocked.at(-1)) : undefined;
 const [progress,setProgress] = useState<Progress>(initial.progress), [toast,setToast] = useState<string|null>(firstToast ? `${firstToast.icon} ${firstToast.title}` : null), [panel,setPanel] = useState(false);
 const root = useRef<HTMLDivElement>(null), progressRef = useRef(initial.progress), toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
 const commit = useCallback((result:{progress:Progress;unlocked:string[]}) => {
  progressRef.current = result.progress; setProgress(result.progress);
  try { localStorage.setItem(STORAGE, JSON.stringify(result.progress)); window.dispatchEvent(new Event('mw:scores')); } catch { /* optional */ }
  const last = result.unlocked.at(-1);
  if (last) { const a = ACHIEVEMENTS.find(x => x.id === last)!; setToast(`${a.icon} ${a.title}`); setStatus(`Achievement unlocked: ${a.title}.`); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 3200); }
 }, []);
 // Persist the loaded progress and keep the lighting in step with the clock.
 useEffect(() => {
  try { localStorage.setItem(STORAGE, JSON.stringify(initial.progress)); } catch { /* optional */ }
  if (initial.unlocked.length) toastTimer.current = setTimeout(() => setToast(null), 3200);
  const clock = setInterval(() => setPhase(skyPhase(hourNow())), 60000);
  return () => { clearTimeout(toastTimer.current); clearInterval(clock); };
 }, [initial]);
 const onStatus = useCallback((text:string) => { setStatus(text); commit(applyStatus(progressRef.current, text)); }, [commit]);
 useEffect(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)'); let onscreen = false;
  const sync = () => { setActive(onscreen && document.visibilityState === 'visible'); setReducedMotion(motion.matches); };
  const observer = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; if(onscreen) setSeen(true); sync(); }, {rootMargin:'100px'});
  if(root.current) observer.observe(root.current);
  sync(); motion.addEventListener('change',sync); document.addEventListener('visibilitychange',sync);
  return () => { observer.disconnect(); motion.removeEventListener('change',sync); document.removeEventListener('visibilitychange',sync); };
 },[]);
 const earned = progress.unlocked.length;
 return <div className="farm-game" data-phase={phase} ref={root} tabIndex={0} aria-label="Interactive farm. Click pigs and carrots, drag animals, or drag the ground to rotate. Keyboard: P pushes a pig, C picks a carrot, R resets."
  onKeyDown={e => { if(e.target!==e.currentTarget)return; if(e.key.toLowerCase()==='p'){e.preventDefault();setPush(v=>v+1);} if(e.key.toLowerCase()==='c'){e.preventDefault();setHarvest(v=>v+1);} if(e.key.toLowerCase()==='r'){e.preventDefault();setReset(v=>v+1);onStatus('Farm reset.');} }}>
  <div className="farm-game-canvas">
   {seen && <Boundary><Scene phase={phase} active={active} reducedMotion={reducedMotion} pushToken={push} harvestToken={harvest} resetToken={reset} onStatus={onStatus}/></Boundary>}
   <div className="farm-goal" aria-hidden="true"><span>🥕 {progress.carrots}/{CARROTS}</span><span>🐷 {progress.splashed.length}/3 in the mud</span><span className="farm-sky">{phase==="night"?"🌙 night":phase==="golden"?"🌅 golden hour":"☀️ day"}</span></div>
   {toast && <div className="farm-toast" aria-hidden="true"><small>achievement unlocked</small>{toast}</div>}
   {panel && <div className="farm-badges" role="dialog" aria-label="Farm achievements">
    <div className="farm-badges-head"><strong>achievements</strong><span>{earned}/{ACHIEVEMENTS.length}</span><button onClick={()=>setPanel(false)} aria-label="Close achievements">×</button></div>
    <ul>{ACHIEVEMENTS.map(a => { const got = progress.unlocked.includes(a.id); return <li key={a.id} className={got?'got':''}><span className="farm-badge-icon" aria-hidden="true">{got?a.icon:'🔒'}</span><span><b>{got?a.title:'???'}</b><small>{a.hint}</small></span><span className="sr-only">{got?'unlocked':'locked'}</span></li>; })}</ul>
   </div>}
  </div>
  <div className="farm-game-footer"><span>click to play · drag to explore</span>
   <div className="farm-footer-actions">
    <button className="farm-trophy" aria-expanded={panel} aria-label={`Achievements: ${earned} of ${ACHIEVEMENTS.length}`} title="Achievements" onClick={()=>setPanel(v=>!v)}>🏆 {earned}/{ACHIEVEMENTS.length}</button>
    <button aria-label="Reset farm" title="Reset farm" onClick={()=>{setReset(v=>v+1);onStatus('Farm reset.');}}>↺</button>
   </div>
  </div>
  <span className="sr-only" role="status">{status}</span>
 </div>;
}
