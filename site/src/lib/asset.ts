/**
 * Resolve a path in /public against Vite's configured base URL.
 *
 * In dev the base is "/", in the GitHub Pages build it is "/Plenum/". Hardcoded
 * absolute paths like "/brand/x.png" would break under a subpath, so always
 * build public-asset URLs through here.
 */
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
