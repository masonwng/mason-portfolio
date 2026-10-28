// A constrained track simulation: velocity is retained between pushes and gravity
// accelerates pigs along the slope. Units are metres and seconds.
export const TRACK_RADIUS = 1.22;
export const TRACK_TURN = Math.PI * 2.5;
export const TRACK_LENGTH = Math.hypot(TRACK_RADIUS * TRACK_TURN, 2.65);
export const RUNOUT = 1.35;
export const FINISH = TRACK_LENGTH + RUNOUT;
export function trackPoint(distance: number): [number, number, number] {
  if (distance < 0) return [distance, 3, -TRACK_RADIUS];
  if (distance > TRACK_LENGTH) return [TRACK_RADIUS, .35, distance - TRACK_LENGTH];
  const progress = distance / TRACK_LENGTH;
  const angle = -Math.PI / 2 + TRACK_TURN * progress;
  return [TRACK_RADIUS * Math.cos(angle), 3 - 2.65 * progress, TRACK_RADIUS * Math.sin(angle)];
}
export function advancePig(distance: number, velocity: number, dt: number) {
  const slope = distance >= 0 && distance < TRACK_LENGTH;
  const acceleration = slope ? 9.81 * 2.65 / TRACK_LENGTH : 0;
  const friction = distance > TRACK_LENGTH ? 2.6 : .65;
  const speed = Math.min(3.7, Math.max(0, (velocity + acceleration * dt) * Math.exp(-friction * dt)));
  return { distance: Math.min(FINISH, distance + speed * dt), velocity: speed };
}

export const PIG_SPACING = .62;
export type PigMotion = { distance:number; velocity:number; splashAge:number; arrived:boolean; bump:number };
/** Equal-mass contacts along the lane: pigs cannot pass through one another. */
export function resolvePigContacts(pigs:PigMotion[]) {
  const ordered=[...pigs].sort((a,b)=>b.distance-a.distance);
  for(let i=1;i<ordered.length;i++) {
    const front=ordered[i-1], rear=ordered[i];
    if(front.distance-rear.distance>=PIG_SPACING) continue;
    rear.distance=front.distance-PIG_SPACING;
    const closing=rear.velocity-front.velocity;
    if(closing>0) {
      const impulse=closing*.65;
      rear.velocity-=impulse;
      front.velocity=Math.min(3.7,front.velocity+impulse);
      rear.bump=front.bump=Math.min(1,closing/2);
    }
  }
}
export class PigSimulation {
  pigs:PigMotion[];
  constructor(count:number) {
    this.pigs=Array.from({length:count},(_,id)=>({distance:-.35-id*.66,velocity:0,splashAge:1,arrived:false,bump:0}));
  }
  push(id:number) {
    const pig=this.pigs[id];
    if(pig.arrived) {
      pig.distance=Math.min(-.35,...this.pigs.filter(p=>p!==pig).map(p=>p.distance-PIG_SPACING));
      pig.velocity=0; pig.arrived=false;
    }
    pig.velocity=Math.min(3.7,pig.velocity+1.05);
    pig.bump=.45;
  }
  step(delta:number) {
    const dt=Math.min(delta,.05),steps=Math.ceil(dt*120);
    for(let i=0;i<steps;i++) {
      for(const pig of this.pigs) {
        Object.assign(pig,advancePig(pig.distance,pig.velocity,dt/steps));
        pig.bump*=Math.exp(-8*dt/steps);
      }
      resolvePigContacts(this.pigs);
    }
    const arrivals:number[]=[];
    this.pigs.forEach((pig,id)=>{
      if(pig.distance>=TRACK_LENGTH+.05 && !pig.arrived) {pig.arrived=true;pig.splashAge=0;arrivals.push(id);}
      pig.splashAge+=dt;
      if(pig.distance>=FINISH) pig.velocity=0;
    });
    return arrivals;
  }
}
