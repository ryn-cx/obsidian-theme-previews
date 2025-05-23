import json
from pathlib import Path


def generate_theme_list(themes_dir: Path) -> None:
    current_dir = Path(__file__).parent
    themes_dir = current_dir / "themes"
    themes = [folder.name for folder in themes_dir.iterdir() if folder.is_dir()]

    # Bring default to the top of the list to make the theme correct on the first load.
    themes.sort(key=lambda x: (x != "Default", x))

    template_file = current_dir / "theme-selector.template.js"
    template_content = template_file.read_text(encoding="utf-8")
    template_content = template_content.replace("themes = []", f"themes = {themes}")

    theme_selector_file = current_dir / "docs/theme-selector.js"
    theme_selector_file.write_text(template_content, encoding="utf-8")
