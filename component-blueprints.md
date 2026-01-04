# Compoent Tool - Living Syllabus

> **Note:** This document is a specialized supplement to the Living Syllabus.

While the main playbook focuses on the "Syllabus as Code" workflow using Markdown and Pandoc, this guide focuses on **direct generation of Canvas HTML components**.

It is designed to guide an AI assistant in generating "copy-paste ready" HTML code blocks that:
1. **Survive** the strict Canvas HTML sanitizer (Walled Garden).
2. **Look Professional** in both Light and Dark modes.
3. **Adhere** to modern 2025 design aesthetics (New Brutalism, Typographic Minimalism).
4. **Require Zero Setup** (No CSS files, no JavaScript, no external tools).

The core philosophy is **"Structure over Color."** You must rely on borders, opacity, and transparency rather than hard-coded pigments.

## I. The Core Commandments (Dark Mode Logic)

* **Never set a text color:** Do not use `color: #000000`, `color: #333333`, or `color: black`. Leave the color attribute undefined so the browser defaults to Black (in Light Mode) and White (in Dark Mode).

* **Never use solid light backgrounds:** Do not use `background-color: #ffffff` or `#f2f2f2`. In Dark Mode, these create blinding white boxes with unreadable white text on top.

* **Use RGBA for backgrounds:** To create a "grey" or "colored" box, use black or a specific hue with very low opacity (alpha).
    * *Light Mode:* It looks like a light pastel box.
    * *Dark Mode:* It becomes transparent or subtle, allowing the dark background to show through.

* **Use Opacity for "Grey" text:** If you want sub-text (dates, captions) to look grey, do not use a grey hex code. Use `opacity: 0.7` or `0.8`. This ensures it looks like "Dim Black" in Light Mode and "Dim White" in Dark Mode.

## II. The Container (Page Architecture)

All content should be wrapped in a main container to ensure readability on large monitors.

* **The Wrapper:**
    * **Goal:** Prevents text from stretching 2000px wide on large screens.
    * **Code:** `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6;">`

* **The Section:**
    * **Goal:** Separates major logic blocks (Intro, Main Content, Conclusion).
    * **Code:** `<section style="margin-bottom: 3rem;"> ... </section>`

## III. Typography & Hierarchy

* **Font Stack:** Always use the "System Stack" (Apple, Segoe, Roboto) rather than importing Google Fonts, which can render slowly or oddly in Canvas apps.

* **Headers (H1, H2, H3):**
    * **H1 (Page Title):** `font-size: 2.25rem; margin: 0;` (No color defined).
    * **H2 (Section Header):** Use a colored left-border to add visual interest without changing the text color.
        * *Code:* `border-left: 4px solid #2b6cb0; padding-left: 1rem; font-size: 1.5rem;`
    * **H3 (Sub-header):** Use opacity to distinguish it from body text.
        * *Code:* `font-size: 1.2rem; opacity: 0.9; margin-top: 1.5rem;`

* **Secondary Text (Metadata/Dates):**
    * *Code:* `<p style="opacity: 0.7; font-size: 1.1rem;">`

## IV. The Component Library

### 1. The "Callout" Box (Notification)
Instead of a boring red text, use a "flex" layout with an emoji icon.

```html
<div style="display: flex; gap: 1rem; background-color: rgba(49, 130, 206, 0.1); border-left: 4px solid #3182ce; padding: 1rem; align-items: start;">
    <div style="font-size: 1.5rem;">ℹ️</div>
    <div>
        <strong style="display: block; color: #2b6cb0; margin-bottom: 0.25rem;">Note for Students</strong>
        <span style="opacity: 0.9;">Assignments are due by 11:59 PM EST. No exceptions.</span>
    </div>
</div>
```

### 2. The "Pill" Tag (Status Indicators)
Use these for metadata like "Required Reading," "Optional," or "Due Date."

```html
<span style="background-color: rgba(56, 161, 105, 0.15); color: #2f855a; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; border: 1px solid #38a169;">
  Reading Due
</span>
```

### 3. The "Accordion" (Interactive Details)
The *only* interactive element allowed. Use for hiding long policies or optional readings.

```html
<details style="background-color: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); border-radius: 6px; padding: 0.5rem 1rem; margin-bottom: 1rem;">
    <summary style="cursor: pointer; font-weight: 600; opacity: 0.9;">▶ Click to expand grading rubric</summary>
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.1);">
        <p>Hidden content goes here...</p>
    </div>
</details>
```

### 4. The "Grid Card" (Dashboard Layout)
A responsive grid of clickable cards for linking to modules.

```html
<div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
    <!-- Card 1 -->
    <a href="#" style="text-decoration: none; color: inherit; flex: 1; min-width: 280px;">
        <div style="border: 2px solid rgba(0,0,0,0.1); padding: 1.5rem; border-radius: 8px; transition: transform 0.2s;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">📚</div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">Module 1</h3>
            <p style="margin: 0; opacity: 0.7;">Introduction to the course concepts.</p>
        </div>
    </a>
    <!-- Card 2 -->
    <a href="#" style="text-decoration: none; color: inherit; flex: 1; min-width: 280px;">
        <div style="border: 2px solid rgba(0,0,0,0.1); padding: 1.5rem; border-radius: 8px;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">📝</div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">Module 2</h3>
            <p style="margin: 0; opacity: 0.7;">Advanced topics and essay writing.</p>
        </div>
    </a>
</div>
```

### 5. The "Timeline" (Schedule)
A vertical timeline using border-left to create the "line."

```html
<div style="padding-left: 1.5rem; border-left: 2px solid rgba(0,0,0,0.1); margin-left: 1rem;">
    <!-- Item 1 -->
    <div style="position: relative; margin-bottom: 2rem;">
        <div style="position: absolute; left: -2.1rem; top: 0.25rem; width: 1rem; height: 1rem; background: #3182ce; border-radius: 50%;"></div>
        <strong style="display: block; font-size: 1.1rem;">Week 1: Foundations</strong>
        <span style="display: block; opacity: 0.7; margin-bottom: 0.5rem;">Jan 12 - Jan 19</span>
        <p style="margin: 0;">Read Chapter 1 and complete the introduction quiz.</p>
    </div>
    <!-- Item 2 -->
    <div style="position: relative; margin-bottom: 2rem;">
        <div style="position: absolute; left: -2.1rem; top: 0.25rem; width: 1rem; height: 1rem; background: #e2e8f0; border: 2px solid #718096; border-radius: 50%;"></div>
        <strong style="display: block; font-size: 1.1rem;">Week 2: Analysis</strong>
        <span style="display: block; opacity: 0.7; margin-bottom: 0.5rem;">Jan 20 - Jan 27</span>
        <p style="margin: 0;">Submit first draft of analytical essay.</p>
    </div>
</div>
```

### 6. The "Brutalist Table" (Data Display)
A high-contrast, bordered table that looks good on mobile.

```html
<div style="overflow-x: auto;">
    <table style="width: 100%; border-collapse: collapse; border: 2px solid rgba(0,0,0,0.8); font-family: monospace;">
        <thead>
            <tr style="border-bottom: 2px solid rgba(0,0,0,0.8); background-color: rgba(0,0,0,0.05);">
                <th style="text-align: left; padding: 1rem; border-right: 1px solid rgba(0,0,0,0.2);">Component</th>
                <th style="text-align: left; padding: 1rem;">Weight</th>
            </tr>
        </thead>
        <tbody>
            <tr style="border-bottom: 1px solid rgba(0,0,0,0.2);">
                <td style="padding: 1rem; border-right: 1px solid rgba(0,0,0,0.2);">Weekly Quizzes</td>
                <td style="padding: 1rem;">20%</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(0,0,0,0.2);">
                <td style="padding: 1rem; border-right: 1px solid rgba(0,0,0,0.2);">Midterm Essay</td>
                <td style="padding: 1rem;">30%</td>
            </tr>
            <tr>
                <td style="padding: 1rem; border-right: 1px solid rgba(0,0,0,0.2);">Final Project</td>
                <td style="padding: 1rem;">50%</td>
            </tr>
        </tbody>
    </table>
</div>
```

### 7. The "Profile Card" (Instructor Info)
A clean layout for instructor bio and contact info.

```html
<div style="display: flex; gap: 2rem; align-items: center; background-color: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.1); padding: 2rem; border-radius: 12px; flex-wrap: wrap;">
    <img src="https://placehold.co/150" alt="Instructor Portrait" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.5);">
    <div style="flex: 1; min-width: 250px;">
        <h3 style="margin: 0 0 0.5rem 0;">Dr. Jane Doe</h3>
        <p style="margin: 0 0 1rem 0; opacity: 0.8; font-style: italic;">Associate Professor of Digital Humanities</p>
        <div style="display: flex; gap: 1rem; font-size: 0.9rem;">
            <a href="mailto:jane.doe@univ.edu" style="text-decoration: none; color: #2b6cb0;">📧 Email Me</a>
            <span style="opacity: 0.5;">|</span>
            <span style="opacity: 0.8;">Office: Building 404</span>
        </div>
    </div>
</div>
```

## V. Advanced Layout Strategies

### The "Hero" Header
A visual banner for the top of a page, using CSS gradients (which usually survive sanitizers).

```html
<div style="background: linear-gradient(135deg, rgba(66, 153, 225, 0.2) 0%, rgba(160, 174, 192, 0.1) 100%); padding: 4rem 2rem; border-radius: 16px; margin-bottom: 3rem; text-align: center;">
    <h1 style="font-size: 3rem; margin-bottom: 1rem; letter-spacing: -0.05em;">Course Title 101</h1>
    <p style="font-size: 1.25rem; opacity: 0.8; max-width: 600px; margin: 0 auto;">A comprehensive introduction to the principles of modern design.</p>
</div>
```

### The "Sticky" Navbar
A navigation bar that stays visible (if the iframe allows) or at least provides quick jumps.

```html
<div style="display: flex; gap: 1rem; padding: 1rem; border-bottom: 2px solid rgba(0,0,0,0.1); margin-bottom: 2rem; overflow-x: auto;">
    <a href="#syllabus" style="text-decoration: none; color: inherit; font-weight: 600; padding: 0.5rem 1rem; background: rgba(0,0,0,0.05); border-radius: 6px;">Syllabus</a>
    <a href="#modules" style="text-decoration: none; color: inherit; font-weight: 600; padding: 0.5rem 1rem; background: rgba(0,0,0,0.05); border-radius: 6px;">Modules</a>
    <a href="#assignments" style="text-decoration: none; color: inherit; font-weight: 600; padding: 0.5rem 1rem; background: rgba(0,0,0,0.05); border-radius: 6px;">Assignments</a>
</div>
```

## VI. Color Palette Reference

When using borders or colored backgrounds, use these safe HEX codes for the *solid* parts (borders), and convert them to RGBA for *backgrounds*.

| Color Name | Safe Border Hex | Safe Background RGBA | Usage |
| --- | --- | --- | --- |
| Neutral | #e2e8f0 | rgba(0,0,0, 0.04) | Standard cards, dividers |
| Blue | #3182ce | rgba(49, 130, 206, 0.15) | Instructions, Info |
| Green | #38a169 | rgba(56, 161, 105, 0.15) | Success, Correct Answer |
| Red | #e53e3e | rgba(229, 62, 62, 0.15) | Warnings, Errors, Deadlines |
| Orange | #dd6b20 | rgba(221, 107, 32, 0.15) | Important, Caution |
| Purple | #805ad5 | rgba(128, 90, 213, 0.15) | Creative, Discussion |

## VII. Summary Checklist for New Content

1. [ ] Did I remove `color: #...` from the text?
2. [ ] Did I remove `background-color: #...` and replace it with `rgba(...)`?
3. [ ] Did I wrap the content in the main container?
4. [ ] Did I use opacity instead of grey colors for secondary text?
5. [ ] Did I use `flex-wrap: wrap` for all multi-column layouts?