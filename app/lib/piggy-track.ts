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
