"use client";
import dynamic from 'next/dynamic';
import {Component,useEffect,useRef,useState,type ReactNode} from 'react';
const Scene=dynamic(()=>import('./farm-scene'),{ssr:false});
class Boundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<span className="secondary">The farm needs WebGL.</span>:this.props.children;}}
export function DesktopFarm(){
 const [visible,setVisible]=useState(false),[active,setActive]=useState(false),[reducedMotion,setReducedMotion]=useState(false);
 const [push,setPush]=useState(0),[harvest,setHarvest]=useState(0),[reset,setReset]=useState(0),[status,setStatus]=useState(''),[help,setHelp]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const desktop=matchMedia('(min-width: 1000px)'),motion=matchMedia('(prefers-reduced-motion: reduce)');let onscreen=false;
  const sync=()=>{setVisible(desktop.matches);setActive(desktop.matches&&onscreen&&document.visibilityState==='visible');setReducedMotion(motion.matches);};
  const observer=new IntersectionObserver(([e])=>{onscreen=e.isIntersecting;sync();});if(root.current)observer.observe(root.current);
  sync();desktop.addEventListener('change',sync);motion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  return()=>{observer.disconnect();desktop.removeEventListener('change',sync);motion.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
 },[]);
 return <div className="desktop-farm" ref={root} aria-label="Interactive miniature farm">
  <div className="desktop-farm-canvas">{visible&&<Boundary><Scene active={active} reducedMotion={reducedMotion} pushToken={push} harvestToken={harvest} resetToken={reset} onStatus={setStatus}/></Boundary>}</div>
  <div className="desktop-farm-tools"><button onClick={()=>setPush(v=>v+1)}>Push a pig</button><button onClick={()=>setHarvest(v=>v+1)}>Pick a carrot</button><button onClick={()=>{setReset(v=>v+1);setStatus('Farm reset.');}}>Reset</button><button aria-expanded={help} aria-label="Farm controls" onClick={()=>setHelp(v=>!v)}>?</button></div>
  {help&&<p className="desktop-farm-help">Click pigs to push. Pull carrots upward. Drag cows and chickens; they walk home when released. Click the barn to open its doors.</p>}
  <span className="sr-only" role="status">{status}</span>
 </div>;
}
