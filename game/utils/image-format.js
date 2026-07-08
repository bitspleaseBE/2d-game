// Detect WebP support once per session so story cinematics can load the
// smaller format in modern browsers while keeping PNG fallbacks elsewhere.

let webpSupportPromise = null;

export function supportsWebP() {
  if (!webpSupportPromise) {
    webpSupportPromise = new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image.width > 0 && image.height > 0);
      image.onerror = () => resolve(false);
      image.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygAAEcmAAATgAAA";
    });
  }
  return webpSupportPromise;
}
