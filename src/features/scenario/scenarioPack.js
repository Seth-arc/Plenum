import { ADDON_DEFINITIONS, isKnownAddon } from './addonRegistry.js';

export const PACK_SCHEMA_VERSION = 1;

const DEFAULT_TEAM_PRESETS = Object.freeze({
    blue: { label: 'Blue Team', shortLabel: 'Blue', color: '#2f6fd0' },
    red: { label: 'Red Team', shortLabel: 'Red', color: '#c0392b' },
    green: { label: 'Green Team', shortLabel: 'Green', color: '#1f8a55' }
});

const DEFAULT_ROLE_SEATS = Object.freeze({
    facilitator: 1,
    scribe: 1,
    notetaker: 2,
    observer: 0,
    whiteCellLead: 1,
    whiteCellSupport: 1,
    gameMaster: 1
});

const DEFAULT_TIMER_SECONDS = 5400;

function asText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function asInteger(value, fallback = 0) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function asList(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((entry) => (typeof entry === 'string' ? entry.trim() : entry))
        .filter((entry) => (typeof entry === 'string' ? entry.length > 0 : entry != null));
}

function asOrg(value, fallbackName = '') {
    const source = value && typeof value === 'object' ? value : {};
    const logoSource = source.logo && typeof source.logo === 'object' ? source.logo : {};
    const fileName = asText(logoSource.fileName);

    return {
        name: asText(source.name, fallbackName),
        logo: {
            fileName,
            altText: asText(logoSource.altText),
            hasAsset: Boolean(fileName)
        }
    };
}

function normalizeIdentity(identity) {
    const source = identity && typeof identity === 'object' ? identity : {};
    const posterSource = source.poster && typeof source.poster === 'object' ? source.poster : {};
    const posterFile = asText(posterSource.fileName);

    return {
        title: asText(source.title, 'Untitled Simulation'),
        domain: asText(source.domain),
        sessionCodePattern: asText(source.sessionCodePattern, 'Operator-issued session code'),
        poster: {
            fileName: posterFile,
            altText: asText(posterSource.altText),
            hasAsset: Boolean(posterFile || posterSource.hasAsset)
        },
        sponsor: asOrg(source.sponsor),
        deliverer: asOrg(source.deliverer),
        dateLabel: asText(source.dateLabel),
        venue: asText(source.venue),
        description: asText(source.description)
    };
}

function normalizeTeams(teams) {
    const source = Array.isArray(teams) ? teams : [];
    const seen = new Set();

    return source.reduce((result, team) => {
        const id = asText(team?.id).toLowerCase();
        if (!id || seen.has(id)) {
            return result;
        }

        seen.add(id);
        const preset = DEFAULT_TEAM_PRESETS[id] || {};
        result.push({
            id,
            label: asText(team?.label, preset.label || `${id} Team`),
            shortLabel: asText(team?.shortLabel, preset.shortLabel || id),
            color: asText(team?.color, preset.color || '#444444')
        });
        return result;
    }, []);
}

function normalizeRoles(roles) {
    const source = roles && typeof roles === 'object' ? roles : {};
    return {
        facilitator: asInteger(source.facilitator, DEFAULT_ROLE_SEATS.facilitator),
        scribe: asInteger(source.scribe, DEFAULT_ROLE_SEATS.scribe),
        notetaker: asInteger(source.notetaker, DEFAULT_ROLE_SEATS.notetaker),
        observer: asInteger(source.observer, DEFAULT_ROLE_SEATS.observer),
        whiteCellLead: asInteger(source.whiteCellLead, DEFAULT_ROLE_SEATS.whiteCellLead),
        whiteCellSupport: asInteger(source.whiteCellSupport, DEFAULT_ROLE_SEATS.whiteCellSupport),
        gameMaster: asInteger(source.gameMaster, DEFAULT_ROLE_SEATS.gameMaster)
    };
}

function normalizeNumberedList(entries, fallbackLabelPrefix) {
    const source = Array.isArray(entries) ? entries : [];
    return source
        .map((entry, index) => {
            const n = asInteger(entry?.n, index + 1);
            return {
                n,
                label: asText(entry?.label, `${fallbackLabelPrefix} ${n}`)
            };
        })
        .sort((left, right) => left.n - right.n);
}

function normalizeCadence(cadence) {
    const source = cadence && typeof cadence === 'object' ? cadence : {};
    const moves = normalizeNumberedList(source.moves, 'Move');
    const phases = normalizeNumberedList(source.phases, 'Phase');

    return {
        moves: moves.length ? moves : [{ n: 1, label: 'Move 1' }],
        phases: phases.length ? phases : [{ n: 1, label: 'Phase 1' }],
        timerSeconds: asInteger(source.timerSeconds, DEFAULT_TIMER_SECONDS) || DEFAULT_TIMER_SECONDS
    };
}

function normalizeField(field) {
    const source = field && typeof field === 'object' ? field : {};
    const key = asText(source.key);

    return {
        key,
        label: asText(source.label, key),
        type: asText(source.type, 'text'),
        options: asList(source.options),
        required: Boolean(source.required)
    };
}

function normalizeContracts(contracts) {
    const source = contracts && typeof contracts === 'object' ? contracts : {};

    const normalizeContract = (teamId) => {
        const groupSource = source[teamId] && typeof source[teamId] === 'object' ? source[teamId] : {};
        const fields = Array.isArray(groupSource.fields) ? groupSource.fields : [];
        const contract = {
            summary: asText(groupSource.summary),
            prefix: asText(groupSource.prefix),
            fields: fields.map(normalizeField).filter((field) => field.key)
        };

        if (groupSource.wizardOptions && typeof groupSource.wizardOptions === 'object') {
            contract.wizardOptions = Object.fromEntries(
                Object.entries(groupSource.wizardOptions).map(([key, value]) => [key, asList(value)])
            );
        }

        return contract;
    };

    return {
        blue: normalizeContract('blue'),
        green: normalizeContract('green'),
        red: normalizeContract('red')
    };
}

function normalizeVocab(vocab) {
    const source = vocab && typeof vocab === 'object' ? vocab : {};
    return {
        sectors: asList(source.sectors),
        targets: asList(source.targets),
        mechanisms: asList(source.mechanisms),
        rfiCategories: asList(source.rfiCategories)
    };
}

function normalizeInjects(injects) {
    const source = Array.isArray(injects) ? injects : [];
    return source
        .map((inject) => ({
            minute: asInteger(inject?.minute, 0),
            title: asText(inject?.title),
            detail: asText(inject?.detail)
        }))
        .filter((inject) => inject.title)
        .sort((left, right) => left.minute - right.minute);
}

function normalizePublish(publish) {
    const source = publish && typeof publish === 'object' ? publish : {};
    return {
        routes: asList(source.routes),
        outputs: asList(source.outputs),
        reportTone: asText(source.reportTone, 'Operator brief')
    };
}

function normalizeAddons(addons) {
    const source = addons && typeof addons === 'object' ? addons : {};
    const result = {};

    Object.entries(source).forEach(([id, value]) => {
        if (!isKnownAddon(id)) {
            return;
        }

        const definition = ADDON_DEFINITIONS[id];
        const entry = value && typeof value === 'object' ? value : {};
        const rawConfig = entry.config && typeof entry.config === 'object' ? entry.config : {};
        const config = {};

        definition.configKeys.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(rawConfig, key)) {
                config[key] = rawConfig[key];
            }
        });

        result[id] = {
            enabled: Boolean(entry.enabled),
            config
        };
    });

    return result;
}

export function normalizePack(packInput) {
    const source = packInput && typeof packInput === 'object' ? packInput : {};

    return {
        schemaVersion: PACK_SCHEMA_VERSION,
        identity: normalizeIdentity(source.identity),
        teams: normalizeTeams(source.teams),
        roles: normalizeRoles(source.roles),
        cadence: normalizeCadence(source.cadence),
        contracts: normalizeContracts(source.contracts),
        vocab: normalizeVocab(source.vocab),
        injects: normalizeInjects(source.injects),
        publish: normalizePublish(source.publish),
        addons: normalizeAddons(source.addons)
    };
}

export function compilePackFromSpec(spec, { manifest = [] } = {}) {
    if (!spec || typeof spec !== 'object') {
        return normalizePack({});
    }

    const program = spec.program || {};
    const seminarIdentity = program.seminarIdentity || {};
    const blueprint = spec.blueprint || {};
    const participants = spec.participants || {};
    const liveControl = spec.liveControl || {};
    const teamContracts = spec.teamContracts || {};
    const publish = spec.publish || {};
    const teamSupport = Array.isArray(participants.teamSupport) ? participants.teamSupport : [];
    const maxNotetakers = teamSupport.reduce(
        (max, entry) => Math.max(max, asInteger(entry?.notetakers, 0)),
        DEFAULT_ROLE_SEATS.notetaker
    );
    const moveCount = asInteger(liveControl.moveCount, 1) || 1;

    return normalizePack({
        identity: {
            title: blueprint.title || program.name,
            domain: blueprint.domain,
            sessionCodePattern: participants.sessionCodePattern,
            poster: seminarIdentity.poster,
            sponsor: seminarIdentity.sponsor,
            deliverer: seminarIdentity.deliverer,
            dateLabel: seminarIdentity.dateLabel,
            venue: seminarIdentity.venue,
            description: seminarIdentity.description
        },
        teams: (participants.activeTeams || []).map((id) => ({ id })),
        roles: {
            facilitator: 1,
            scribe: 1,
            notetaker: maxNotetakers,
            observer: asInteger(participants.observerSeats, 0),
            whiteCellLead: asInteger(participants.whiteCellLeadCount, 1),
            whiteCellSupport: asInteger(participants.whiteCellSupportCount, 1),
            gameMaster: asInteger(participants.gameMasterCount, 1)
        },
        cadence: {
            moves: Array.from({ length: moveCount }, (_unused, index) => ({
                n: index + 1,
                label: `Move ${index + 1}`
            })),
            phases: spec.cadence?.phases,
            timerSeconds: asInteger(liveControl.moveLengthMinutes, 0) * 60 || undefined
        },
        contracts: {
            blue: { summary: teamContracts.blueActionShape, fields: [] },
            green: { summary: teamContracts.greenProposalShape, fields: [] },
            red: { summary: teamContracts.redResponseShape, fields: [] }
        },
        vocab: spec.vocab,
        injects: liveControl.injects,
        publish: {
            routes: (Array.isArray(manifest) ? manifest : [])
                .map((entry) => entry?.route)
                .filter(Boolean),
            outputs: publish.outputs,
            reportTone: publish.reportTone
        }
    });
}

export function toTeamOptions(pack) {
    return normalizePack(pack).teams.map((team) => ({
        id: team.id,
        label: team.label,
        shortLabel: team.shortLabel
    }));
}

export function toRoleLimits(pack) {
    const normalized = normalizePack(pack);
    const limits = {
        white: normalized.roles.gameMaster,
        viewer: normalized.roles.observer,
        whitecell_lead: normalized.roles.whiteCellLead,
        whitecell_support: normalized.roles.whiteCellSupport
    };

    normalized.teams.forEach((team) => {
        limits[`${team.id}_facilitator`] = normalized.roles.facilitator;
        limits[`${team.id}_scribe`] = normalized.roles.scribe;
        limits[`${team.id}_notetaker`] = normalized.roles.notetaker;
    });

    return limits;
}

export function toScenarioEnums(pack) {
    const normalized = normalizePack(pack);

    return {
        MOVES: Object.fromEntries(normalized.cadence.moves.map((move) => [move.n, move.label])),
        PHASES: Object.fromEntries(normalized.cadence.phases.map((phase) => [phase.n, phase.label])),
        SECTORS: normalized.vocab.sectors,
        TARGETS: normalized.vocab.targets,
        MECHANISMS: normalized.vocab.mechanisms,
        RFI_CATEGORIES: normalized.vocab.rfiCategories,
        TEAMS: [...normalized.teams.map((team) => team.id), 'white_cell']
    };
}

export function toTimerSeconds(pack) {
    return normalizePack(pack).cadence.timerSeconds;
}

export default {
    PACK_SCHEMA_VERSION,
    normalizePack,
    compilePackFromSpec,
    toTeamOptions,
    toRoleLimits,
    toScenarioEnums,
    toTimerSeconds
};
