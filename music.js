const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const songTitleEl = document.getElementById('song-title');
const volumeBar = document.getElementById('volume-bar');
const volumeIcon = document.getElementById('volume-icon');
const suffleBtn = document.getElementById('suffle');
const timerBtn = document.getElementById('timer');

let isShuffle = false; 
let isTimerActive = false; 
let timer; 
let songIndex = 0;
let lastVolume = 0.5; // Default volume


// Songs and their titles
const songs = [
    { name: 'Govind Bolo', file: 'songs/Govind Bolo.mp3' },
    { name: 'Ab Saunp Diya', file: 'songs/Ab-Saunp-Diya.mp3' },
    { name: 'Raam Aayenge', file: 'songs/Raam Aayenge.mp3' },
    { name: 'Ram Siya Ram', file: 'songs/Ram Siya Ram.mp3' },
    { name: 'Zaroor', file: 'songs/Zaroor.mp3' },
    { name: 'Dil Tu Jaan TU', file: 'songs/Dil_Tu_Jaan_Tu.mp3' },
    { name: 'Ishq', file: 'songs/Ishq.mp3' },
    { name: 'Maahi', file: 'songs/Maahi.mp3' },
    { name: 'Samjhawan', file: 'songs/Samjhawan.mp3' },
    { name: 'Jo Tum Na Ho', file: 'songs/Jo Tum Na Ho.mp3' },
    { name: 'Vibe', file: 'songs/Vibe.mp3' },
    { name: 'Teri Baton Mein ~Satish', file: 'songs/Teri Baton mein.mp3' },
    { name: 'Black', file: 'songs/Black.mp3'},
    { name: 'Banjaara', file: 'songs/Banjaara.mp3'},
    { name: 'Hass Hass', file: 'songs/Hass Hass.mp3'},
    { name: 'God Damn', file: 'songs/God Damn.mp3' }
];

// Load song & update title
function loadSong(song) {
    audio.src = song.file;
    songTitleEl.textContent = song.name;
    audio.load();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; // play button is reset to play when loading a new song
    updateVolume();
}

// Play & pause music
function playPauseMusic() {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; // Change to pause when playing
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; // Change to play when paused
    }
}


audio.addEventListener('ended', () => {
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; // Reset to play icon when the song ends
});



// Next song
function nextSong() {
    if (isShuffle) {
        songIndex = Math.floor(Math.random() * songs.length); // Shuffle mode
    } else {
        songIndex = (songIndex + 1) % songs.length; // Normal mode
    }

    loadSong(songs[songIndex]);
    audio.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; //play button stays as pause when playing next song
}

// Previous song
function prevSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    audio.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

// update play button to "play" when song ends
function updatePlayButtonOnEnd() {
    if (isShuffle) {
        songIndex = Math.floor(Math.random() * songs.length); 
        loadSong(songs[songIndex]); 
        audio.play(); 
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; 
    } else {
        //Stop the song and reset to play button when song ends
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
}


// Update progress bar and background
function updateProgressBar() {
    if (!isNaN(audio.duration)) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
        progressBar.style.background = `linear-gradient(to right, #c6c2c2 ${progressPercent}%, #393939d5 ${progressPercent}%)`;

        // Update current time and duration display
        let currentMinutes = Math.floor(audio.currentTime / 60);
        let currentSeconds = Math.floor(audio.currentTime % 60);
        let durationMinutes = Math.floor(audio.duration / 60);
        let durationSeconds = Math.floor(audio.duration % 60);

        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
        durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }
}



// Set progress bar manually when clicked
function setProgress(s) {
    const width = this.clientWidth;
    let offsetX;

    if (s.type === 'click') {
        offsetX = s.offsetX;
    } else if (s.type === 'touchstart' || s.type === 'touchmove') {
        const touch = s.touches[0];
        offsetX = touch.clientX - this.getBoundingClientRect().left;
    }

    const duration = audio.duration;

    if (!isNaN(duration)) {
        audio.currentTime = (offsetX / width) * duration;
    }
}

// Click & touch for progress bar
progressBar.addEventListener('click', setProgress);
progressBar.addEventListener('touchstart', setProgress);
progressBar.addEventListener('touchmove', setProgress);



// Mute/Unmute functionality
volumeIcon.addEventListener('click', () => {
    if (audio.volume > 0) {
        lastVolume = audio.volume;
        audio.volume = 0;
        volumeBar.value = 0;
    } else {
        audio.volume = lastVolume;
        volumeBar.value = lastVolume * 100;
    }
    updateVolume();
});

// Mute/unmute on hover
volumeIcon.addEventListener('mouseover', () => {
    if (audio.volume > 0) {
        volumeIcon.className = 'fa-solid fa-volume-mute'; 
    } else {
        volumeIcon.className = 'fa-solid fa-volume-up'; 
    }
});

volumeIcon.addEventListener('mouseleave', () => {
    updateVolume(); // Reset the icon to match the actual volume 
});

// Volume control
function updateVolume() {
    audio.volume = volumeBar.value / 100;

    // Update volume bar background based on volume
    volumeBar.style.background = `linear-gradient(to right, #c6c2c2 ${audio.volume * 100}%, #393939d5 ${audio.volume * 100}%)`;

    // Update volume icon based on volume level
    if (audio.volume === 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else if (audio.volume <= 0.5) {
        volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high';
    }
}


// Shuffle mode background 
suffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle; 
    if (isShuffle) {
        suffleBtn.style.backgroundColor = '#393939d5'; // Highlight shuffle button

        //automatically pick and play a random song when shuffle is activated
        songIndex = Math.floor(Math.random() * songs.length);
        loadSong(songs[songIndex]); 
        audio.play(); 
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; 
    } else {
        suffleBtn.style.backgroundColor = ''; // Reset shuffle button background 
        audio.pause(); // Stop the music if shuffle is deactivated
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
});



// Timer function and background 
timerBtn.addEventListener('click', () => {
    isTimerActive = !isTimerActive; 
    if (isTimerActive) {
        const duration = prompt('Set timer duration in minutes (5, 10, 30, 60):', 5);
        const durationMs = parseInt(duration) * 60000;

        // Start timer
        timer = setTimeout(() => {
            pauseMusic(); 
            isTimerActive = false;
            timerBtn.style.backgroundColor = ''; 
        }, durationMs);

        timerBtn.style.backgroundColor = '#393939d5'; 
    } else {
        clearTimeout(timer);
        timerBtn.style.backgroundColor = '';
    }
});


// Load initial song
window.addEventListener('load', () => {
    loadSong(songs[songIndex]);
    volumeBar.value = 50;
    audio.volume = 0.5;
    updateVolume();
});

// Event listeners for buttons
playBtn.addEventListener('click', playPauseMusic);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
audio.addEventListener('timeupdate', updateProgressBar);
volumeBar.addEventListener('input', updateVolume);
audio.addEventListener('ended', updatePlayButtonOnEnd);
