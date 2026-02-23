chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'pick') {
    const movies = document.querySelectorAll('li.griditem .react-component');
    const films = Array.from(movies).map(movie => movie.dataset.itemName);
    const randomFilm = films[Math.floor(Math.random() * films.length)];
    sendResponse({ film: randomFilm });
  }
  return true;
});