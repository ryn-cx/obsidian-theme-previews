// Package main generates theme selector assets and injects them into HTML files
// for the Obsidian theme previews site.
package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/PuerkitoBio/goquery"
	"github.com/joho/godotenv"
)

var (
	currentDir        string
	docsDir           string
	themesDir         string
	obsidianExportDir string
)

// getThemeList returns the sorted list of theme directory names, with "Default" first.
//
// "Default" will be set to the top of the list because having it as the first entry
// improves the user experience because the user will start at the top of the list of
// themes instead of in the middle.
func getThemeList() ([]string, error) {
	entries, err := os.ReadDir(themesDir)
	if err != nil {
		return nil, fmt.Errorf("reading themes directory: %w", err)
	}

	var themes []string
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		if entry.Name() == "Default" {
			themes = append([]string{"Default"}, themes...)
		} else {
			themes = append(themes, entry.Name())
		}
	}

	return themes, nil
}

// writeThemeList writes docs/themes.json containing the sorted theme names.
func writeThemeList() error {
	themes, err := getThemeList()
	if err != nil {
		return fmt.Errorf("getting theme list: %w", err)
	}

	data, err := json.Marshal(themes)
	if err != nil {
		return fmt.Errorf("marshaling theme list: %w", err)
	}

	outputPath := filepath.Join(docsDir, "themes.json")
	if err := os.WriteFile(outputPath, data, 0644); err != nil {
		return fmt.Errorf("writing %s: %w", outputPath, err)
	}
	return nil
}

// copyThemeSelector copies theme-selector.js into the docs directory.
func copyThemeSelector() error {
	src := filepath.Join(currentDir, "theme-selector.js")
	dst := filepath.Join(docsDir, "theme-selector.js")

	data, err := os.ReadFile(src)
	if err != nil {
		return fmt.Errorf("reading %s: %w", src, err)
	}
	if err := os.WriteFile(dst, data, 0644); err != nil {
		return fmt.Errorf("writing %s: %w", dst, err)
	}
	return nil
}

// addThemeSelectorToHTML adds the theme selector to every HTML file.
func addThemeSelectorToHTML(doc *goquery.Document) error {
	themeToggle := doc.Find("label.theme-toggle-container").First()
	if themeToggle.Length() == 0 {
		return fmt.Errorf("could not find the theme toggle container")
	}

	themeToggle.AfterHtml(
		`<div class="theme-selector-container">` +
			`<select id="theme_selector" class="theme-selector" title="Select theme" style="width: 100px;"></select>` +
			`</div>`)
	return nil
}

// modifyHTMLFile parses an HTML file and injects the theme selector, stylesheet,
// and script tag.
func modifyHTMLFile(filePath string) error {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("reading file: %w", err)
	}

	doc, err := goquery.NewDocumentFromReader(bytes.NewReader(content))
	if err != nil {
		return fmt.Errorf("parsing HTML: %w", err)
	}

	if err := addThemeSelectorToHTML(doc); err != nil {
		return fmt.Errorf("adding theme selector: %w", err)
	}

	head := doc.Find("head").First()
	if head.Length() == 0 {
		return fmt.Errorf("could not find <head>")
	}

	basePath := "/" + filepath.Base(currentDir)
	head.AppendHtml(fmt.Sprintf(`<link id="theme-stylesheet" rel="stylesheet" href="%s/generic.css"/>`, basePath))
	head.AppendHtml(fmt.Sprintf(`<script src="%s/theme-selector.js"></script>`, basePath))

	html, err := doc.Html()
	if err != nil {
		return fmt.Errorf("serializing HTML: %w", err)
	}

	if err := os.WriteFile(filePath, []byte(html), 0644); err != nil {
		return fmt.Errorf("writing file: %w", err)
	}
	return nil
}

// getThemesSource returns the path to the Obsidian themes directory from the
// OBSIDIAN_THEMES_PATH env var, prompting the user for input if unset.
func getThemesSource() (string, error) {
	if p := os.Getenv("OBSIDIAN_THEMES_PATH"); p != "" {
		return p, nil
	}

	fmt.Print("OBSIDIAN_THEMES_PATH is not set. Enter the path to your Obsidian themes directory: ")
	scanner := bufio.NewScanner(os.Stdin)
	if !scanner.Scan() {
		return "", fmt.Errorf("no input provided")
	}
	p := strings.TrimSpace(scanner.Text())
	if p == "" {
		return "", fmt.Errorf("empty path provided")
	}
	return p, nil
}

// copyDir recursively copies the contents of src into dst.
func copyDir(src, dst string) error {
	return filepath.WalkDir(src, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}

		relPath, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}

		targetPath := filepath.Join(dst, relPath)

		if d.IsDir() {
			return os.MkdirAll(targetPath, 0755)
		}

		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		return os.WriteFile(targetPath, data, 0644)
	})
}

func run() error {
	exe, err := os.Executable()
	if err != nil {
		currentDir, _ = os.Getwd()
	} else {
		currentDir = filepath.Dir(exe)
	}
	docsDir = filepath.Join(currentDir, "docs")
	themesDir = filepath.Join(docsDir, "themes")
	obsidianExportDir = filepath.Join(currentDir, "obsidian-export")

	_ = godotenv.Load() // loads .env from working directory

	fmt.Println("Removing docs directory...")
	if err := os.RemoveAll(docsDir); err != nil {
		return fmt.Errorf("removing docs directory: %w", err)
	}

	fmt.Println("Copying obsidian-export to docs...")
	if err := copyDir(obsidianExportDir, docsDir); err != nil {
		return fmt.Errorf("copying obsidian-export to docs: %w", err)
	}

	fmt.Println("Copying themes...")
	themesSource, err := getThemesSource()
	if err != nil {
		return fmt.Errorf("getting themes source: %w", err)
	}
	if err := copyDir(themesSource, themesDir); err != nil {
		return fmt.Errorf("copying themes: %w", err)
	}

	fmt.Println("Generating themes.json...")
	if err := writeThemeList(); err != nil {
		return fmt.Errorf("generating themes.json: %w", err)
	}

	fmt.Println("Copying theme-selector.js...")
	if err := copyThemeSelector(); err != nil {
		return fmt.Errorf("copying theme-selector.js: %w", err)
	}

	fmt.Println("Modifying HTML files...")
	siteLibDir := filepath.Join(docsDir, "site-lib")
	var htmlFiles []string
	err = filepath.WalkDir(docsDir, func(path string, d os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if d.IsDir() && path == siteLibDir {
			return filepath.SkipDir
		}
		if !d.IsDir() && strings.HasSuffix(path, ".html") {
			htmlFiles = append(htmlFiles, path)
		}
		return nil
	})
	if err != nil {
		return fmt.Errorf("walking docs directory: %w", err)
	}

	var wg sync.WaitGroup
	errs := make([]error, len(htmlFiles))
	for i, path := range htmlFiles {
		wg.Add(1)
		go func(i int, path string) {
			defer wg.Done()
			if err := modifyHTMLFile(path); err != nil {
				errs[i] = fmt.Errorf("%s: %w", path, err)
			}
		}(i, path)
	}
	wg.Wait()

	for _, e := range errs {
		if e != nil {
			return fmt.Errorf("modifying HTML files: %w", e)
		}
	}

	fmt.Println("Done.")
	return nil
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}
