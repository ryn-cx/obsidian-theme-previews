# IMport generate and html functions
from generate_theme_list import generate_theme_list
from pathlib import Path
from html_modify import modify_html_file
def main():
    current_dir = Path(__file__).parent
    themes_dir = current_dir / "themes"
    generate_theme_list(themes_dir)

    docs_dir = current_dir / "docs"
    html_files = list(docs_dir.glob("**/*.html"))
    for file_path in html_files:
        modify_html_file(file_path)


if __name__ == "__main__":
    main()
