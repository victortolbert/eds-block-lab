/**
 * Demonstrates the smallest useful authored-content-to-component transformation.
 * @param {HTMLElement} block The block element supplied by the EDS runtime.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [eyebrowRow, titleRow, bodyRow, actionRow] = rows;

  const eyebrow = eyebrowRow?.firstElementChild;
  const title = titleRow?.firstElementChild;
  const body = bodyRow?.firstElementChild;
  const action = actionRow?.firstElementChild;

  eyebrow?.classList.add('hello-world-eyebrow');
  title?.classList.add('hello-world-title');
  body?.classList.add('hello-world-body');
  action?.classList.add('hello-world-action');

  const link = action?.querySelector('a');
  if (link) {
    link.classList.add('button', 'primary');
    link.insertAdjacentText('beforeend', ' →');
  }
}
