/**
 * Converts each authored row into a semantic card.
 * @param {HTMLElement} block The block element supplied by the EDS runtime.
 */
export default function decorate(block) {
  block.setAttribute('role', 'list');

  [...block.children].forEach((row, index) => {
    row.setAttribute('role', 'listitem');
    row.classList.add('cards-lab-card');

    const [headingCell, contentCell] = row.children;
    const heading = headingCell?.querySelector('h2, h3, h4, h5, h6, strong');
    const title = heading?.textContent.trim() || `Card ${index + 1}`;

    headingCell?.classList.add('cards-lab-heading');
    contentCell?.classList.add('cards-lab-content');

    if (heading && heading.tagName === 'STRONG') {
      const cardHeading = document.createElement('h3');
      cardHeading.textContent = title;
      heading.replaceWith(cardHeading);
    }

    const link = contentCell?.querySelector('a');
    if (link) {
      link.classList.add('cards-lab-link');
      link.setAttribute('aria-label', `${link.textContent.trim()}: ${title}`);
    }
  });
}
