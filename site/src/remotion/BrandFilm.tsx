import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { brand, ARC } from "../brand";
import { ParticleSphere } from "./elements/ParticleSphere";

const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 90% at 70% 18%, ${brand.inkSoft} 0%, ${brand.ink} 55%, #060a08 100%)`,
    }}
  >
    {/* faint vignette */}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(80% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  </AbsoluteFill>
);

/** A word that rises and fades up, letter group at a time. */
const RiseText: React.FC<{
  children: React.ReactNode;
  delay: number;
  style?: React.CSSProperties;
}> = ({ children, delay, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const BrandFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ---- Sphere choreography ----
  const assemble = spring({
    frame,
    fps,
    config: { damping: 200, mass: 1.4 },
    durationInFrames: 95,
  });
  const rotation = frame * 0.0062;

  // sphere recedes + drifts right as the wordmark takes the stage
  const sphereScale = interpolate(frame, [70, 180], [1, 0.74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sphereX = interpolate(frame, [70, 200], [0, width * 0.235], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sphereY = interpolate(frame, [70, 200], [0, -height * 0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sphereSize = 760;

  // gold period spring pop
  const dotSpring = spring({
    frame: frame - 108,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 180 },
  });

  // kicker fades out as wordmark arrives
  const kickerOpacity = interpolate(frame, [22, 55, 96, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: brand.sans }}>
      <Background />

      {/* Sphere */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${sphereX}px, ${sphereY}px) scale(${sphereScale})`,
        }}
      >
        <ParticleSphere
          size={sphereSize}
          radius={300}
          rotation={rotation}
          assemble={assemble}
          count={520}
        />
      </AbsoluteFill>

      {/* Kicker */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            top: height * 0.3,
            opacity: kickerOpacity,
            fontFamily: brand.mono,
            fontSize: 19,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: brand.gold,
            fontWeight: 600,
          }}
        >
          Strategic Simulation Platform
        </div>
      </AbsoluteFill>

      {/* Wordmark + tagline block, left-weighted once the sphere drifts right */}
      <AbsoluteFill
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: width * 0.1,
        }}
      >
        <Sequence from={92} layout="none">
          <RiseText delay={0}>
            <div
              style={{
                fontFamily: brand.serif,
                fontWeight: 600,
                fontSize: 168,
                lineHeight: 1,
                color: brand.text,
                letterSpacing: "-0.03em",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              Plenum
              <span
                style={{
                  color: brand.gold,
                  display: "inline-block",
                  transform: `scale(${interpolate(dotSpring, [0, 1], [0, 1])})`,
                  transformOrigin: "bottom center",
                  marginLeft: 4,
                }}
              >
                .
              </span>
            </div>
          </RiseText>

          <Sequence from={70} layout="none">
            <RiseText
              delay={0}
              style={{
                maxWidth: 760,
                marginTop: 26,
                fontFamily: brand.serif,
                fontStyle: "italic",
                fontSize: 33,
                lineHeight: 1.5,
                color: brand.textSoft,
              }}
            >
              Where the full body convenes — a chamber for policy simulation,
              structured deliberation, and consequential decision under pressure.
            </RiseText>
          </Sequence>

          {/* The operating arc */}
          <Sequence from={150} layout="none">
            <div
              style={{
                marginTop: 52,
                display: "flex",
                alignItems: "center",
                gap: 26,
              }}
            >
              {ARC.map((word, i) => {
                const wf = frame - 92 - 150 - i * 16;
                const ws = spring({ frame: wf, fps, config: { damping: 200 } });
                return (
                  <React.Fragment key={word}>
                    {i > 0 && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          background: brand.gold,
                          opacity: interpolate(ws, [0, 1], [0, 0.9]),
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily: brand.mono,
                        fontSize: 22,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: brand.text,
                        fontWeight: 600,
                        opacity: interpolate(ws, [0, 1], [0, 1]),
                        transform: `translateY(${interpolate(ws, [0, 1], [12, 0])}px)`,
                      }}
                    >
                      {word}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </Sequence>
        </Sequence>
      </AbsoluteFill>

      {/* Attribution */}
      <Sequence from={300} layout="none">
        <RiseText
          delay={0}
          style={{
            position: "absolute",
            bottom: 56,
            left: width * 0.1,
            fontFamily: brand.mono,
            fontSize: 15,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: brand.textMuted,
          }}
        >
          Fielded by Statecraft Simulations Group · AidData
        </RiseText>
      </Sequence>
    </AbsoluteFill>
  );
};
