"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { type Group } from "three";
import { advancePig, trackPoint, TRACK_LENGTH, FINISH } from "../lib/piggy-track";

export type PigCount = 1 | 2 | 3;
type PigVariant = "pink" | "spotted" | "brown";
type Point = [number, number, number];
export type PiggySlideSceneProps = {
  active: boolean; reducedMotion: boolean; resetToken: number;
  pigCount: PigCount; pushToken: number; onStatus?: (message: string) => void;
};
const VARIANTS: PigVariant[] = ["pink", "spotted", "brown"];
const PIG_COLORS: Record<PigVariant, { body: string; head: string; accent: string; feet: string }> = {
  pink: { body: "#F4A7B9", head: "#F4A7B9", accent: "#D58197", feet: "#C77D90" },
  spotted: { body: "#F3D8CF", head: "#F3D8CF", accent: "#E5A3AD", feet: "#AB8B80" },
  brown: { body: "#9B684C", head: "#9B684C", accent: "#C69878", feet: "#76513E" },
};
function Box({
  position = [0, 0, 0],
  size,
  color,
  rotation,
  shadows = true,
}: {
  position?: Point;
  size: Point;
  color: string;
  rotation?: Point;
  shadows?: boolean;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow={shadows} receiveShadow={shadows}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}

function PigModel({ variant }: { variant: PigVariant }) {
  const colors = PIG_COLORS[variant];
  return (
    <group name={`pig-model-${variant}`}>
      <Box size={[0.62, 0.4, 0.48]} color={colors.body} />
      <Box position={[0.34, 0.06, 0]} size={[0.35, 0.36, 0.41]} color={colors.head} />
      {variant === "spotted" && (
        <group name="brown-patches">
          {[-1, 1].map((side) => (
            <group key={side}>
              <Box position={[-0.14, 0.045, side * 0.243]} size={[0.25, 0.23, 0.012]} color="#765047" />
              <Box position={[-0.025, -0.04, side * 0.244]} size={[0.15, 0.15, 0.012]} color="#765047" />
              <Box position={[0.2, -0.09, side * 0.244]} size={[0.14, 0.13, 0.012]} color="#765047" />
              <Box position={[0.28, 0.15, side * 0.208]} size={[0.17, 0.15, 0.012]} color="#765047" />
            </group>
          ))}
          <Box position={[-0.14, 0.203, -0.06]} size={[0.28, 0.012, 0.24]} color="#765047" />
          <Box position={[-0.03, 0.204, 0.08]} size={[0.16, 0.012, 0.16]} color="#765047" />
          <Box position={[-0.313, 0.02, 0.06]} size={[0.012, 0.24, 0.23]} color="#765047" />
        </group>
      )}
      <Box position={[0.55, 0.01, 0]} size={[0.13, 0.16, 0.26]} color={colors.accent} />
      {[-0.087, 0.087].map((z) => (
        <Box key={`nostril-${z}`} position={[0.619, 0.025, z]} size={[0.012, 0.035, 0.035]} color="#765047" shadows={false} />
      ))}
      {[-0.17, 0.17].map((z) => (
        <group key={z}>
          <Box position={[0.29, 0.29, z]} size={[0.13, 0.17, 0.1]} color={colors.accent} />
          <Box position={[0.474, 0.12, z * 1.17]} size={[0.055, 0.057, 0.019]} color="#332a31" shadows={false} />
          {[-0.2, 0.2].map((x) => (
            <Box key={x} position={[x, -0.26, z]} size={[0.14, 0.19, 0.13]} color={colors.feet} />
          ))}
        </group>
      ))}
      <Box position={[-0.37, 0.08, 0]} size={[0.14, 0.075, 0.075]} color={colors.accent} />
      <Box position={[-0.42, 0.12, 0.035]} size={[0.07, 0.1, 0.075]} color={colors.accent} />
    </group>
  );
}


function Track() {
  const segments = 100;
  return <group>
    <Box position={[0, -.22, 0]} size={[5.1, .38, 4.8]} color="#abc69e" />
    <Box position={[0, -.46, 0]} size={[5.1, .12, 4.8]} color="#c9bda2" />
    <Box position={[0, 1.5, 0]} size={[.24, 3.1, .24]} color="#ab825b" />
    <Box position={[-.85, 2.93, -1.22]} size={[1.7, .14, 1]} color="#c59b70" />
    {[-1.5, -.35].map(x => <Box key={x} position={[x, 1.45, -1.58]} size={[.13, 2.9, .13]} color="#ab825b" />)}
    {Array.from({length:8},(_,i)=><Box key={`step-${i}`} position={[-1.7, .2+i*.37, -1.55]} size={[.46,.07,.3]} color="#c79d72" />)}
    {Array.from({length:segments}, (_,i) => {
      const a=trackPoint(i/segments*TRACK_LENGTH), b=trackPoint((i+1)/segments*TRACK_LENGTH);
      const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2];
      const length=Math.hypot(dx,dy,dz);
      return <group key={i} position={[(a[0]+b[0])/2,(a[1]+b[1])/2-.065,(a[2]+b[2])/2]} rotation={[0,-Math.atan2(dz,dx),0]}>
        <group rotation={[0,0,Math.atan2(dy,Math.hypot(dx,dz))]}>
          <Box size={[length+.035,.13,.96]} color={i%5===0?'#d0a67b':'#d9b286'} />
          {[-.47,.47].map(z=><Box key={z} position={[0,.13,z]} size={[length+.04,.28,.065]} color="#bd9268" />)}
        </group>
      </group>;
    })}
    <Box position={[1.22,.28,.7]} size={[1.05,.14,1.65]} color="#8a6953" />
    <Box position={[1.1,.36,.85]} size={[.48,.015,.42]} color="#a38164" shadows={false} />
    {[-1,1].map(side=><Box key={side} position={[1.22+side*.55,.28,.7]} size={[.09,.24,1.7]} color="#b18b64" />)}
    {[-2,-.8,.5,2].map((x,i)=><group key={x} position={[x,0,i%2?1.9:-1.95]}>
      <Box size={[.42,.025,.36]} color="#b6cdab" />
      <Box position={[0,.13,0]} size={[.035,.26,.035]} color="#6f9867" shadows={false} />
      <Box position={[0,.27,0]} size={[.18,.06,.18]} color={i%2?'#e4bad0':'#fff0c3'} />
      <Box position={[0,.31,0]} size={[.065,.025,.065]} color="#d8b878" shadows={false} />
    </group>)}
  </group>;
}

function Pig({ id, active, reducedMotion, pushToken, pigCount, onStatus }: PiggySlideSceneProps & {id:number}) {
  const model = useRef<Group>(null);
  const splash = useRef<Group>(null);
  const state = useRef({distance:-.35-id*.55, velocity:0, splashAge:1, arrived:false});
  const lastPush = useRef(pushToken);
  const { gl } = useThree();
  const push = () => {
    if (!active) return;
    const pig=state.current;
    if(pig.arrived) { pig.distance=-.35-id*.55; pig.velocity=0; pig.arrived=false; }
    pig.velocity=Math.min(3.7,pig.velocity+1.05);
    onStatus?.(`Pig ${id+1} got a push.`);
  };
  // Buttons and direct pointer hits use the same impulse, including keyboard activation.
  useEffect(() => {
    if(pushToken!==lastPush.current && (pushToken-1)%pigCount===id) {
      const pig=state.current;
      if(pig.arrived) { pig.distance=-.35-id*.55; pig.velocity=0; pig.arrived=false; }
      pig.velocity=Math.min(3.7,pig.velocity+1.05);
      onStatus?.(`Pig ${id+1} got a push.`);
    }
    lastPush.current=pushToken;
  },[pushToken,pigCount,id,onStatus]);
  useFrame((_,delta)=>{
    if(!active || !model.current) return;
    const pig=state.current;
    // Clamp elapsed time after tab switches; fixed substeps keep momentum stable.
    const dt=Math.min(delta,.05), steps=Math.ceil(dt/(1/120));
    for(let i=0;i<steps;i++) {
      const next=advancePig(pig.distance,pig.velocity,dt/steps);
      pig.distance=next.distance; pig.velocity=next.velocity;
    }
    const p=trackPoint(pig.distance), next=trackPoint(pig.distance+.01);
    model.current.position.set(p[0],p[1]+.235,p[2]);
    model.current.rotation.y=-Math.atan2(next[2]-p[2],next[0]-p[0]);
    if(pig.distance>=TRACK_LENGTH+.25 && !pig.arrived) {
      pig.arrived=true; pig.splashAge=0;
      onStatus?.(`Splash! Pig ${id+1} made it. Tap it to go again.`);
    }
    if(pig.distance>=FINISH) pig.velocity=0;
    pig.splashAge+=dt;
    if(splash.current) {
      splash.current.position.set(p[0],.38,p[2]);
      splash.current.visible=pig.splashAge<.7 && !reducedMotion;
      splash.current.children.forEach((cube,i)=>{
        const t=pig.splashAge/.7, angle=i*Math.PI/4;
        cube.position.set(Math.cos(angle)*t*.5,Math.sin(t*Math.PI)*.4,Math.sin(angle)*t*.5);
        cube.scale.setScalar(Math.max(.01,1-t));
      });
    }
  });
  const click=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation(); if(event.delta<6) push();};
  const start=trackPoint(-.35-id*.55);
  return <>
    <group ref={model} position={[start[0],start[1]+.235,start[2]]} scale={.68} onClick={click}
      onPointerOver={e=>{e.stopPropagation();gl.domElement.style.setProperty('cursor','pointer');}}
      onPointerOut={()=>{gl.domElement.style.setProperty('cursor','grab');}}>
      <PigModel variant={VARIANTS[id]} />
    </group>
    <group ref={splash} visible={false}>{Array.from({length:8},(_,i)=><Box key={i} size={[.09,.09,.09]} color={i%2?'#a68362':'#896751'} shadows={false}/>)}</group>
  </>;
}

function World(props:PiggySlideSceneProps) {
  const width=useThree(s=>s.size.width),height=useThree(s=>s.size.height);
  const zoom=Math.min(width/7.2,height/5.7);
  return <>
    <OrthographicCamera makeDefault position={[6,5.5,7]} zoom={zoom} near={.1} far={40}/>
    <OrbitControls makeDefault target={[0,1.25,0]} enabled={props.active} enablePan={false} enableZoom={false} enableDamping={!props.reducedMotion} dampingFactor={.12} rotateSpeed={.5} minPolarAngle={Math.PI/6} maxPolarAngle={Math.PI*.44}/>
    <ambientLight intensity={1.25}/>
    <directionalLight position={[-3,7,4]} intensity={2.5} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={5} shadow-camera-bottom={-4} shadow-bias={-.001} shadow-normalBias={.03}/>
    <Track/>
    {Array.from({length:props.pigCount},(_,id)=><Pig key={`${props.resetToken}-${props.pigCount}-${id}`} {...props} id={id}/>)}
  </>;
}

export default function PiggySlideScene(props:PiggySlideSceneProps) {
  return <Canvas orthographic shadows dpr={[1,1.5]} frameloop={props.active?'always':'demand'} gl={{antialias:true,alpha:true,powerPreference:'low-power'}} onCreated={({gl})=>gl.setClearColor(0x000000,0)} style={{touchAction:'pan-y'}} fallback={<p className="piggy-fallback">The game needs a browser with WebGL.</p>}>
    <Suspense fallback={null}><World {...props}/></Suspense>
  </Canvas>;
}
