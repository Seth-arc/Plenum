import React from "react";

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconUsers: React.FC = () => (
  <svg {...base}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconInject: React.FC = () => (
  <svg {...base}>
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
  </svg>
);

export const IconDecision: React.FC = () => (
  <svg {...base}>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export const IconReview: React.FC = () => (
  <svg {...base}>
    <path d="M3 3v18h18" />
    <path d="M7 14l3-4 3 3 4-6" />
  </svg>
);

export const IconShield: React.FC = () => (
  <svg {...base}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const IconClock: React.FC = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconLayers: React.FC = () => (
  <svg {...base}>
    <path d="M12 2 2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

export const IconBroadcast: React.FC = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="2" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14" />
  </svg>
);

export const IconArrow: React.FC = () => (
  <svg {...base} width={18} height={18}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
