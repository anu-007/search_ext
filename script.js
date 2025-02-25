document.addEventListener('DOMContentLoaded', function () {
    const searchBox = document.getElementById('searchBox');
    const chatgptBtn = document.getElementById('chatgptBtn');
    const googleBtn = document.getElementById('googleBtn');
    const perplexityBtn = document.getElementById('perplexityBtn');
    const allDropdowns = document.querySelectorAll('.search-options');

    // Default search engine options (no longer loaded from storage)
    let currentChatGPTOption = 'web';
    let currentGoogleOption = 'regular';
    let currentPerplexityOption = 'auto';

    // Close all dropdowns
    function closeAllDropdowns() {
        allDropdowns.forEach(dropdown => dropdown.classList.remove('show'));
    }

    // Handle dropdowns
    function setupDropdown(btnId, optionsId, optionVar) {
        const btn = document.getElementById(btnId);
        const options = document.getElementById(optionsId);
        const btnIcon = btn.querySelector('img');

        // Separate click handlers for the button icon (search) and dropdown arrow
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Check if the click target is the dropdown part (text or arrow)
            const isDropdownClick = e.target === btn ||
                (!e.target.matches('img') && e.target.closest('button') === btn);

            if (isDropdownClick) {
                // Close other dropdowns before opening this one
                allDropdowns.forEach(dropdown => {
                    if (dropdown !== options) {
                        dropdown.classList.remove('show');
                    }
                });

                // Toggle this dropdown
                options.classList.toggle('show');
            } else if (e.target === btnIcon) {
                // If icon is clicked, perform search
                performSearch(btnId);
            }
        });

        options.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling to button

            if (e.target.classList.contains('search-option')) {
                const value = e.target.dataset.value;

                // Update the option in memory (but don't save to storage)
                switch (optionVar) {
                    case 'chatgptOption': currentChatGPTOption = value; break;
                    case 'googleOption': currentGoogleOption = value; break;
                    case 'perplexityOption': currentPerplexityOption = value; break;
                }

                // Now perform the search with the selected option
                performSearch(btnId, value);

                closeAllDropdowns();
            }
        });
    }

    // Perform search based on button clicked and option selected
    function performSearch(btnId, specificOption = null) {
        const query = searchBox.value.trim();
        if (!query) return;

        switch (btnId) {
            case 'chatgptBtn':
                const chatgptBaseUrl = 'https://chat.openai.com/';
                // Use specificOption if provided, otherwise use current option
                const chatgptOption = specificOption || currentChatGPTOption;
                const chatgptUrl = chatgptOption === 'web'
                    ? `${chatgptBaseUrl}?web=1&q=${encodeURIComponent(query)}`
                    : `${chatgptBaseUrl}?q=${encodeURIComponent(query)}`;
                chrome.tabs.create({ url: chatgptUrl });
                break;

            case 'googleBtn':
                let googleUrl = 'https://www.google.com/search?q=';
                // Use specificOption if provided, otherwise use current option
                const googleOption = specificOption || currentGoogleOption;
                switch (googleOption) {
                    case 'flash':
                        googleUrl = 'https://gemini.google.com/app?model=gemini-2.0-flash-001&q=';
                        break;
                    case 'experimental':
                        googleUrl = 'https://gemini.google.com/app?model=gemini-2.0-flash-thinking-exp-01-21&q=';
                        break;
                }
                chrome.tabs.create({ url: googleUrl + encodeURIComponent(query) });
                break;

            case 'perplexityBtn':
                let perplexityUrl = 'https://www.perplexity.ai/';
                // Use specificOption if provided, otherwise use current option
                const perplexityOption = specificOption || currentPerplexityOption;
                switch (perplexityOption) {
                    case 'deep':
                        perplexityUrl += 'deep?q=';
                        break;
                    case 'o3mini':
                        perplexityUrl += 'search/o3mini?q=';
                        break;
                    case 'r1':
                        perplexityUrl += 'search/r1?q=';
                        break;
                    default:
                        perplexityUrl += '?q=';
                }
                chrome.tabs.create({ url: perplexityUrl + encodeURIComponent(query) });
                break;
        }
    }

    setupDropdown('chatgptBtn', 'chatgptOptions', 'chatgptOption');
    setupDropdown('googleBtn', 'googleOptions', 'googleOption');
    setupDropdown('perplexityBtn', 'perplexityOptions', 'perplexityOption');

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        closeAllDropdowns();
    });

    // Handle search when clicking the main button (not dropdown)
    chatgptBtn.querySelector('img').addEventListener('click', () => performSearch('chatgptBtn'));
    googleBtn.querySelector('img').addEventListener('click', () => performSearch('googleBtn'));
    perplexityBtn.querySelector('img').addEventListener('click', () => performSearch('perplexityBtn'));

    // Handle Enter key in search box
    searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchBox.value.trim();
            if (query) {
                chrome.search.query({ text: query });
            }
        }
    });
});