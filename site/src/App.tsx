import React from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./sections/Hero";
import { useReveal } from "./lib/useReveal";
import { asset } from "./lib/asset";
import {
  IconUsers,
  IconInject,
  IconDecision,
  IconReview,
  IconShield,
  IconClock,
  IconLayers,
  IconBroadcast,
  IconArrow,
} from "./components/icons";

/* ----------------------------------------------------------------- */
/* Affiliation strip                                                  */
/* ----------------------------------------------------------------- */
const Affiliations: React.FC = () => (
  <section className="affil">
    <div className="container affil-inner reveal">
      <span className="affil-label">Fielded by</span>
      <div className="affil-logos">
        <img src={asset("brand/ssg-crest-gold.png")} alt="Statecraft Simulations Group" />
        <img src={asset("brand/aiddata-white.png")} alt="AidData" />
      </div>
    </div>
  </section>
);

/* ----------------------------------------------------------------- */
/* Problem → Solution → Value                                         */
/* ----------------------------------------------------------------- */
const Premise: React.FC = () => (
  <section className="section premise" id="premise">
    <div className="container">
      <div className="premise-head reveal">
        <p className="kicker">The premise</p>
        <h2 className="h-section">
          A live simulation is hard to coordinate, document, assess, and repeat.
          Plenum makes it a system.
        </h2>
      </div>
      <div className="premise-grid">
        {[
          {
            k: "Problem",
            t: "Complexity outruns the room",
            d: "Roles, materials, injects, and decisions live across decks, chats, and spreadsheets. The signal of the exercise is lost the moment it ends.",
          },
          {
            k: "Solution",
            t: "One operating environment",
            d: "Plenum structures the whole environment — roles, teams, scenario packs, injects, decision submissions, white-cell adjudication, and the record.",
          },
          {
            k: "Value",
            t: "A repeatable learning system",
            d: "A one-off event becomes a repeatable learning and research instrument: run it again, compare cohorts, and study what decisions actually did.",
          },
        ].map((c, i) => (
          <article
            className="premise-card reveal"
            key={c.k}
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <span className="premise-card-k">{c.k}</span>
            <h3>{c.t}</h3>
            <p className="muted">{c.d}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ----------------------------------------------------------------- */
/* How it works — the four-beat arc                                   */
/* ----------------------------------------------------------------- */
const steps = [
  {
    n: "01",
    label: "Convene",
    icon: <IconUsers />,
    t: "Stand up the chamber",
    d: "Load a scenario pack, open a session, and seat participants by team and role with a session code. Facilitators, scribes, and notetakers join in seconds.",
  },
  {
    n: "02",
    label: "Deliberate",
    icon: <IconInject />,
    t: "Run the play",
    d: "Push injects on a phase clock, brief teams with role-based materials, and let delegations work the problem while the white cell watches the board.",
  },
  {
    n: "03",
    label: "Decide",
    icon: <IconDecision />,
    t: "Commit and adjudicate",
    d: "Teams submit actions, proposals, and RFIs. The white cell adjudicates outcomes and answers requests — every decision captured with its context.",
  },
  {
    n: "04",
    label: "Debrief",
    icon: <IconReview />,
    t: "Learn from the record",
    d: "Close the session into a complete after-action record. Export the timeline, decisions, and notes for review, assessment, and research.",
  },
];

const HowItWorks: React.FC = () => (
  <section className="section how" id="how">
    <div className="container">
      <div className="sec-head reveal">
        <p className="kicker">How a session runs</p>
        <h2 className="h-section">From an empty room to an after-action record.</h2>
        <p className="lead">
          Plenum follows the rhythm of a real exercise — four beats, one
          continuous record.
        </p>
      </div>

      <ol className="how-steps">
        {steps.map((s, i) => (
          <li
            className="how-step reveal"
            key={s.n}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="how-step-top">
              <span className="how-step-icon">{s.icon}</span>
              <span className="how-step-n">{s.n}</span>
            </div>
            <span className="how-step-label">{s.label}</span>
            <h3>{s.t}</h3>
            <p className="muted">{s.d}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

/* ----------------------------------------------------------------- */
/* Platform capabilities                                              */
/* ----------------------------------------------------------------- */
const capabilities = [
  {
    icon: <IconLayers />,
    t: "Scenario packs",
    d: "Self-contained scenarios resolve at runtime — landing surface, roles, materials, and action options all travel in one pack.",
  },
  {
    icon: <IconUsers />,
    t: "Roles & teams",
    d: "Blue, Red, and Green delegations with facilitator, scribe, and notetaker seats. Seat contracts keep every chair accounted for.",
  },
  {
    icon: <IconShield />,
    t: "White-cell control",
    d: "A dedicated control surface to adjudicate actions, answer RFIs, and steer the game — lead and support operators in sync.",
  },
  {
    icon: <IconClock />,
    t: "Phase & inject timing",
    d: "Move and phase controls with a timer keep the whole room on the same clock. Injects land when the scenario calls for them.",
  },
  {
    icon: <IconBroadcast />,
    t: "Targeted communications",
    d: "Send role-aware communications and RFIs to the right teams, with delivery scoped to who should see what, when.",
  },
  {
    icon: <IconDecision />,
    t: "Decision capture",
    d: "Actions, proposals, and responses are captured with their full context — finalized, locked, and timestamped for the record.",
  },
];

const Platform: React.FC = () => (
  <section className="section platform" id="platform">
    <div className="container">
      <div className="sec-head reveal">
        <p className="kicker">The platform</p>
        <h2 className="h-section">Everything an exercise needs, in one chamber.</h2>
      </div>
      <div className="cap-grid">
        {capabilities.map((c, i) => (
          <article
            className="cap-card reveal"
            key={c.t}
            style={{ transitionDelay: `${(i % 3) * 80}ms` }}
          >
            <span className="cap-icon">{c.icon}</span>
            <h3>{c.t}</h3>
            <p className="muted">{c.d}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ----------------------------------------------------------------- */
/* Roles split                                                        */
/* ----------------------------------------------------------------- */
const roles = [
  {
    name: "Facilitator",
    seat: "1 seat per team",
    d: "Drives the delegation surface — submits actions and RFIs on behalf of the team.",
  },
  {
    name: "Scribe",
    seat: "1 seat per team",
    d: "Runs the support slide deck and keeps the team’s working materials in view.",
  },
  {
    name: "Notetaker",
    seat: "2 seats per team",
    d: "Captures notes, quotes, alliances, and the key moments that make the debrief.",
  },
  {
    name: "Game Master",
    seat: "Operator",
    d: "Creates and monitors sessions, controls the game, and exports the record.",
  },
  {
    name: "White Cell",
    seat: "Operator",
    d: "Adjudicates actions and answers RFIs — lead and support working the board.",
  },
];

const Roles: React.FC = () => (
  <section className="section roles" id="roles">
    <div className="container roles-grid">
      <div className="roles-intro reveal">
        <p className="kicker">A seat for every job</p>
        <h2 className="h-section">
          Roles that mirror how a real cell actually works.
        </h2>
        <p className="lead">
          Plenum seats participants by team and responsibility, so the exercise
          runs like the room it is meant to simulate — not a free-for-all.
        </p>
      </div>
      <ul className="roles-list">
        {roles.map((r, i) => (
          <li
            className="role-row reveal"
            key={r.name}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="role-row-main">
              <h3>{r.name}</h3>
              <span className="role-seat">{r.seat}</span>
            </div>
            <p className="muted">{r.d}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ----------------------------------------------------------------- */
/* Use cases                                                          */
/* ----------------------------------------------------------------- */
const useCases = [
  "Statecraft games",
  "Crisis simulations",
  "Interagency exercises",
  "Classroom wargames",
  "Policy training",
  "PME-adjacent learning",
];

const UseCases: React.FC = () => (
  <section className="section usecases" id="use-cases">
    <div className="container">
      <div className="sec-head reveal">
        <p className="kicker">Where it’s used</p>
        <h2 className="h-section">One environment, many tables.</h2>
        <p className="lead">
          Plenum is scenario-agnostic. Field it for a seminar game one week and a
          crisis exercise the next — same chamber, different pack.
        </p>
      </div>
      <div className="uc-grid">
        {useCases.map((u, i) => (
          <div
            className="uc-chip reveal"
            key={u}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <span className="uc-dot" />
            {u}
          </div>
        ))}
      </div>

      <div className="uc-feature reveal">
        <img
          src={asset("brand/fractured-order-poster.png")}
          alt="Fractured Order — an economic statecraft seminar game"
        />
        <div className="uc-feature-body">
          <img
            className="uc-feature-mark"
            src={asset("brand/ssg-crest-gold.png")}
            alt="Statecraft Simulations Group"
          />
          <p className="kicker">Fielded scenario</p>
          <h3>Fractured Order</h3>
          <p className="muted">
            A William &amp; Mary Statecraft Simulations Group simulation,
            delivered through Plenum. Four delegations negotiate, coerce, and
            cooperate under escalating pressure — with every move on the record.
          </p>
          <div className="uc-feature-meta">
            <span>4 delegations</span>
            <span>Multi-phase</span>
            <span>White-cell adjudicated</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ----------------------------------------------------------------- */
/* Research / after-action                                            */
/* ----------------------------------------------------------------- */
const Research: React.FC = () => (
  <section className="section research" id="research">
    <div className="container research-grid">
      <div className="research-body reveal">
        <p className="kicker">After-action & research</p>
        <h2 className="h-section">
          The exercise doesn’t end when the room clears.
        </h2>
        <p className="lead">
          Every session closes into a structured record — the timeline, the
          decisions, the notes, the communications. It can be exported for
          assessment, or kept as a longitudinal record of how a program’s
          decisions change over time.
        </p>
      </div>

      <div className="research-side reveal">
        <ul className="research-list">
          {[
            "Full decision & inject timeline, timestamped",
            "CSV / JSON exports for analysis",
            "Captured notes, quotes, and alliance tracking",
            "Repeatable runs for cohort comparison",
          ].map((r) => (
            <li key={r}>
              <span className="check" /> {r}
            </li>
          ))}
        </ul>
        <p className="research-roadmap muted">
          In development: decision analytics, AAR dashboards, role-based
          intelligence feeds, automated inject scheduling, and scenario
          libraries.
        </p>
      </div>
    </div>
  </section>
);

/* ----------------------------------------------------------------- */
/* Closing call-to-action                                             */
/* ----------------------------------------------------------------- */
const CTA: React.FC = () => (
  <section className="section cta" id="get-started">
    <div className="container cta-inner reveal">
      <p className="kicker">Open the chamber</p>
      <h2 className="h-display">
        Run your next exercise as a system, not a one-off.
      </h2>
      <p className="lead">
        Plenum is built and fielded by the Statecraft Simulations Group at
        William &amp; Mary. Explore the code, field a scenario, or start a
        conversation about bringing it to your program.
      </p>
      <div className="cta-actions">
        <a
          className="btn btn-primary"
          href="https://github.com/Seth-arc/Plenum"
          target="_blank"
          rel="noreferrer"
        >
          Explore the project
          <IconArrow />
        </a>
      </div>
    </div>
  </section>
);

/* ----------------------------------------------------------------- */
/* Footer                                                             */
/* ----------------------------------------------------------------- */
const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <span className="nav-word">Plenum</span>
        <span className="nav-dot">.</span>
        <p className="muted">
          A digital operating environment for statecraft simulation.
        </p>
      </div>
      <div className="footer-cols">
        <div>
          <h4>Platform</h4>
          <a href="#how">How it works</a>
          <a href="#platform">Capabilities</a>
          <a href="#roles">Roles</a>
          <a href="#research">Research</a>
        </div>
        <div>
          <h4>Scenarios</h4>
          <a href="#use-cases">Use cases</a>
          <a href="#use-cases">Fractured Order</a>
        </div>
        <div>
          <h4>Project</h4>
          <a
            href="https://github.com/Seth-arc/Plenum"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a href="mailto:ssg@wm.edu">ssg@wm.edu</a>
        </div>
      </div>
    </div>
    <div className="container footer-base">
      <span className="muted">© {new Date().getFullYear()} Plenum</span>
      <span className="muted">Convene · Deliberate · Decide · Debrief</span>
    </div>
  </footer>
);

/* ----------------------------------------------------------------- */
/* App                                                                */
/* ----------------------------------------------------------------- */
const App: React.FC = () => {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Affiliations />
        <Premise />
        <HowItWorks />
        <Platform />
        <Roles />
        <UseCases />
        <Research />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default App;
