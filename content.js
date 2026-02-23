function getPosterUrl(img) {
  if (!img) return null;
  // Lazy-loaded images may use data-src or srcset instead of src
  let url = img.dataset.src || img.src || img.getAttribute('data-src');
  if (!url && img.srcset) {
    url = img.srcset.split(',')[0].trim().split(/\s+/)[0];
  }
  if (!url || url.startsWith('data:')) return null;
  return url.replace(/-0-\d+-0-\d+-crop/, '-0-500-0-750-crop');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'pick') {
    const movies = document.querySelectorAll('li.griditem .react-component');
    const films = Array.from(movies).map(movie => {
      const poster = getPosterUrl(movie.querySelector('img'));
      return {
        name: movie.dataset.itemName,
        poster,
        link: movie.dataset.targetLink
      };
    });
    const randomFilm = films[Math.floor(Math.random() * films.length)];
    sendResponse({ film: randomFilm });
  }
  return true;
});