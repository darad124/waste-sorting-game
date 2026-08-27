// Fire-and-forget particle bursts, consumed by <ParticleEmitter />.
// Lives outside the component file so fast refresh keeps working.
export const triggerConfetti = (x: number, y: number, color: string) => {
  const event = new CustomEvent("spawn-particles", {
    detail: { x, y, color },
  });
  window.dispatchEvent(event);
};
