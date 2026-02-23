// State management
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0].url;

  if (url.includes('letterboxd.com') && url.includes('/watchlist')) {
    document.getElementById('not-on-watchlist').classList.add('hidden');
    document.getElementById('on-watchlist').classList.remove('hidden');
  }
});

// Go to watchlist
function goToWatchlist() {
  const username = document.getElementById('username').value;
  if (username) {
    chrome.tabs.create({ url: `https://letterboxd.com/${username}/watchlist/` });
  }
}

document.getElementById('go-btn').addEventListener('click', goToWatchlist);

document.getElementById('username').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') goToWatchlist();
});

document.getElementById('username').focus();


document.getElementById('pick-btn').addEventListener('click', sendMessage);

const resultPoster = document.getElementById('result-poster');

function sendMessage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'pick' }, (response) => {
      document.getElementById('on-watchlist').classList.add('hidden');
      document.getElementById('result-name').textContent = response.film.name;
      document.getElementById('result-link').href = `https://letterboxd.com${response.film.link}`;
      document.getElementById('result').classList.remove('hidden');

      if (response.film.poster) {
        resultPoster.style.display = '';
        resultPoster.alt = response.film.name;
        resultPoster.src = response.film.poster;
      } else {
        resultPoster.style.display = 'none';
      }
    });
  });
}

// Hide image when it fails to load (e.g. lazy loading, 404, CORS)
resultPoster.addEventListener('error', () => {
  resultPoster.style.display = 'none';
});

document.getElementById('pick-again-btn').addEventListener('click', sendMessage);