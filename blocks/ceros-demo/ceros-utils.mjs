const DEFAULT_ALLOWED_HOSTS = ['view.ceros.com', 'ceros.site'];

/**
 * Reads the common two-column key/value block shape into a plain object.
 * @param {Array<Array<string>>} rows Text pairs from authored rows.
 * @returns {Record<string, string>} Normalized settings.
 */
export function settingsFromPairs(rows) {
  return Object.fromEntries(rows
    .map(([key = '', value = '']) => [key.trim(), value.trim()])
    .filter(([key]) => key));
}

/**
 * Allows only HTTPS experience URLs on explicitly approved hosts.
 * @param {string} value Candidate URL.
 * @param {string[]} allowedHosts Exact host allowlist.
 * @returns {URL|null} A safe URL or null.
 */
export function getAllowedExperienceUrl(value, allowedHosts = DEFAULT_ALLOWED_HOSTS) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    const approved = allowedHosts.some((host) => (
      url.hostname === host || url.hostname.endsWith(`.${host}`)
    ));
    if (!approved) return null;
    return url;
  } catch {
    return null;
  }
}

/**
 * Accepts a simple numeric CSS aspect ratio while rejecting arbitrary CSS.
 * @param {string} value Candidate ratio.
 * @returns {string} Safe ratio.
 */
export function getSafeAspectRatio(value) {
  const candidate = value.trim();
  return /^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/.test(candidate)
    ? candidate
    : '16 / 9';
}

export { DEFAULT_ALLOWED_HOSTS };
