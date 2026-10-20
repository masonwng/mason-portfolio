"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const Game = dynamic(()=>import('./piggy-slide').then(m=>m.PiggySlide),{ssr:false,loading:()=> <p>Loading pigs…</p>});
export function PiggyBreak(){const [open,setOpen]=useState(false);return <div className="pig-break"><button className="pig-break-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="pig-game">{open?'close piggy game':'play with the pigs'} <span aria-hidden="true">{open?'−':'+'}</span></button>{open&&<div id="pig-game"><Game/></div>}</div>;}
