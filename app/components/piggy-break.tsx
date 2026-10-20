"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
const Game = dynamic(()=>import('./piggy-slide').then(m=>m.PiggySlide),{ssr:false,loading:()=> <p className="piggy-loading">Loading pigs…</p>});
export function PiggyBreak(){
 const [expanded,setExpanded]=useState(false);const windowRef=useRef<HTMLDialogElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!expanded)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;};},[expanded]);
 function resize(){const panel=windowRef.current;if(!panel)return;panel.close();if(expanded){panel.show();trigger.current?.focus();}else panel.showModal();setExpanded(!expanded);}
 return <aside className="hero-pig" aria-label="Piggy game"><dialog ref={windowRef} open className="pig-window" data-expanded={expanded} aria-labelledby="pig-window-title" onCancel={e=>{e.preventDefault();if(expanded)resize();}}><div className="pig-window-bar"><span id="pig-window-title">piggy game</span><button ref={trigger} onClick={resize} aria-label={expanded?'Minimize piggy game':'Maximize piggy game'} title={expanded?'Minimize':'Maximize'}>{expanded?'↙':'↗'}</button></div><div className="pig-window-game"><Game/></div></dialog></aside>;
}
