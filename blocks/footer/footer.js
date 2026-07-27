/**
 * Creates a small footer for the self-contained lab fixture.
 * @param {HTMLElement} block The synthetic footer block.
 */
export default function decorate(block) {
  const text = document.createElement('p');
  text.textContent = 'Built as an Edge Delivery Services learning sandbox.';
  block.append(text);
}
