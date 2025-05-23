from bs4 import BeautifulSoup
from pathlib import Path


def modify_html_file(file_path: Path) -> None:
    soup = BeautifulSoup(file_path.read_text(encoding="utf-8"), "html.parser")

    # Add the theme selector next to the dark/light toggle
    existing_selector = soup.select_one("div.theme-selector-container")
    if not existing_selector:
        theme_toggle = soup.select_one("label.theme-toggle-container")

        if not theme_toggle:
            raise ValueError(
                "Could not find the theme selector container in the HTML file."
            )

        theme_selector_container = soup.new_tag("div")
        theme_selector_container["class"] = "theme-selector-container"

        select_element = soup.new_tag("select")
        select_element["id"] = "theme_selector"
        select_element["class"] = "theme-selector"
        select_element["title"] = "Select theme"

        theme_selector_container.append(select_element)
        theme_toggle.insert_after(theme_selector_container)

    # Add the generic stylesheet node used by theme-selector.js
    stylesheet_link = soup.select_one('head link[rel="stylesheet"]')
    if not stylesheet_link:
        head = soup.select_one("head")

        if not head:
            raise ValueError("Could not find the head in the HTML file.")

        new_stylesheet = soup.new_tag("link")
        new_stylesheet["rel"] = "stylesheet"
        head.append(new_stylesheet)

    # Add theme-selector.js loading to the head
    theme_script = soup.select_one(
        'head script[src="https://ryn-cx.github.io/obsidian-theme-previews/theme-selector.js"]'
    )
    if not theme_script:
        head = soup.select_one("head")

        if not head:
            raise ValueError("Could not find the head in the HTML file.")

        new_script = soup.new_tag("script")
        new_script["src"] = (
            "https://ryn-cx.github.io/obsidian-theme-previews/theme-selector.js"
        )
        head.append(new_script)

    file_path.write_text(str(soup), encoding="utf-8")
