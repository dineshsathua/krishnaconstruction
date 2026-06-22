/* =========================================================
   KRISHNA CONSTRUCTION — SHARED JAVASCRIPT
   js/main.js  |  Loaded on every page
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. Init Lucide Icons ─────────────────────────── */
    if (typeof lucide !== 'undefined') lucide.createIcons();

    /* ── 2. Navbar scroll behaviour ──────────────────── */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 55);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run once on load
    }

    /* ── 3. Mobile menu toggle ────────────────────────── */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    let   menuOpen   = false;

    function setMenu(open) {
        menuOpen = open;
        hamburger?.classList.toggle('menu-open', open);
        mobileMenu?.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger?.addEventListener('click', () => setMenu(!menuOpen));

    // Close on mobile link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
        if (menuOpen && !navbar?.contains(e.target)) setMenu(false);
    });

    /* ── 4. Smooth scroll (offset for sticky nav) ─────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = (navbar?.offsetHeight ?? 70) + 12;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            if (menuOpen) setMenu(false);
        });
    });

    /* ── 5. Active nav link (based on current filename) ─ */
    const rawPath   = window.location.pathname.split('/').pop();
    const pageName  = rawPath === '' ? 'index.html' : rawPath;

    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        const linkPage = link.getAttribute('data-page');
        const isHome   = (linkPage === 'index.html' || linkPage === 'home') &&
                         (pageName === '' || pageName === 'index.html');
        const isMatch  = linkPage === pageName;
        if (isHome || isMatch) link.classList.add('active');
    });

    document.querySelectorAll('.mobile-nav-link[data-page]').forEach(link => {
        const linkPage = link.getAttribute('data-page');
        const isHome   = (linkPage === 'index.html' || linkPage === 'home') &&
                         (pageName === '' || pageName === 'index.html');
        const isMatch  = linkPage === pageName;
        if (isHome || isMatch) link.classList.add('active');
    });

    /* ── 6. Scroll-reveal (IntersectionObserver) ─────── */
    window.initScrollReveal = (container = document) => {
        const revealSelectors = ['.reveal', '.reveal-left', '.reveal-right'];
        const allRevealEls    = container.querySelectorAll(revealSelectors.join(','));

        if (allRevealEls.length > 0 && typeof IntersectionObserver !== 'undefined') {
            const revealObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

            allRevealEls.forEach(el => revealObs.observe(el));
        }
    };

    window.initScrollReveal();

    /* ── 7. Re-init icons after dynamic DOM changes ───── */
    window.reinitIcons = () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    /* ── 8. Background audio: fade in on first scroll, fade out at end ── */
    const BG_AUDIO_SRC    = 'audio/Krishna%20Flute.mp3';
    const BG_TARGET_VOL   = 0.5;   // peak volume once faded in
    const FADE_IN_MS      = 3000;  // fade-in duration
    const FADE_OUT_LEAD_S = 4;     // start fading out this many seconds before track ends

    const bgAudio = new Audio(BG_AUDIO_SRC);
    bgAudio.volume = 0;
    bgAudio.preload = 'auto';

    let fadeInterval = null;
    const clearFade = () => { if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; } };

    const fadeVolume = (to, durationMs) => {
        clearFade();
        const from  = bgAudio.volume;
        const steps = Math.max(1, Math.round(durationMs / 50));
        const step  = (to - from) / steps;
        let count = 0;
        fadeInterval = setInterval(() => {
            count++;
            const next = from + step * count;
            bgAudio.volume = Math.min(1, Math.max(0, count >= steps ? to : next));
            if (count >= steps) clearFade();
        }, 50);
    };

    let started = false;
    const startBgAudio = () => {
        if (started) return;
        started = true;
        bgAudio.play().then(() => fadeVolume(BG_TARGET_VOL, FADE_IN_MS)).catch(() => { started = false; });
        window.removeEventListener('scroll', startBgAudio);
    };
    window.addEventListener('scroll', startBgAudio, { passive: true });

    bgAudio.addEventListener('timeupdate', () => {
        if (bgAudio.duration && bgAudio.duration - bgAudio.currentTime <= FADE_OUT_LEAD_S) {
            fadeVolume(0, FADE_OUT_LEAD_S * 1000);
        }
    });

});
