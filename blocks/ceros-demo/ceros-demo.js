import {
  getAllowedExperienceUrl,
  getSafeAspectRatio,
  settingsFromPairs,
} from './ceros-utils.mjs';

function readSettings(block) {
  const pairs = [...block.children].map((row) => [...row.children]
    .map((cell) => cell.textContent.trim()));
  const settings = settingsFromPairs(pairs.filter((row) => row.length > 1));
  if (Object.keys(settings).length) return settings;

  const [mode, experienceUrl, title, aspectRatio] = pairs.flat();
  return {
    mode,
    experienceUrl,
    title,
    aspectRatio,
  };
}

function buildMock(title, aspectRatio) {
  const mock = document.createElement('div');
  mock.className = 'ceros-demo-mock';
  mock.style.aspectRatio = aspectRatio;
  const heading = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = title;
  heading.append(strong);

  const explanation = document.createElement('p');
  explanation.textContent = 'Local mock: no third-party request was made.';
  mock.append(heading, explanation);
  return mock;
}

function buildError(message) {
  const error = document.createElement('p');
  error.className = 'ceros-demo-error';
  error.setAttribute('role', 'alert');
  error.textContent = message;
  return error;
}

/**
 * Demonstrates an EDS-owned boundary for a third-party experience.
 * @param {HTMLElement} block The block element supplied by the EDS runtime.
 */
export default function decorate(block) {
  const {
    mode = 'mock',
    experienceUrl = '',
    title = 'Interactive experience',
    aspectRatio = '16 / 9',
  } = readSettings(block);

  const safeAspectRatio = getSafeAspectRatio(aspectRatio);
  block.replaceChildren();

  if (mode.toLowerCase() !== 'embed') {
    block.append(buildMock(title, safeAspectRatio));
    return;
  }

  const safeUrl = getAllowedExperienceUrl(experienceUrl);
  if (!safeUrl) {
    block.append(buildError('The experience URL must use HTTPS and an approved Ceros host.'));
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.className = 'ceros-demo-frame';
  iframe.src = safeUrl.href;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allow = 'fullscreen';
  iframe.style.aspectRatio = safeAspectRatio;
  block.append(iframe);
}
