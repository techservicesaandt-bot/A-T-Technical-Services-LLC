/* ============================================================
   A&T Technical Services — script.js v2
   ============================================================ */
(function () {
    'use strict';

    // ---- DOM ----
    const heroIntro = document.getElementById('heroIntro');
    const welcomeText = document.getElementById('welcomeText');

    // ============================================================
    // 10. HERO WELCOME ANIMATION (REFINED FADE CYCLE)
    // ============================================================
    function initWelcomeAnimation() {
        if (!heroIntro || !welcomeText) return;
        const textWrap = document.querySelector('.intro-text-wrap');

        const languages = [
            { text: 'Welcome', lang: 'en' },
            { text: 'Bienvenido', lang: 'es' },
            { text: 'Velkommen', lang: 'da' },
            { text: 'Witamy', lang: 'pl' },
            { text: 'नमस्ते', lang: 'hi' },
            { text: 'Bienvenue', lang: 'fr' },
            { text: 'أهلاً بك', lang: 'ar' },
            { text: 'Willkommen', lang: 'de' }
        ];

        let index = 0;

        async function cycle() {
            // 1. Show Text
            const current = languages[index];
            welcomeText.textContent = current.text;
            welcomeText.dir = current.lang === 'ar' ? 'rtl' : 'ltr';
            
            textWrap.classList.add('active');

            // Wait 1.2s (still) - Faster pace
            await new Promise(r => setTimeout(r, 1200));

            // Fade Out
            textWrap.classList.remove('active');

            // Wait 0.1s (tiny gap)
            await new Promise(r => setTimeout(r, 100));

            // Next
            index = (index + 1) % languages.length;
            cycle();
        }

        cycle();
    }
    initWelcomeAnimation();
    const body        = document.getElementById('body');
    const header      = document.getElementById('header');
    const themeBtn    = document.getElementById('themeBtn');
    const themeIco    = document.getElementById('themeIco');

    const burger      = document.getElementById('burger');
    const drawer      = document.getElementById('drawer');
    const drawerClose = document.getElementById('drawerClose');
    const scrim       = document.getElementById('scrim');
    const drawerRentals     = document.getElementById('drawerRentals');
    const drawerRentalsBody = document.getElementById('drawerRentalsBody');
    const quoteForm   = document.getElementById('quoteForm');
    const galleryRunner = document.getElementById('galleryRunner');
    const cursor        = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    // ============================================================
    // 1. CUSTOM CURSOR
    // ============================================================
    if (cursor && cursorFollower && window.matchMedia('(hover: hover)').matches) {
        let mx = 0, my = 0, fx = 0, fy = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top  = my + 'px';
        });

        // Smooth follower
        (function follow() {
            fx += (mx - fx) * 0.1;
            fy += (my - fy) * 0.1;
            cursorFollower.style.left = fx + 'px';
            cursorFollower.style.top  = fy + 'px';
            requestAnimationFrame(follow);
        })();

        // Hover effect on interactive elements
        const hoverEls = document.querySelectorAll('a, button, .g-card, .svc-card, input, textarea');
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => body.classList.add('cursor-hovered'));
            el.addEventListener('mouseleave', () => body.classList.remove('cursor-hovered'));
        });
    }

    // ============================================================
    // 2. THEME SWITCH
    // ============================================================
    const savedTheme = localStorage.getItem('at-theme') || 'dark';
    applyTheme(savedTheme);

    themeBtn.addEventListener('click', () => {
        applyTheme(body.classList.contains('dark-mode') ? 'light' : 'dark');
    });

    function applyTheme(mode) {
        if (mode === 'dark') {
            body.classList.replace('light-mode', 'dark-mode');
            themeIco.className = 'fa-solid fa-sun';
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            themeIco.className = 'fa-solid fa-moon';
        }
        localStorage.setItem('at-theme', mode);
    }


    // ============================================================
    // 4. HEADER — Solid on scroll
    // ============================================================
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    
    function handleScroll() {
        const scrolled = window.scrollY > 70;
        header.classList.toggle('solid', scrolled);
        
        // On homepage, if not scrolled, we want to ensure visibility against dark video
        if (isHomePage) {
            body.classList.toggle('header-at-top', !scrolled);
        } else {
            body.classList.remove('header-at-top');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init on load

    // ============================================================
    // 5. MOBILE DRAWER
    // ============================================================
    burger.addEventListener('click',      openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    scrim.addEventListener('click',       closeDrawer);

    function openDrawer() {
        drawer.classList.add('open');
        scrim.classList.add('open');
        burger.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        scrim.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
    }

    // Close drawer on link click
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

    // Rentals accordion
    if (drawerRentals && drawerRentalsBody) {
        drawerRentals.addEventListener('click', () => {
            const isOpen = drawerRentalsBody.classList.toggle('open');
            drawerRentals.classList.toggle('open', isOpen);
            drawerRentals.setAttribute('aria-expanded', String(isOpen));
        });
    }

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    // ============================================================
    // 6. SCROLL REVEAL
    // ============================================================
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const delay = parseFloat(entry.target.style.getPropertyValue('--delay')) || 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

    // ============================================================
    // 7. GALLERY — DRAG SCROLL
    // ============================================================
    if (galleryRunner) {
        let active = false, startX, startScroll;

        galleryRunner.addEventListener('mousedown', e => {
            active = true;
            startX = e.pageX - galleryRunner.offsetLeft;
            startScroll = galleryRunner.scrollLeft;
        });
        document.addEventListener('mouseup',   () => { active = false; });
        document.addEventListener('mouseleave',() => { active = false; });
        galleryRunner.addEventListener('mousemove', e => {
            if (!active) return;
            e.preventDefault();
            const x    = e.pageX - galleryRunner.offsetLeft;
            const walk = (x - startX) * 1.5;
            galleryRunner.scrollLeft = startScroll - walk;
        });

        // Gallery Navigation Buttons
        const galleryPrev = document.getElementById('galleryPrev');
        const galleryNext = document.getElementById('galleryNext');
        
        if (galleryPrev && galleryNext) {
            const scrollAmount = 350; // Width of one card + gap roughly
            galleryPrev.addEventListener('click', () => {
                galleryRunner.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
            galleryNext.addEventListener('click', () => {
                galleryRunner.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        // Placeholder removed, handled by index-portfolio.js
    }

    // ============================================================
    // 8. QUOTE FORM
    // ============================================================
    if (quoteForm) {
        quoteForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const orig = btn.innerHTML;

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent to info@at-s.ae!';
                btn.style.background = '#16a34a';

                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.style.background = '';
                    btn.disabled = false;
                    quoteForm.reset();
                }, 4500);
            }, 1800);
        });
    }

    // ============================================================
    // 9. SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 10;
            window.scrollTo({ top, behavior: 'smooth' });
            if (drawer.classList.contains('open')) closeDrawer();
        });
    });

    // ============================================================
    //  GLOBAL SETTINGS (CMS DYNAMIC)
    // ============================================================
    async function initGlobalSettings() {
        try {
            const resp = await fetch('/settings.json');
            if (!resp.ok) return;
            const settings = await resp.json();

            // Phone
            if (settings.phone) {
                document.querySelectorAll('.cms-phone').forEach(el => el.textContent = settings.phone);
                document.querySelectorAll('.cms-phone-link').forEach(el => {
                    el.href = 'tel:' + settings.phone.replace(/\s+/g, '');
                });
            }

            // Email
            if (settings.email) {
                document.querySelectorAll('.cms-email').forEach(el => el.textContent = settings.email);
            }

            // Location
            if (settings.location) {
                document.querySelectorAll('.cms-location').forEach(el => el.textContent = settings.location);
            }
            if (settings.google_maps_link) {
                document.querySelectorAll('.cms-location-link').forEach(el => el.href = settings.google_maps_link);
            }

            // Portfolio
            if (settings.portfolio_link) {
                document.querySelectorAll('.cms-portfolio').forEach(el => el.href = settings.portfolio_link);
            }

            // Socials
            if (settings.socials) {
                if (settings.socials.instagram) document.querySelectorAll('.soc-instagram').forEach(el => el.href = settings.socials.instagram);
                if (settings.socials.facebook)  document.querySelectorAll('.soc-facebook').forEach(el => el.href = settings.socials.facebook);
                if (settings.socials.linkedin)  document.querySelectorAll('.soc-linkedin').forEach(el => el.href = settings.socials.linkedin);
                if (settings.socials.youtube)   document.querySelectorAll('.soc-youtube').forEach(el => el.href = settings.socials.youtube);
            }

        } catch (err) {
            console.error('Error loading settings:', err);
        }
    }

    // ============================================================
    // 11. FLOATING BAR LOGIC (SCROLL & CLOCK)
    // ============================================================
    function initFloatingBar() {
        const bar = document.getElementById('floatingBar');
        const toTopBtn = document.getElementById('fbToTop');
        const dateEl = document.getElementById('fbDateLabel');
        const timeEl = document.getElementById('fbTimeLabel');

        if (!bar) return;

        // A. Scroll Reveal
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                bar.classList.add('visible');
            } else {
                bar.classList.remove('visible');
            }
        });

        // B. Back to Top
        if (toTopBtn) {
            toTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // C. System Clock
        function updateClock() {
            const now = new Date();
            
            // Format: WED, APR 08
            const dateStr = now.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: '2-digit' 
            }).toUpperCase();
            
            // Format: 18:35
            const timeStr = now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            if (dateEl) dateEl.textContent = dateStr;
            if (timeEl) timeEl.textContent = timeStr;
        }

        updateClock();
        setInterval(updateClock, 1000 * 30); // Update every 30s
    }

    // ============================================================
    // 12. SERVICES SCROLL (MOBILE ARROWS)
    // ============================================================
    function initServicesScroll() {
        const grid = document.getElementById('svcGrid');
        const prev = document.getElementById('svcPrev');
        const next = document.getElementById('svcNext');

        if (!grid || !prev || !next) return;

        const scrollAmount = 300; 

        prev.addEventListener('click', () => {
            grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        next.addEventListener('click', () => {
            grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // ============================================================
    // 13. PARALLAX EFFECT
    // ============================================================
    function initParallax() {
        const parallaxEls = document.querySelectorAll('[data-parallax]');
        if (parallaxEls.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
                const offset = scrolled * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        });
    }

    initParallax();
    initServicesScroll();
    initFloatingBar();
    initGlobalSettings();

})();
