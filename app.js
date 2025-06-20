document.addEventListener('DOMContentLoaded', () => {
  const API_CHANNELS = 'https://iptv-org.github.io/api/channels.json';
  const API_STREAMS = 'https://iptv-org.github.io/api/streams.json';

  const container = document.getElementById('channelContainer');
  const searchInput = document.getElementById('search');
  const videoSource = document.getElementById('videoSource');
  const playerTitle = document.getElementById('currentChannel');
  const player = videojs('tvPlayer');
  const themeToggle = document.getElementById('themeToggle');

  let allChannels = [];
  const streamsMap = new Map();

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  fetch(API_STREAMS)
    .then(res => res.json())
    .then(streams => {
      streams.forEach(s => {
        if (s.channel && s.url.includes('.m3u8')) {
          streamsMap.set(s.channel, s.url);
        }
      });
      return fetch(API_CHANNELS);
    })
    .then(res => res.json())
    .then(channels => {
      allChannels = channels.filter(c => c.logo && streamsMap.has(c.id));
      displayChannels(allChannels);
    });

  function displayChannels(channels) {
    container.innerHTML = '';
    channels.forEach(channel => {
      const div = document.createElement('div');
      div.className = 'channel-card';
      div.innerHTML = `
        <img src="${channel.logo}" alt="${channel.name}" class="channel-logo">
        <p>${channel.name}</p>
      `;
      div.addEventListener('click', () => {
        playChannel(channel.name, streamsMap.get(channel.id));
      });
      container.appendChild(div);
    });
  }

  function playChannel(name, url) {
    playerTitle.textContent = `En direct : ${name}`;
    player.src({ type: 'application/x-mpegURL', src: url });
    player.play();
  }

  searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();
    const filtered = allChannels.filter(c => c.name.toLowerCase().includes(value));
    displayChannels(filtered);
  });
});
