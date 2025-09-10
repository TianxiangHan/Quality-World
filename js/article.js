// Article page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get article ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (articleId) {
        loadArticle(articleId);
    } else {
        // Redirect to blog if no article ID
        window.location.href = 'blog.html';
    }
});

function loadArticle(articleId) {
    const article = getArticleById(articleId);
    
    if (!article) {
        showError('Article not found');
        return;
    }

    // Update page title
    document.title = `${article.title} - Quality World with Thomas`;
    
    // Update page elements
    updatePageContent(article);
    
    // Load related articles
    loadRelatedArticles(articleId);
    
    // Update URL for sharing
    updateSharingButtons(article);
}

function updatePageContent(article) {
    // Update title and meta information
    document.getElementById('page-title').textContent = `${article.title} - Quality World with Thomas`;
    document.getElementById('article-breadcrumb-title').textContent = article.title;
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('article-date').textContent = article.date;
    document.getElementById('reading-time').textContent = article.readingTime;
    
    // Update tags
    const tagsContainer = document.getElementById('article-tags');
    tagsContainer.innerHTML = '';
    article.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // Update article content
    const contentContainer = document.getElementById('article-body');
    contentContainer.innerHTML = article.content;
    
    // Add smooth scrolling for internal links
    addSmoothScrolling();
}

function loadRelatedArticles(currentArticleId) {
    const relatedArticles = getRelatedArticles(currentArticleId, 3);
    const container = document.getElementById('related-articles-grid');
    
    if (relatedArticles.length === 0) {
        document.querySelector('.related-articles').style.display = 'none';
        return;
    }
    
    container.innerHTML = '';
    
    relatedArticles.forEach(article => {
        const articleCard = createRelatedArticleCard(article);
        container.appendChild(articleCard);
    });
}

function createRelatedArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'related-article-card';
    card.onclick = () => loadNewArticle(article.id);
    
    card.innerHTML = `
        <div class="article-meta">
            <span class="article-date">${article.date}</span>
            <span class="reading-time">${article.readingTime}</span>
        </div>
        <h4>${article.title}</h4>
        <p class="article-snippet">${article.snippet}</p>
        <div class="article-tags">
            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;
    
    return card;
}

function loadNewArticle(articleId) {
    // Update URL without page reload
    const newUrl = `${window.location.pathname}?id=${articleId}`;
    window.history.pushState({articleId}, '', newUrl);
    
    // Load new article
    loadArticle(articleId);
    
    // Scroll to top
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function updateSharingButtons(article) {
    const currentUrl = window.location.href;
    const title = encodeURIComponent(article.title);
    const description = encodeURIComponent(article.snippet);
    
    // Store for sharing functions
    window.currentArticle = {
        url: currentUrl,
        title: article.title,
        description: article.snippet
    };
}

function shareArticle(platform) {
    const article = window.currentArticle;
    if (!article) return;
    
    const url = encodeURIComponent(article.url);
    const title = encodeURIComponent(article.title);
    const description = encodeURIComponent(article.description);
    
    let shareUrl = '';
    
    switch (platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}&hashtags=QualityManagement,QualityControl`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`;
            break;
        case 'email':
            const subject = encodeURIComponent(`Interesting Article: ${article.title}`);
            const body = encodeURIComponent(`I thought you might find this article interesting:\n\n${article.title}\n${article.description}\n\nRead more: ${article.url}`);
            shareUrl = `mailto:?subject=${subject}&body=${body}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyArticleLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!');
        }).catch(() => {
            fallbackCopyText(url);
        });
    } else {
        fallbackCopyText(url);
    }
}

function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Link copied to clipboard!');
    } catch (err) {
        showNotification('Unable to copy link. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#667eea',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: '1000',
        fontSize: '14px',
        fontWeight: '500',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function addSmoothScrolling() {
    // Add smooth scrolling to all internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
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
}

function showError(message) {
    const container = document.getElementById('article-body');
    container.innerHTML = `
        <div class="error-message">
            <h2>Oops! Something went wrong</h2>
            <p>${message}</p>
            <div class="error-actions">
                <a href="blog.html" class="btn-primary">← Back to Blog</a>
                <a href="../index.html" class="btn-secondary">Home</a>
            </div>
        </div>
    `;
    
    // Hide related articles
    document.querySelector('.related-articles').style.display = 'none';
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.articleId) {
        loadArticle(event.state.articleId);
    } else {
        window.location.href = 'blog.html';
    }
});

