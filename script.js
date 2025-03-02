document.addEventListener('DOMContentLoaded', function () {
    const searchBox = document.getElementById('searchBox');
    const chatgptBtn = document.getElementById('chatgptBtn');
    const googleBtn = document.getElementById('googleBtn');
    const perplexityBtn = document.getElementById('perplexityBtn');

    // Perform search based on button clicked
    function performSearch(btnId) {
        const query = searchBox.value.trim();
        if (!query) return;

        switch (btnId) {
            case 'chatgptBtn':
                const chatgptUrl = `https://chat.openai.com/?q=${encodeURIComponent(query)}`;
                chrome.tabs.create({ url: chatgptUrl });
                break;

            case 'googleBtn':
                const googleUrl = 'https://gemini.google.com/app?model=gemini-2.0-flash-001&q=' + encodeURIComponent(query);
                chrome.tabs.create({ url: googleUrl });
                break;

            case 'perplexityBtn':
                const perplexityUrl = 'https://www.perplexity.ai/?q=' + encodeURIComponent(query);
                chrome.tabs.create({ url: perplexityUrl });
                break;
        }
    }

    // Handle button clicks
    chatgptBtn.addEventListener('click', () => performSearch('chatgptBtn'));
    googleBtn.addEventListener('click', () => performSearch('googleBtn'));
    perplexityBtn.addEventListener('click', () => performSearch('perplexityBtn'));

    // Handle Enter key in search box (default to Google search)
    searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchBox.value.trim();
            if (query) {
                chrome.search.query({ text: query });
            }
        }
    });
});