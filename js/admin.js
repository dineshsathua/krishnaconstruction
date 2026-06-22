/* =========================================================
   KRISHNA CONSTRUCTION — ADMIN PANEL & EDITING SYSTEM
   js/admin.js | Handles Admin Authentication & Live Dashboard Editing
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // ── 1. CSS Injection for Admin UI ─────────────────────
    const adminStyles = `
        /* Admin Navbar Button styling overrides if needed */
        .admin-logged-in-btn {
            border-color: #ef4444 !important;
            color: #f87171 !important;
        }
        .admin-logged-in-btn:hover {
            background-color: rgba(239, 68, 68, 0.1) !important;
            color: #ef4444 !important;
            border-color: #ef4444 !important;
        }

        /* Modal Overlay */
        .admin-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .admin-modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* Modal Container */
        .admin-modal-container {
            background: rgba(30, 41, 59, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1.25rem;
            padding: 2.25rem;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            transform: scale(0.95);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            color: white;
            font-family: 'Inter', system-ui, sans-serif;
        }
        .admin-modal-overlay.active .admin-modal-container {
            transform: scale(1);
        }

        /* Modal Header */
        .admin-modal-title {
            font-size: 1.5rem;
            font-weight: 900;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #22d3ee, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .admin-modal-subtitle {
            font-size: 0.8125rem;
            color: #94a3b8;
            margin-bottom: 1.75rem;
        }

        /* Modal Forms */
        .admin-form-group {
            margin-bottom: 1.25rem;
        }
        .admin-label {
            display: block;
            font-size: 0.6875rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #94a3b8;
            margin-bottom: 0.5rem;
        }
        .admin-input {
            width: 100%;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.75rem;
            padding: 0.75rem 1rem;
            color: white;
            font-size: 0.875rem;
            transition: all 0.2s ease;
        }
        .admin-input:focus {
            outline: none;
            border-color: #22d3ee;
            box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.2);
            background: rgba(15, 23, 42, 0.8);
        }

        /* Buttons */
        .admin-btn-primary {
            width: 100%;
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            color: white;
            font-weight: 700;
            font-size: 0.875rem;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            margin-top: 1rem;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2);
        }
        .admin-btn-primary:hover {
            opacity: 0.95;
            box-shadow: 0 4px 16px rgba(6, 182, 212, 0.3);
        }
        .admin-btn-close {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            color: #94a3b8;
            transition: color 0.2s ease;
        }
        .admin-btn-close:hover {
            color: white;
        }
        .admin-error-msg {
            color: #ef4444;
            font-size: 0.75rem;
            font-weight: 600;
            margin-top: 0.5rem;
            display: none;
        }

        /* Dashboard Editor Styles */
        .dashboard-edit-form {
            background: rgba(15, 23, 42, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 0.875rem;
            padding: 1.25rem;
            margin-bottom: 1.25rem;
        }
        .edit-fields-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
        }
        @media (min-width: 640px) {
            .edit-fields-grid {
                grid-template-columns: 2fr 1fr 1.5fr 1fr;
            }
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = adminStyles;
    document.head.appendChild(styleEl);

    // ── 2. Dynamic Injection of Admin Login Modal HTML ──
    const modalHTML = `
        <div id="admin-modal" class="admin-modal-overlay">
            <div class="admin-modal-container relative">
                <button class="admin-btn-close" id="admin-modal-close" aria-label="Close modal">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div class="admin-modal-title">Admin Console</div>
                <div class="admin-modal-subtitle">Log in to update projects details and dashboard values.</div>
                
                <form id="admin-login-form">
                    <div class="admin-form-group">
                        <label class="admin-label" for="admin-username">Username</label>
                        <input class="admin-input" type="text" id="admin-username" required placeholder="Enter username">
                    </div>
                    <div class="admin-form-group">
                        <label class="admin-label" for="admin-password">Password</label>
                        <input class="admin-input" type="password" id="admin-password" required placeholder="Enter password">
                        <div id="admin-login-error" class="admin-error-msg">Invalid credentials. Please try again.</div>
                    </div>
                    <button type="submit" class="admin-btn-primary">Sign In</button>
                </form>
            </div>
        </div>
    `;
    const modalWrapper = document.createElement('div');
    modalWrapper.innerHTML = modalHTML;
    document.body.appendChild(modalWrapper.firstElementChild);

    // ── 3. Handle Login Modal Toggling & Auth ─────────────
    const adminModal = document.getElementById('admin-modal');
    const modalClose = document.getElementById('admin-modal-close');
    const loginForm = document.getElementById('admin-login-form');
    const usernameInput = document.getElementById('admin-username');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('admin-login-error');

    function checkAdminState() {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        // Update Desktop buttons
        document.querySelectorAll('#admin-btn').forEach(btn => {
            const span = btn.querySelector('span');
            const icon = btn.querySelector('i');
            
            let dot = btn.querySelector('.status-dot');
            if (!dot) {
                dot = document.createElement('span');
                dot.className = 'status-dot w-2 h-2 rounded-full inline-block';
                if (span) {
                    span.parentNode.insertBefore(dot, span);
                } else {
                    btn.appendChild(dot);
                }
            }
            
            if (isAdmin) {
                btn.classList.add('admin-logged-in-btn');
                if (span) span.textContent = 'Logout';
                dot.className = 'status-dot w-2 h-2 rounded-full inline-block bg-emerald-400 animate-pulse';
                if (icon) {
                    icon.setAttribute('data-lucide', 'unlock');
                }
            } else {
                btn.classList.remove('admin-logged-in-btn');
                if (span) span.textContent = 'Admin';
                dot.className = 'status-dot w-2 h-2 rounded-full inline-block bg-slate-500';
                if (icon) {
                    icon.setAttribute('data-lucide', 'lock');
                }
            }
        });

        // Update Mobile buttons
        document.querySelectorAll('#mobile-admin-btn').forEach(btn => {
            const span = btn.querySelector('span');
            const icon = btn.querySelector('i');
            
            let dot = btn.querySelector('.status-dot');
            if (!dot) {
                dot = document.createElement('span');
                dot.className = 'status-dot w-2 h-2 rounded-full inline-block';
                if (span) {
                    span.parentNode.insertBefore(dot, span);
                } else {
                    btn.appendChild(dot);
                }
            }
            
            if (isAdmin) {
                btn.classList.add('admin-logged-in-btn');
                if (span) span.textContent = 'Logout';
                dot.className = 'status-dot w-2 h-2 rounded-full inline-block bg-emerald-400 animate-pulse';
                if (icon) icon.setAttribute('data-lucide', 'unlock');
            } else {
                btn.classList.remove('admin-logged-in-btn');
                if (span) span.textContent = 'Admin Login';
                dot.className = 'status-dot w-2 h-2 rounded-full inline-block bg-slate-500';
                if (icon) icon.setAttribute('data-lucide', 'lock');
            }
        });

        // Refresh icons using window.reinitIcons if defined
        if (window.reinitIcons) {
            window.reinitIcons();
        }

        // Show/hide dashboard edit button on home page
        const editBtn = document.getElementById('edit-dashboard-btn');
        if (editBtn) {
            if (isAdmin) {
                editBtn.classList.remove('hidden');
                editBtn.classList.add('flex');
            } else {
                editBtn.classList.remove('flex');
                editBtn.classList.add('hidden');
                // Exit edit mode if logged out
                if (dashboardState.isEditing) {
                    toggleDashboardEdit(false);
                }
            }
        }

        // Show/hide featured projects edit button on home page
        const editFeaturedBtn = document.getElementById('edit-featured-btn');
        if (editFeaturedBtn) {
            if (isAdmin) {
                editFeaturedBtn.classList.remove('hidden');
                editFeaturedBtn.classList.add('flex');
            } else {
                editFeaturedBtn.classList.remove('flex');
                editFeaturedBtn.classList.add('hidden');
                // Exit edit mode if logged out
                if (featuredState.isEditing) {
                    toggleFeaturedEdit(false);
                }
            }
        }

        // Show/hide projects page administrative elements
        const portfolioToolbar = document.getElementById('admin-portfolio-toolbar');
        if (portfolioToolbar) {
            if (isAdmin) {
                portfolioToolbar.classList.remove('hidden');
                portfolioToolbar.classList.add('flex');
            } else {
                portfolioToolbar.classList.remove('flex');
                portfolioToolbar.classList.add('hidden');
            }
        }

        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) {
            renderPortfolioReadOnly();
        }
    }

    function openModal() {
        loginError.style.display = 'none';
        usernameInput.value = '';
        passwordInput.value = '';
        adminModal.classList.add('active');
        setTimeout(() => usernameInput.focus(), 150);
    }

    function closeModal() {
        adminModal.classList.remove('active');
    }

    // Set up click handlers on admin buttons dynamically
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('#admin-btn') || e.target.closest('#mobile-admin-btn');
        if (btn) {
            e.preventDefault();
            const isAdmin = localStorage.getItem('isAdmin') === 'true';
            if (isAdmin) {
                // Logout
                localStorage.removeItem('isAdmin');
                checkAdminState();
            } else {
                // Open login modal
                openModal();
            }
        }
    });

    modalClose.addEventListener('click', closeModal);
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) closeModal();
    });

    // Handle credentials check
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === 'dineshsathua' && password === 'Divyansh@12345') {
            localStorage.setItem('isAdmin', 'true');
            checkAdminState();
            closeModal();
        } else {
            loginError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    // ── 4. Live Dashboard Projects Configuration ──────────
    const defaultProjects = [
        {
            id: 1,
            name: "DWSD Water Scheme — Phase II",
            progress: 78,
            value: "₹ 4.2 Cr",
            status: "Active"
        },
        {
            id: 2,
            name: "Collectorate Building — G+3",
            progress: 45,
            value: "₹ 7.8 Cr",
            status: "In Progress"
        },
        {
            id: 3,
            name: "Rural Pipeline Network — Zone C",
            progress: 100,
            value: "₹ 3.1 Cr",
            status: "Completed"
        }
    ];

    const dashboardState = {
        projects: [],
        isEditing: false
    };

    function getDashboardProjectsFromPortfolio() {
        return [...portfolioState.projects]
            .sort((a, b) => a.id - b.id)
            .slice(0, 3)
            .map(p => {
                const isCompleted = p.status === 'Completed';
                return {
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    dept: p.dept,
                    year: p.year,
                    location: p.location,
                    progress: isCompleted ? 100 : (p.progress || 0),
                    value: p.value,
                    status: isCompleted ? 'Completed' : 'In Progress'
                };
            });
    }

    function getStatusConfig(status) {
        switch (status) {
            case 'Active':
                return {
                    statusClass: 'text-emerald-400 bg-emerald-400/10',
                    barClass: 'bg-gradient-to-r from-cyan-500 to-blue-500'
                };
            case 'In Progress':
                return {
                    statusClass: 'text-blue-400 bg-blue-400/10',
                    barClass: 'bg-gradient-to-r from-blue-500 to-indigo-500'
                };
            case 'Completed':
            default:
                return {
                    statusClass: 'text-slate-400 bg-slate-400/10',
                    barClass: 'bg-gradient-to-r from-emerald-500 to-teal-500'
                };
        }
    }

    function initDashboardData() {
        dashboardState.projects = getDashboardProjectsFromPortfolio();
    }

    function renderDashboardReadOnly() {
        const container = document.getElementById('live-dashboard-projects');
        if (!container) return;

        if (dashboardState.projects.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-700/60 rounded-xl px-4 bg-slate-900/20">
                    <svg class="w-8 h-8 mx-auto mb-2.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <p class="font-medium text-slate-400">No dashboard projects</p>
                    <p class="text-xs text-slate-500 mt-1">Completed projects edited by the admin will appear here.</p>
                </div>
            `;
            return;
        }

        let html = '';
        dashboardState.projects.forEach(proj => {
            const config = getStatusConfig(proj.status);
            const deptClass = getFeaturedDeptClass(proj.dept);
            const locationLine = proj.status === 'Completed' && proj.location
                ? `<span class="text-slate-500 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i>${proj.location}</span>`
                : '';
            html += `
                <a href="projects.html#project-${proj.id}" class="project-row block hover:bg-slate-800/40 p-3 rounded-xl border border-transparent hover:border-slate-700/50 transition-all group relative" data-id="${proj.id}" style="text-decoration: none; outline: none;">
                    <div class="flex justify-between mb-1.5">
                        <span class="text-slate-300 text-sm font-medium project-name group-hover:text-cyan-400 transition-colors">${proj.name}</span>
                        <span class="text-[11px] font-bold ${config.statusClass} px-2 py-0.5 rounded-full project-status flex-shrink-0">${proj.status}</span>
                    </div>
                    <p class="text-slate-500 text-[11px] leading-relaxed mb-2 line-clamp-2">${proj.description || ''}</p>
                    <div class="flex items-center gap-3 mb-2 text-[11px]">
                        <span class="font-bold ${deptClass}">${proj.dept || ''}</span>
                        <span class="text-slate-500">${proj.year || ''}</span>
                        ${locationLine}
                    </div>
                    <div class="h-2 bg-slate-700/60 rounded-full overflow-hidden">
                        <div class="prog-bar ${config.barClass} project-progress-bar" style="width:0%"></div>
                    </div>
                    <div class="flex justify-between mt-1.5 text-slate-500 text-xs">
                        <span class="project-progress-text">${proj.progress}% Complete</span>
                        <span class="project-value font-semibold group-hover:text-slate-300 transition-colors">${proj.value}</span>
                    </div>
                </a>
            `;
        });

        container.innerHTML = html;

        if (window.reinitIcons) window.reinitIcons();

        // Trigger animations with progress values
        setTimeout(() => {
            dashboardState.projects.forEach(proj => {
                const row = container.querySelector(`.project-row[data-id="${proj.id}"]`);
                if (row) {
                    const bar = row.querySelector('.project-progress-bar');
                    if (bar) bar.style.width = `${proj.progress}%`;
                }
            });
        }, 100);
    }

    function renderDashboardEditForm() {
        const container = document.getElementById('live-dashboard-projects');
        if (!container) return;

        const completedProjects = portfolioState.projects.filter(p => p.status === 'Completed');

        let html = '<form id="dashboard-edit-form" class="space-y-4">';
        html += '<div class="max-h-[320px] overflow-y-auto pr-2 space-y-4" style="scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;">';
        
        completedProjects.forEach((proj, idx) => {
            const isShown = !!proj.editedByAdmin;
            html += `
                <div class="dashboard-edit-row border-b border-slate-700/50 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                    <div class="flex justify-between items-center mb-2">
                        <div class="admin-label text-cyan-400 font-bold">Completed Project #${idx + 1}</div>
                        <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                            <input type="checkbox" id="edit-show-${proj.id}" class="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20" ${isShown ? 'checked' : ''}>
                            <span>Show in Dashboard</span>
                        </label>
                    </div>
                    <div class="edit-fields-grid">
                        <div>
                            <label class="admin-label text-[10px]" for="edit-name-${proj.id}">Work Name</label>
                            <input class="admin-input" type="text" id="edit-name-${proj.id}" value="${proj.name}" required>
                        </div>
                        <div>
                            <label class="admin-label text-[10px]" for="edit-progress-${proj.id}">Progress %</label>
                            <input class="admin-input" type="number" id="edit-progress-${proj.id}" value="100" min="0" max="100" required disabled>
                        </div>
                        <div>
                            <label class="admin-label text-[10px]" for="edit-value-${proj.id}">Contract Value</label>
                            <input class="admin-input" type="text" id="edit-value-${proj.id}" value="${proj.value}" required>
                        </div>
                        <div>
                            <label class="admin-label text-[10px]" for="edit-status-${proj.id}">Status</label>
                            <select class="admin-input cursor-pointer" id="edit-status-${proj.id}">
                                <option value="Completed" selected>Completed</option>
                                <option value="Active">Active</option>
                                <option value="In Progress">In Progress</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
        });

        if (completedProjects.length === 0) {
            html += `<p class="text-slate-400 text-sm py-4 text-center">No completed projects found in the portfolio. Go to Projects page to add/edit completed projects.</p>`;
        }

        html += '</div>'; // end scroll container

        html += `
            <div class="flex gap-3 pt-2">
                <button type="submit" class="admin-btn-primary mt-0 flex-1 py-2 rounded-lg">Save Dashboard</button>
                <button type="button" id="dashboard-edit-cancel" class="border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-semibold px-5 py-2 rounded-lg transition-all flex-1 text-sm">Cancel</button>
            </div>
        </form>
        `;

        container.innerHTML = html;

        // Hook up form controls
        const editForm = document.getElementById('dashboard-edit-form');
        const cancelBtn = document.getElementById('dashboard-edit-cancel');

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            portfolioState.projects = portfolioState.projects.map(p => {
                const nameInput = document.getElementById(`edit-name-${p.id}`);
                if (nameInput) {
                    const name = nameInput.value.trim();
                    const value = document.getElementById(`edit-value-${p.id}`).value.trim();
                    const status = document.getElementById(`edit-status-${p.id}`).value;
                    const showInDashboard = document.getElementById(`edit-show-${p.id}`).checked;

                    const isCompleted = status === 'Completed';
                    return {
                        ...p,
                        name,
                        value,
                        status: isCompleted ? 'Completed' : 'Ongoing',
                        statusText: isCompleted ? 'Done' : '80%', // default ongoing starting point
                        progress: isCompleted ? 100 : 80,
                        editedByAdmin: showInDashboard
                    };
                }
                return p;
            });

            localStorage.setItem('portfolioProjects', JSON.stringify(portfolioState.projects));
            
            dashboardState.projects = getDashboardProjectsFromPortfolio();
            
            toggleDashboardEdit(false);
            renderDashboardReadOnly();
            renderFeaturedReadOnly();
        });

        cancelBtn.addEventListener('click', () => {
            toggleDashboardEdit(false);
            renderDashboardReadOnly();
        });
    }

    function toggleDashboardEdit(editing) {
        dashboardState.isEditing = editing;
        const editBtn = document.getElementById('edit-dashboard-btn');
        if (editBtn) {
            const span = editBtn.querySelector('span');
            const icon = editBtn.querySelector('i');
            if (editing) {
                editBtn.classList.add('bg-cyan-500/20', 'border-cyan-500/40');
                if (span) span.textContent = 'Editing Mode';
                if (icon) icon.setAttribute('data-lucide', 'x');
                renderDashboardEditForm();
            } else {
                editBtn.classList.remove('bg-cyan-500/20', 'border-cyan-500/40');
                if (span) span.textContent = 'Edit Projects';
                if (icon) icon.setAttribute('data-lucide', 'edit-3');
            }
            if (window.reinitIcons) window.reinitIcons();
        }
    }


    // ── 4.5. Live Centralized Projects Portfolio Configuration ──────────
    const defaultPortfolioProjects = [
        {
            id: 1,
            name: "Rural Water Supply Scheme — 12 Village Cluster",
            description: "High-capacity scheme covering 12 villages. 45 km DI pipeline, 3 overhead tanks, pump stations, and 2,400+ household connections.",
            value: "₹ 3.8 Cr",
            year: "2023",
            dept: "DWSD",
            status: "Completed",
            statusText: "Done",
            location: "[District]",
            progress: 0,
            image: "",
            icon: "droplets",
            gradient: "from-cyan-600 to-blue-700",
            featured: true
        },
        {
            id: 2,
            name: "District Collectorate Building — G+3 Complex",
            description: "4-storey RCC government administrative complex, 8,000 sqft/floor, modern amenities, underground parking, and generator backup.",
            value: "₹ 7.8 Cr",
            year: "2024",
            dept: "BCD",
            status: "Ongoing",
            statusText: "45%",
            location: "",
            progress: 45,
            image: "",
            icon: "building-2",
            gradient: "from-slate-700 to-slate-900",
            featured: true
        },
        {
            id: 3,
            name: "Water Treatment Plant — 2 MLD Capacity",
            description: "Slow sand filtration WTP with flocculation, sedimentation, and chlorination units for municipal town water supply.",
            value: "₹ 2.4 Cr",
            year: "2022",
            dept: "DWSD",
            status: "Completed",
            statusText: "Done",
            location: "[District]",
            progress: 0,
            image: "",
            icon: "filter",
            gradient: "from-teal-600 to-cyan-700",
            featured: false
        },
        {
            id: 4,
            name: "Govt. Higher Secondary School — New Block",
            description: "24 classrooms, science labs, admin wing, and sports infrastructure. G+1 RCC structure on 2-acre campus.",
            value: "₹ 5.2 Cr",
            year: "2025",
            dept: "BCD",
            status: "Ongoing",
            statusText: "30%",
            location: "",
            progress: 30,
            image: "",
            icon: "book-open",
            gradient: "from-blue-600 to-indigo-700",
            featured: false
        },
        {
            id: 5,
            name: "Urban Distribution Pipeline Network — 85 km",
            description: "HDPE & DI pipeline distribution covering 30,000+ households across municipal wards with house service connections.",
            value: "₹ 12.6 Cr",
            year: "2024",
            dept: "DWSD",
            status: "Completed",
            statusText: "Done",
            location: "[District]",
            progress: 0,
            image: "",
            icon: "activity",
            gradient: "from-cyan-700 to-blue-800",
            featured: true
        },
        {
            id: 6,
            name: "Primary Health Centre — 30-Bed Facility",
            description: "G+1 PHC building with OPD, IPD wards, operation theatre, pharmacy block, and staff residential quarters.",
            value: "₹ 4.1 Cr",
            year: "2025",
            dept: "BCD",
            status: "Ongoing",
            statusText: "60%",
            location: "",
            progress: 60,
            image: "",
            icon: "cross",
            gradient: "from-slate-600 to-slate-800",
            featured: false
        },
        {
            id: 7,
            name: "ESR Construction — 1.5 Lakh Litre Capacity",
            description: "RCC elevated service reservoir at 18m staging height with inlet, outlet, overflow, and wash-out arrangements.",
            value: "₹ 1.2 Cr",
            year: "2021",
            dept: "DWSD",
            status: "Completed",
            statusText: "Done",
            location: "[District]",
            progress: 0,
            image: "",
            icon: "waves",
            gradient: "from-emerald-700 to-teal-800",
            featured: false
        },
        {
            id: 8,
            name: "Anganwadi Centre Buildings — Package of 18",
            description: "Construction of 18 anganwadi centre buildings with kitchen, toilet, veranda, and compound wall across 3 taluks.",
            value: "₹ 2.1 Cr",
            year: "2023",
            dept: "BCD",
            status: "Completed",
            statusText: "Done",
            location: "[District]",
            progress: 0,
            image: "",
            icon: "home",
            gradient: "from-slate-500 to-slate-700",
            featured: false
        },
        {
            id: 9,
            name: "Booster Pump Station & Rising Main",
            description: "2×1 HP submersible pump sets with 6 km MS rising main, valve chambers, and automation panel for hill-zone supply.",
            value: "₹ 1.8 Cr",
            year: "2025",
            dept: "DWSD",
            status: "Ongoing",
            statusText: "70%",
            location: "",
            progress: 70,
            image: "",
            icon: "gauge",
            gradient: "from-sky-600 to-blue-700",
            featured: false
        }
    ];

    const portfolioState = {
        projects: []
    };

    const featuredState = {
        isEditing: false
    };

    let tempFeaturedImages = {};

    function getFeaturedStatusConfig(status) {
        if (status === 'Completed') {
            return {
                badgeClass: 'bg-emerald-500 text-white',
                dotClass: 'bg-emerald-400',
                textClass: 'text-emerald-600'
            };
        } else {
            return {
                badgeClass: 'bg-blue-50 text-blue-600 border border-blue-200',
                dotClass: 'bg-blue-400 animate-pulse',
                textClass: 'text-blue-600'
            };
        }
    }

    function getFeaturedDeptClass(dept) {
        switch(dept) {
            case 'DWSD': return 'text-cyan-600';
            case 'BCD': return 'text-blue-600';
            case 'RCD': return 'text-rose-600';
            case 'RDSD': return 'text-emerald-600';
            case 'MI': return 'text-amber-600';
            case 'Zila Parishad': return 'text-violet-600';
            case 'UDHD': return 'text-indigo-600';
            default: return 'text-slate-600';
        }
    }

    function renderFilterTabs() {
        const container = document.getElementById('project-filters-container');
        if (!container) return;

        const depts = [...new Set(portfolioState.projects.map(p => p.dept))].filter(Boolean);

        let html = `
            <button class="filter-btn active" data-filter="all">All Projects</button>
            <button class="filter-btn" data-filter="completed">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>Completed
            </button>
            <button class="filter-btn" data-filter="ongoing">
                <span class="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1.5 animate-pulse"></span>Ongoing
            </button>
        `;

        depts.forEach(dept => {
            html += `<button class="filter-btn" data-filter="${dept}">${dept} Projects</button>`;
        });

        container.innerHTML = html;
    }

    const FEATURED_FIX_KEY = 'portfolioFeaturedFixApplied_v1';

    function initPortfolioData() {
        const savedData = localStorage.getItem('portfolioProjects');
        if (savedData) {
            try {
                let parsed = JSON.parse(savedData);
                if (Array.isArray(parsed)) {
                    let migrated = false;
                    parsed = parsed.map(proj => {
                        const defProj = defaultPortfolioProjects.find(dp => dp.id === proj.id) || {};
                        const merged = { ...defProj, ...proj };
                        for (const key of Object.keys(defProj)) {
                            if (proj[key] === undefined) {
                                migrated = true;
                            }
                        }
                        return merged;
                    });

                    // One-time correction: re-sync the "featured" flag to the
                    // canonical defaults, since stale saved data could carry
                    // featured flags that no longer match the intended set.
                    if (!localStorage.getItem(FEATURED_FIX_KEY)) {
                        parsed = parsed.map(proj => {
                            const defProj = defaultPortfolioProjects.find(dp => dp.id === proj.id);
                            return defProj ? { ...proj, featured: defProj.featured } : proj;
                        });
                        migrated = true;
                        localStorage.setItem(FEATURED_FIX_KEY, 'true');
                    }

                    if (migrated) {
                        localStorage.setItem('portfolioProjects', JSON.stringify(parsed));
                    }
                    portfolioState.projects = parsed;
                } else {
                    portfolioState.projects = [...defaultPortfolioProjects];
                    localStorage.setItem('portfolioProjects', JSON.stringify(defaultPortfolioProjects));
                    localStorage.setItem(FEATURED_FIX_KEY, 'true');
                }
            } catch (e) {
                portfolioState.projects = [...defaultPortfolioProjects];
            }
        } else {
            portfolioState.projects = [...defaultPortfolioProjects];
            localStorage.setItem('portfolioProjects', JSON.stringify(defaultPortfolioProjects));
            localStorage.setItem(FEATURED_FIX_KEY, 'true');
        }
    }

    function renderFeaturedReadOnly() {
        const container = document.getElementById('featured-projects-container');
        if (!container) return;

        const featuredProjs = portfolioState.projects.filter(p => p.featured);

        if (featuredProjs.length === 0) {
            container.classList.remove('featured-proj-grid');
            container.innerHTML = `
                <div class="col-span-full text-center py-12 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/20 max-w-xl mx-auto px-6 reveal">
                    <svg class="w-10 h-10 mx-auto mb-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <p class="font-bold text-slate-400 text-base">No featured projects</p>
                    <p class="text-xs text-slate-500 mt-1">Projects added or edited by the administrator will be featured here.</p>
                </div>
            `;
            if (window.initScrollReveal) {
                window.initScrollReveal(container);
            }
            if (window.reinitIcons) {
                window.reinitIcons();
            }
            return;
        }

        container.classList.add('featured-proj-grid');

        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        let html = '';
        featuredProjs.forEach((proj, idx) => {
            const statusConfig = getFeaturedStatusConfig(proj.status);
            const deptClass = getFeaturedDeptClass(proj.dept);
            const revealDelayClass = `d${idx + 1}`;

            let headerBg = '';
            if (proj.image) {
                headerBg = `<div class="h-40 bg-cover bg-center relative overflow-hidden" style="background-image: url('${proj.image}')">`;
            } else {
                headerBg = `
                    <div class="h-40 bg-gradient-to-br ${proj.gradient || 'from-cyan-600 to-blue-700'} relative overflow-hidden">
                        <div class="absolute inset-0 flex items-center justify-center opacity-[0.07]"><i data-lucide="${proj.icon || 'droplets'}" class="w-28 h-28 text-white"></i></div>
                `;
            }

            let adminBar = '';
            if (isAdmin) {
                adminBar = `
                    <div class="admin-card-actions bg-slate-50 border-t border-slate-100 px-5 py-3 flex justify-end gap-3.5">
                        <button class="edit-featured-card-btn text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1 transition-colors animate-none" data-id="${proj.id}">
                            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit
                        </button>
                        <button class="delete-featured-card-btn text-xs font-bold text-red-600 hover:text-red-500 flex items-center gap-1 transition-colors animate-none" data-id="${proj.id}">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
                        </button>
                    </div>
                `;
            }

            html += `
                <div class="project-card bg-white rounded-xl overflow-hidden border border-slate-200 flex flex-col reveal ${revealDelayClass}">
                    ${headerBg}
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div class="absolute top-3.5 left-3.5"><span class="${statusConfig.badgeClass} text-[11px] font-bold px-2.5 py-1 rounded-full">${proj.status}</span></div>
                        <div class="absolute bottom-3 left-4 text-white/60 text-[11px] font-semibold">${proj.dept} — ${proj.year}</div>
                    </div>
                    <div class="p-5 flex flex-col flex-1">
                        <h4 class="font-bold text-slate-800 mb-1.5 text-sm">${proj.name}</h4>
                        <p class="text-slate-500 text-xs leading-relaxed mb-4 flex-1">${proj.description}</p>
                        <div class="flex justify-between pt-3 border-t border-slate-100">
                            <div><div class="text-[10px] text-slate-400 uppercase">Contract Value</div><div class="font-black text-slate-800">${proj.value}</div></div>
                            <div class="w-px bg-slate-100"></div>
                            <div><div class="text-[10px] text-slate-400 uppercase">Dept.</div><div class="font-bold ${deptClass} text-sm">${proj.dept}</div></div>
                            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full ${statusConfig.dotClass}"></span><span class="text-[11px] ${statusConfig.textClass} font-bold">${proj.statusText}</span></div>
                        </div>
                    </div>
                    ${adminBar}
                </div>
            `;
        });

        container.innerHTML = html;

        if (window.initScrollReveal) {
            window.initScrollReveal(container);
        }

        if (window.reinitIcons) {
            window.reinitIcons();
        }

        if (isAdmin) {
            container.querySelectorAll('.edit-featured-card-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = parseInt(btn.dataset.id);
                    openProjectEditor(id);
                });
            });
            container.querySelectorAll('.delete-featured-card-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = parseInt(btn.dataset.id);
                    deleteProject(id);
                });
            });
        }
    }

    function renderFeaturedEditForm() {
        const container = document.getElementById('featured-projects-container');
        if (!container) return;

        const featuredProjs = portfolioState.projects.filter(p => p.featured);

        if (featuredProjs.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-8 border border-slate-700/60 bg-slate-900/20 rounded-2xl shadow-sm px-4">
                    <p class="text-slate-400 text-sm font-semibold mb-2">No projects have been added or edited by you yet.</p>
                    <p class="text-xs text-slate-500">Go to the Projects page to add new projects or edit existing ones.</p>
                </div>
            `;
            return;
        }

        let cardsHtml = '';
        featuredProjs.forEach((proj, idx) => {
            cardsHtml += `
                <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-4 text-left">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Featured Project #${idx + 1}</span>
                        <span class="text-xs font-semibold text-blue-600">${proj.dept}</span>
                    </div>
                    
                    <!-- Image Upload & Preview -->
                    <div class="space-y-2">
                        <label class="admin-label text-[10px] text-slate-500 font-bold block">Project Photo</label>
                        <div class="flex items-center gap-3">
                            <div class="w-16 h-12 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center flex-shrink-0">
                                <img id="preview-featured-photo-${proj.id}" src="${proj.image || ''}" class="w-full h-full object-cover ${proj.image ? '' : 'hidden'}">
                                <i id="preview-featured-icon-${proj.id}" data-lucide="${proj.icon || 'folder'}" class="w-5 h-5 text-slate-400 ${proj.image ? 'hidden' : ''}"></i>
                            </div>
                            <div class="flex-1">
                                <label for="edit-featured-photo-${proj.id}" class="cursor-pointer bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg inline-block transition-all text-center w-full">
                                    Upload File
                                </label>
                                <input type="file" id="edit-featured-photo-${proj.id}" accept="image/*" class="hidden edit-featured-file-input" data-id="${proj.id}">
                            </div>
                        </div>
                    </div>

                    <!-- Title Input -->
                    <div>
                        <label class="admin-label text-[10px] text-slate-500 font-bold block mb-1" for="edit-featured-name-${proj.id}">Project Title</label>
                        <input class="admin-input bg-white text-slate-800 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-xs py-1.5" type="text" id="edit-featured-name-${proj.id}" value="${proj.name}" required>
                    </div>

                    <!-- Description Input -->
                    <div>
                        <label class="admin-label text-[10px] text-slate-500 font-bold block mb-1" for="edit-featured-desc-${proj.id}">Description</label>
                        <textarea class="admin-input bg-white text-slate-800 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-xs py-1.5 h-16 resize-none" id="edit-featured-desc-${proj.id}" required>${proj.description}</textarea>
                    </div>

                    <!-- Value & Year -->
                    <div class="grid grid-cols-2 gap-2.5">
                        <div>
                            <label class="admin-label text-[10px] text-slate-500 font-bold block mb-1" for="edit-featured-value-${proj.id}">Value</label>
                            <input class="admin-input bg-white text-slate-800 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-xs py-1.5" type="text" id="edit-featured-value-${proj.id}" value="${proj.value}" required>
                        </div>
                        <div>
                            <label class="admin-label text-[10px] text-slate-500 font-bold block mb-1" for="edit-featured-year-${proj.id}">Year</label>
                            <input class="admin-input bg-white text-slate-800 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-xs py-1.5" type="text" id="edit-featured-year-${proj.id}" value="${proj.year}" required>
                        </div>
                    </div>

                    <!-- Dept & Status -->
                    <div class="grid grid-cols-2 gap-2.5">
                        <div>
                            <label class="admin-label text-[10px] text-slate-500 font-bold block mb-1" for="edit-featured-dept-${proj.id}">Dept</label>
                            <select class="admin-input bg-white text-slate-800 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-xs py-1.5 cursor-pointer" id="edit-featured-dept-${proj.id}">
                                <option value="DWSD" ${proj.dept === 'DWSD' ? 'selected' : ''}>DWSD</option>
                                <option value="BCD" ${proj.dept === 'BCD' ? 'selected' : ''}>BCD</option>
                                <option value="RCD" ${proj.dept === 'RCD' ? 'selected' : ''}>RCD</option>
                                <option value="RDSD" ${proj.dept === 'RDSD' ? 'selected' : ''}>RDSD</option>
                                <option value="MI" ${proj.dept === 'MI' ? 'selected' : ''}>MI</option>
                                <option value="Zila Parishad" ${proj.dept === 'Zila Parishad' ? 'selected' : ''}>Zila Parishad</option>
                                <option value="UDHD" ${proj.dept === 'UDHD' ? 'selected' : ''}>UDHD</option>
                            </select>
                        </div>
                        <div>
                            <label class="admin-label text-[10px] text-slate-500 font-bold block mb-1" for="edit-featured-status-${proj.id}">Status Type</label>
                            <select class="admin-input bg-white text-slate-800 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-xs py-1.5 cursor-pointer" id="edit-featured-status-${proj.id}">
                                <option value="Completed" ${proj.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                <option value="Ongoing" ${proj.status === 'Ongoing' ? 'selected' : ''}>Ongoing</option>
                            </select>
                        </div>
                    </div>

                    <!-- Status Text -->
                    <div>
                        <label class="admin-label text-[10px] text-slate-500 font-bold block mb-1" for="edit-featured-statustext-${proj.id}">Status Badge Text (e.g. Done, 45%)</label>
                        <input class="admin-input bg-white text-slate-800 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-xs py-1.5" type="text" id="edit-featured-statustext-${proj.id}" value="${proj.statusText}" required>
                    </div>
                </div>
            `;
        });

        let formHtml = `
            <form id="featured-edit-form" class="col-span-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div class="grid md:grid-cols-3 gap-6">
                    ${cardsHtml}
                </div>
                <div class="flex gap-4 pt-4 border-t border-slate-200">
                    <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm">Save Changes</button>
                    <button type="button" id="featured-edit-cancel" class="border border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-bold px-6 py-2.5 rounded-xl transition-all text-sm">Cancel</button>
                </div>
            </form>
        `;

        container.innerHTML = formHtml;

        if (window.reinitIcons) {
            window.reinitIcons();
        }

        // Set up upload preview listeners
        const fileInputs = container.querySelectorAll('.edit-featured-file-input');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const projId = parseInt(e.target.dataset.id);
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        tempFeaturedImages[projId] = evt.target.result;
                        const imgEl = document.getElementById(`preview-featured-photo-${projId}`);
                        const iconEl = document.getElementById(`preview-featured-icon-${projId}`);
                        if (imgEl) {
                            imgEl.src = evt.target.result;
                            imgEl.classList.remove('hidden');
                        }
                        if (iconEl) {
                            iconEl.classList.add('hidden');
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        });

        // Set up save and cancel handlers
        const form = document.getElementById('featured-edit-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const updatedMap = {};
            featuredProjs.forEach(proj => {
                const name = document.getElementById(`edit-featured-name-${proj.id}`).value.trim();
                const description = document.getElementById(`edit-featured-desc-${proj.id}`).value.trim();
                const value = document.getElementById(`edit-featured-value-${proj.id}`).value.trim();
                const year = document.getElementById(`edit-featured-year-${proj.id}`).value.trim();
                const dept = document.getElementById(`edit-featured-dept-${proj.id}`).value;
                const status = document.getElementById(`edit-featured-status-${proj.id}`).value;
                const statusText = document.getElementById(`edit-featured-statustext-${proj.id}`).value.trim();
                
                const image = tempFeaturedImages[proj.id] !== undefined ? tempFeaturedImages[proj.id] : proj.image;

                updatedMap[proj.id] = {
                    name, description, value, year, dept, status, statusText, image
                };
            });

            const updated = portfolioState.projects.map(proj => {
                if (updatedMap[proj.id]) {
                    const editDetails = updatedMap[proj.id];
                    return {
                        ...proj,
                        name: editDetails.name,
                        description: editDetails.description,
                        value: editDetails.value,
                        year: editDetails.year,
                        dept: editDetails.dept,
                        status: editDetails.status,
                        statusText: editDetails.statusText,
                        image: editDetails.image
                    };
                }
                return proj;
            });

            portfolioState.projects = updated;
            localStorage.setItem('portfolioProjects', JSON.stringify(updated));

            toggleFeaturedEdit(false);
            renderFeaturedReadOnly();
            if (document.getElementById('live-dashboard-projects')) {
                initDashboardData();
                renderDashboardReadOnly();
            }
        });

        const cancelBtn = document.getElementById('featured-edit-cancel');
        cancelBtn.addEventListener('click', () => {
            toggleFeaturedEdit(false);
            renderFeaturedReadOnly();
        });
    }

    function toggleFeaturedEdit(editing) {
        featuredState.isEditing = editing;
        const editBtn = document.getElementById('edit-featured-btn');
        if (editBtn) {
            const span = editBtn.querySelector('span');
            const icon = editBtn.querySelector('i');
            if (editing) {
                editBtn.classList.add('bg-blue-500/20', 'border-blue-500/40', 'text-blue-700');
                if (span) span.textContent = 'Editing Mode';
                if (icon) icon.setAttribute('data-lucide', 'x');
                tempFeaturedImages = {};
                renderFeaturedEditForm();
            } else {
                editBtn.classList.remove('bg-blue-500/20', 'border-blue-500/40', 'text-blue-700');
                if (span) span.textContent = 'Edit Featured';
                if (icon) icon.setAttribute('data-lucide', 'edit-3');
            }
            if (window.reinitIcons) window.reinitIcons();
        }
    }

    function renderPortfolioReadOnly() {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;

        renderFilterTabs();

        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        let html = '';

        portfolioState.projects.forEach(proj => {
            const statusConfig = getFeaturedStatusConfig(proj.status);
            const deptClass = getFeaturedDeptClass(proj.dept);
            
            let headerBg = '';
            if (proj.image) {
                headerBg = `<div class="h-44 bg-cover bg-center relative overflow-hidden" style="background-image: url('${proj.image}')">`;
            } else {
                headerBg = `
                    <div class="h-44 bg-gradient-to-br ${proj.gradient || 'from-cyan-600 to-blue-700'} relative overflow-hidden">
                        <div class="absolute inset-0 flex items-center justify-center opacity-[0.07]"><i data-lucide="${proj.icon || 'droplets'}" class="w-32 h-32 text-white"></i></div>
                `;
            }

            let statusDetail = '';
            if (proj.status === 'Completed') {
                statusDetail = `
                    <div><div class="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Location</div><div class="text-slate-700 font-semibold text-sm">${proj.location || '[District]'}</div></div>
                `;
            } else {
                statusDetail = `
                    <div>
                        <div class="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Progress</div>
                        <div class="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-blue-500 rounded-full" style="width:${proj.progress || 0}%"></div></div>
                    </div>
                `;
            }

            let adminBar = '';
            if (isAdmin) {
                adminBar = `
                    <div class="admin-card-actions bg-slate-50 border-t border-slate-100 px-5 py-3 flex justify-end gap-3.5">
                        <button class="edit-portfolio-card-btn text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1 transition-colors animate-none" data-id="${proj.id}">
                            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit
                        </button>
                        <button class="delete-portfolio-card-btn text-xs font-bold text-red-600 hover:text-red-500 flex items-center gap-1 transition-colors animate-none" data-id="${proj.id}">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
                        </button>
                    </div>
                `;
            }

            html += `
                <div id="project-${proj.id}" class="project-card bg-white rounded-xl overflow-hidden border border-slate-200 flex flex-col transition-all duration-300"
                     data-category="${proj.status.toLowerCase()}" data-dept="${proj.dept}">
                    ${headerBg}
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div class="absolute top-3.5 left-3.5"><span class="${statusConfig.badgeClass} text-[11px] font-bold px-2.5 py-1 rounded-full">${proj.status}</span></div>
                        <div class="absolute top-3.5 right-3.5"><span class="bg-cyan-700/80 text-cyan-100 text-[11px] font-semibold px-2.5 py-1 rounded-full">${proj.dept}</span></div>
                        <div class="absolute bottom-3 left-4 text-white/60 text-[11px] font-semibold">${proj.year}</div>
                    </div>
                    <div class="p-5 flex flex-col flex-1">
                        <h4 class="font-bold text-slate-800 mb-1.5 text-sm">${proj.name}</h4>
                        <p class="text-slate-500 text-xs leading-relaxed mb-4 flex-1">${proj.description}</p>
                        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div><div class="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Contract Value</div><div class="font-black text-slate-800">${proj.value}</div></div>
                            <div class="w-px h-8 bg-slate-100"></div>
                            ${statusDetail}
                            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full ${statusConfig.dotClass}"></span><span class="text-[11px] ${statusConfig.textClass} font-bold">${proj.statusText}</span></div>
                        </div>
                    </div>
                    ${adminBar}
                </div>
            `;
        });

        grid.innerHTML = html;

        if (window.initProjectsFilter) {
            window.initProjectsFilter();
        }

        if (window.reinitIcons) {
            window.reinitIcons();
        }

        if (isAdmin) {
            grid.querySelectorAll('.edit-portfolio-card-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = parseInt(btn.dataset.id);
                    openProjectEditor(id);
                });
            });
            grid.querySelectorAll('.delete-portfolio-card-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = parseInt(btn.dataset.id);
                    deleteProject(id);
                });
            });
        }

        // Programmatic smooth scroll & visual highlight for hashed cards on load
        const handleHashScroll = () => {
            if (window.location.hash && window.location.hash.startsWith('#project-')) {
                const targetEl = document.querySelector(window.location.hash);
                if (targetEl) {
                    setTimeout(() => {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Add glow ring outline and visual lift
                        targetEl.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.4)';
                        targetEl.style.borderColor = 'rgba(6, 182, 212, 0.8)';
                        targetEl.style.transform = 'translateY(-6px) scale(1.015)';
                        setTimeout(() => {
                            targetEl.style.boxShadow = '';
                            targetEl.style.borderColor = '';
                            targetEl.style.transform = '';
                        }, 2500);
                    }, 400);
                }
            }
        };

        handleHashScroll();
        
        // Listen to hash changes in case they happen within the page
        if (!window.hasHashListener) {
            window.addEventListener('hashchange', handleHashScroll);
            window.hasHashListener = true;
        }
    }

    // ── 4.6. Project Editor Modal Creation & Handlers ──────────
    const projectModalHTML = `
        <div id="project-editor-modal" class="admin-modal-overlay">
            <div class="admin-modal-container relative max-w-lg w-11/12 max-h-[90vh] overflow-y-auto" style="background: rgba(30, 41, 59, 0.98);">
                <button class="admin-btn-close" id="project-modal-close" aria-label="Close modal">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div class="admin-modal-title" id="project-modal-title">Add Project</div>
                <div class="admin-modal-subtitle" id="project-modal-subtitle">Enter project details and photo below.</div>
                
                <form id="project-editor-form" class="space-y-4 text-left">
                    <input type="hidden" id="project-modal-id">
                    
                    <!-- Image Upload & Preview -->
                    <div class="admin-form-group">
                        <label class="admin-label">Project Photo</label>
                        <div class="flex items-center gap-4 bg-slate-800/40 p-3 rounded-xl border border-white/5">
                            <div class="w-20 h-16 rounded-lg bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                                <img id="project-modal-preview-img" src="" class="w-full h-full object-cover hidden">
                                <i id="project-modal-preview-icon" data-lucide="image" class="w-6 h-6 text-slate-500"></i>
                            </div>
                            <div class="flex-1">
                                <label for="project-modal-file" class="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-lg inline-block transition-all text-center w-full">
                                    Choose Photo
                                </label>
                                <input type="file" id="project-modal-file" accept="image/*" class="hidden">
                            </div>
                        </div>
                    </div>

                    <!-- Title -->
                    <div class="admin-form-group">
                        <label class="admin-label" for="project-modal-name">Project Title</label>
                        <input class="admin-input" type="text" id="project-modal-name" required placeholder="e.g. Rural Water Supply Scheme">
                    </div>

                    <!-- Description -->
                    <div class="admin-form-group">
                        <label class="admin-label" for="project-modal-desc">Description</label>
                        <textarea class="admin-input h-20 resize-none font-sans" id="project-modal-desc" required placeholder="Enter project description..."></textarea>
                    </div>

                    <!-- Value & Year -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="admin-form-group">
                            <label class="admin-label" for="project-modal-value">Value</label>
                            <input class="admin-input" type="text" id="project-modal-value" required placeholder="e.g. ₹ 3.8 Cr">
                        </div>
                        <div class="admin-form-group">
                            <label class="admin-label" for="project-modal-year">Year</label>
                            <input class="admin-input" type="text" id="project-modal-year" required placeholder="e.g. 2023">
                        </div>
                    </div>

                    <!-- Dept & Status -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="admin-form-group">
                            <label class="admin-label" for="project-modal-dept">Department</label>
                            <select class="admin-input cursor-pointer" id="project-modal-dept">
                                <option value="DWSD">DWSD</option>
                                <option value="BCD">BCD</option>
                                <option value="RCD">RCD</option>
                                <option value="RDSD">RDSD</option>
                                <option value="MI">MI</option>
                                <option value="Zila Parishad">Zila Parishad</option>
                                <option value="UDHD">UDHD</option>
                            </select>
                        </div>
                        <div class="admin-form-group">
                            <label class="admin-label" for="project-modal-status">Status Type</label>
                            <select class="admin-input cursor-pointer" id="project-modal-status">
                                <option value="Completed">Completed</option>
                                <option value="Ongoing">Ongoing</option>
                            </select>
                        </div>
                    </div>

                    <!-- Conditional inputs based on status -->
                    <div class="grid grid-cols-2 gap-4">
                        <!-- For Completed: Location -->
                        <div class="admin-form-group" id="project-modal-loc-group">
                            <label class="admin-label" for="project-modal-location">Location</label>
                            <input class="admin-input" type="text" id="project-modal-location" placeholder="e.g. Seraikella">
                        </div>
                        <!-- For Ongoing: Progress % -->
                        <div class="admin-form-group hidden" id="project-modal-prog-group">
                            <label class="admin-label" for="project-modal-progress">Progress %</label>
                            <input class="admin-input" type="number" id="project-modal-progress" min="0" max="100" placeholder="e.g. 45">
                        </div>
                        <!-- Status text -->
                        <div class="admin-form-group">
                            <label class="admin-label" for="project-modal-statustext">Status Badge Text</label>
                            <input class="admin-input" type="text" id="project-modal-statustext" required placeholder="e.g. Done or 45%">
                        </div>
                    </div>

                    <!-- Featured checkbox -->
                    <div class="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="project-modal-featured" class="w-4 h-4 rounded border-white/10 bg-slate-900 text-blue-600 focus:ring-blue-500/20 cursor-pointer">
                        <label class="text-xs font-semibold text-slate-300 cursor-pointer" for="project-modal-featured">Show on Homepage (Featured Projects)</label>
                    </div>

                    <button type="submit" class="admin-btn-primary mt-2">Save Project</button>
                </form>
            </div>
        </div>
    `;
    const projModalWrapper = document.createElement('div');
    projModalWrapper.innerHTML = projectModalHTML;
    document.body.appendChild(projModalWrapper.firstElementChild);

    const projectEditorModal = document.getElementById('project-editor-modal');
    const projectModalClose = document.getElementById('project-modal-close');
    const projectEditorForm = document.getElementById('project-editor-form');
    const projectModalFile = document.getElementById('project-modal-file');
    
    const projectModalPreviewImg = document.getElementById('project-modal-preview-img');
    const projectModalPreviewIcon = document.getElementById('project-modal-preview-icon');

    let modalTempImage = ''; 

    function openProjectEditor(id = null) {
        modalTempImage = '';
        projectEditorForm.reset();
        
        const locGroup = document.getElementById('project-modal-loc-group');
        const progGroup = document.getElementById('project-modal-prog-group');
        locGroup.classList.remove('hidden');
        progGroup.classList.add('hidden');

        if (id) {
            document.getElementById('project-modal-title').textContent = 'Edit Project';
            document.getElementById('project-modal-id').value = id;
            
            const proj = portfolioState.projects.find(p => p.id === id);
            if (proj) {
                document.getElementById('project-modal-name').value = proj.name;
                document.getElementById('project-modal-desc').value = proj.description;
                document.getElementById('project-modal-value').value = proj.value;
                document.getElementById('project-modal-year').value = proj.year;
                document.getElementById('project-modal-dept').value = proj.dept;
                document.getElementById('project-modal-status').value = proj.status;
                document.getElementById('project-modal-statustext').value = proj.statusText;
                document.getElementById('project-modal-featured').checked = !!proj.featured;

                if (proj.status === 'Completed') {
                    document.getElementById('project-modal-location').value = proj.location || '';
                    locGroup.classList.remove('hidden');
                    progGroup.classList.add('hidden');
                } else {
                    document.getElementById('project-modal-progress').value = proj.progress || 0;
                    locGroup.classList.add('hidden');
                    progGroup.classList.remove('hidden');
                }

                if (proj.image) {
                    projectModalPreviewImg.src = proj.image;
                    projectModalPreviewImg.classList.remove('hidden');
                    projectModalPreviewIcon.classList.add('hidden');
                    modalTempImage = proj.image;
                } else {
                    projectModalPreviewImg.classList.add('hidden');
                    projectModalPreviewIcon.classList.remove('hidden');
                    projectModalPreviewIcon.setAttribute('data-lucide', proj.icon || 'image');
                }
            }
        } else {
            document.getElementById('project-modal-title').textContent = 'Add New Project';
            document.getElementById('project-modal-id').value = '';
            projectModalPreviewImg.classList.add('hidden');
            projectModalPreviewIcon.classList.remove('hidden');
            projectModalPreviewIcon.setAttribute('data-lucide', 'image');
        }

        if (window.reinitIcons) window.reinitIcons();
        projectEditorModal.classList.add('active');
    }

    function closeProjectModal() {
        projectEditorModal.classList.remove('active');
    }

    projectModalClose.addEventListener('click', closeProjectModal);
    projectEditorModal.addEventListener('click', (e) => {
        if (e.target === projectEditorModal) closeProjectModal();
    });

    projectModalFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                modalTempImage = evt.target.result;
                projectModalPreviewImg.src = evt.target.result;
                projectModalPreviewImg.classList.remove('hidden');
                projectModalPreviewIcon.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    const projectModalStatusSelect = document.getElementById('project-modal-status');
    projectModalStatusSelect.addEventListener('change', () => {
        const locGroup = document.getElementById('project-modal-loc-group');
        const progGroup = document.getElementById('project-modal-prog-group');
        const statusText = document.getElementById('project-modal-statustext');
        
        if (projectModalStatusSelect.value === 'Completed') {
            locGroup.classList.remove('hidden');
            progGroup.classList.add('hidden');
            statusText.value = 'Done';
        } else {
            locGroup.classList.add('hidden');
            progGroup.classList.remove('hidden');
            statusText.value = '45%';
        }
    });

    projectEditorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const idVal = document.getElementById('project-modal-id').value;
        const name = document.getElementById('project-modal-name').value.trim();
        const description = document.getElementById('project-modal-desc').value.trim();
        const value = document.getElementById('project-modal-value').value.trim();
        const year = document.getElementById('project-modal-year').value.trim();
        const dept = document.getElementById('project-modal-dept').value;
        const status = document.getElementById('project-modal-status').value;
        const statusText = document.getElementById('project-modal-statustext').value.trim();
        const featured = document.getElementById('project-modal-featured').checked;
        
        const location = status === 'Completed' ? document.getElementById('project-modal-location').value.trim() : '';
        const progress = status === 'Ongoing' ? parseInt(document.getElementById('project-modal-progress').value) || 0 : 0;

        let updatedProjects = [...portfolioState.projects];

        if (idVal) {
            const id = parseInt(idVal);
            updatedProjects = updatedProjects.map(p => {
                if (p.id === id) {
                    return {
                        ...p,
                        name, description, value, year, dept, status, statusText, location, progress, featured,
                        image: modalTempImage || p.image,
                        editedByAdmin: true
                    };
                }
                return p;
            });
        } else {
            const nextId = updatedProjects.length > 0 ? Math.max(...updatedProjects.map(p => p.id)) + 1 : 1;
            const icon = dept === 'DWSD' ? 'droplets' : 'building-2';
            const gradient = dept === 'DWSD' ? 'from-cyan-600 to-blue-700' : 'from-slate-700 to-slate-900';

            updatedProjects.push({
                id: nextId,
                name, description, value, year, dept, status, statusText, location, progress, featured,
                image: modalTempImage,
                icon,
                gradient,
                editedByAdmin: true
            });
        }

        portfolioState.projects = updatedProjects;
        localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));

        closeProjectModal();
        
        renderPortfolioReadOnly();
        renderFeaturedReadOnly();
        if (document.getElementById('live-dashboard-projects')) {
            initDashboardData();
            renderDashboardReadOnly();
        }
    });

    function deleteProject(id) {
        const proj = portfolioState.projects.find(p => p.id === id);
        if (!proj) return;

        if (confirm(`Are you sure you want to delete the project "${proj.name}"?`)) {
            const updated = portfolioState.projects.filter(p => p.id !== id);
            portfolioState.projects = updated;
            localStorage.setItem('portfolioProjects', JSON.stringify(updated));
            
            renderPortfolioReadOnly();
            renderFeaturedReadOnly();
            if (document.getElementById('live-dashboard-projects')) {
                initDashboardData();
                renderDashboardReadOnly();
            }
        }
    }

    // Initialize Central Portfolio Projects Data if either container exists
    const featuredContainer = document.getElementById('featured-projects-container');
    const projectsGrid = document.getElementById('projects-grid');
    
    const dashboardContainer = document.getElementById('live-dashboard-projects');

    if (featuredContainer || projectsGrid || dashboardContainer) {
        initPortfolioData();
    }

    if (dashboardContainer) {
        initDashboardData();
        renderDashboardReadOnly();

        const editBtn = document.getElementById('edit-dashboard-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                toggleDashboardEdit(!dashboardState.isEditing);
            });
        }
    }

    if (featuredContainer) {
        renderFeaturedReadOnly();

        const editFeaturedBtn = document.getElementById('edit-featured-btn');
        if (editFeaturedBtn) {
            editFeaturedBtn.addEventListener('click', () => {
                toggleFeaturedEdit(!featuredState.isEditing);
            });
        }
    }

    if (projectsGrid) {
        renderPortfolioReadOnly();

        const addProjectBtn = document.getElementById('add-project-btn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openProjectEditor();
            });
        }
    }

    // ── 5. Run Initial Check on Load ─────────────────────
    checkAdminState();
});
