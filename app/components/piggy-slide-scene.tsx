"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  useBeforePhysicsStep,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import { Plane, Vector3, type Group } from "three";

export type PigCount = 1 | 2 | 3;
type PigVariant = "pink" | "spotted" | "brown";

export type PiggySlideSceneProps = {
  active: boolean;
  reducedMotion: boolean;
  resetToken: number;
  pigCount: PigCount;
  onStatus?: (message: string) => void;
};

type Point = [number, number, number];
type DebugState = {
  dragStarts: number;
  dragEnds: number;
  slideCollisions: number;
  splashes: number;
  resets: number;
  splashVisuals: number;
};
type SplashSignal = { token: number; x: number; z: number };
type Shared = {
  registerBody: (id: number, body: RapierRigidBody | null) => void;
  getBodies: () => (RapierRigidBody | null)[];
  getDragging: () => number | null;
  setDragging: (id: number | null) => void;
  getControls: () => OrbitControlsImpl | null;
  track: (event: keyof DebugState) => void;
  getDebug: () => DebugState;
  emitSplash: (id: number) => void;
  getSplash: (id: number) => SplashSignal | null;
  setSplashVisible: (id: number, count: number) => void;
  getVisibleSplashCubes: () => number;
};

const VARIANTS: PigVariant[] = ["pink", "spotted", "brown"];
const LANES = [-0.6, 0, 0.6];
const PIG_COLORS: Record<PigVariant, { body: string; head: string; accent: string; feet: string }> = {
  pink: { body: "#F4A7B9", head: "#F4A7B9", accent: "#D58197", feet: "#C77D90" },
  spotted: { body: "#F3D8CF", head: "#F3D8CF", accent: "#E5A3AD", feet: "#AB8B80" },
  brown: { body: "#9B684C", head: "#9B684C", accent: "#C69878", feet: "#76513E" },
};
const CAMERA_POSITION: Point = [6, 5.5, 7];
const CAMERA_TARGET: Point = [0, 0.85, 0];
const PIG_HALF_HEIGHT = 0.32;
const SLIDE_ANGLE = -0.48;
const SLIDE_CENTER: Point = [-0.06, 1.08, 0];
const ZERO = { x: 0, y: 0, z: 0 };
const UPRIGHT = { x: 0, y: 0, z: 0, w: 1 };
const STAGING: Point = [-1.86, 2.27, 0];
// Keep the entire collider beyond the horizontal deck before releasing it.
const SLIDE_TOP: Point = [-0.85, 1.99, 0];
const START_POSITIONS: Point[] = LANES.map((z) => [STAGING[0], STAGING[1], z]);
const TOP_POSITIONS: Point[] = LANES.map((z) => [SLIDE_TOP[0], SLIDE_TOP[1], z]);

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

function Garden() {
  return (
    <group>
      {[-1.9, -0.8, 0.35, 1.45, 2.35].map((x, index) => (
        <Box key={`grass-${x}`} position={[x, 0.012, index % 2 === 0 ? -1.24 : 1.24]} size={[0.4, 0.025, 0.35]} color={index % 2 === 0 ? "#9ebc91" : "#b6cdab"} shadows={false} />
      ))}
      {[
        { x: -2.22, z: 1.26, color: "#fff0c3" },
        { x: -0.85, z: -1.2, color: "#e4bad0" },
        { x: 0.4, z: 1.3, color: "#f5d9c1" },
        { x: 2.25, z: -1.25, color: "#e0c8e6" },
      ].map(({ x, z, color }) => (
        <group key={`flower-${x}`} position={[x, 0, z]}>
          <Box position={[0, 0.12, 0]} size={[0.035, 0.24, 0.035]} color="#6f9867" shadows={false} />
          <Box position={[0.025, 0.075, 0]} size={[0.13, 0.035, 0.08]} color="#84a879" shadows={false} />
          <Box position={[0, 0.24, 0]} size={[0.19, 0.06, 0.19]} color={color} />
          <Box position={[0, 0.276, 0]} size={[0.065, 0.025, 0.065]} color="#d8b878" shadows={false} />
        </group>
      ))}
      {[0, 1, 2, 3].map((step) => (
        <Box key={`ladder-${step}`} position={[-2.18, 0.3 + step * 0.42, 1.01]} size={[0.28, 0.065, 0.3]} color="#c79d72" />
      ))}
      {[-2.32, -2.04].map((x) => (
        <Box key={`ladder-side-${x}`} position={[x, 0.89, 1.01]} size={[0.065, 1.85, 0.08]} color="#aa7f59" />
      ))}
      <Box position={[1.8, 0.076, -0.35]} size={[0.24, 0.012, 0.18]} color="#97755b" shadows={false} />
      <Box position={[2.18, 0.076, 0.3]} size={[0.3, 0.012, 0.21]} color="#795c4b" shadows={false} />
    </group>
  );
}

function Environment({ onMud }: { onMud: (id: number) => void }) {
  return (
    <>
      <RigidBody type="fixed" name="ground" colliders={false}>
        <CuboidCollider args={[2.7, 0.25, 1.65]} position={[0, -0.25, 0]} friction={0.9} />
        <Box position={[0, -0.28, 0]} size={[5.4, 0.5, 3.3]} color="#abc69e" />
        <Box position={[0, -0.56, 0]} size={[5.4, 0.18, 3.3]} color="#c9bda2" />
      </RigidBody>
      <RigidBody type="fixed" name="staging" colliders={false}>
        <CuboidCollider args={[0.49, 0.09, 0.96]} position={[-1.85, 1.86, 0]} friction={0.8} />
        <Box position={[-1.85, 1.86, 0]} size={[0.98, 0.18, 1.92]} color="#c59b70" />
        {[-2.17, -1.52].map((x) => (
          <Box key={x} position={[x, 0.9, -0.77]} size={[0.14, 1.8, 0.14]} color="#ab825b" />
        ))}
      </RigidBody>
      <RigidBody type="fixed" name="slide" position={SLIDE_CENTER} rotation={[0, 0, SLIDE_ANGLE]} colliders={false}>
        <CuboidCollider args={[1.63, 0.065, 0.94]} friction={0.035} restitution={0} />
        <Box size={[3.26, 0.13, 1.88]} color="#d9b286" />
        {[-0.92, 0.92].map((z) => (
          <group key={z}>
            <CuboidCollider args={[1.63, 0.17, 0.06]} position={[0, 0.15, z]} friction={0.035} />
            <Box position={[0, 0.15, z]} size={[3.26, 0.34, 0.12]} color="#bd9268" />
          </group>
        ))}
      </RigidBody>
      <RigidBody type="fixed" name="mud" colliders={false}>
        <CuboidCollider args={[0.57, 0.035, 0.86]} position={[1.96, 0.035, 0]} friction={1.6} restitution={0} />
        <CuboidCollider
          args={[0.58, 0.21, 0.87]}
          position={[1.96, 0.27, 0]}
          sensor
          onIntersectionEnter={({ other }) => {
            const id = other.rigidBodyObject?.userData.pigId;
            if (typeof id === "number") onMud(id);
          }}
        />
        <Box position={[1.96, 0.035, 0]} size={[1.14, 0.07, 1.72]} color="#8a6953" />
      </RigidBody>
      {/* Invisible safety walls keep pigs within the miniature world. */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.1, 2, 1.75]} position={[-2.8, 1.5, 0]} />
        <CuboidCollider args={[0.1, 2, 1.75]} position={[2.8, 1.5, 0]} />
        <CuboidCollider args={[2.8, 2, 0.1]} position={[0, 1.5, -1.75]} />
        <CuboidCollider args={[2.8, 2, 0.1]} position={[0, 1.5, 1.75]} />
      </RigidBody>
      <Garden />
    </>
  );
}

type CaptureTarget = { setPointerCapture: (id: number) => void; releasePointerCapture: (id: number) => void };

function Pig({ id, active, resetToken, onStatus, shared }: Pick<PiggySlideSceneProps, "active" | "resetToken" | "onStatus"> & { id: number; shared: Shared }) {
  const body = useRef<RapierRigidBody | null>(null);
  const status = useRef(onStatus);
  const { rapier } = useRapier();
  const { gl, camera, invalidate } = useThree();
  const drag = useRef<{ pointerId: number; plane: Plane; offset: Vector3; target: CaptureTarget } | null>(null);
  const destination = useRef(new Vector3());
  const hit = useMemo(() => new Vector3(), []);
  // Rapier re-applies its Three transform when a mutable option changes.
  // Keep metadata stable so a live-region update cannot undo an imperative move.
  const userData = useMemo(() => ({ pigId: id }), [id]);

  useEffect(() => { status.current = onStatus; }, [onStatus]);

  const release = useCallback(() => {
    if (!drag.current) return;
    const currentDrag = drag.current;
    drag.current = null;
    shared.setDragging(null);
    // Commit the last pointer position even if release precedes the next fixed step.
    if (body.current?.isValid()) {
      body.current.setTranslation(destination.current, true);
      body.current.setBodyType(rapier.RigidBodyType.Dynamic, true);
      body.current.setLinvel(ZERO, true);
      body.current.setAngvel(ZERO, true);
    }
    try {
      currentDrag.target.releasePointerCapture(currentDrag.pointerId);
    } catch {
      // Browsers may have released capture already after pointercancel.
    }
    gl.domElement.style.setProperty("cursor", "grab");
    shared.track("dragEnds");
    status.current?.(`Pig ${id + 1} released. Gravity takes it from here.`);
    invalidate();
  }, [gl, id, invalidate, rapier, shared]);

  const place = useCallback((position: Point) => {
    release();
    if (!body.current?.isValid()) return;
    body.current.setBodyType(rapier.RigidBodyType.Dynamic, true);
    body.current.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
    body.current.setRotation(UPRIGHT, true);
    body.current.setLinvel(ZERO, true);
    body.current.setAngvel(ZERO, true);
    invalidate();
  }, [invalidate, rapier, release]);

  useEffect(() => {
    shared.registerBody(id, body.current);
    return () => { shared.registerBody(id, null); };
  }, [id, shared]);

  useEffect(() => {
    place(START_POSITIONS[id]);
    if (id === 0) {
      shared.track("resets");
      if (resetToken > 0) status.current?.("Pigs are back at the start. Ready for another slide.");
    }
  }, [id, place, resetToken, shared]);

  useEffect(() => { if (!active) release(); }, [active, release]);

  useEffect(() => {
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
      release();
    };
  }, [release]);

  useBeforePhysicsStep(() => {
    const currentBody = body.current;
    if (!currentBody) return;
    if (drag.current) {
      currentBody.setNextKinematicTranslation(destination.current);
      return;
    }
    const position = currentBody.translation();
    if (position.y < -1.5 || Math.abs(position.x) > 3.3 || Math.abs(position.z) > 2.2) place(START_POSITIONS[id]);
  });

  function start(event: ThreeEvent<PointerEvent>) {
    if (!active || !body.current || shared.getDragging() !== null || event.button > 0) return;
    event.stopPropagation();
    const position = body.current.translation();
    // Keep lane dragging predictable, including after orbiting edge-on to a lane.
    const normal = Math.abs(event.ray.direction.z) >= 0.2
      ? new Vector3(0, 0, 1)
      : camera.getWorldDirection(new Vector3()).setY(0).normalize();
    const plane = new Plane().setFromNormalAndCoplanarPoint(normal, new Vector3(position.x, position.y, position.z));
    if (!event.ray.intersectPlane(plane, hit)) return;
    const target = event.target as unknown as CaptureTarget;
    target.setPointerCapture(event.pointerId);
    destination.current.set(position.x, position.y, position.z);
    drag.current = { pointerId: event.pointerId, plane, offset: new Vector3(position.x, position.y, position.z).sub(hit), target };
    shared.setDragging(id);
    body.current.setBodyType(rapier.RigidBodyType.KinematicPositionBased, true);
    body.current.setLinvel(ZERO, true);
    body.current.setAngvel(ZERO, true);
    shared.track("dragStarts");
    gl.domElement.style.setProperty("cursor", "grabbing");
    status.current?.(`Dragging pig ${id + 1}. Release it above the slide.`);
    invalidate();
  }

  function move(event: ThreeEvent<PointerEvent>) {
    if (!drag.current || event.pointerId !== drag.current.pointerId) return;
    event.stopPropagation();
    if (!event.ray.intersectPlane(drag.current.plane, hit)) return;
    destination.current.copy(hit).add(drag.current.offset);
    destination.current.x = Math.max(-2.2, Math.min(2.2, destination.current.x));
    destination.current.z = Math.max(-1.3, Math.min(1.3, destination.current.z));
    const rampHeight = Math.abs(destination.current.z) > 1.15 ? 0.08 : destination.current.x >= -1.5 && destination.current.x <= 1.5
      ? SLIDE_CENTER[1] + Math.tan(SLIDE_ANGLE) * (destination.current.x - SLIDE_CENTER[0]) + 0.08
      : destination.current.x < -1.5 ? 1.96 : 0.08;
    destination.current.y = Math.max(rampHeight + PIG_HALF_HEIGHT + 0.04, Math.min(3.7, destination.current.y));
    invalidate();
  }

  return (
    <RigidBody ref={body} name={`pig-${id}`} userData={userData} position={START_POSITIONS[id]} colliders={false} enabledRotations={[false, false, false]} linearDamping={0.12} angularDamping={2} ccd onCollisionEnter={({ other }) => {
      if (other.rigidBodyObject?.name === "slide") shared.track("slideCollisions");
    }}>
      <CuboidCollider args={[0.42, PIG_HALF_HEIGHT, 0.25]} position={[0.05, 0, 0]} friction={0.035} restitution={0.03} />
      <group onPointerDown={start} onPointerMove={move} onPointerUp={(event) => { event.stopPropagation(); release(); }} onPointerCancel={(event) => { event.stopPropagation(); release(); }} onPointerOver={(event) => { event.stopPropagation(); if (!drag.current) gl.domElement.style.setProperty("cursor", "grab"); }} onPointerOut={() => { if (!drag.current) gl.domElement.style.setProperty("cursor", "default"); }}>
        <PigModel variant={VARIANTS[id]} />
      </group>
    </RigidBody>
  );
}

function Splash({ id, shared, active, reducedMotion }: { id: number; shared: Shared; active: boolean; reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const lastToken = useRef(0);
  const age = useRef(1);
  useFrame((_, delta) => {
    const signal = shared.getSplash(id);
    const splash = group.current;
    if (!splash) return;
    if (!signal) {
      splash.visible = false;
      lastToken.current = 0;
      shared.setSplashVisible(id, 0);
      return;
    }
    if (!active) return;
    if (signal.token !== lastToken.current) {
      lastToken.current = signal.token;
      age.current = 0;
      splash.position.set(signal.x, 0.12, signal.z);
      shared.track("splashVisuals");
    }
    age.current += Math.min(delta, 0.05);
    const progress = age.current / 0.65;
    splash.visible = progress < 1;
    shared.setSplashVisible(id, progress < 1 ? 8 : 0);
    if (progress >= 1) return;
    splash.children.forEach((cube, index) => {
      const angle = index * Math.PI / 4;
      const spread = reducedMotion ? 0.2 : 0.12 + progress * 0.38;
      cube.position.set(Math.cos(angle) * spread, reducedMotion ? 0 : Math.sin(progress * Math.PI) * (index % 2 ? 0.22 : 0.34), Math.sin(angle) * spread);
      cube.scale.setScalar(reducedMotion ? 0.8 : Math.max(0.08, 1 - progress));
    });
  });
  return (
    <group ref={group} visible={false}>
      {Array.from({ length: 8 }, (_, index) => (
        <Box key={index} size={[0.09, 0.09, 0.09]} color={index % 2 === 0 ? "#896751" : "#a68362"} shadows={false} />
      ))}
    </group>
  );
}

function Diagnostics({ shared, active, reducedMotion }: { shared: Shared; active: boolean; reducedMotion: boolean }) {
  const last = useRef(0);
  const projection = useMemo(() => new Vector3(), []);
  const { gl, camera } = useThree();
  const { world } = useRapier();
  useFrame(({ clock }) => {
    if (process.env.NODE_ENV === "production" || clock.elapsedTime - last.current < 0.12) return;
    last.current = clock.elapsedTime;
    const rect = gl.domElement.getBoundingClientRect();
    function screen(position: { x: number; y: number; z: number }) {
      projection.set(position.x, position.y, position.z).project(camera);
      return { x: rect.left + (projection.x + 1) * rect.width / 2, y: rect.top + (1 - projection.y) * rect.height / 2 };
    }
    const pigs = shared.getBodies().map((body, id) => {
      if (!body) return null;
      const position = body.translation();
      const top = TOP_POSITIONS[id];
      return { id, variant: VARIANTS[id], ...position, screen: screen(position), topScreen: screen({ x: top[0], y: top[1], z: top[2] }), velocity: body.linvel(), rotation: body.rotation(), sleeping: body.isSleeping(), dragging: shared.getDragging() === id, bodyType: body.bodyType() };
    }).filter((pig) => pig !== null);
    const controls = shared.getControls();
    gl.domElement.parentElement?.setAttribute("data-piggy-debug", JSON.stringify({ ...shared.getDebug(), active, reducedMotion, dpr: gl.getPixelRatio(), visibleSplashCubes: shared.getVisibleSplashCubes(), pigs, rigidBodies: world.bodies.len(), colliders: world.colliders.len(), camera: { position: camera.position.toArray(), zoom: "zoom" in camera ? camera.zoom : null, enabled: controls?.enabled, azimuth: controls?.getAzimuthalAngle(), polar: controls?.getPolarAngle() }, slideTop: screen({ x: SLIDE_TOP[0], y: SLIDE_TOP[1], z: SLIDE_TOP[2] }) }));
  });
  useEffect(() => () => { gl.domElement.parentElement?.removeAttribute("data-piggy-debug"); }, [gl]);
  return null;
}

function World(props: PiggySlideSceneProps) {
  const { onStatus } = props;
  const bodies = useRef<(RapierRigidBody | null)[]>([]);
  const dragging = useRef<number | null>(null);
  const controls = useRef<OrbitControlsImpl>(null);
  const active = useRef(props.active);
  const [isDragging, setIsDragging] = useState(false);
  const debug = useRef<DebugState>({ dragStarts: 0, dragEnds: 0, slideCollisions: 0, splashes: 0, resets: 0, splashVisuals: 0 });
  const splashSignals = useRef<(SplashSignal | null)[]>(Array(3).fill(null));
  const splashCounts = useRef<number[]>(Array(3).fill(0));
  const splashSerial = useRef(0);
  useEffect(() => {
    active.current = props.active;
    if (controls.current) controls.current.enabled = props.active && dragging.current === null;
  }, [props.active]);
  useEffect(() => {
    splashSignals.current.fill(null);
    splashCounts.current.fill(0);
  }, [props.resetToken, props.pigCount]);
  const shared = useMemo<Shared>(() => ({
    registerBody: (id, body) => { bodies.current[id] = body; },
    getBodies: () => bodies.current,
    getDragging: () => dragging.current,
    setDragging: (id) => {
      dragging.current = id;
      // Disable synchronously: a native orbit pointer listener can run before
      // React commits the enabled prop after a pig receives pointerdown.
      if (controls.current) controls.current.enabled = id === null && active.current;
      setIsDragging(id !== null);
    },
    getControls: () => controls.current,
    track: (event) => { debug.current[event] += 1; },
    getDebug: () => debug.current,
    emitSplash: (id) => {
      const body = bodies.current[id];
      if (!body) return;
      const position = body.translation();
      splashSignals.current[id] = { token: ++splashSerial.current, x: Math.max(1.54, Math.min(2.4, position.x)), z: position.z };
    },
    getSplash: (id) => splashSignals.current[id],
    setSplashVisible: (id, count) => { splashCounts.current[id] = count; },
    getVisibleSplashCubes: () => splashCounts.current.reduce((sum, count) => sum + count, 0),
  }), []);
  const width = useThree((state) => state.size.width);
  const onMud = useCallback((id: number) => {
    if (shared.getDragging() === id) return;
    shared.track("splashes");
    shared.emitSplash(id);
    onStatus?.(`Splash! Pig ${id + 1} landed in the mud.`);
  }, [onStatus, shared]);
  return (
    <>
      <OrthographicCamera makeDefault position={CAMERA_POSITION} zoom={width / 7.3} near={0.1} far={40} />
      <OrbitControls ref={controls} makeDefault target={CAMERA_TARGET} enabled={props.active && !isDragging} enablePan={false} enableDamping={!props.reducedMotion} dampingFactor={0.12} rotateSpeed={0.55} zoomSpeed={0.5} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI * 0.42} minZoom={width / 9} maxZoom={width / 6.8} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[-3, 7, 4]} intensity={2.5} castShadow shadow-mapSize={[512, 512]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.001} shadow-normalBias={0.03} />
      <Physics paused={!props.active} gravity={[0, -9.81, 0]} timeStep={1 / 60} interpolate>
        <Environment onMud={onMud} />
        {Array.from({ length: props.pigCount }, (_, id) => <Pig key={id} id={id} active={props.active} resetToken={props.resetToken} onStatus={props.onStatus} shared={shared} />)}
        {Array.from({ length: props.pigCount }, (_, id) => <Splash key={`splash-${id}`} id={id} shared={shared} active={props.active} reducedMotion={props.reducedMotion} />)}
        <Diagnostics shared={shared} active={props.active} reducedMotion={props.reducedMotion} />
      </Physics>
    </>
  );
}

export default function PiggySlideScene(props: PiggySlideSceneProps) {
  return (
    <Canvas orthographic shadows dpr={[1, 1.5]} frameloop={props.active ? "always" : "demand"} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)} style={{ touchAction: "none" }} fallback={<p className="piggy-fallback">The 3D scene needs WebGL. Your portfolio is ready to explore.</p>}>
      <Suspense fallback={null}>
        <World {...props} />
      </Suspense>
    </Canvas>
  );
}
