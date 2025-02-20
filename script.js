document.addEventListener('DOMContentLoaded', function () {
    console.log('script loaded')
    const searchBox = document.getElementById('searchBox');
    const chatgptBtn = document.getElementById('chatgptBtn');
    const googleBtn = document.getElementById('googleBtn');
    const perplexityBtn = document.getElementById('perplexityBtn');

    // Handle search with different engines
    chatgptBtn.addEventListener('click', () => {
        const query = searchBox.value.trim();
        if (query) {
            chrome.tabs.create({
                url: `https://chat.openai.com/?q=${encodeURIComponent(query)}`
            });
        }
    });

    googleBtn.addEventListener('click', () => {
        const query = searchBox.value.trim();
        if (query) {
            chrome.tabs.create({
                url: `https://www.google.com/search?q=${encodeURIComponent(query)}`
            });
        }
    });

    perplexityBtn.addEventListener('click', () => {
        const query = searchBox.value.trim();
        if (query) {
            chrome.tabs.create({
                url: `https://www.perplexity.ai/?q=${encodeURIComponent(query)}`
            });
        }
    });

    // Handle Enter key in search box
    searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchBox.value.trim();
            if (query) {
                // Default to Google search on Enter
                chrome.tabs.create({
                    url: `https://www.google.com/search?q=${encodeURIComponent(query)}`
                });
            }
        }
    });

    const bookmarksContainer = document.querySelector('.bookmarks-grid');

    function fetchBookmarks() {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            displayBookmarks(bookmarkTreeNodes, bookmarksContainer);
        });
    }

    function displayBookmarks(bookmarkNodes, container) {
        container.innerHTML = '';

        bookmarkNodes.forEach(node => {
            if (node.children) {
                displayBookmarks(node.children, container);
            } else if (node.url) {
                // Create a bookmark link
                const link = document.createElement('a');
                link.href = node.url;
                link.className = 'bookmark-card';
                link.target = "_blank";
                link.innerHTML = `<img src="https://www.google.com/s2/favicons?sz=32&domain=${node.url}" alt="Bookmark Icon"> <span class="bookmark-title">${node.title}</span>`;

                container.appendChild(link);
            }
        });
    }

    fetchBookmarks();

    async function fetchTechNews() {
        const newsGrid = document.querySelector('.news-grid');

        try {
            // Fetch news from TechCrunch API
            const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://techcrunch.com/wp-json/wp/v2/posts?per_page=3'));
            const data = await response.json();
            const articles = JSON.parse(data.contents);

            // Remove skeleton loaders
            newsGrid.innerHTML = '';

            // Populate news articles
            articles.forEach(article => {
                const card = document.createElement('a');
                card.className = 'news-card';
                card.href = article.link;
                card.target = "_blank";
                card.innerHTML = `
                    <img src="${article.jetpack_featured_media_url || '/icons/news-placeholder.png'}" 
                         alt="${article.title.rendered}" 
                         class="news-image">
                    <div class="news-content">
                        <h3 class="news-title">${article.title.rendered}</h3>
                        <div class="news-meta">
                            <span>TechCrunch</span>
                            <span>${getTimeAgo(new Date(article.date))}</span>
                        </div>
                    </div>
                `;

                newsGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }


    function getTimeAgo(date) {
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours === 1) return '1h';
        if (diffInHours < 24) return `${diffInHours}h`;
        return `${Math.floor(diffInHours / 24)}d`;
    }

    // Load news when popup opens
    fetchTechNews();
});