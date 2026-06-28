/**
 * Scenario addon registry.
 *
 * The registry defines addon identities and accepted config keys only. Runtime
 * implementations are integrated in later steps.
 */

export const ADDON_SURFACES = Object.freeze({
    ANALYTICS: 'analytics',
    DELIVERY: 'delivery',
    CAPTURE: 'capture',
    ACCESS: 'access',
    ONBOARDING: 'onboarding',
    INTELLIGENCE: 'intelligence'
});

export const ADDON_COST_MODELS = Object.freeze({
    FLAT: 'flat',
    USAGE: 'usage',
    NONE: 'none'
});

export const ADDON_DEFINITIONS = Object.freeze({
    extendedResearch: {
        id: 'extendedResearch',
        label: 'Extended Research & Analytics',
        surface: ADDON_SURFACES.ANALYTICS,
        costModel: ADDON_COST_MODELS.FLAT,
        readOnly: true,
        compliance: null,
        modulePath: './extendedResearch/index.js',
        configKeys: ['metrics', 'dashboards', 'exportTargets']
    },
    onlineDelivery: {
        id: 'onlineDelivery',
        label: 'Online Delivery & Team Booths',
        surface: ADDON_SURFACES.DELIVERY,
        costModel: ADDON_COST_MODELS.USAGE,
        readOnly: false,
        compliance: null,
        modulePath: './onlineDelivery/index.js',
        configKeys: ['provider', 'booths', 'breakouts', 'maxParticipants']
    },
    audioRecording: {
        id: 'audioRecording',
        label: 'Audio Recording',
        surface: ADDON_SURFACES.CAPTURE,
        costModel: ADDON_COST_MODELS.USAGE,
        readOnly: false,
        compliance: 'consent',
        modulePath: './audioRecording/index.js',
        configKeys: ['consentRequired', 'storageBucket', 'retentionDays']
    },
    emailVerification: {
        id: 'emailVerification',
        label: 'Institutional Email Verification',
        surface: ADDON_SURFACES.ACCESS,
        costModel: ADDON_COST_MODELS.FLAT,
        readOnly: false,
        compliance: null,
        modulePath: './emailVerification/index.js',
        configKeys: ['allowedDomains', 'blockDisposable']
    },
    participantOnboarding: {
        id: 'participantOnboarding',
        label: 'Participant Onboarding & Pre-Brief',
        surface: ADDON_SURFACES.ONBOARDING,
        costModel: ADDON_COST_MODELS.FLAT,
        readOnly: false,
        compliance: null,
        modulePath: './participantOnboarding/index.js',
        configKeys: ['briefSource', 'readinessCheck', 'roleCards']
    },
    aiWhiteCell: {
        id: 'aiWhiteCell',
        label: 'AI-Assisted White Cell / Adversary',
        surface: ADDON_SURFACES.INTELLIGENCE,
        costModel: ADDON_COST_MODELS.USAGE,
        readOnly: false,
        compliance: 'disclosure',
        modulePath: './aiWhiteCell/index.js',
        configKeys: ['mode', 'playsTeam', 'injectCadence']
    }
});

export const KNOWN_ADDON_IDS = Object.freeze(Object.keys(ADDON_DEFINITIONS));

export function getAddonDefinition(id) {
    return ADDON_DEFINITIONS[id] || null;
}

export function isKnownAddon(id) {
    return Object.prototype.hasOwnProperty.call(ADDON_DEFINITIONS, id);
}

export default {
    ADDON_SURFACES,
    ADDON_COST_MODELS,
    ADDON_DEFINITIONS,
    KNOWN_ADDON_IDS,
    getAddonDefinition,
    isKnownAddon
};
