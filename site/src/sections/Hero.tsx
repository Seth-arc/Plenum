import React from "react";
import { ARC } from "../brand";
import { HeroSphere } from "../components/HeroSphere";

export const Hero: React.FC = () => {
  return (
    <section className="hero" id="top">
      <HeroSphere className="hero-sphere" />
      <div className="hero-grain" aria-hidden="true" />

      <div className="container hero-inner">
        <p className="kicker reveal in">Strategic Simulation Platform</p>

        <h1 className="hero-title reveal in">
          Plenum<span className="hero-dot">.</span>
        </h1>

        <p className="hero-tagline reveal in">
          Where the full body convenes — a chamber for policy simulation,
          structured deliberation, and consequential decision under pressure.
        </p>

        <div className="hero-arc reveal in" aria-hidden="true">
          {ARC.map((w, i) => (
            <React.Fragment key={w}>
              {i > 0 && <span className="hero-arc-dot" />}
              <span>{w}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <a className="hero-scroll" href="#how" aria-label="Scroll to learn more">
        <span />
      </a>
    </section>
  );
};
