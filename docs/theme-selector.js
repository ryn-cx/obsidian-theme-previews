document.addEventListener('DOMContentLoaded', function () {
    setupThemeSelector();
    loadThemeFromUrlParameters();
});

function setupThemeSelector() {
    const themeSelector = document.getElementById('theme_selector');

    // This value will automatically be replaced by the generate_theme_list.py
    const themes = ['Default', '80s Neon', 'AMOLED Serenity', 'Abate', 'Abecedarium', 'AbsoluteGruv', 'Abyssal', 'Adrenaline', 'Adwaita', 'Agate', 'Al Dente', 'Allium', 'AnuPpuccin', 'Apatheia', 'Apex', 'Arcane', 'Atom', 'Aura', 'Aura Dark', 'Aurora', 'Aurora-Twilight', 'Autotape', 'Ayu Mirage', 'Base2Tone', 'Behave dark', 'Big & Bold', 'Black', 'Blackbird', 'Blossom', 'Blue Topaz', 'Bolt', 'Border', 'Borealis', 'Bossidian', 'Brainhack', 'Brutalism', 'Buena Vista', 'Camena', 'Carbon', 'Cardstock', 'Catppuccin', 'Celestial Night', 'Charcoal', 'Christmas', 'Cobalt Peacock', 'Colored Candy', 'Comfort', 'Comfort Dark', 'Comfort Smooth', 'Comfort color dark', 'Composer', 'Consolas', 'Covert', 'Creature', 'Creme brulee', 'Cupertino', 'Cyber Glow', 'Cybertron', 'Cybertron Shifted', 'Dark Castle', 'Dark Clarity', 'Dark Graphite', 'Dark Graphite Pie', 'Dark Moss', 'DarkEmber', 'Darkyan', 'Dawn', 'Dayspring', 'Dekurai', 'Discordian', 'Dracula + LYT', 'Dracula Gemini', 'Dracula Official', 'Dracula Plus', 'Dracula Slim', 'Dracula for Obsidian', 'Dune', 'Dunite', 'Dust', 'Dynamic Color', 'Ebullientworks', 'Eldritch', 'Elegance', 'Emerald Echo', 'Encore', 'Enhanced file explorer tree', 'Ethereon', 'Everblush', 'Everforest', 'Everforest Enchanted', 'Evergreen-Shadow', 'EvilRed', 'Faded', 'Fancy-a-Story', 'FastPpuccin', 'Feather', 'Firefly', 'Flexoki', 'Flexoki Warm', 'Focus', 'Frost', 'Fusion', 'GDCT', 'GDCT Dark', 'Garden Gnome (Adwaita, GTK)', 'GitHub Theme', 'GitHubDHC', 'Gitsidian', 'Glass Robo', 'Golden Topaz', 'Green Nightmare', 'Gummy-Revived', 'Hackthebox', 'Handwriting (Kalam)', 'Heboric', 'Hipstersmoothie', 'Hojicha', 'Hulk', 'ITS Theme', 'Iceberg', 'Improved Potato', 'Ink', 'Jotter', 'Kakano', 'Kanagawa', 'Kanagawa Paper', 'Kiwi Mono', 'Kurokula', 'LYT Mode', 'LaTeX', 'Lagom', 'Lavender-Mist', 'Lemons Theme', 'LessWrong', 'Light & Bright', 'Listive', 'Lorens', 'Lumines', 'Mado 11', 'Mado Miniflow', 'MagicUser', 'Mammoth', 'Maple', 'Marathon', 'Material 3', 'Material Flat', 'Material Gruvbox', 'Material Ocean', 'Meridian', 'Micro Mike', 'Midnight-Fjord', 'Minimal', 'Minimal Dracula', 'Minimal Edge', 'Minimal Red', 'Minimal-Dark-Coder', 'Minimal-Resources', 'Mint-Breeze', 'MistyMauve', 'Mono High Contrast', 'Monokai', 'Moonlight', 'Mulled Wine', 'Muted-Blue', 'Myst', 'Nebula', 'Neo', 'Neon Synthwave', 'Neovim', 'NeuBorder', 'Neumorphism', 'Neutral Academia', 'Nier', 'Nightfox', 'Nightingale', 'Nordic', 'Northern-Sky', 'NotSwift', 'Notation', 'Notation 2', 'Novadust', 'OISTNB', 'OLED.Black', 'Obsidian Boom', 'Obsidian Nord', 'Obsidian gruvbox', 'Obsidianite', 'Obsidianotion', 'Obuntu', 'Old World', 'Oldsidian Purple', 'Olivier’s Theme', 'OneNice', 'Ono Sendai', 'Orange', 'Oreo', 'Origami', 'Origin', 'OverCast', 'PLN', 'Pale - 淡', 'Panic Mode', 'Penumbra', 'Perso', 'Phoenix', 'Pine Forest Berry', 'Pink Topaz', 'Pisum', 'Planetary', 'Playground', 'Poimandres', 'Polka', 'Pomme Notes', 'Powered by Lancer', 'Primary', 'Prime', 'Prism', 'Proper Dark', 'ProtocolBlue', 'Prussian Blue', 'Publisher', 'Pure', 'Purple Aurora', 'Purple Owl', 'Pxld', 'Qlean', 'Quillcode', 'Red Graphite', 'Red-Shadow', 'Refined Default', 'Reshi', 'Retro Windows', 'RetroNotes', 'RetroOS 98', 'Reverie', 'Rezin', 'Ribbons', 'Rift', 'Rmaki', 'Rose Pine', 'Rose Red', 'Rosé Pine', 'Rosé Pine Moon', 'Royal Velvet', 'SALEM', 'Sad Machine Druid', 'Sakurajima', 'Sanctum', 'Sanctum reborn', 'Sandover', 'Sandstorm', 'Sanguine', 'Sea Glass', 'Seamless View', 'Sei', 'Serenity', 'Serif', 'Serika', 'Shade Sanctuary', 'Shadeflow', 'Shiba Inu', 'Shimmering Focus', 'Simple', 'Simplicity', 'Simply Colorful', 'Sodalite', 'Solarized', 'Soli Deo Gloria', 'Solitude', 'Soloing', 'Soothe', 'Space', 'Sparkling Day', 'Sparkling Night', 'Sparkling Wisdom', 'Spectrum', 'Spectrum Blue', 'Spring', 'Strict', 'Subtlegold', 'Suddha', 'Sunbather', 'SynthWave', "Synthwave '84", 'Terminal', 'Terminal2K', 'TerraFlow', 'Theme-That-Shall-Not-Be-Named', 'Things', 'Things 3', 'Tiniri', 'Tokyo Night', 'Tokyo Night Storm', "Tom's Theme", 'Tomorrow', 'Tomorrow Night Bright', 'Trace Labs', 'Transient', 'Transparent', 'Typewriter', 'Typomagical', 'Typora-Vue', 'Ukiyo', 'Ultra Lobster', 'Underwater', 'Ursa', 'Vanilla AMOLED', 'Vanilla AMOLED Color', 'Vanilla Palettes', 'Vauxhall', 'Velvet-Moon', 'Venom', 'Vercel Geist', 'Vesper', 'Vibrant', 'Vicious', 'Violet Evening', 'Virgo', 'Vortex', 'W95', 'WY Console', 'Wasp', 'Wikipedia', 'WilcoxOne', 'Willemstad', 'Winter Spices', 'WiseLight', 'Wombat', 'Wyrd', 'Yue', 'Zario', 'Zen', 'Zenburn', 'aged whisky', 'chiaroscuroflow', 'cocoa', 'deep submerge', 'deeper work', 'evangelion', 'flexcyon', 'halcyon', 'iA Writer', 'iB Writer', 'ion', 'mono black (monochrome, charcoal)', 'monochroYOU', 'nobb', 'obsidian_ia', 'parfait', 'sQdthOne', '🔔 Chime'];

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