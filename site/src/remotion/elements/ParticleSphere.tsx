import React, { useMemo } from "react";
import { interpolate } from "remotion";
import { brand } from "../../brand";

/**
 * Deterministic gold particle sphere — the core Plenum motif ("the full body
 * convenes"). Points are placed on a Fibonacci sphere and rotated around the
 * Y axis. An `assemble` value in [0,1] interpolates each point from a stable
 * scattered position into its place on the sphere.
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

type Pt = {
  // sphere target (unit)
  sx: number;
  sy: number;
  sz: number;
  // scattered origin (unit cube-ish)
  ox: number;
  oy: number;
  oz: number;
  accent: boolean; // a minority glow in brighter gold
};

function buildPoints(count: number): Pt[] {
  const rnd = mulberry32(20260626);
  const pts: Pt[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({
      sx: Math.cos(theta) * r,
      sy: y,
      sz: Math.sin(theta) * r,
      ox: (rnd() - 0.5) * 3.4,
      oy: (rnd() - 0.5) * 3.4,
      oz: (rnd() - 0.5) * 3.4,
      accent: rnd() < 0.14,
    });
  }
  return pts;
}

export const ParticleSphere: React.FC<{
  size: number;
  radius: number;
  rotation: number; // radians around Y
  assemble: number; // 0..1
  opacity?: number;
  count?: number;
}> = ({ size, radius, rotation, assemble, opacity = 1, count = 460 }) => {
  const points = useMemo(() => buildPoints(count), [count]);
  const cx = size / 2;
  const cy = size / 2;
  const cosR = Math.cos(rotation);
  const sinR = Math.sin(rotation);

  const eased = interpolate(assemble, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rendered = points.map((p, i) => {
    // lerp scattered -> sphere
    const ux = p.ox + (p.sx - p.ox) * eased;
    const uy = p.oy + (p.sy - p.oy) * eased;
    const uz = p.oz + (p.sz - p.oz) * eased;

    // rotate around Y
    const rx = ux * cosR - uz * sinR;
    const rz = ux * sinR + uz * cosR;

    // simple perspective
    const persp = 1 / (1.9 - rz * 0.55);
    const x = cx + rx * radius * persp;
    const y = cy + uy * radius * persp;

    const depth = (rz + 1) / 2; // 0 back .. 1 front
    const r = (p.accent ? 2.2 : 1.5) * (0.55 + depth * 0.85);
    const o =
      opacity *
      interpolate(depth, [0, 1], [0.18, 1], { extrapolateRight: "clamp" }) *
      interpolate(eased, [0, 0.4], [0.2, 1], { extrapolateRight: "clamp" });

    const fill = p.accent ? brand.goldLight : brand.gold;
    return { x, y, r, o, fill, depth, key: i };
  });

  // paint back-to-front for believable depth
  rendered.sort((a, b) => a.depth - b.depth);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="sphereHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={brand.gold} stopOpacity="0.16" />
          <stop offset="55%" stopColor={brand.green} stopOpacity="0.06" />
          <stop offset="100%" stopColor={brand.green} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={radius * 1.25}
        fill="url(#sphereHalo)"
        opacity={eased}
      />
      {rendered.map((d) => (
        <circle key={d.key} cx={d.x} cy={d.y} r={d.r} fill={d.fill} opacity={d.o} />
      ))}
    </svg>
  );
};
