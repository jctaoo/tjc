/**
 * Render text to given HTML element.
 * @param {string} text The text you want to render.
 * @param {HTMLElement} element The element you want to render to.
 */
export function renderApplication(text, element) {
  const textElement = document.createElement("h1");
  textElement.innerHTML = text;

  element.appendChild(textElement);
}
