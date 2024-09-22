
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


//songs and titles
const songs = [
    { name: 'Zaroor', file: 'Zaroor.mp3' },
    { name: 'Dil Tu Jaan TU', file: 'Dil_Tu_Jaan_Tu.mp3' },
    { name: 'Ishq', file: 'Ishq.mp3' },
    { name: 'Maahi', file: 'Maahi.mp3' },
    { name: 'Samjhawan', file: 'Samjhawan.mp3' },
    { name: 'Jo Tum Na Ho', file: 'Jo Tum Na Ho.mp3' },
    { name: 'Vibe', file: 'Vibe.mp3' },
    { name: 'Teri Baton Mein ~Satish', file: 'Teri Baton mein.mp3' },
    { name: 'God Damn', file: 'God Damn.mp3' }
];


let songIndex = 0;


// Load song & update title
function loadSong(song) {
    audio.src = song.file; 
    songTitleEl.textContent = song.name;
    audio.load(); 
   // audio.play(); 
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; 
    updateVolume(); 
}

// Play & pause 
function playPauseMusic() {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
}

//Next-song
function nextSong() {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
}

//Previous-song
function prevSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
}


//progress-bar background
function updateProgressBar() {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
        progressBar.style.background = `linear-gradient(to right,#c6c2c2 ${progressPercent}%, #393939d5 ${progressPercent}%)`;

        let currentMinutes = Math.floor(audio.currentTime / 60);
        let currentSeconds = Math.floor(audio.currentTime % 60);
        let durationMinutes = Math.floor(audio.duration / 60);
        let durationSeconds = Math.floor(audio.duration % 60);

        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
        durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }
}


//progress bar when clicked
progressBar.addEventListener('click', function(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
});




let lastVolume = 0.5; 


// Mute/Unmute 
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


// Volume control
function updateVolume() {
    audio.volume = volumeBar.value / 100;

    //volume bar background based on the current volume
    volumeBar.style.background = `linear-gradient(to right, #c6c2c2 ${audio.volume * 100}%, #393939d5 ${audio.volume * 100}%)`;

    // volume icon based on the current volume
    if (audio.volume === 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else if (audio.volume <= 0.5) {
        volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high';
    }
}


volumeBar.addEventListener('input', updateVolume);


window.addEventListener('load', () => {
    loadSong(songs[songIndex]);
    volumeBar.value = 50;
    audio.volume = 0.5;  
    updateVolume();  
});


playBtn.addEventListener('click', playPauseMusic);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
audio.addEventListener('timeupdate', updateProgressBar);
volumeBar.addEventListener('input', updateVolume);


