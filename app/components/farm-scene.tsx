"use client";

import { Suspense, useRef, useState, useEffect, type RefObject } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Plane, Vector3, type Group } from "three";
import { Box, Herd, Track } from "./piggy-slide-scene";
export type FarmPlace = "about" | "contact" | "resume" | "projects";
type Point=[number,number,number];
type Props={active:boolean; reducedMotion:boolean; pushToken:number; harvestToken:number; resetToken:number; onStatus:(text:string)=>void};

function Tree({position,scale=1}:{position:Point;scale?:number}) {
 return <group position={position} scale={scale}>
  <Box position={[0,.55,0]} size={[.18,1.1,.18]} color="#826343"/>
  <mesh position={[0,1.35,0]} castShadow><icosahedronGeometry args={[.67,0]}/><meshStandardMaterial color="#799765" flatShading/></mesh>
  <mesh position={[.28,1.7,-.06]} castShadow><icosahedronGeometry args={[.52,0]}/><meshStandardMaterial color="#9aae7a" flatShading/></mesh>
 </group>;
}
function Fence({x,z,length=4,rotation=0}:{x:number;z:number;length?:number;rotation?:number}) {
 return <group position={[x,0,z]} rotation={[0,rotation,0]}>
  {Array.from({length:Math.ceil(length)+1},(_,i)=><Box key={i} position={[i*length/Math.ceil(length)-length/2,.34,0]} size={[.1,.72,.1]} color="#e1c9a1"/>)}
  {[.25,.52].map(y=><Box key={y} position={[0,y,0]} size={[length,.075,.07]} color="#e9d8b7"/>)}
 </group>;
}
function Cow({position,rotation=0,active,reducedMotion,walking}:{position:Point;rotation?:number;active:boolean;reducedMotion:boolean;walking?:RefObject<number>}) {
 const head=useRef<Group>(null),legs=useRef<Group[]>([]);
 useFrame(({clock})=>{if(head.current && active && !reducedMotion)head.current.rotation.z=Math.sin(clock.elapsedTime*.9+position[0])*.08;legs.current.forEach((leg,i)=>{if(leg)leg.rotation.z=reducedMotion?0:Math.sin(clock.elapsedTime*11+(i===0||i===3?0:Math.PI))*.38*(walking?.current??0);});});
 return <group position={position} rotation={[0,rotation,0]}>
  <Box position={[0,.62,0]} size={[1.05,.62,.6]} color="#ede9dc"/>
  <Box position={[-.18,.68,.305]} size={[.32,.32,.015]} color="#544a41"/>
  <Box position={[.29,.84,0]} size={[.28,.2,.62]} color="#544a41"/>
  {[-.35,.35].flatMap(x=>[-.22,.22].map(z=><group key={`${x}-${z}`} ref={el=>{if(el)legs.current[(x<0?0:2)+(z<0?0:1)]=el;}} position={[x,.48,z]}><Box position={[0,-.24,0]} size={[.13,.5,.13]} color="#e4ddcc"/><Box position={[0,-.42,0]} size={[.15,.12,.15]} color="#5d5144"/></group>))}
  <group ref={head} position={[.62,.65,0]}>
   <Box size={[.42,.46,.46]} color="#f3efe4"/><Box position={[.24,-.1,0]} size={[.17,.22,.43]} color="#d9aaa2"/>
   {[-1,1].map(side=><group key={side}><Box position={[.1,.1,side*.235]} size={[.055,.06,.025]} color="#292d28"/><Box position={[-.06,.2,side*.31]} size={[.23,.09,.16]} color="#a7927b"/><Box position={[-.06,.32,side*.15]} size={[.06,.19,.06]} color="#e8d0a3"/></group>)}
  </group>
  <Box position={[-.6,.52,0]} size={[.08,.48,.07]} color="#544a41" rotation={[0,0,-.2]}/>
 </group>;
}
function Chicken({position,active,reducedMotion,walking}:{position:Point;active:boolean;reducedMotion:boolean;walking?:RefObject<number>}) {
 const bird=useRef<Group>(null),feet=useRef<Group[]>([]);
 useFrame(({clock})=>{if(bird.current && active && !reducedMotion)bird.current.rotation.z=Math.max(0,Math.sin(clock.elapsedTime*1.5+position[0]*3))*.22;feet.current.forEach((foot,i)=>{if(foot)foot.rotation.z=reducedMotion?0:Math.sin(clock.elapsedTime*16+i*Math.PI)*.5*(walking?.current??0);});});
 return <group position={position} ref={bird}>
  <Box position={[0,.23,0]} size={[.38,.34,.32]} color="#f3e9cc"/>
  <Box position={[.21,.41,0]} size={[.23,.26,.24]} color="#fff3d3"/>
  <Box position={[.35,.38,0]} size={[.13,.07,.1]} color="#d79a42"/>
  <Box position={[.2,.57,0]} size={[.17,.08,.07]} color="#ae5547"/>
  <Box position={[.27,.46,.13]} size={[.035,.04,.02]} color="#36382a"/>
  <Box position={[-.23,.36,0]} size={[.18,.24,.1]} rotation={[0,0,-.5]} color="#ddc99e"/>
  {[-.1,.1].map((z,i)=><group key={z} ref={el=>{if(el)feet.current[i]=el;}} position={[0,.13,z]}><Box position={[0,-.08,0]} size={[.06,.16,.06]} color="#cb974f"/></group>)}
 </group>;
}
function Barn() {
 return <group position={[0,0,-1.45]}>
  <Box position={[0,1.02,0]} size={[2.8,2.04,2.15]} color="#ae5f4d"/>
  {Array.from({length:12},(_,i)=><Box key={i} position={[-1.3+i*.236,1.03,1.084]} size={[.025,2.02,.02]} color="#934e40" shadows={false}/>)}
  {[-1,1].map(side=><mesh key={side} position={[0,0,side*1.076]} rotation={[0,side===1?0:Math.PI,0]} castShadow>
   <bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array([-1.4,2.04,0,1.4,2.04,0,0,2.72,0]),3]}/></bufferGeometry>
   <meshStandardMaterial color="#ae5f4d" flatShading/>
  </mesh>)}
  {/* Two pitched roof panels give the barn its familiar silhouette. */}
  {[-1,1].map(side=><Box key={side} position={[side*.78,2.3,0]} size={[1.86,.14,2.48]} rotation={[0,0,side*-.48]} color="#606e5e"/>)}
  <Box position={[0,1.76,1.1]} size={[.43,.37,.06]} color="#ead7ae"/>
  <Box position={[0,1.76,1.14]} size={[.29,.24,.03]} color="#5b6755"/>
 </group>;
}
function BarnDoor({onStatus}:{onStatus:Props['onStatus']}) {
 const [open,setOpen]=useState(false);
 const left=useRef<Group>(null),right=useRef<Group>(null);
 useFrame((_,dt)=>{for(const [ref,side] of [[left,-1],[right,1]] as const)if(ref.current)ref.current.rotation.y+=((open?side*1.15:0)-ref.current.rotation.y)*(1-Math.exp(-8*dt));});
 return <group onClick={e=>{e.stopPropagation();setOpen(!open);onStatus(open?'Barn closed.':'Barn open.');}} onPointerOver={e=>{e.stopPropagation();document.body.style.cursor='pointer';}} onPointerOut={()=>{document.body.style.cursor='';}}>
  <Barn/><Box position={[0,.65,-.34]} size={[1.3,1.4,.04]} color="#392f29"/>
  {[-1,1].map(side=><group key={side} ref={side===-1?left:right} position={[side*.64,0,-.29]}>
   <Box position={[-side*.31,.65,0]} size={[.62,1.3,.06]} color="#784c3c"/>
   <Box position={[-side*.31,1.29,.04]} size={[.62,.07,.05]} color="#ecdbb7"/>
   <Box position={[-side*.31,.66,.04]} size={[.06,1.42,.05]} rotation={[0,0,side*.42]} color="#ecdbb7"/>
  </group>)}
 </group>;
}
function Animal({home,kind,rotation=0,active,reducedMotion,onStatus}:{home:Point;kind:'cow'|'chicken';rotation?:number}&Props) {
 const walking=useRef(0);
 const root=useRef<Group>(null),drag=useRef(false),offset=useRef(new Vector3()),hit=useRef(new Vector3());
 const {gl}=useThree();
 const ground=useRef(new Plane(new Vector3(0,1,0),-.3));
 const finish=(e:ThreeEvent<PointerEvent>)=>{if(!drag.current)return;e.stopPropagation();drag.current=false;gl.domElement.style.setProperty('cursor','grab');(e.target as Element).releasePointerCapture(e.pointerId);onStatus(`${kind==='cow'?'Cow':'Chicken'} is walking home.`);};
 useEffect(()=>()=>{document.body.style.cursor='';},[]);
 useFrame(({clock},delta)=>{
  const obj=root.current;if(!obj||!active||drag.current)return;
  const dt=Math.min(delta,.05),dx=home[0]-obj.position.x,dz=home[2]-obj.position.z,distance=Math.hypot(dx,dz),step=Math.min(distance,dt*(kind==='cow'?.85:1.25));
  walking.current=distance>.01?1:0;
  if(distance>.01){obj.position.x+=dx/distance*step;obj.position.z+=dz/distance*step;const goal=-Math.atan2(dz,dx);obj.rotation.y+=Math.atan2(Math.sin(goal-obj.rotation.y),Math.cos(goal-obj.rotation.y))*(1-Math.exp(-8*dt));obj.position.y=reducedMotion?0:Math.abs(Math.sin(clock.elapsedTime*12))*.035;}
  else {obj.position.y*=Math.exp(-12*dt);obj.rotation.y+=Math.atan2(Math.sin(rotation-obj.rotation.y),Math.cos(rotation-obj.rotation.y))*(1-Math.exp(-5*dt));}
 });
 return <group ref={root} position={home} rotation={[0,rotation,0]}
  onPointerOver={e=>{e.stopPropagation();gl.domElement.style.setProperty('cursor','grab');}}
  onPointerOut={()=>{if(!drag.current)gl.domElement.style.setProperty('cursor','');}}
  onPointerDown={e=>{e.stopPropagation();if(!root.current)return;drag.current=true;if(e.ray.intersectPlane(ground.current,hit.current))offset.current.copy(root.current.position).sub(hit.current);(e.target as Element).setPointerCapture(e.pointerId);gl.domElement.style.setProperty('cursor','grabbing');onStatus(`Picked up a ${kind}.`);}}
  onPointerMove={e=>{if(!drag.current||!root.current)return;e.stopPropagation();if(e.ray.intersectPlane(ground.current,hit.current)){root.current.position.x=Math.max(-4.5,Math.min(4.5,hit.current.x+offset.current.x));root.current.position.z=Math.max(.25,Math.min(3.5,hit.current.z+offset.current.z));root.current.position.y=.3;}}}
  onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={()=>{drag.current=false;gl.domElement.style.setProperty('cursor','');}}>
  {kind==='cow'?<Cow walking={walking} position={[0,0,0]} active={active} reducedMotion={reducedMotion}/>:<Chicken walking={walking} position={[0,0,0]} active={active} reducedMotion={reducedMotion}/>}
 </group>;
}
function Carrot({position,index,harvestToken,active,onStatus}:Props&{position:Point;index:number}) {
 const root=useRef<Group>(null),state=useRef({dragging:false,start:0,lift:0,picked:false}),last=useRef(harvestToken);
 const {gl}=useThree();
 useEffect(()=>{if(last.current!==harvestToken&&(harvestToken-1)%12===index){state.current.picked=!state.current.picked;onStatus(state.current.picked?'Carrot picked.':'Carrot replanted.');}last.current=harvestToken;},[harvestToken,index,onStatus]);
 useFrame((_,dt)=>{if(!root.current||!active)return;const s=state.current,target=s.dragging?s.lift:s.picked?.45:0;root.current.position.y+=(position[1]+target-root.current.position.y)*(1-Math.exp(-14*dt));root.current.rotation.z+=((s.picked&&!s.dragging?.6:0)-root.current.rotation.z)*(1-Math.exp(-10*dt));});
 function release(e:ThreeEvent<PointerEvent>){if(!state.current.dragging)return;e.stopPropagation();state.current.dragging=false;state.current.picked=state.current.lift>.18;(e.target as Element).releasePointerCapture(e.pointerId);gl.domElement.style.setProperty('cursor','grab');onStatus(state.current.picked?'Carrot picked.':'Give it a little more pull.');}
 return <group ref={root} position={position}
 onPointerOver={e=>{e.stopPropagation();gl.domElement.style.setProperty('cursor','grab');}} onPointerOut={()=>{if(!state.current.dragging)gl.domElement.style.setProperty('cursor','');}}
 onPointerDown={e=>{e.stopPropagation();state.current={dragging:true,start:e.nativeEvent.clientY,lift:0,picked:false};(e.target as Element).setPointerCapture(e.pointerId);gl.domElement.style.setProperty('cursor','grabbing');}}
 onPointerMove={e=>{if(state.current.dragging){e.stopPropagation();state.current.lift=Math.max(0,Math.min(1,(state.current.start-e.nativeEvent.clientY)/85));}}}
 onPointerUp={release} onPointerCancel={release} onLostPointerCapture={()=>{state.current.dragging=false;}}>
  <mesh position={[0,-.13,0]} rotation={[0,0,Math.PI]} castShadow><coneGeometry args={[.105,.4,5]}/><meshStandardMaterial color="#ce8c49" flatShading/></mesh>
  {[-1,0,1].map(i=><Box key={i} position={[i*.055,.13,0]} size={[.06,.29,.07]} color={i===0?'#8ba069':'#68834e'} rotation={[0,i*.8,i*-.35]}/>)}
  <mesh position={[0,.12,0]}><boxGeometry args={[.34,.4,.32]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>
 </group>;
}

function Landscape(props:Props) {
 const {width,height}=useThree(s=>s.size);
 return <>
  <OrthographicCamera makeDefault position={[9,10,13]} zoom={Math.min(width/13.2,height/10.5)} near={.1} far={80}/>
  <OrbitControls target={[0,.2,0]} enablePan={false} enableZoom={false} enableRotate={false}/>
  <ambientLight intensity={1.5}/>
  <directionalLight position={[-5,10,7]} intensity={2.3} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-.001} shadow-normalBias={.03}/>
  <Box position={[0,-.26,0]} size={[11,.48,8.2]} color="#a9bf89"/>
  <Box position={[0,-.57,0]} size={[11,.18,8.2]} color="#d1bea0"/>
  <Box position={[0,.005,1.5]} size={[1.12,.03,4.8]} color="#dfcdab"/>
  <Box position={[0,.012,1.45]} size={[8.7,.03,.85]} color="#dfcdab"/>
  {Array.from({length:8},(_,i)=><Box key={i} position={[.1*(i%2),.04,3.65-i*.49]} size={[.52,.025,.29]} color={i%2?'#c7b798':'#d2c3a4'} rotation={[0,i*.1,0]}/>)}
  <BarnDoor onStatus={props.onStatus}/>
  <Animal home={[.85,0,.6]} rotation={-.5} kind="cow" {...props}/>
  <Animal home={[2.1,0,.2]} rotation={.4} kind="cow" {...props}/>
  <group position={[-3.15,.06,.25]} scale={.66}>
   <Track/><Herd pigCount={3} active={props.active} reducedMotion={props.reducedMotion} pushToken={props.pushToken} resetToken={props.resetToken} onStatus={props.onStatus}/>
  </group>
  <group position={[3.5,0,1.7]}>
   <Box position={[.1,.55,-.55]} size={[1.3,1.1,1]} color="#d5b47c"/>
   <Box position={[.1,1.16,-.55]} size={[1.6,.16,1.3]} rotation={[0,0,-.16]} color="#7c8871"/>
   <Box position={[.1,.43,-.035]} size={[.39,.5,.025]} color="#705544"/>
   <Box position={[.1,.18,.28]} size={[.4,.06,.7]} rotation={[-.35,0,0]} color="#b18a5c"/>
  </group>
  <Animal home={[2.9,0,2.35]} kind="chicken" {...props}/>
  <Animal home={[3.95,0,2.45]} kind="chicken" {...props}/>
  <Animal home={[4.3,0,1.9]} kind="chicken" {...props}/>
  <group position={[-2.9,0,2.7]}>
   <Box size={[2.5,.07,1.25]} color="#8b7154"/>
   {Array.from({length:12},(_,i)=><Carrot key={i} index={i} position={[-.9+(i%4)*.59,.06,-.4+Math.floor(i/4)*.4]} {...props}/>)}
  </group>
  <Fence x={0} z={-3.6} length={9.8}/><Fence x={5} z={-1.15} length={4.8} rotation={Math.PI/2}/>
  <Fence x={-5} z={-1.7} length={3.8} rotation={Math.PI/2}/>
  {[[-4.4,0,-2.7],[-2.9,0,-3],[3.8,0,-2.8],[4.6,0,-1.5]].map((p,i)=><Tree key={i} position={p as Point} scale={i%2?.85:1.1}/>)}
  {[[-.8,0,-3],[2.4,0,-2.8]].map((p,i)=><group key={i} position={p as Point}><Box position={[0,.25,0]} size={[.7,.5,.55]} color="#d1b568"/><Box position={[0,.25,.28]} size={[.06,.5,.015]} color="#9a8756"/></group>)}
  {Array.from({length:14},(_,i)=><group key={i} position={[4.55-Math.floor(i/7)*.45,.04,-.8+(i%7)*.46]}><Box size={[.18,.04,.15]} color="#bbca99"/><Box position={[0,.13,0]} size={[.025,.26,.025]} color="#7d975b"/><Box position={[0,.27,0]} size={[.12,.05,.12]} color={i%2?'#ead4b5':'#eddc93'}/></group>)}
 </>;
}
export default function FarmScene(props:Props) {
 return <Canvas shadows dpr={[1,1.5]} frameloop={props.active?'always':'demand'} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} style={{touchAction:'pan-y'}} fallback={<p className="farm-fallback">Explore using the buttons below.</p>}>
  <Suspense fallback={null}><Landscape key={props.resetToken} {...props}/></Suspense>
 </Canvas>;
}
