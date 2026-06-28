import { describe, expect, it } from 'vitest';

import { getDefaultPack } from '../../core/runtimePack.js';
import {
    normalizePack,
    toRoleLimits,
    toScenarioEnums,
    toTeamOptions,
    toTimerSeconds
} from './scenarioPack.js';
import { validatePack } from './scenarioPack.validate.js';

describe('scenarioPack', () => {
    it('normalizes empty input without throwing', () => {
        const pack = normalizePack();

        expect(pack.teams).toEqual([]);
        expect(validatePack(pack).length).toBeGreaterThan(0);
    });

    it('exposes Fractured Order as the default pack', () => {
        const pack = getDefaultPack();

        expect(pack.identity.title).toBe('Fractured Order');
        expect(toTeamOptions(pack)).toEqual([
            { id: 'blue', label: 'Blue Team', shortLabel: 'Blue' },
            { id: 'red', label: 'Red Team', shortLabel: 'Red' },
            { id: 'green', label: 'Green Team', shortLabel: 'Green' }
        ]);
        expect(toRoleLimits(pack).blue_facilitator).toBe(1);
        expect(toScenarioEnums(pack).MOVES[1]).toBe('Epoch 1 (2027-2030)');
        expect(toTimerSeconds(pack)).toBe(5400);
        expect(pack.identity.deliverer.name).toBe('SSG');
    });

    it('drops unknown addon ids and unknown addon config keys', () => {
        const pack = normalizePack({
            addons: {
                unknownAddon: { enabled: true },
                audioRecording: {
                    enabled: true,
                    config: {
                        consentRequired: true,
                        retentionDays: 30,
                        arbitraryFlag: true
                    }
                }
            }
        });

        expect(pack.addons.unknownAddon).toBeUndefined();
        expect(pack.addons.audioRecording.config).toEqual({
            consentRequired: true,
            retentionDays: 30
        });
    });

    it('validates addon compliance gates', () => {
        const base = {
            identity: {
                title: 'Demo',
                sponsor: { name: 'Sponsor' },
                deliverer: { name: 'Deliverer' }
            },
            teams: [{ id: 'blue' }],
            contracts: { blue: { summary: 'Actions', fields: [] } },
            publish: { routes: ['/master.html'] }
        };

        expect(validatePack({
            ...base,
            addons: { audioRecording: { enabled: true, config: { consentRequired: false } } }
        })).toContain('Audio recording records participants and requires consentRequired: true.');
        expect(validatePack({
            ...base,
            addons: { emailVerification: { enabled: true, config: {} } }
        })).toContain('Email verification is enabled but has no allowed domains.');
        expect(validatePack({
            ...base,
            addons: { onlineDelivery: { enabled: true, config: {} } }
        })).toContain('Online delivery is enabled but has no video provider.');
    });
});
