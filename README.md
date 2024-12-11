# A11yEnhance Documentation

## Introduction
The Accessibility Toolkit is a lightweight, customizable widget designed to enhance the accessibility of your website. It provides features such as high contrast mode, text-to-speech (TTS), color blind-friendly adjustments, and more to ensure an inclusive experience for all users.

---

## Installation
To add the Accessibility Toolkit to your website, follow these steps:

1. Clone or download the Accessibility Toolkit repository from [GitHub](https://github.com/MrRandomDevelopment/A11yEnhance) or download the toolkit directly from our [official website](https://a11yenhance.coroposws.com).
2. Place the `a11yenhance` ZIP file into your project, then unzip the file.
3. Add the following script tag to your HTML file to include the toolkit:
   ```html
   <script src="./a11yenhance/dist/main.js" defer></script>
   ```
4. To ensure the toolkit applies its features to specific sections, wrap your main content in a `<div id="page-content">` tag:
   ```html
   <div id="page-content">
     Your website content goes here
   </div>
   ```

Save your changes and reload the website to see the Accessibility Toolkit in action.

---

## Features
The toolkit includes the following features:
- **High Contrast Mode:** Increases text and background contrast for improved readability.
- **Color Blind-Friendly Mode:** Applies grayscale filters to assist users with color blindness.
- **Large Text:** Enlarges all text on the page for users with visual impairments.
- **Readable Fonts:** Switches to dyslexia-friendly fonts.
- **Text-to-Speech (TTS):** Reads the page content aloud.
- **Focus Highlight:** Highlights focused elements for keyboard navigation.
- **Reduce Motion:** Disables animations for motion-sensitive users.
- **Reading Guide:** Displays a horizontal guide to assist line tracking.
- **Language Selector:** Changes the website's language for TTS and content adaptation.

---

## Usage Instructions
The widget appears in the bottom-right corner of the page. By default, it is minimized. Click the **"Accessibility Toolkit"** header to open the widget and access the features.

Use the toggles, sliders, and dropdowns to customize the accessibility settings as needed. Preferences are saved automatically and restored on subsequent visits.

---

## Customization
To customize the toolkit (e.g., change default settings or styling), modify the `main.js` file. You can:
- Set default preferences for features such as high contrast or large text.
- Adjust the widget's position by changing the `bottom` and `right` values in the CSS.
- Add or remove features as needed.

---

## Known Bugs
1. When using the high contrast or color blind mode, the toolkit resets to a random spot on the page.
   - **Found a fix?** Let us know on GitHub or email us at `equigley@coroposws.com`.

---

## FAQ

### Q: Can I disable a feature if I don’t need it?
**A:** Yes, you can modify the `main.js` file to remove unnecessary features.

### Q: Will the toolkit affect my website’s performance?
**A:** No, the toolkit is lightweight and optimized for performance.

### Q: How are preferences saved?
**A:** Preferences are stored in the browser's `localStorage`.

### Q: How can I get updates for the Accessibility Toolkit?
**A:** Check for updates on our [GitHub repository](https://github.com/MrRandomDevelopment/A11yEnhance) 

---

## Footer
©2024 Coropos Web Services. Developed by [Edward Quigley](#).
