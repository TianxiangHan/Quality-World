// Main JavaScript file for Quality World with Thomas website

// Navigation function
function navigateTo(url) {
    window.location.href = url;
}

// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation support for nav circles
    const navCircles = document.querySelectorAll('.nav-circle');
    navCircles.forEach(circle => {
        circle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                circle.click();
            }
        });
    });

    // Add smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.nav-circle, .roadmap-stop, .article-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Search functionality for blog page
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const articles = document.querySelectorAll('.article-card');

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            articles.forEach(article => {
                const title = article.querySelector('h3').textContent.toLowerCase();
                const snippet = article.querySelector('.article-snippet').textContent.toLowerCase();
                const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
                
                const isMatch = title.includes(searchTerm) || 
                               snippet.includes(searchTerm) || 
                               tags.some(tag => tag.includes(searchTerm));
                
                article.style.display = isMatch ? 'block' : 'none';
            });
        });
    }
}

// Filter functionality for blog
function filterArticles(category) {
    const articles = document.querySelectorAll('.article-card');
    
    articles.forEach(article => {
        if (category === 'all') {
            article.style.display = 'block';
        } else {
            const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            article.style.display = tags.includes(category.toLowerCase()) ? 'block' : 'none';
        }
    });
}

// Quality system navigation for roadmap pages
function navigateToQualitySystem(systemName, category) {
    const url = `quality-system.html?system=${encodeURIComponent(systemName)}&category=${encodeURIComponent(category)}`;
    window.location.href = url;
}

// Back navigation function
function goBack() {
    window.history.back();
}

// Home navigation
function goHome() {
    window.location.href = '../index.html';
}

// Breadcrumb functionality
function updateBreadcrumb(items) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = items.map((item, index) => {
            if (index === items.length - 1) {
                return `<span class="breadcrumb-current">${item}</span>`;
            } else {
                return `<a href="${item.url}" class="breadcrumb-link">${item.text}</a>`;
            }
        }).join(' <span class="breadcrumb-separator">></span> ');
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-open');
}

// Loading state management
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-spinner';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loading-spinner');
    if (loader) {
        loader.remove();
    }
}

// Error handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Analytics tracking (placeholder)
function trackPageView(pageName) {
    console.log(`Page view tracked: ${pageName}`);
    // Add your analytics tracking code here
}

// Share functionality
function shareArticle(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!');
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('notification-show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('notification-show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Print functionality
function printPage() {
    window.print();
}

// Accessibility improvements
function improveAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add focus management for modals and dropdowns
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or dropdowns
            const openModals = document.querySelectorAll('.modal.open');
            openModals.forEach(modal => modal.classList.remove('open'));
        }
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    improveAccessibility();
    initializeSearch();
    
    // Track initial page view
    const pageName = document.title || 'Unknown Page';
    trackPageView(pageName);
    
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            showLoading();
        });
    });
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Function to scroll to about section
function scrollToAbout(event) {
    if (event) {
        event.preventDefault();
    }
    
    console.log('scrollToAbout function called'); // Debug log
    
    const aboutSection = document.getElementById('about');
    console.log('About section found:', aboutSection); // Debug log
    
    if (aboutSection) {
        aboutSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        console.log('Scrolling to about section'); // Debug log
    } else {
        console.error('About section not found!');
    }
}

