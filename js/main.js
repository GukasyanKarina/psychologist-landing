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
    img.addEventListener('click', function () { openLightbox(img.dataset.full || img.src, img.alt); });
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

// Cookie consent banner + Meta Pixel. The Pixel (and its cookies) loads only
// after the visitor clicks Accept; the choice itself is kept in localStorage.
var META_PIXEL_ID = '1647264933465842';
var COOKIE_CONSENT_KEY = 'cookie-consent';

function getConsent() {
  // undefined = localStorage unavailable (e.g. private mode), null = not chosen yet
  try { return localStorage.getItem(COOKIE_CONSENT_KEY); } catch (e) { return undefined; }
}
function setConsent(value) {
  try { localStorage.setItem(COOKIE_CONSENT_KEY, value); } catch (e) {}
}

function loadMetaPixel() {
  if (window.fbq) return;
  // Meta Pixel base code
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
}

var cookieBanner = document.getElementById('cookie-banner');
var cookieAccept = document.getElementById('cookie-accept');
var cookieDecline = document.getElementById('cookie-decline');
var consent = getConsent();
if (consent === 'accepted') {
  loadMetaPixel();
} else if (consent === null && cookieBanner) {
  cookieBanner.hidden = false;
}
if (cookieBanner && cookieAccept) {
  cookieAccept.addEventListener('click', function () {
    setConsent('accepted');
    cookieBanner.hidden = true;
    loadMetaPixel();
  });
}
if (cookieBanner && cookieDecline) {
  cookieDecline.addEventListener('click', function () {
    setConsent('declined');
    cookieBanner.hidden = true;
  });
}

// "Withdraw consent" link on the privacy pages
var cookieReset = document.getElementById('cookie-reset');
if (cookieReset) {
  cookieReset.addEventListener('click', function (event) {
    event.preventDefault();
    setConsent('declined');
    cookieReset.textContent = cookieReset.dataset.done;
  });
}

// Count messenger and phone clicks as Contact events — these are the bookings.
// Only fires when the Pixel was loaded, i.e. the visitor accepted cookies.
document.querySelectorAll('a[href^="https://t.me/"], a[href^="https://wa.me/"], a[href^="viber:"], a[href^="tel:"]').forEach(function (link) {
  link.addEventListener('click', function () {
    if (!window.fbq) return;
    var href = link.getAttribute('href');
    var channel = href.indexOf('t.me') !== -1 ? 'telegram'
      : href.indexOf('wa.me') !== -1 ? 'whatsapp'
      : href.indexOf('viber') === 0 ? 'viber' : 'phone';
    fbq('track', 'Contact', { channel: channel });
  });
});

// Footer year
var yearEl = document.getElementById('year');
if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
