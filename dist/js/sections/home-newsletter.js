export const initNewsletter = () => {
  const form = document.querySelector('[data-js="newsletter-form"]');
  const status = document.querySelector('[data-js="newsletter-status"]');

  if (!form || !status || form.dataset.initialized === 'true') {
    return;
  }
  form.dataset.initialized = 'true';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    status.textContent = 'Newsletter sign-up is not connected in this static homepage build.';
  });
};
