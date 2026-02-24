// State management
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const url = tabs[0].url;

  if (url.includes('letterboxd.com') && url.includes('/watchlist')) {
    document.getElementById('not-on-watchlist').classList.add('hidden');
    document.getElementById('on-watchlist').classList.remove('hidden');
  } else {
    const { username } = await chrome.storage.local.get('username');
    if (username) {
      document.getElementById('not-on-watchlist').classList.add('hidden');
      document.getElementById('welcome-username').textContent = username;
      document.getElementById('welcome-back').classList.remove('hidden');
    }
  }
});

// Go to watchlist
async function goToWatchlist() {
  const username = document.getElementById('username').value;
  if (username) {
    await chrome.storage.local.set({ username });
    chrome.tabs.create({ url: `https://letterboxd.com/${username}/watchlist/` });
  }
}

document.getElementById('go-btn').addEventListener('click', goToWatchlist);

document.getElementById('welcome-go-btn').addEventListener('click', async () => {
  const { username } = await chrome.storage.local.get('username');
  if (username) {
    chrome.tabs.create({ url: `https://letterboxd.com/${username}/watchlist/` });
  }
});

document.getElementById('change-user-btn').addEventListener('click', () => {
  document.getElementById('welcome-back').classList.add('hidden');
  document.getElementById('not-on-watchlist').classList.remove('hidden');
  document.getElementById('username').focus();
});

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