const songs = [
  {
    title: "Dreamer",
    artist: "AudioCoffee",
    src: "https://cdn.pixabay.com/audio/2023/04/04/audio_59ad9d9411.mp3"
  },
  {
    title: "Epic Motivation",
    artist: "Daddy's Music",
    src: "https://cdn.pixabay.com/audio/2023/03/30/audio_d0e5e940db.mp3"
  },
  {
    title: "Relaxing Vibes",
    artist: "Olexy",
    src: "https://cdn.pixabay.com/audio/2021/08/08/audio_c7d3ad5da9.mp3"
  }
];

let currentIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playPauseBtn = document.getElementById("playPauseBtn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  } else {
    audio.play();
    playPauseBtn.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  playSelected();
}

function nextSong() {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  playSelected();
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  alert("Repeat: " + (isRepeat ? "ON" : "OFF"));
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  alert("Shuffle: " + (isShuffle ? "ON" : "OFF"));
}

function playSelected() {
  loadSong(songs[currentIndex]);
  updatePlaylistUI();
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸️";
}

function updatePlaylistUI() {
  [...playlistEl.children].forEach((li, i) => {
    li.classList.toggle("active", i === currentIndex);
  });
}

audio.addEventListener("timeupdate", () => {
  const { duration, currentTime } = audio;
  const percent = (currentTime / duration) * 100;
  progress.style.width = percent + "%";
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

function setProgress(e) {
  const width = e.currentTarget.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
}

function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    playSelected();
  } else {
    nextSong();
  }
});

function buildPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener("click", () => {
      currentIndex = index;
      playSelected();
    });
    playlistEl.appendChild(li);
  });
}

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

document.querySelector(".progress-container").addEventListener("click", setProgress);

// INIT
loadSong(songs[currentIndex]);
buildPlaylist();
updatePlaylistUI();
