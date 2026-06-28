import { ADDON_DEFINITIONS } from './addonRegistry.js';
import { normalizePack } from './scenarioPack.js';

export function validatePack(packInput) {
    const pack = normalizePack(packInput);
    const issues = [];

    if (!pack.identity.title || pack.identity.title === 'Untitled Simulation') {
        issues.push('Give the simulation a title so participants know what they are joining.');
    }
    if (!pack.identity.sponsor.name) {
        issues.push('Name the sponsoring institution that owns or funds this simulation.');
    }
    if (!pack.identity.deliverer.name) {
        issues.push('Name the deliverer that runs and hosts the live session.');
    }
    if (pack.teams.length === 0) {
        issues.push('Activate at least one team so the runtime has a public surface to seat.');
    }
    if (pack.roles.gameMaster < 1) {
        issues.push('Include at least one Game Master seat so session creation and publish controls exist.');
    }
    if (pack.roles.whiteCellLead < 1) {
        issues.push('Include at least one White Cell lead seat so submissions can be reviewed and adjudicated.');
    }
    if (pack.teams.length > 0 && pack.roles.facilitator < 1) {
        issues.push('Include at least one facilitator seat per team so each team can submit into the backend.');
    }
    if (pack.cadence.moves.length === 0) {
        issues.push('Define at least one move so the session has a play loop.');
    }
    if (pack.cadence.phases.length === 0) {
        issues.push('Define at least one phase so the runtime can label session state.');
    }
    if (pack.cadence.timerSeconds <= 0) {
        issues.push('Set a positive move timer so the runtime clock can start.');
    }

    pack.teams.forEach((team) => {
        const contract = pack.contracts[team.id];
        if (!contract?.summary) {
            issues.push(`Describe what the ${team.shortLabel} team submits so its facilitator surface has a contract.`);
        }
    });

    Object.entries(pack.contracts).forEach(([teamId, contract]) => {
        contract.fields.forEach((field) => {
            if ((field.type === 'select' || field.type === 'multiselect') && field.options.length === 0) {
                issues.push(`The ${teamId} field "${field.label}" is a choice field but lists no options.`);
            }
        });
    });

    const routes = pack.publish.routes;
    const endsInShippedRuntime = routes.some(
        (route) => route.includes('master.html') || route.includes('whitecell.html') || /teams\//.test(route)
    );
    if (!endsInShippedRuntime) {
        issues.push('Set the publish target to the shipped runtime routes.');
    }

    Object.entries(pack.addons).forEach(([id, entry]) => {
        if (!entry.enabled) {
            return;
        }

        if (id === 'audioRecording' && entry.config.consentRequired !== true) {
            issues.push('Audio recording records participants and requires consentRequired: true.');
        }
        if (
            id === 'emailVerification'
            && (!Array.isArray(entry.config.allowedDomains) || entry.config.allowedDomains.length === 0)
        ) {
            issues.push('Email verification is enabled but has no allowed domains.');
        }
        if (id === 'onlineDelivery' && !entry.config.provider) {
            issues.push('Online delivery is enabled but has no video provider.');
        }
        if (ADDON_DEFINITIONS[id]?.compliance === 'disclosure' && !entry.config.mode) {
            issues.push(`${ADDON_DEFINITIONS[id].label} requires an explicit operating mode for disclosure review.`);
        }
    });

    return issues;
}

export function isPublishablePack(packInput) {
    return validatePack(packInput).length === 0;
}

export default { validatePack, isPublishablePack };
