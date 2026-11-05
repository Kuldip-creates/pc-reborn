// ==========================================================
// WALL ART PREVIEW | Local prototype, no commerce requests
// ==========================================================
const instances = new WeakMap();
const steps = ['photo', 'configure', 'crop', 'review'];
const formats = {
  canvas: { label: 'Canvas', finishes: { 'gallery-wrap': 'Gallery wrap' } },
  framed: { label: 'Framed', finishes: { black: 'Black frame', white: 'White frame' } },
  poster: { label: 'Poster', finishes: { unframed: 'Unframed' } },
  aluminium: { label: 'Aluminium', finishes: { aluminium: 'Aluminium surface' } }
};
const sizes = { 30: [30, 20], 60: [60, 40], 90: [90, 60] };
const samples = {
  forest: { url: 'assets/images/wall-art-preview-forest.png', name: 'Forest lake' }
};
const titles = ['Add your photo', 'Choose & customise', 'Crop & edit your photo', 'Review your wall art'];
const intros = [
  'Choose a photo to create your wall art.',
  'Choose a format, size and finish. These options are illustrative, not live catalogue data.',
  'Adjust the crop for your selected print proportions. Production trim and quality checks are unavailable.',
  'Check your design. Live pricing, production checks and basket service are not connected.'
];
const nextLabels = ['Continue to customise', 'Continue to crop', 'Continue to review', 'Add to basket'];
const freshCrop = () => ({ ratio: 'original', zoom: 100, horizontal: 50, vertical: 50, rotation: 0 });
const freshState = () => ({ step: 0, format: 'canvas', size: '60', orientation: 'landscape', finish: 'gallery-wrap', photo: null, crop: freshCrop() });
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const owns = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const galleryDatabaseName = 'pc-reborn-wall-art-gallery';

function openGalleryDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('Browser photo storage is unavailable.'));
      return;
    }
    const request = indexedDB.open(galleryDatabaseName, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('photos')) request.result.createObjectStore('photos', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Browser photo storage could not be opened.'));
  });
}

function galleryRequest(database, mode, operation) {
  return new Promise((resolve, reject) => {
    let result;
    let transaction;
    try {
      transaction = database.transaction('photos', mode);
      const request = operation(transaction.objectStore('photos'));
      request.onsuccess = () => { result = request.result; };
      request.onerror = () => reject(request.error || new Error('Browser photo storage request failed.'));
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error || new Error('Browser photo storage request failed.'));
      transaction.onabort = () => reject(transaction.error || new Error('Browser photo storage request was cancelled.'));
    } catch (reason) {
      reject(reason);
    }
  });
}

function createThumbnail(image) {
  const scale = Math.min(1, 320 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
}

async function fileFingerprint(file) {
  if (!globalThis.crypto?.subtle) return `${file.name}:${file.size}:${file.lastModified}`;
  try {
    const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  } catch {
    return `${file.name}:${file.size}:${file.lastModified}`;
  }
}

function roots(root) {
  return root.matches?.('[data-js="wall-art-preview"]') ? [root] : [...root.querySelectorAll('[data-js="wall-art-preview"]')];
}

function printDimensions(state) {
  const [width, height] = sizes[state.size];
  return state.orientation === 'portrait' ? [height, width] : [width, height];
}

function cropRectangle(state) {
  const rotation = state.crop.rotation % 180 === 0 ? 0 : 90;
  const width = rotation ? state.photo.height : state.photo.width;
  const height = rotation ? state.photo.width : state.photo.height;
  const [printWidth, printHeight] = printDimensions(state);
  const ratios = { original: width / height, '3:2': 3 / 2, '4:3': 4 / 3, '16:9': 16 / 9, print: printWidth / printHeight };
  const ratio = ratios[state.crop.ratio];
  const cropWidth = Math.min(width, height * ratio) * 100 / state.crop.zoom;
  const cropHeight = cropWidth / ratio;
  return { x: (width - cropWidth) * state.crop.horizontal / 100, y: (height - cropHeight) * state.crop.vertical / 100, width: cropWidth, height: cropHeight };
}

function estimatePrintPpi(state) {
  const crop = cropRectangle(state);
  const [printWidth, printHeight] = printDimensions(state);
  const centimetresPerPixel = Math.max(printWidth / crop.width, printHeight / crop.height);
  return Math.round(2.54 / centimetresPerPixel);
}

async function validateFile(file) {
  if (!file || file.size === 0) throw new Error('Choose a non-empty image file.');
  if (file.size > 20 * 1024 * 1024) throw new Error('This photo exceeds the 20 MiB local preview limit. Choose a smaller file.');
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const signature = String.fromCharCode(...bytes);
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const png = bytes[0] === 137 && signature.slice(1, 8) === 'PNG\r\n\x1a\n';
  const webp = signature.startsWith('RIFF') && signature.slice(8, 12) === 'WEBP';
  const heic = signature.slice(4, 8) === 'ftyp' && /^(heic|heix|hevc|hevx|mif1|msf1)$/.test(signature.slice(8, 12));
  if (!jpeg && !png && !webp && !heic) throw new Error('Choose a JPG, PNG, WebP or supported HEIC photo. This file type is not supported.');
}

function createInstance(element) {
  const find = (name) => element.querySelector(`[data-js="${name}"]`);
  const all = (name) => [...element.querySelectorAll(`[data-js="${name}"]`)];
  const form = find('flow');
  const required = ['title', 'intro', 'progress', 'progress-list', 'progress-mobile', 'progressbar', 'progress-fill', 'gallery-section', 'gallery', 'gallery-count', 'gallery-help', 'gallery-action-template', 'gallery-more', 'delete-all', 'sample-empty-action', 'photo-empty', 'photo-preview', 'photo-preview-image', 'dock-thumbnail', 'choose-library', 'change-photo', 'room', 'room-canvas', 'print-canvas', 'crop-canvas', 'print-preview', 'preview-control', 'preview-toggle', 'file', 'error', 'status', 'finish', 'next', 'back', 'action-dock', 'selection-count', 'actions', 'cancel-load', 'drop-zone', 'sample-grid', 'sample-dialog', 'sample-open', 'sample-close', 'zoom', 'horizontal', 'vertical', 'zoom-value', 'room-caption', 'summary-format', 'summary-size', 'summary-orientation', 'summary-photo', 'summary-crop', 'summary-finish', 'review-quality', 'review-quality-text'];
  if (!form || required.some((name) => !find(name)) || all('step').length !== steps.length) return null;
  const canvases = ['room-canvas', 'print-canvas', 'crop-canvas'].map(find);
  if (canvases.some((canvas) => !canvas.getContext('2d'))) return null;
  const listeners = new AbortController();
  let state = freshState();
  state.gallery = [];
  let galleryVisibleCount = 20;
  let sequence = 0;
  let loading = false;
  let pending = null;
  let destroyed = false;
  let downloadUrl = null;
  let previewPinned = false;
  let previewHovered = false;
  let previewFocused = false;
  let previewDismissed = false;
  let transitionTimer = 0;
  let navigationLock = false;
  let navigationTimer = 0;
  let galleryDatabase = null;
  let galleryUnavailable = false;
  let galleryBusy = false;
  const galleryUrls = new Map();

  const announce = (message) => { find('status').textContent = message; };
  const error = (message) => {
    find('error').textContent = message;
    find('file').setAttribute('aria-invalid', String(Boolean(message)));
  };
  const release = (photo) => { if (photo?.owned) URL.revokeObjectURL(photo.url); };
  const thumbnailUrl = (photo) => {
    if (!galleryUrls.has(photo.id)) galleryUrls.set(photo.id, URL.createObjectURL(photo.thumbnail || photo.blob));
    return galleryUrls.get(photo.id);
  };
  const syncPreview = () => {
    const open = !previewDismissed && (previewPinned || previewHovered || previewFocused);
    find('preview-control').dataset.open = String(open);
    find('preview-toggle').setAttribute('aria-expanded', String(open));
    find('print-preview').setAttribute('aria-hidden', String(!open));
  };

  function animateFlow() {
    if (transitionTimer) clearTimeout(transitionTimer);
    form.classList.remove('is-transitioning');
    void form.offsetWidth;
    form.classList.add('is-transitioning');
    transitionTimer = setTimeout(() => {
      form.classList.remove('is-transitioning');
      transitionTimer = 0;
    }, 250);
  }

  function draw(canvas, editor = false) {
    if (!state.photo) {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      canvas.setAttribute('aria-label', 'No photo selected');
      return;
    }
    const crop = cropRectangle(state);
    const [printWidth, printHeight] = printDimensions(state);
    const ratio = printWidth / printHeight;
    const canvasWidth = editor ? 960 : Math.max(1, Math.round(640 * Math.min(1, ratio)));
    const canvasHeight = editor ? 640 : Math.max(1, Math.round(640 / Math.max(1, ratio)));
    if (canvas.width !== canvasWidth) canvas.width = canvasWidth;
    if (canvas.height !== canvasHeight) canvas.height = canvasHeight;
    const context = canvas.getContext('2d');
    const style = getComputedStyle(element);
    const surface = style.getPropertyValue('--color-surface-primary').trim();
    const ink = style.getPropertyValue('--color-text-primary').trim();
    context.fillStyle = surface;
    context.fillRect(0, 0, canvas.width, canvas.height);
    let padding = 0;
    if (!editor && state.format === 'framed') {
      padding = 24;
      context.fillStyle = state.finish === 'white' ? surface : ink;
      context.fillRect(0, 0, canvas.width, canvas.height);
    } else if (!editor && state.format === 'canvas') {
      padding = 6;
    } else if (!editor && state.format === 'aluminium') {
      padding = 2;
    }
    padding = Math.min(padding, canvas.width / 4, canvas.height / 4);
    const availableWidth = canvas.width - padding * 2;
    const availableHeight = canvas.height - padding * 2;
    const scale = Math.min(availableWidth / crop.width, availableHeight / crop.height);
    const width = crop.width * scale;
    const height = crop.height * scale;
    const left = (canvas.width - width) / 2;
    const top = (canvas.height - height) / 2;
    const rotation = state.crop.rotation;
    let sourceX = crop.x;
    let sourceY = crop.y;
    let sourceWidth = crop.width;
    let sourceHeight = crop.height;
    if (rotation === 90) {
      sourceX = crop.y;
      sourceY = state.photo.height - crop.x - crop.width;
      sourceWidth = crop.height;
      sourceHeight = crop.width;
    } else if (rotation === 180) {
      sourceX = state.photo.width - crop.x - crop.width;
      sourceY = state.photo.height - crop.y - crop.height;
    } else if (rotation === 270) {
      sourceX = state.photo.width - crop.y - crop.height;
      sourceY = crop.x;
      sourceWidth = crop.height;
      sourceHeight = crop.width;
    }
    const drawWidth = rotation % 180 ? height : width;
    const drawHeight = rotation % 180 ? width : height;
    context.save();
    context.translate(left + width / 2, top + height / 2);
    context.rotate(rotation * Math.PI / 180);
    context.drawImage(state.photo.image, sourceX, sourceY, sourceWidth, sourceHeight, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    context.restore();
    if (editor) {
      const guide = Math.min(8, width / 4, height / 4);
      context.strokeStyle = surface;
      context.lineWidth = 2;
      context.strokeRect(left + guide, top + guide, width - guide * 2, height - guide * 2);
      context.beginPath();
      for (const fraction of [1 / 3, 2 / 3]) {
        context.moveTo(left + width * fraction, top + guide);
        context.lineTo(left + width * fraction, top + height - guide);
        context.moveTo(left + guide, top + height * fraction);
        context.lineTo(left + width - guide, top + height * fraction);
      }
      context.stroke();
    }
    canvas.dataset.orientation = state.orientation;
    canvas.dataset.size = state.size;
    canvas.dataset.rotation = String(rotation);
    canvas.setAttribute('aria-label', `${editor ? 'Crop' : formats[state.format].label} preview: ${state.photo.name}${rotation ? `, rotated ${rotation} degrees` : ''}`);
  }

  function renderGallery() {
    const list = find('gallery');
    list.replaceChildren();
    for (const photo of state.gallery.slice(0, galleryVisibleCount)) {
      const item = document.createElement('li');
      item.className = 'wall-art-preview__gallery-item';
      const select = document.createElement('button');
      select.className = 'wall-art-preview__gallery-select';
      select.type = 'button';
      select.dataset.js = 'gallery-select';
      select.dataset.photoId = photo.id;
      const selected = state.photo?.galleryId === photo.id;
      select.setAttribute('aria-pressed', String(selected));
      select.setAttribute('aria-label', `Select and preview ${photo.name}`);
      const image = document.createElement('img');
      image.src = thumbnailUrl(photo);
      image.alt = '';
      image.width = photo.width;
      image.height = photo.height;
      image.loading = 'lazy';
      image.decoding = 'async';
      const name = document.createElement('span');
      name.className = 'wall-art-preview__gallery-name';
      name.textContent = photo.name;
      select.append(image, name);
      if (selected) {
        const selectedMark = document.createElement('span');
        selectedMark.className = 'wall-art-preview__gallery-selected-mark';
        selectedMark.setAttribute('aria-hidden', 'true');
        selectedMark.textContent = '✓';
        select.append(selectedMark);
      }
      const actions = find('gallery-action-template').content.cloneNode(true);
      const menu = actions.querySelector('details');
      const trigger = actions.querySelector('summary');
      trigger.setAttribute('aria-label', `Actions for ${photo.name}`);
      trigger.title = `Actions for ${photo.name}`;
      const remove = actions.querySelector('[data-js="gallery-delete"]');
      remove.dataset.photoId = photo.id;
      remove.setAttribute('aria-label', `Delete ${photo.name} from this device`);
      item.append(select, actions);
      list.append(item);
    }
    const addItem = document.createElement('li');
    addItem.className = 'wall-art-preview__gallery-item wall-art-preview__gallery-item--add';
    const addButton = document.createElement('button');
    addButton.className = 'wall-art-preview__gallery-add';
    addButton.type = 'button';
    addButton.dataset.js = 'add-photo';
    addButton.innerHTML = '<span aria-hidden="true">+</span><span>Add photo</span>';
    addItem.append(addButton);
    list.append(addItem);
    find('gallery-section').hidden = state.gallery.length === 0;
    find('gallery-count').textContent = `(${state.gallery.length.toLocaleString('en-GB')})`;
    find('gallery-more').hidden = state.gallery.length <= galleryVisibleCount;
    find('choose-library').hidden = state.gallery.length === 0;
    find('sample-empty-action').hidden = state.gallery.length > 0;
    find('delete-all').disabled = galleryBusy || loading;
  }

  async function restoreGallery() {
    try {
      galleryDatabase = await openGalleryDatabase();
      const stored = await galleryRequest(galleryDatabase, 'readonly', (store) => store.getAll());
      const present = new Set(state.gallery.map((photo) => photo.id));
      state.gallery = [...stored.filter((photo) => !present.has(photo.id)).map((photo) => ({ ...photo, persisted: true })), ...state.gallery];
      state.gallery.sort((first, second) => second.createdAt - first.createdAt);
      galleryUnavailable = false;
    } catch {
      galleryUnavailable = true;
    }
    render();
  }

  async function addToGallery(file, image) {
    const fingerprint = await fileFingerprint(file);
    const duplicate = state.gallery.find((photo) => photo.fingerprint === fingerprint);
    if (duplicate) return duplicate;
    let thumbnail = null;
    try { thumbnail = await createThumbnail(image); } catch { /* The original remains usable if thumbnail encoding is unavailable. */ }
    const photo = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name || 'Your photo',
      size: file.size,
      type: file.type,
      width: image.naturalWidth,
      height: image.naturalHeight,
      createdAt: Date.now(),
      fingerprint,
      blob: file,
      thumbnail,
      persisted: false
    };
    try {
      galleryDatabase ||= await openGalleryDatabase();
      await galleryRequest(galleryDatabase, 'readwrite', (store) => store.put(photo));
      photo.persisted = true;
      galleryUnavailable = false;
    } catch {
      galleryUnavailable = true;
    }
    state.gallery = [photo, ...state.gallery];
    return photo;
  }

  async function deleteGalleryPhoto(id) {
    if (galleryBusy || loading) return;
    const photo = state.gallery.find((entry) => entry.id === id);
    if (!photo || !window.confirm(`Delete ${photo.name} from this device?`)) return;
    try {
      if (photo.persisted) {
        galleryDatabase ||= await openGalleryDatabase();
        await galleryRequest(galleryDatabase, 'readwrite', (store) => store.delete(id));
      }
    } catch {
      error('This photo could not be deleted from browser storage. Try again.');
      return;
    }
    if (state.photo?.galleryId === id) {
      release(state.photo);
      state.photo = null;
      state.crop = freshCrop();
    }
    state.gallery = state.gallery.filter((entry) => entry.id !== id);
    if (galleryUrls.has(id)) {
      URL.revokeObjectURL(galleryUrls.get(id));
      galleryUrls.delete(id);
    }
    error('');
    render();
    (find('gallery').querySelector('[data-js="gallery-select"]') || find('file')).focus();
    announce('Photo deleted from this device. Select another photo to continue.');
  }

  async function deleteAllPhotos() {
    if (galleryBusy || loading || state.gallery.length === 0) return;
    if (!window.confirm('Delete all photos stored in this browser on this device? This removes the entire local gallery and cannot be undone. Your original device files are not deleted.')) return;
    galleryBusy = true;
    cancelPending();
    error('');
    render();
    try {
      if (state.gallery.some((photo) => photo.persisted)) {
        galleryDatabase ||= await openGalleryDatabase();
        await galleryRequest(galleryDatabase, 'readwrite', (store) => store.clear());
      }
      if (destroyed) return;
      if (state.photo?.galleryId) {
        release(state.photo);
        state.photo = null;
        state.crop = freshCrop();
      }
      state.gallery = [];
      galleryVisibleCount = 20;
      for (const url of galleryUrls.values()) URL.revokeObjectURL(url);
      galleryUrls.clear();
      announce('All gallery photos deleted from this browser. Original device files are unchanged.');
    } catch {
      if (!destroyed) error('The gallery could not be deleted from browser storage. Your photos and selection have been retained. Try again.');
    } finally {
      galleryBusy = false;
      if (!destroyed) {
        render();
        if (state.gallery.length === 0) (state.photo ? all('sample-open').find((button) => button.getClientRects().length) : find('file'))?.focus();
      }
    }
  }

  function render() {
    const view = steps[state.step];
    const viewChanged = element.dataset.view !== view;
    element.dataset.view = view;
    find('title').textContent = titles[state.step];
    find('intro').textContent = intros[state.step];
    find('progress').textContent = `Step ${state.step + 1} of 4`;
    const progressLabel = ['Photo', 'Customise', 'Crop', 'Review'][state.step];
    find('progress-mobile').textContent = `Step 0${state.step + 1} of 04 · ${progressLabel}`;
    const progressBar = find('progressbar');
    progressBar.dataset.progressValue = String(state.step + 1);
    progressBar.setAttribute('aria-valuenow', String(state.step + 1));
    progressBar.setAttribute('aria-valuetext', `Step ${state.step + 1} of 4: ${progressLabel}`);
    for (const item of all('progress-item')) {
      const step = Number(item.parentElement.dataset.progressStep);
      const label = ['Photo', 'Customise', 'Crop', 'Review'][step];
      const stateName = step === state.step ? 'current' : step < state.step ? 'complete' : 'upcoming';
      item.parentElement.dataset.state = stateName;
      item.querySelector('[data-js="progress-marker"]').textContent = step < state.step ? '✓' : `0${step + 1}`;
      item.setAttribute('aria-label', `${label}, ${stateName === 'current' ? 'current step' : stateName}`);
      if (step === state.step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    }
    for (const panel of all('step')) panel.hidden = panel.dataset.step !== view;
    find('room').hidden = !['configure', 'review'].includes(view);
    find('actions').hidden = false;
    find('back').hidden = state.step === 0;
    find('back').textContent = view === 'review' ? 'Edit design' : 'Back';
    find('next').textContent = `${nextLabels[state.step] || 'Continue'}${view === 'review' ? '' : ' →'}`;
    if (view === 'review') find('next').setAttribute('aria-describedby', 'wall-art-basket-help');
    else find('next').removeAttribute('aria-describedby');
    find('next').disabled = navigationLock || galleryBusy || loading || !state.photo || view === 'review';
    find('selection-count').textContent = state.photo?.sample ? 'Sample selected' : state.photo ? '1 photo selected' : 'No photo selected';
    const dockThumbnail = find('dock-thumbnail');
    dockThumbnail.hidden = !state.photo;
    if (state.photo) {
      const galleryPhoto = state.gallery.find((photo) => photo.id === state.photo.galleryId);
      const source = galleryPhoto ? thumbnailUrl(galleryPhoto) : state.photo.url;
      if (dockThumbnail.getAttribute('src') !== source) dockThumbnail.src = source;
    } else dockThumbnail.removeAttribute('src');
    find('cancel-load').hidden = !loading;
    find('drop-zone').setAttribute('aria-busy', String(loading));
    find('file').disabled = loading || galleryBusy;
    find('gallery-help').textContent = galleryUnavailable
      ? 'Stored on this device where browser storage is available.'
      : 'Stored in this browser on this device only.';
    find('photo-empty').hidden = Boolean(state.photo);
    const photoPreview = find('photo-preview');
    const photoPreviewImage = find('photo-preview-image');
    photoPreview.hidden = !state.photo;
    if (state.photo) {
      if (photoPreviewImage.getAttribute('src') !== state.photo.url) photoPreviewImage.setAttribute('src', state.photo.url);
      photoPreviewImage.width = state.photo.width;
      photoPreviewImage.height = state.photo.height;
      photoPreviewImage.alt = `Selected photo: ${state.photo.name}`;
    } else {
      photoPreviewImage.removeAttribute('src');
      photoPreviewImage.alt = '';
    }
    renderGallery();
    for (const radio of all('format')) radio.checked = radio.value === state.format;
    for (const radio of all('size')) radio.checked = radio.value === state.size;
    for (const radio of all('orientation')) radio.checked = radio.value === state.orientation;
    for (const radio of all('ratio')) radio.checked = radio.value === state.crop.ratio;
    for (const name of ['zoom', 'horizontal', 'vertical']) find(name).value = String(state.crop[name]);
    find('zoom-value').textContent = `${state.crop.zoom}%`;
    const finishSelect = find('finish');
    const finishEntries = Object.entries(formats[state.format].finishes);
    if ([...finishSelect.options].map((option) => option.value).join('|') !== finishEntries.map(([value]) => value).join('|')) {
      finishSelect.replaceChildren(...finishEntries.map(([value, label]) => new Option(label, value)));
    }
    finishSelect.value = state.finish;
    const samples = all('sample');
    for (const sample of samples) {
      const selected = sample.dataset.sample === state.photo?.sample;
      sample.setAttribute('aria-pressed', String(selected));
    }
    const format = formats[state.format].label;
    const finish = formats[state.format].finishes[state.finish];
    const dimensions = `${printDimensions(state).join(' × ')} cm`;
    const orientation = state.orientation === 'portrait' ? 'Portrait' : 'Landscape';
    find('room-caption').textContent = `${format} · ${finish} · Illustrative preview, not to scale`;
    find('summary-format').textContent = format;
    find('summary-size').textContent = dimensions;
    find('summary-orientation').textContent = orientation;
    find('summary-photo').textContent = state.photo?.name || 'No photo selected';
    find('summary-crop').textContent = `${state.crop.ratio === 'print' ? 'Print proportions' : state.crop.ratio === 'original' ? 'Original proportions' : state.crop.ratio} · ${state.crop.zoom}% zoom${state.crop.rotation ? ` · ${state.crop.rotation}° rotation` : ''}`;
    find('summary-finish').textContent = finish;
    const crop = state.photo ? cropRectangle(state) : null;
    const [printWidth, printHeight] = printDimensions(state);
    const hasMargins = crop && Math.abs(crop.width * printHeight - crop.height * printWidth) > 0.000001;
    const quality = state.photo
      ? `${hasMargins ? 'Photo and print proportions differ. The preview includes white margins. Choose Print size in the crop controls to fill the print. ' : ''}Local estimate: approximately ${estimatePrintPpi(state)} PPI at ${dimensions}. Production quality has not been verified.`
      : 'Select a photo to see a local resolution estimate. Production quality has not been verified.';
    find('crop-quality').textContent = quality;
    find('review-quality').dataset.state = state.photo ? 'estimated' : 'unverified';
    find('review-quality-text').textContent = quality;
    for (const canvas of canvases) draw(canvas, canvas === find('crop-canvas'));
    if (viewChanged) animateFlow();
  }

  function cancelPending() {
    sequence += 1;
    pending?.cancel();
    pending = null;
    loading = false;
  }

  async function loadPhoto(source, file = null) {
    if (galleryBusy) {
      release(source);
      return;
    }
    cancelPending();
    const request = sequence;
    loading = true;
    error('');
    announce('Loading photo locally…');
    render();
    let photo = null;
    try {
      if (file) await validateFile(file);
      if (destroyed || request !== sequence) return;
      photo = file ? { url: URL.createObjectURL(file), name: file.name || 'Your photo', owned: true } : { ...source, owned: Boolean(source.owned) };
      const image = new Image();
      await new Promise((resolve, reject) => {
        const finish = (reason) => {
          clearTimeout(timer);
          image.onload = null;
          image.onerror = null;
          if (reason) reject(reason); else resolve();
        };
        const timer = setTimeout(() => finish(new Error('The photo took too long to open. Choose it again or try another image.')), 15000);
        pending = { cancel: () => { finish(new Error('cancelled')); image.src = ''; } };
        image.onload = () => finish();
        image.onerror = () => finish(new Error('This photo could not be opened. It may be damaged or HEIC may not be supported. Try a JPG, PNG or WebP.'));
        image.src = photo.url;
      });
      if (destroyed || request !== sequence) { release(photo); return; }
      if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 40000000) {
        throw new Error('Choose a photo with valid dimensions and no more than 40 megapixels for this local preview.');
      }
      if (file) {
        const galleryPhoto = await addToGallery(file, image);
        if (destroyed || request !== sequence) { release(photo); return; }
        photo.galleryId = galleryPhoto.id;
        photo.size = galleryPhoto.size;
      }
      release(state.photo);
      state.photo = { ...photo, image, width: image.naturalWidth, height: image.naturalHeight, size: file?.size || source?.size || 0 };
      state.crop = freshCrop();
      announce(source?.sample
        ? `${photo.name} sample selected.`
        : file && galleryUnavailable || source?.persisted === false
          ? `Selected ${photo.name}. Browser storage is unavailable, so it will remain only for this visit.`
          : `Selected ${photo.name}. Your photo is stored in this browser on this device only.`);
    } catch (reason) {
      release(photo);
      if (!destroyed && request === sequence) { error(reason.message); announce('Previous photo and choices retained.'); }
    } finally {
      if (!destroyed && request === sequence) {
        pending = null;
        loading = false;
        find('file').value = '';
        render();
      }
    }
  }

  function go(step) {
    if (!Number.isInteger(step) || step < 0 || step >= steps.length || (step > 0 && !state.photo)) return;
    if (navigationTimer) clearTimeout(navigationTimer);
    navigationTimer = 0;
    navigationLock = false;
    cancelPending();
    state.step = step;
    error('');
    render();
    find('title').focus();
    announce('');
  }
  const on = (target, event, handler) => target.addEventListener(event, handler, { signal: listeners.signal });
  const sampleDialog = find('sample-dialog');
  let sampleTrigger = null;
  const closeSampleDialog = () => {
    if (sampleDialog.open) sampleDialog.close();
    if (sampleTrigger?.getClientRects().length) sampleTrigger.focus();
  };
  const previewControl = find('preview-control');
  const previewHoverTargets = [find('preview-toggle'), find('print-preview')];
  for (const target of previewHoverTargets) {
    on(target, 'pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      previewDismissed = false;
      previewHovered = true;
      syncPreview();
    });
    on(target, 'pointerleave', (event) => {
      if (event.pointerType !== 'mouse' || previewControl.contains(event.relatedTarget)) return;
      previewHovered = false;
      syncPreview();
    });
  }
  on(previewControl, 'focusin', () => { previewFocused = true; syncPreview(); });
  on(previewControl, 'focusout', (event) => {
    if (previewControl.contains(event.relatedTarget)) return;
    previewFocused = false;
    previewDismissed = false;
    syncPreview();
  });
  on(previewControl, 'keydown', (event) => {
    if (event.key !== 'Escape') return;
    previewPinned = false;
    previewHovered = false;
    previewDismissed = true;
    syncPreview();
  });
  on(form, 'submit', (event) => {
    event.preventDefault();
    if (navigationLock || loading || state.step === 3) return;
    if (state.step > 0 && !state.photo) { error('Choose a photo before continuing.'); return; }
    go(state.step + 1);
    navigationLock = true;
    find('next').disabled = true;
    navigationTimer = setTimeout(() => {
      navigationLock = false;
      navigationTimer = 0;
      if (!destroyed) render();
    }, 250);
  });
  on(form, 'change', (event) => {
    const control = event.target;
    const hook = control.dataset.js;
    if (hook === 'file') {
      if (control.files?.length) loadPhoto(null, control.files[0]);
      return;
    }
    if (hook === 'format' && owns(formats, control.value)) {
      state.format = control.value;
      state.finish = Object.keys(formats[state.format].finishes)[0];
      announce(`${formats[state.format].label} selected. Illustrative finish options updated.`);
    } else if (hook === 'size' && owns(sizes, control.value)) {
      state.size = control.value;
      state.crop.ratio = 'print';
      announce('Crop updated to the selected print proportions. Print quality remains unverified.');
    } else if (hook === 'orientation' && ['landscape', 'portrait'].includes(control.value)) {
      state.orientation = control.value;
      state.crop.ratio = 'print';
      announce('Orientation and crop updated. Adjust the crop to keep important details in view.');
    } else if (hook === 'finish' && owns(formats[state.format].finishes, control.value)) {
      state.finish = control.value;
    } else if (hook === 'ratio' && ['original', '3:2', '4:3', '16:9', 'print'].includes(control.value)) {
      state.crop.ratio = control.value;
    }
    render();
  });
  on(form, 'input', (event) => {
    const hook = event.target.dataset.js;
    if (!['zoom', 'horizontal', 'vertical'].includes(hook)) return;
    const value = Number(event.target.value);
    if (!Number.isFinite(value)) return;
    state.crop[hook] = clamp(value, hook === 'zoom' ? 100 : 0, hook === 'zoom' ? 300 : 100);
    render();
  });
  let drag = null;
  const cropCanvas = find('crop-canvas');
  on(cropCanvas, 'pointerdown', (event) => {
    if (!state.photo || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, horizontal: state.crop.horizontal, vertical: state.crop.vertical };
    cropCanvas.dataset.dragging = 'true';
    cropCanvas.setPointerCapture(event.pointerId);
  });
  on(cropCanvas, 'pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const bounds = cropCanvas.getBoundingClientRect();
    state.crop.horizontal = clamp(drag.horizontal - (event.clientX - drag.x) / bounds.width * 100, 0, 100);
    state.crop.vertical = clamp(drag.vertical - (event.clientY - drag.y) / bounds.height * 100, 0, 100);
    render();
  });
  const finishDrag = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    drag = null;
    delete cropCanvas.dataset.dragging;
    announce('Crop position updated.');
  };
  on(cropCanvas, 'pointerup', finishDrag);
  on(cropCanvas, 'pointercancel', finishDrag);
  on(form, 'click', (event) => {
    if (!previewControl.contains(event.target) && (previewPinned || previewFocused)) {
      previewPinned = false;
      previewDismissed = previewFocused;
      syncPreview();
    }
    const control = event.target.closest('button[data-js]');
    if (!control || !form.contains(control)) return;
    switch (control.dataset.js) {
      case 'preview-toggle':
        previewDismissed = false;
        previewPinned = !previewPinned;
        syncPreview();
        break;
      case 'change-photo': find('file').click(); break;
      case 'add-photo': find('file').click(); break;
      case 'gallery-more': galleryVisibleCount += 20; renderGallery(); break;
      case 'sample-open': sampleTrigger = control; sampleDialog.showModal(); break;
      case 'delete-all': deleteAllPhotos(); break;
      case 'sample-close': closeSampleDialog(); break;
      case 'back': go(state.step - 1); break;
      case 'edit-photo': go(0); break;
      case 'edit-options': go(1); break;
      case 'edit-crop': go(2); break;
      case 'adjust-crop': go(2); break;
      case 'gallery-select': {
        const photo = state.gallery.find((entry) => entry.id === control.dataset.photoId);
        if (photo) loadPhoto({ ...photo, url: URL.createObjectURL(photo.blob), owned: true, galleryId: photo.id });
        break;
      }
      case 'gallery-delete':
        event.preventDefault();
        event.stopPropagation();
        control.closest('details')?.removeAttribute('open');
        deleteGalleryPhoto(control.dataset.photoId);
        break;
      case 'sample': {
        const key = control.dataset.sample;
        if (owns(samples, key)) {
          closeSampleDialog();
          loadPhoto({ ...samples[key], sample: key });
        }
        break;
      }
      case 'cancel-load': cancelPending(); render(); announce('Loading cancelled. Previous photo retained.'); break;
      case 'reset-crop': state.crop = freshCrop(); render(); announce('Crop reset.'); break;
      case 'rotate': state.crop.rotation = (state.crop.rotation + 90) % 360; render(); announce(`Photo rotated ${state.crop.rotation} degrees.`); break;
      case 'download': {
        if (!state.photo) break;
        try {
          if (downloadUrl) URL.revokeObjectURL(downloadUrl);
          const canvas = find('print-canvas');
          const request = sequence;
          canvas.toBlob((blob) => {
            if (request !== sequence) return;
            if (!blob || destroyed) { if (!destroyed) error('The preview could not be downloaded. Try again.'); return; }
            if (downloadUrl) URL.revokeObjectURL(downloadUrl);
            downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'wall-art-preview.png';
            link.hidden = true;
            form.append(link);
            link.click();
            link.remove();
            announce('Preview download requested. This is not a print-ready file.');
          }, 'image/png');
        } catch { error('The preview could not be downloaded. Try again.'); }
        break;
      }
    }
  });
  on(sampleDialog, 'click', (event) => {
    if (event.target === sampleDialog) closeSampleDialog();
  });
  on(sampleDialog, 'keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    closeSampleDialog();
  });
  on(sampleDialog, 'cancel', (event) => {
    event.preventDefault();
    closeSampleDialog();
  });
  const dropZone = find('drop-zone');
  on(dropZone, 'dragover', (event) => { event.preventDefault(); dropZone.classList.add('is-dragging'); });
  on(dropZone, 'dragleave', (event) => { if (!dropZone.contains(event.relatedTarget)) dropZone.classList.remove('is-dragging'); });
  on(dropZone, 'drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('is-dragging');
    const files = event.dataTransfer?.files;
    if (files?.length !== 1) { error('Drop one image file at a time.'); return; }
    loadPhoto(null, files[0]);
  });
  form.hidden = false;
  render();
  restoreGallery();

  return () => {
    destroyed = true;
    cancelPending();
    if (transitionTimer) clearTimeout(transitionTimer);
    if (navigationTimer) clearTimeout(navigationTimer);
    listeners.abort();
    release(state.photo);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    for (const url of galleryUrls.values()) URL.revokeObjectURL(url);
    galleryUrls.clear();
    galleryDatabase?.close();
    for (const canvas of canvases) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    form.hidden = true;
  };
}

/** Initialise local wall-art flows without adding duplicate listeners. */
export function init(root = document) {
  for (const element of roots(root)) {
    if (instances.has(element)) continue;
    const dispose = createInstance(element);
    if (dispose) instances.set(element, dispose);
  }
}

/** Cancel pending work and release local photo resources. */
export function destroy(root = document) {
  for (const element of roots(root)) {
    instances.get(element)?.();
    instances.delete(element);
  }
}