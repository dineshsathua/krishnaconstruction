/* =========================================================
   KRISHNA CONSTRUCTION — PROJECTS PAGE JAVASCRIPT
   js/projects.js  |  Loaded only on projects.html
   ========================================================= */

window.initProjectsFilter = function() {
    const filterBtns   = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    // Reset initial state — all visible
    projectCards.forEach(card => {
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0) scale(1)';
        card.style.pointerEvents = 'auto';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease';
    });

    // Reset active button to 'all'
    const allBtn = Array.from(filterBtns).find(b => b.dataset.filter === 'all');
    if (allBtn) {
        filterBtns.forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');
    }

    // Set up click handlers by cloning buttons to clean up old event listeners
    filterBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });

    const freshBtns = document.querySelectorAll('.filter-btn');
    freshBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            freshBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const matchesStatus = filter === 'all'
                    || card.dataset.category  === filter
                    || card.dataset.dept      === filter;

                if (matchesStatus) {
                    card.style.display   = 'flex';
                    card.style.flexDirection = 'column';
                    void card.offsetWidth;
                    card.style.opacity   = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.pointerEvents = 'auto';
                } else {
                    card.style.opacity   = '0';
                    card.style.transform = 'translateY(10px) scale(0.96)';
                    card.style.pointerEvents = 'none';
                    setTimeout(() => {
                        const activeBtn = Array.from(freshBtns).find(b => b.classList.contains('active'));
                        const currentFilter = activeBtn ? activeBtn.dataset.filter : 'all';
                        const stillHidden = currentFilter !== 'all'
                            && card.dataset.category  !== currentFilter
                            && card.dataset.dept      !== currentFilter;
                        if (stillHidden) card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    // If cards already exist, initialize immediately
    if (document.querySelectorAll('.project-card').length > 0) {
        window.initProjectsFilter();
    }
});
