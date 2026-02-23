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

function sendMessage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'pick' }, (response) => {
      document.getElementById('result').textContent = response.film;
      document.getElementById('on-watchlist').classList.add('hidden');
      document.getElementById('film-result').classList.remove('hidden');
    });
  });
}