// ==========================================================
// PDP CONFIGURATION | Selected size and wrap summary
// ==========================================================
/**
 * Keeps the visible PDP setup summary in sync with native size and wrap controls.
 * @param {ParentNode} [root=document]
 */
export const initPdpConfiguration = (root = document) => {
  const panel = root.querySelector('[data-js="pdp-configuration"]');

  if (!panel || panel.dataset.initialized === 'true') {
    return;
  }

  const size = panel.querySelector('[data-js="pdp-size"]');
  const wrapInputs = [...panel.querySelectorAll('input[name="canvas-wrap"]')];
  const summarySize = panel.querySelector('[data-js="pdp-summary-size"]');
  const summaryWrap = panel.querySelector('[data-js="pdp-summary-wrap"]');

  if (!size || !wrapInputs.length || !summarySize || !summaryWrap) {
    console.error('PDP configuration is missing a size/wrap control or summary target.');
    return;
  }

  const updateSummary = () => {
    const selectedSize = size.selectedOptions[0];
    const selectedWrap = wrapInputs.find((input) => input.checked);
    const wrapLabel = selectedWrap?.closest('label')?.querySelector('[data-js="pdp-option-label"]');

    if (!selectedSize || !selectedWrap || !wrapLabel) {
      console.error('PDP configuration has no valid selected size or wrap label.');
      return;
    }

    summarySize.textContent = selectedSize.textContent.trim();
    summaryWrap.textContent = wrapLabel.textContent.trim();
  };

  size.addEventListener('change', updateSummary);
  wrapInputs.forEach((input) => input.addEventListener('change', updateSummary));
  updateSummary();
  panel.dataset.initialized = 'true';
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initPdpConfiguration(), { once: true });
} else {
  initPdpConfiguration();
}
