/**
 * Creates a tiny local-lab header. Real projects usually load authored nav content.
 * @param {HTMLElement} block The synthetic header block.
 */
export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Lab navigation');

  const home = document.createElement('a');
  home.href = '/drafts/';
  home.textContent = 'EDS Block Lab';

  const guide = document.createElement('a');
  guide.href = 'https://www.aem.live/developer/tutorial';
  guide.textContent = 'Adobe tutorial';

  nav.append(home, guide);
  block.append(nav);
}
