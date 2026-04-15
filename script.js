// Navbar scroll behavior
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
}


// Mobile menu
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
const mobileMenuCta = document.querySelector('.mobile-menu-cta');
const mobileOverlay = document.querySelector('.mobile-menu-overlay');

// Helper: reset hamburger icon
function resetHamburger() {
    const spans = mobileMenuToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

// Helper: close mobile menu
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    resetHamburger();
}

mobileMenuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    if (mobileOverlay) mobileOverlay.classList.toggle('active', isOpen);

    if (isOpen) {
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        resetHamburger();
    }
});

// Close on link/CTA/overlay click
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});
mobileMenuCta.addEventListener('click', closeMobileMenu);
if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
}

// Close on click outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        closeMobileMenu();
    }
});

// Pricing toggle
const pricingToggle = document.getElementById('pricing-toggle');
const monthlyLabel = document.getElementById('monthly-label');
const yearlyLabel = document.getElementById('yearly-label');
const priceAmounts = document.querySelectorAll('.amount');

pricingToggle.addEventListener('change', () => {
    const isYearly = pricingToggle.checked;

    if (isYearly) {
        monthlyLabel.classList.remove('active');
        yearlyLabel.classList.add('active');
    } else {
        monthlyLabel.classList.add('active');
        yearlyLabel.classList.remove('active');
    }

    priceAmounts.forEach(amount => {
        const monthlyPrice = amount.getAttribute('data-monthly');
        const yearlyPrice = amount.getAttribute('data-yearly');

        amount.style.opacity = '0';
        amount.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            amount.textContent = isYearly ? yearlyPrice : monthlyPrice;
            amount.style.opacity = '1';
            amount.style.transform = 'translateY(0)';
        }, 150);
    });
});

monthlyLabel.classList.add('active');

// Scroll reveal (IntersectionObserver)
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Dashboard sidebar tabs
const dashboardLinks = document.querySelectorAll('.dashboard-sidebar .sidebar-link[data-view]');
const dashboardViews = document.querySelectorAll('.dashboard-main .dashboard-view[data-view]');
const dashboardPill = document.getElementById('dashboard-pill');

const dashboardPillTextByView = {
    overview: 'Today',
    tasks: 'My Tasks',
    projects: 'Projects',
    team: 'Team',
    insights: 'Insights',
    settings: 'Settings'
};

function setDashboardView(viewName) {
    if (!viewName) return;

    dashboardLinks.forEach(link => {
        const isActive = link.getAttribute('data-view') === viewName;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    dashboardViews.forEach(view => {
        const isActive = view.getAttribute('data-view') === viewName;
        view.classList.toggle('active', isActive);
    });

    if (dashboardPill) {
        dashboardPill.textContent = dashboardPillTextByView[viewName] || 'Today';
    }
}

if (dashboardLinks.length && dashboardViews.length) {
    dashboardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            setDashboardView(link.getAttribute('data-view'));
        });
    });
}

// User profile dropdown
const userProfile = document.querySelector('.user-profile');
const profileDropdown = document.querySelector('.profile-dropdown');
const userAvatar = document.querySelector('.user-avatar');

if (userProfile && profileDropdown) {
    userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = userAvatar.getAttribute('aria-expanded') === 'true';
        userAvatar.setAttribute('aria-expanded', !isExpanded);
        profileDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!userProfile.contains(e.target)) {
            userAvatar.setAttribute('aria-expanded', 'false');
            profileDropdown.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && profileDropdown.classList.contains('active')) {
            userAvatar.setAttribute('aria-expanded', 'false');
            profileDropdown.classList.remove('active');
        }
    });

    // Settings link navigation
    const settingsLink = document.getElementById('settings-link');
    if (settingsLink) {
        settingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDashboardView('settings');
            userAvatar.setAttribute('aria-expanded', 'false');
            profileDropdown.classList.remove('active');

            const dashboardContent = document.querySelector('.dashboard-content');
            if (dashboardContent) {
                dashboardContent.scrollTop = 0;
            }
        });
    }
}

// Back to top button
const backToTopBtn = document.querySelector('.back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Active nav link highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');
const mobileNavLinks = document.querySelectorAll('.mobile-menu-link');

function updateActiveNavLink() {
    // Use the vertical midpoint of the viewport as the probe
    const scrollMid = window.scrollY + window.innerHeight * 0.4;

    let currentId = null;
    sections.forEach(section => {
        const top = section.offsetTop - 20;
        const bottom = top + section.offsetHeight;
        if (scrollMid >= top && scrollMid < bottom) {
            currentId = section.getAttribute('id');
        }
    });

    // If near the very top, clear active state
    if (window.scrollY < 80) currentId = null;

    const href = currentId ? `#${currentId}` : null;

    navLinksAll.forEach(link => {
        link.classList.toggle('active', href !== null && link.getAttribute('href') === href);
    });
    mobileNavLinks.forEach(link => {
        link.classList.toggle('active', href !== null && link.getAttribute('href') === href);
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
updateActiveNavLink();

// Skeleton loading animation
const dashboardSkeleton = document.querySelector('.dashboard-skeleton');
if (dashboardSkeleton) {
    // Remove skeleton class after animation completes
    dashboardSkeleton.addEventListener('animationend', () => {
        dashboardSkeleton.classList.remove('dashboard-skeleton');
    });
}

// Scroll progress bar
const scrollProgressBar = document.getElementById('scrollProgress');

if (scrollProgressBar) {
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / docHeight;
        
        scrollProgressBar.style.width = (progress * 100) + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
}

// Dark/light mode
const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('focusflow-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        if (newTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', newTheme);
        }

        localStorage.setItem('focusflow-theme', newTheme);
    });
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all other items
        faqItems.forEach(other => {
            if (other !== item) {
                other.classList.remove('open');
                other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            }
        });

        // Toggle current
        item.classList.toggle('open', !isOpen);
        question.setAttribute('aria-expanded', !isOpen);
    });
});

// Cookie consent
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

if (cookieBanner && !localStorage.getItem('focusflow-cookies')) {
    // Show banner after a short delay
    setTimeout(() => {
        cookieBanner.classList.add('visible');
    }, 1500);

    const dismissBanner = (choice) => {
        cookieBanner.classList.remove('visible');
        localStorage.setItem('focusflow-cookies', choice);
    };

    if (cookieAccept) cookieAccept.addEventListener('click', () => dismissBanner('accepted'));
    if (cookieDecline) cookieDecline.addEventListener('click', () => dismissBanner('declined'));
}

// Dashboard tabs
const tabChips = document.querySelectorAll('.chip-group[aria-label="Task filters"] .chip[data-tab]');
const tabContents = document.querySelectorAll('.dashboard-view[data-view="tasks"] .tab-content');

if (tabChips.length > 0 && tabContents.length > 0) {
    tabChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active class from all chips
            tabChips.forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            chip.classList.add('active');

            // Hide all tab content
            tabContents.forEach(content => content.classList.remove('active'));

            // Show target tab content
            const targetId = chip.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}
