import { describe, expect, it } from 'vitest';

import viteConfig from './vite.config.js';

describe('vite multi-page entries', () => {
    it('uses index.html as the Plenum runtime entry', async () => {
        const config = await viteConfig({ mode: 'test' });
        const mainEntry = config.build?.rollupOptions?.input?.main;

        expect(typeof mainEntry).toBe('string');
        expect(mainEntry.replace(/\\/g, '/')).toMatch(/\/index\.html$/);
    });
});
