import React, { useEffect, useRef } from "react";

/**
 * Live, self-contained canvas version of the Plenum particle sphere used as the
 * ambient hero background. Pure requestAnimationFrame — independent of Remotion,
 * but visually matched so the page and the brand film feel like one system.
 *
 * On load the particles assemble from a scattered cloud into the sphere, then
 * settle into a slow continuous rotation with a gentle "breathing" drift.
 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const ASSEMBLE_MS = 1700;

export const HeroSphere: React.FC<{ className?: string }> = ({ className }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const COUNT = 540;
    const rnd = mulberry32(20260626);
    const pts = Array.from({ length: COUNT }, (_, i) => {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      return {
        // sphere target
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        // scattered origin (stable per particle)
        ox: (rnd() - 0.5) * 3.6,
        oy: (rnd() - 0.5) * 3.6,
        oz: (rnd() - 0.5) * 3.6,
        accent: rnd() < 0.14,
      };
    });

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let start = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const goldRGB = "185,151,91";
    const goldLightRGB = "212,183,125";

    const draw = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      const assemble = reduce
        ? 1
        : easeOutCubic(Math.min(elapsed / ASSEMBLE_MS, 1));

      // rotation eases in as the cloud forms, then runs steadily
      const rot = t * 0.00014 * assemble;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const cx = w * 0.5;
      const cy = h * 0.5;
      // gentle breathing once assembled
      const breathe = 1 + Math.sin(t * 0.0006) * 0.012 * assemble;
      const radius = Math.min(w, h) * 0.42 * breathe;

      ctx.clearRect(0, 0, w, h);

      const frame = pts
        .map((p) => {
          // lerp scattered -> sphere
          const ux = p.ox + (p.x - p.ox) * assemble;
          const uy = p.oy + (p.y - p.oy) * assemble;
          const uz = p.oz + (p.z - p.oz) * assemble;

          const rx = ux * cos - uz * sin;
          const rz = ux * sin + uz * cos;
          const persp = 1 / (1.9 - rz * 0.55);
          return {
            sx: cx + rx * radius * persp,
            sy: cy + uy * radius * persp,
            depth: (rz + 1) / 2,
            accent: p.accent,
          };
        })
        .sort((a, b) => a.depth - b.depth);

      const fade = reduce ? 1 : Math.min(elapsed / 600, 1);
      for (const d of frame) {
        const r = (d.accent ? 2.1 : 1.4) * (0.55 + d.depth * 0.85);
        const o = (0.18 + d.depth * 0.82) * fade;
        ctx.beginPath();
        ctx.arc(d.sx, d.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.accent ? goldLightRGB : goldRGB},${o})`;
        ctx.fill();
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    if (reduce) draw(0);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
};
