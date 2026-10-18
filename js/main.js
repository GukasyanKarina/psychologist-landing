// Mobile nav toggle
var navToggle = document.getElementById('nav-toggle');
var mainNav = document.getElementById('main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll-reveal animation
var revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach(function (el) { observer.observe(el); });
} else {
  revealEls.forEach(function (el) { el.classList.add('is-visible'); });
}

// Diploma slider — scroll one slide width per click
document.querySelectorAll('.slider').forEach(function (slider) {
  var track = slider.querySelector('.slider-track');
  var prevBtn = slider.querySelector('.slider-prev');
  var nextBtn = slider.querySelector('.slider-next');
  if (!track) return;
  function scrollByOneSlide(direction) {
    var slide = track.querySelector('.slider-slide');
    var amount = slide ? slide.getBoundingClientRect().width + 20 : track.clientWidth;
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }
  if (prevBtn) prevBtn.addEventListener('click', function () { scrollByOneSlide(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { scrollByOneSlide(1); });
});

// Lightbox — click a diploma slide to see it full size
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightbox-img');
var lightboxClose = document.getElementById('lightbox-close');
if (lightbox && lightboxImg) {
  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
  }
  document.querySelectorAll('.slider-slide').forEach(function (img) {
    img.addEventListener('click', function () { openLightbox(img.src, img.alt); });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}

// Accordion — working rules section
document.querySelectorAll('.accordion-item').forEach(function (item) {
  var trigger = item.querySelector('.accordion-trigger');
  var panel = item.querySelector('.accordion-panel');
  var icon = item.querySelector('.accordion-icon');
  if (!trigger || !panel) return;
  trigger.addEventListener('click', function () {
    var isOpen = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    panel.hidden = isOpen;
    if (icon) icon.textContent = isOpen ? '+' : '×';
  });
});

// Voice player — under the about photo; the "About me" nav link also starts it
var audioPlayer = document.querySelector('.audio-player');
if (audioPlayer) {
  var audio = audioPlayer.querySelector('audio');
  var audioToggle = audioPlayer.querySelector('.audio-toggle');
  var audioProgress = audioPlayer.querySelector('.audio-progress');
  var audioFill = audioPlayer.querySelector('.audio-progress-fill');
  var audioTime = audioPlayer.querySelector('.audio-time');

  function formatTime(seconds) {
    if (!isFinite(seconds)) return '0:00';
    var s = Math.floor(seconds);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  function playAudio() {
    var playing = audio.play();
    // play() can reject (e.g. file missing) — just leave the player paused
    if (playing && playing.catch) playing.catch(function () {});
  }
  function setPlayingState(isPlaying) {
    audioPlayer.classList.toggle('is-playing', isPlaying);
    audioToggle.setAttribute('aria-label', isPlaying ? audioPlayer.dataset.labelPause : audioPlayer.dataset.labelPlay);
  }
  function seekTo(fraction) {
    if (!isFinite(audio.duration)) return;
    audio.currentTime = Math.min(Math.max(fraction, 0), 1) * audio.duration;
  }

  audioToggle.addEventListener('click', function () {
    if (audio.paused) playAudio(); else audio.pause();
  });
  audio.addEventListener('play', function () { setPlayingState(true); });
  audio.addEventListener('pause', function () { setPlayingState(false); });
  audio.addEventListener('ended', function () { audio.currentTime = 0; });
  audio.addEventListener('loadedmetadata', function () { audioTime.textContent = formatTime(audio.duration); });
  audio.addEventListener('timeupdate', function () {
    var fraction = audio.duration ? audio.currentTime / audio.duration : 0;
    audioFill.style.width = (fraction * 100) + '%';
    audioProgress.setAttribute('aria-valuenow', Math.round(fraction * 100));
    audioTime.textContent = formatTime(audio.paused && audio.currentTime === 0 ? audio.duration : audio.currentTime);
  });
  audioProgress.addEventListener('click', function (event) {
    var rect = audioProgress.getBoundingClientRect();
    seekTo((event.clientX - rect.left) / rect.width);
  });
  audioProgress.addEventListener('keydown', function (event) {
    if (!audio.duration) return;
    if (event.key === 'ArrowRight') { seekTo((audio.currentTime + 5) / audio.duration); event.preventDefault(); }
    if (event.key === 'ArrowLeft') { seekTo((audio.currentTime - 5) / audio.duration); event.preventDefault(); }
  });

  document.querySelectorAll('a[href="#about"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (audio.paused) playAudio();
    });
  });
}

// Cookie consent banner — off until tracking scripts (Meta Pixel / GA) are added.
// Set TRACKING_ENABLED to true at that point so the banner shows again.
var TRACKING_ENABLED = false;
var cookieBanner = document.getElementById('cookie-banner');
var cookieAccept = document.getElementById('cookie-accept');
if (TRACKING_ENABLED && cookieBanner && cookieAccept) {
  var COOKIE_CONSENT_KEY = 'cookie-consent';
  try {
    if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
      cookieBanner.hidden = false;
    }
  } catch (e) {
    // localStorage unavailable (e.g. private mode) — skip the banner rather than showing it every load
  }
  cookieAccept.addEventListener('click', function () {
    try { localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted'); } catch (e) {}
    cookieBanner.hidden = true;
  });
}
// TODO: once Google Analytics / Meta Pixel are added, only load those scripts
// after localStorage.getItem('cookie-consent') === 'accepted'.

// Footer year
var yearEl = document.getElementById('year');
if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
