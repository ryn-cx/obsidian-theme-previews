document.addEventListener('DOMContentLoaded', function () {
    setupThemeSelector();
    loadThemeFromUrlParameters();
});

function setupThemeSelector() {
    const themeSelector = document.getElementById('theme_selector');

    // This value will automatically be replaced by the generate_theme_list.py
    const themes = [];

    // Create all of the options to choose from
    themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = `https://ryn-cx.github.io/Obsidian-Theme-Previews/themes/${theme}/theme.css`;
        option.textContent = theme;
        themeSelector.appendChild(option);
    });

    // Add event listener to change theme the selected theme is changed
    themeSelector.addEventListener('change', function () {
        const selectedThemeName = this.options[this.selectedIndex].textContent;
        applyTheme(selectedThemeName);
    });
}

function applyTheme(themeName) {
    // Load theme
    const existingThemeLinks = document.querySelector('link[rel="stylesheet"]');
    existingThemeLinks.href = `https://ryn-cx.github.io/Obsidian-Theme-Previews/themes/${themeName}/theme.css`;

    // Add theme to URL
    const url = new URL(window.location);
    url.searchParams.set('theme', themeName);
    window.history.replaceState({}, '', url);

    // Add the parameter to all internal links so you can move between pages and keep the theme
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http')) {
            const newUrl = new URL(href, window.location);
            newUrl.searchParams.set('theme', themeName);
            link.href = newUrl.toString();
        }
    });
}

function loadThemeFromUrlParameters() {
    const url = new URL(window.location);
    const themeParam = url.searchParams.get('theme');

    // If the theme exists automatically load it
    if (themeParam) {
        const options = Array.from(document.getElementById('theme_selector').options);
        let matchingOption = options.find(option => option.textContent === themeParam);

        if (matchingOption) {
            document.getElementById('theme_selector').value = matchingOption.value;
            applyTheme(themeParam);
        }
    }
}

window.setupThemeSelector = setupThemeSelector;