/**
 * Plenum brand tokens — single source of truth shared by the marketing site
 * and the Remotion brand film, so the video and the page never drift apart.
 *
 * Palette derives from the William & Mary identity used in the simulation
 * runtime: W&M Green (#115740) and W&M Gold (#B9975B), set against a deep,
 * near-black "chamber" ground.
 */
export const brand = {
  // Chamber grounds
  ink: "#0a0f0d", // deepest background
  inkRaised: "#0e1512", // raised panels
  inkSoft: "#121b17",

  // William & Mary green
  green: "#115740",
  greenDeep: "#0b3b2b",
  greenMuted: "#1a7558",
  greenBright: "#3f8466",

  // William & Mary gold (the accent + particle color)
  gold: "#b9975b",
  goldLight: "#d4b77d",
  goldGlow: "rgba(185, 151, 91, 0.55)",

  // Text
  text: "#f4f3ef",
  textSoft: "#c9ccc6",
  textMuted: "#8b938c",
  textFaint: "#5d645e",

  // Lines
  hair: "rgba(244, 243, 239, 0.10)",
  hairStrong: "rgba(244, 243, 239, 0.18)",

  // Type
  serif: "'Source Serif 4', ui-serif, Georgia, serif",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
} as const;

/** The four-beat operating arc that anchors the whole brand. */
export const ARC = ["Convene", "Deliberate", "Decide", "Debrief"] as const;

export const VIDEO = {
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 30 * 14, // 14s brand film
} as const;
