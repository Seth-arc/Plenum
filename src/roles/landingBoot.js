import { resolveActivePack, DEFAULT_SIMULATION_ID, SELECTED_SIMULATION_KEY } from '../core/runtimePack.js';
import { renderLanding } from '../features/scenario/landingRender.js';

globalThis.__ESG_DISABLE_AUTO_INIT__ = true;

async function boot() {
    const landing = document.querySelector('.landing');

    let resolved;
    try {
        resolved = await resolveActivePack();
    } catch (_error) {
        resolved = null;
    }

    if (resolved && resolved.pack) {
        renderLanding(resolved.pack);

        try {
            const slug = resolved.source === 'default'
                ? DEFAULT_SIMULATION_ID
                : (globalThis.localStorage?.getItem(SELECTED_SIMULATION_KEY) || DEFAULT_SIMULATION_ID);
            globalThis.localStorage?.setItem(SELECTED_SIMULATION_KEY, slug);
        } catch (_error) {
            // Selection persistence is best-effort only.
        }
    }

    if (landing) {
        requestAnimationFrame(() => landing.classList.add('landing--visible'));
    }

    const { landingController } = await import('./landing.js');
    landingController.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        void boot();
    });
} else {
    void boot();
}
