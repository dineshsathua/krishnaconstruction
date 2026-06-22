/* =========================================================
   KRISHNA CONSTRUCTION — HOME PAGE JAVASCRIPT
   js/home.js  |  Loaded only on index.html
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Animated stat counters ───────────────────────── */
    const counters = document.querySelectorAll('[data-count]');

    if (counters.length > 0) {
        const countObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el      = entry.target;
                const end     = parseFloat(el.dataset.count);
                const isFloat = el.dataset.count.includes('.');
                const suffix  = el.dataset.suffix ?? '';
                const prefix  = el.dataset.prefix ?? '';
                const dur     = 2000; // ms
                const step    = 16;  // ~60fps
                const inc     = end / (dur / step);
                let   cur     = 0;

                const tick = () => {
                    cur += inc;
                    if (cur >= end) {
                        el.textContent = prefix + (isFloat ? end.toFixed(1) : Math.floor(end)) + suffix;
                    } else {
                        el.textContent = prefix + (isFloat ? cur.toFixed(1) : Math.floor(cur)) + suffix;
                        requestAnimationFrame(tick);
                    }
                };
                requestAnimationFrame(tick);
                countObs.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(el => countObs.observe(el));
    }

    /* ── Hero dashboard progress bars animate in ─────── */
    const progBars = document.querySelectorAll('.prog-bar');
    if (progBars.length > 0) {
        // Store target widths, set to 0 initially, then animate
        progBars.forEach(bar => {
            const target = bar.style.width;
            bar.dataset.targetWidth = target;
            bar.style.width = '0%';
        });

        setTimeout(() => {
            progBars.forEach(bar => {
                bar.style.width = bar.dataset.targetWidth;
            });
        }, 400);
    }

});
