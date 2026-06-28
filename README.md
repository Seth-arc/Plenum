# Plenum

*A digital operating environment for statecraft simulation.*

![Plenum simulation interface](screenshot.PNG)

---

## Problem

Complex simulations are difficult to coordinate, document, assess, and repeat.

## Solution

Plenum structures the simulation environment: roles, teams, scenario materials, injects, decision submissions, admin control, and records for after-action review.

## Value

It turns a live simulation from a one-off event into a repeatable learning and research system.

## Use Cases

Statecraft games, crisis simulations, interagency exercises, classroom wargames, policy training, PME-adjacent learning environments.

---

## Future Development

Decision analytics, AAR dashboards, role-based intelligence feeds, automated inject scheduling, participant performance mapping, scenario libraries.

## Runtime Direction

`index.html` is now the Plenum runtime entry. It resolves an active Scenario Pack through `src/core/runtimePack.js`, renders the landing surface from that pack, and falls back to the built-in Fractured Order pack when no session or scenario library is available.
