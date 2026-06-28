import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

function readText(relativePath) {
    return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

function extractTitle(html) {
    return html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '';
}

function extractMetaDescription(html) {
    return html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] ?? '';
}

describe('public naming', () => {
    it('brands the landing entry points as Fractured Order on Plenum for SSG', () => {
        const landingHtml = readText('../../index.html');
        const emDash = String.fromCharCode(0x2014);

        expect(extractTitle(landingHtml)).toBe(`Fractured Order ${emDash} on Plenum, for SSG`);
        expect(extractMetaDescription(landingHtml)).toBe(
            'Fractured Order, a seminar simulation served on the Plenum platform for SSG.'
        );
        // The poster lockup names the game and its type.
        expect(landingHtml).toContain('class="atm-title-name">Fractured Order<');
        expect(landingHtml).toContain('class="atm-title-kind">An Economic Statecraft Seminar Game<');
        // The landing itself stays branded as Fractured Order on Plenum for SSG.
        expect(landingHtml).toContain('alt="Fractured Order - A Seminar Simulation"');
        expect(landingHtml).toContain('on Plenum');
        expect(landingHtml).toContain('for SSG');
        // The public entry branding no longer surfaces the internal product name
        expect(landingHtml).not.toContain('Statecraft Sim');
        expect(landingHtml).not.toContain('SSG Platform');
        expect(landingHtml).not.toContain('Statecraft Simulations Group');
        expect(landingHtml).not.toContain('ESG Economic Statecraft Simulation Platform');
    });

    it('keeps Plenum as the platform product name', () => {
        const readme = readText('../../README.md');
        const packageJson = JSON.parse(readText('../../package.json'));

        expect(readme).toContain('# Plenum');
        expect(readme).toContain('A digital operating environment for statecraft simulation.');
        expect(readme).toContain('`index.html` is now the Plenum runtime entry.');
        expect(packageJson.description).toBe('Plenum seminar simulation platform');
    });

    it('keeps operator and participant surfaces aligned on Plenum', () => {
        const expectations = [
            {
                path: '../../master.html',
                title: 'Plenum | Game Master Operator Console',
                description: 'Plenum Game Master operator console.'
            },
            {
                path: '../../whitecell.html',
                title: 'Plenum | White Cell Operator Interface',
                description: 'Plenum White Cell operator interface.'
            },
            {
                path: '../../teams/blue/facilitator.html',
                title: 'Plenum | Blue Team Facilitator',
                description: 'Plenum Blue Team facilitator interface.'
            },
            {
                path: '../../teams/red/facilitator.html',
                title: 'Plenum | Red Team Facilitator',
                description: 'Plenum Red Team facilitator interface.'
            },
            {
                path: '../../teams/green/facilitator.html',
                title: 'Plenum | Green Team Facilitator',
                description: 'Plenum Green Team facilitator interface.'
            },
            {
                path: '../../teams/blue/notetaker.html',
                title: 'Plenum | Blue Team Notetaker',
                description: 'Plenum Blue Team notetaker interface.'
            },
            {
                path: '../../teams/blue/scribe.html',
                title: 'Plenum | Blue Team Scribe',
                description: 'Plenum Blue Team scribe support deck.'
            },
            {
                path: '../../teams/red/notetaker.html',
                title: 'Plenum | Red Team Notetaker',
                description: 'Plenum Red Team notetaker interface.'
            },
            {
                path: '../../teams/red/scribe.html',
                title: 'Plenum | Red Team Scribe',
                description: 'Plenum Red Team scribe support deck.'
            },
            {
                path: '../../teams/green/notetaker.html',
                title: 'Plenum | Green Team Notetaker',
                description: 'Plenum Green Team notetaker interface.'
            },
            {
                path: '../../teams/green/scribe.html',
                title: 'Plenum | Green Team Scribe',
                description: 'Plenum Green Team scribe support deck.'
            }
        ];

        // The visible header <h1> was removed from the interfaces; the internal
        // Plenum brand still lives in each document <title> and meta.
        for (const surface of expectations) {
            const html = readText(surface.path);

            expect(extractTitle(html)).toBe(surface.title);
            expect(extractMetaDescription(html)).toBe(surface.description);
            expect(html).not.toContain('ESG Simulation');
        }
    });
});
