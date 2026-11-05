import { initSiteHeader } from './components/site-header.js';
import { initProductGallery } from './commerce/product-gallery.js';
import { initHomeHero } from './sections/home-hero.js';
import { initRoomTabs } from './sections/home-shop-by-room.js';
import { initNewsletter } from './sections/home-newsletter.js';
import { initHomeTestimonials } from './sections/home-testimonials.js';
import { init as initWallArtPreview } from './sections/wall-art-preview.js';

const init = () => {
  initSiteHeader();
  initProductGallery();
  initHomeHero();
  initRoomTabs();
  initNewsletter();
  initHomeTestimonials();
  initWallArtPreview();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
