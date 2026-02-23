chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'pick') {
    const movies = document.querySelectorAll('li.griditem .react-component');
    const films = Array.from(movies).map(movie => ({
      name: movie.dataset.itemName,
      poster: movie.querySelector('img')?.src.replace(/-0-\d+-0-\d+-crop/, '-0-500-0-750-crop'),
      link: movie.dataset.targetLink
    }));
    const randomFilm = films[Math.floor(Math.random() * films.length)];
    sendResponse({ film: randomFilm });
  }
  return true;
});