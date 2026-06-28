import { FRACTURED_ORDER_PACK } from '../features/scenario/builtinPacks.js';
import { normalizePack } from '../features/scenario/scenarioPack.js';

export const SELECTED_SIMULATION_KEY = 'esg_selected_simulation';
export const DEFAULT_SIMULATION_ID = 'fractured-order';

let scenarioServicePromise = null;

async function getScenarioService() {
    if (!scenarioServicePromise) {
        const scenarioServicePath = '../services/scenarioService.js';
        scenarioServicePromise = import(/* @vite-ignore */ scenarioServicePath)
            .then((module) => module.scenarioService || module.default)
            .catch(() => null);
    }

    return scenarioServicePromise;
}

function readSelectedSimulationId() {
    try {
        return globalThis.localStorage?.getItem(SELECTED_SIMULATION_KEY) || null;
    } catch (_error) {
        return null;
    }
}

export function getDefaultPack() {
    return normalizePack(FRACTURED_ORDER_PACK);
}

export async function resolveActivePack({ scenarioId = null, simulationId = null } = {}) {
    if (scenarioId) {
        const service = await getScenarioService();
        if (service) {
            try {
                const scenario = await service.getScenario(scenarioId);
                if (scenario?.pack) {
                    return { pack: normalizePack(scenario.pack), source: 'session' };
                }
            } catch (_error) {
                // Fall back to selected/default pack.
            }
        }
    }

    const selectedId = simulationId || readSelectedSimulationId();
    if (selectedId && selectedId !== DEFAULT_SIMULATION_ID) {
        const service = await getScenarioService();
        if (service) {
            try {
                const list = await service.listScenarios({ status: 'published' });
                const match = list.find((entry) => entry.slug === selectedId || entry.id === selectedId);
                if (match?.pack) {
                    return { pack: normalizePack(match.pack), source: 'selected' };
                }
            } catch (_error) {
                // Fall back to default pack.
            }
        }
    }

    return { pack: getDefaultPack(), source: 'default' };
}

export default {
    resolveActivePack,
    getDefaultPack,
    SELECTED_SIMULATION_KEY,
    DEFAULT_SIMULATION_ID
};
