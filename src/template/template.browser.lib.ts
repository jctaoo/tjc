/**
 * Render text to given HTML element.
 * @param text The text you want to render.
 * @param element The element you want to render to.
 */
export function renderText(text: string, element: HTMLElement) {
  const textElement = document.createElement("h1");
  textElement.innerHTML = text;

  element.appendChild(textElement);
}
