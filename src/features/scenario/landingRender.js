const ROLE_SURFACE_META = Object.freeze({
    facilitator: { label: 'Facilitator', seatNoun: 'seat', verb: 'Submits actions and RFIs' },
    scribe: { label: 'Scribe', seatNoun: 'seat', verb: 'Opens the support slide deck' },
    notetaker: { label: 'Notetaker', seatNoun: 'seats', verb: 'Captures notes, quotes, key moments' }
});

const ROLE_ICONS = Object.freeze({
    facilitator: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    scribe: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    notetaker: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
});

function setText(node, value) {
    if (node && typeof value === 'string') {
        node.textContent = value;
    }
}

function renderTitle(pack, documentRef) {
    setText(documentRef.querySelector('.atm-title-name'), pack.identity.title);
    setText(documentRef.querySelector('.atm-title-kind'), pack.identity.domain);
    setText(documentRef.querySelector('title'), pack.identity.title);
}

function renderPoster(pack, documentRef) {
    const poster = documentRef.querySelector('.atm-poster');
    if (poster && pack.identity.poster.hasAsset) {
        poster.setAttribute('src', pack.identity.poster.fileName);
        poster.setAttribute('alt', pack.identity.poster.altText || pack.identity.title);
    }

    const mark = documentRef.querySelector('.atm-mark');
    if (mark && pack.identity.deliverer.logo.fileName) {
        mark.setAttribute('src', pack.identity.deliverer.logo.fileName);
        mark.setAttribute('alt', pack.identity.deliverer.logo.altText || '');
    }
}

function renderTeamChips(pack, documentRef) {
    const container = documentRef.querySelector('.lf-chips[aria-label="Team selection"]');
    if (!container) {
        return;
    }

    container.replaceChildren();
    pack.teams.forEach((team) => {
        const chip = documentRef.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.dataset.team = team.id;
        chip.setAttribute('aria-pressed', 'false');
        chip.setAttribute('title', `Lead the ${team.label} delegation surface`);
        chip.textContent = team.shortLabel;
        container.appendChild(chip);
    });

    const hiddenTeam = documentRef.getElementById('selectedTeam');
    if (hiddenTeam && pack.teams[0]) {
        hiddenTeam.value = pack.teams[0].id;
    }
}

function renderRoleChips(pack, documentRef) {
    const container = documentRef.querySelector('.lf-chips[aria-label="Role selection"]');
    if (!container) {
        return;
    }

    container.replaceChildren();
    Object.keys(ROLE_SURFACE_META).forEach((surface) => {
        const seatCount = pack.roles[surface];
        if (!seatCount || seatCount < 1) {
            return;
        }

        const meta = ROLE_SURFACE_META[surface];
        const chip = documentRef.createElement('button');
        chip.type = 'button';
        chip.className = 'chip chip--role';
        chip.dataset.roleSurface = surface;
        chip.setAttribute('aria-pressed', 'false');
        chip.setAttribute('title', `${seatCount} ${meta.seatNoun} per team - ${meta.verb}`);
        chip.innerHTML = `${ROLE_ICONS[surface]} ${meta.label}`;
        container.appendChild(chip);
    });
}

function renderFooter(pack, documentRef) {
    const footer = documentRef.querySelector('.fp-foot');
    if (!footer) {
        return;
    }

    const parts = [];
    if (pack.identity.deliverer.name) {
        parts.push(`Hosted by ${pack.identity.deliverer.name}`);
    }
    if (pack.identity.sponsor.name) {
        parts.push(`Sponsored by ${pack.identity.sponsor.name}`);
    }

    let credit = documentRef.querySelector('.fp-foot-credit');
    if (!credit) {
        credit = documentRef.createElement('span');
        credit.className = 'fp-foot-credit';
        footer.insertBefore(credit, footer.firstChild);
    }
    credit.textContent = parts.join(' - ');
}

export function renderLanding(pack, { documentRef = typeof document !== 'undefined' ? document : null } = {}) {
    if (!pack || !documentRef) {
        return;
    }

    renderTitle(pack, documentRef);
    renderPoster(pack, documentRef);
    renderTeamChips(pack, documentRef);
    renderRoleChips(pack, documentRef);
    renderFooter(pack, documentRef);
}

export default { renderLanding };
