import React, { useEffect, useRef } from "react";

/**
 * Live, self-contained canvas version of the Plenum particle sphere used as the
 * ambient hero background. Pure requestAnimationFrame — independent of Remotion,
 * but visually matched so the page and the brand film feel like one system.
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
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        accent: rnd() < 0.14,
      };
    });

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

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
      const rot = t * 0.00014;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.42;

      ctx.clearRect(0, 0, w, h);

      const frame = pts
        .map((p) => {
          const rx = p.x * cos - p.z * sin;
          const rz = p.x * sin + p.z * cos;
          const persp = 1 / (1.9 - rz * 0.55);
          return {
            sx: cx + rx * radius * persp,
            sy: cy + p.y * radius * persp,
            depth: (rz + 1) / 2,
            accent: p.accent,
          };
        })
        .sort((a, b) => a.depth - b.depth);

      for (const d of frame) {
        const r = (d.accent ? 2.1 : 1.4) * (0.55 + d.depth * 0.85);
        const o = 0.18 + d.depth * 0.82;
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
