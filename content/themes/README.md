# Themes Directory

This directory is intended to store custom CSS themes for the Living Syllabus project.

## How to Use

1. **Create or Download a Theme:** Save your `.css` file in this folder (e.g., `my-university.css`).
2. **Generate Content:** When running the generator, you can reference themes stored here.

    ```bash
    node generate.js my-content.md my-university
    ```

    *Note: The generator checks this folder automatically if the theme is not found in the root directory.*

## Standard Themes

Common "Classless" CSS themes often used include:

* **Academic:** A clean, serif-based layout for research papers.
* **Modern:** A sans-serif, high-contrast look for digital reading.
* **Notebook:** A style mimicking paper for creative assignments.
