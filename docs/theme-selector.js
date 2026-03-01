const basePath = window.location.pathname.split('/')[1];

document.addEventListener('DOMContentLoaded', async function () {
    await addThemeSelector();
    loadThemeFromUrlParameters();
});

window.addEventListener('popstate', function () {
    loadThemeFromUrlParameters();
});

async function addThemeSelector() {
    const themeSelector = document.getElementById('theme_selector');
    const response = await fetch(`${window.location.origin}/${basePath}/themes.json`);
    const themes = await response.json();

    themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme;
        themeSelector.appendChild(option);
    });

    themeSelector.addEventListener('change', function () {
        applyTheme(this.value);
    });
}

function applyTheme(themeName, { pushHistory = true } = {}) {
    const themeLink = document.getElementById('theme-stylesheet');
    themeLink.href = `${window.location.origin}/${basePath}/themes/${themeName}/theme.css`;

    const url = new URL(window.location);
    url.searchParams.set('theme', themeName);
    if (pushHistory) {
        window.history.pushState({}, '', url);
    }

    // Add the parameter to all internal links so you can move between pages and keep
    // the theme.
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href.startsWith('/') || href.startsWith('.')) {
            const newUrl = new URL(href, window.location);
            newUrl.searchParams.set('theme', themeName);
            link.href = newUrl.toString();
        }
    });
}

function loadThemeFromUrlParameters() {
    const themeSelector = document.getElementById('theme_selector');
    const themeParam = new URL(window.location).searchParams.get('theme') || 'Default';
    themeSelector.value = themeParam;
    applyTheme(themeParam, { pushHistory: false });
}

window.addThemeSelector = addThemeSelector;
