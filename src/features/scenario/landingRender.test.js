import { describe, expect, it } from 'vitest';

import { getDefaultPack } from '../../core/runtimePack.js';
import { normalizePack } from './scenarioPack.js';
import { renderLanding } from './landingRender.js';

function createNode(tagName, { id = '', className = '', textContent = '', attributes = {} } = {}) {
    return {
        tagName,
        id,
        className,
        textContent,
        attributes: { ...attributes },
        children: [],
        dataset: {},
        innerHTML: '',
        type: '',
        value: '',
        setAttribute(name, value) {
            this.attributes[name] = String(value);
        },
        getAttribute(name) {
            return this.attributes[name] ?? null;
        },
        appendChild(child) {
            this.children.push(child);
            return child;
        },
        insertBefore(child, reference) {
            const index = this.children.indexOf(reference);
            if (index === -1) {
                this.children.unshift(child);
            } else {
                this.children.splice(index, 0, child);
            }
            return child;
        },
        replaceChildren(...children) {
            this.children = children;
        }
    };
}

function matches(node, selector) {
    if (selector === 'title') {
        return node.tagName === 'title';
    }
    if (selector === '.lf-chips[aria-label="Team selection"]') {
        return node.className.split(' ').includes('lf-chips')
            && node.attributes['aria-label'] === 'Team selection';
    }
    if (selector === '.lf-chips[aria-label="Role selection"]') {
        return node.className.split(' ').includes('lf-chips')
            && node.attributes['aria-label'] === 'Role selection';
    }
    if (selector.startsWith('.')) {
        return node.className.split(' ').includes(selector.slice(1));
    }
    return false;
}

function findNode(nodes, selector) {
    for (const node of nodes) {
        if (matches(node, selector)) {
            return node;
        }
        const childMatch = findNode(node.children || [], selector);
        if (childMatch) {
            return childMatch;
        }
    }
    return null;
}

function createDocument() {
    const title = createNode('title', { textContent: 'Fractured Order' });
    const name = createNode('span', { className: 'atm-title-name', textContent: 'Fractured Order' });
    const kind = createNode('span', { className: 'atm-title-kind', textContent: 'An Economic Statecraft Seminar Game' });
    const poster = createNode('img', { className: 'atm-poster', attributes: { src: './old.png', alt: 'old' } });
    const mark = createNode('img', { className: 'atm-mark', attributes: { src: '', alt: '' } });
    const teamChips = createNode('div', { className: 'lf-chips', attributes: { 'aria-label': 'Team selection' } });
    const roleChips = createNode('div', { className: 'lf-chips', attributes: { 'aria-label': 'Role selection' } });
    const selectedTeam = createNode('input', { id: 'selectedTeam' });
    selectedTeam.value = 'blue';
    const footer = createNode('footer', { className: 'fp-foot' });
    const powered = createNode('span', { className: 'fp-foot-powered', textContent: 'Delivered on Plenum.' });
    footer.children.push(powered);

    const nodes = [title, name, kind, poster, mark, teamChips, roleChips, selectedTeam, footer];

    return {
        nodes,
        createElement: (tagName) => createNode(tagName),
        querySelector: (selector) => findNode(nodes, selector),
        getElementById: (id) => nodes.find((node) => node.id === id) || null
    };
}

const CUSTOM_PACK = normalizePack({
    identity: {
        title: 'Sahel Arena',
        domain: 'A Crisis Response Wargame',
        poster: { fileName: './sahel.png', altText: 'Sahel Arena poster' },
        sponsor: { name: 'State Department / GEC' },
        deliverer: { name: 'AidData', logo: { fileName: 'aiddata.png', altText: 'AidData' } }
    },
    teams: [
        { id: 'blue', label: 'Coalition', shortLabel: 'Coalition' },
        { id: 'red', label: 'Insurgent Bloc', shortLabel: 'Insurgents' }
    ],
    roles: {
        facilitator: 1,
        scribe: 1,
        notetaker: 0,
        whiteCellLead: 1,
        whiteCellSupport: 1,
        gameMaster: 1
    },
    contracts: {
        blue: { summary: 'Coalition actions', fields: [] },
        red: { summary: 'Bloc responses', fields: [] }
    },
    publish: { routes: ['/master.html'] }
});

describe('landingRender', () => {
    it('renders scenario identity and media from a pack', () => {
        const documentRef = createDocument();

        renderLanding(CUSTOM_PACK, { documentRef });

        expect(documentRef.querySelector('title').textContent).toBe('Sahel Arena');
        expect(documentRef.querySelector('.atm-title-name').textContent).toBe('Sahel Arena');
        expect(documentRef.querySelector('.atm-title-kind').textContent).toBe('A Crisis Response Wargame');
        expect(documentRef.querySelector('.atm-poster').getAttribute('src')).toBe('./sahel.png');
        expect(documentRef.querySelector('.atm-mark').getAttribute('src')).toBe('aiddata.png');
    });

    it('renders team and role chips from pack data', () => {
        const documentRef = createDocument();

        renderLanding(CUSTOM_PACK, { documentRef });

        const teamChips = documentRef.querySelector('.lf-chips[aria-label="Team selection"]').children;
        const roleChips = documentRef.querySelector('.lf-chips[aria-label="Role selection"]').children;

        expect(teamChips.map((chip) => chip.dataset.team)).toEqual(['blue', 'red']);
        expect(teamChips.map((chip) => chip.textContent)).toEqual(['Coalition', 'Insurgents']);
        expect(roleChips.map((chip) => chip.dataset.roleSurface)).toEqual(['facilitator', 'scribe']);
        expect(documentRef.getElementById('selectedTeam').value).toBe('blue');
    });

    it('preserves Fractured Order as the default landing pack', () => {
        const documentRef = createDocument();

        renderLanding(getDefaultPack(), { documentRef });

        expect(documentRef.querySelector('.atm-title-name').textContent).toBe('Fractured Order');
        expect(documentRef.querySelector('.fp-foot').children[0].textContent).toContain('Hosted by SSG');
        expect(documentRef.querySelector('.fp-foot').children[0].textContent).not.toContain('Statecraft Simulation Group');
        expect(documentRef.querySelector('.lf-chips[aria-label="Team selection"]').children
            .map((chip) => chip.dataset.team)).toEqual(['blue', 'red', 'green']);
    });
});
