// A11yEnhance v1.2.0 Open Source Version
(function () {
  /************************************************************
   * Open Source Version: No API key or authentication
   * Designed for easy integration and use.
   ************************************************************/

  // Insert Boxicons (for wheelchair icon, etc.)
  const boxiconsLink = document.createElement("link");
  boxiconsLink.rel = "stylesheet";
  boxiconsLink.href =
    "https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css";
  document.head.appendChild(boxiconsLink);

  // Insert CSS for the widget
  const style = document.createElement("style");
  style.textContent = `
    /* Widget Container */
    .compliance-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #1F2937;
      border: 1px solid #374151;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      width: 300px;
      font-family: Arial, sans-serif;
      z-index: 10000000;
      color: #FFF;
      overflow: hidden;
      transition: all 0.3s ease;
      pointer-events: auto;
      font-size: 14px;
    }
    .compliance-widget-container.minimized .compliance-content,
    .compliance-widget-container.minimized .compliance-footer {
      display: none;
    }

    /* Widget Header */
    .compliance-header {
      display: flex;
      align-items: center;
      background: #111827;
      color: #FFF;
      padding: 10px;
      border-radius: 8px 8px 0 0;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      user-select: none;
    }
    .compliance-header .logo-icon {
      font-size: 20px;
      margin-right: 8px;
    }

    /* Widget Content */
    .compliance-content {
      padding: 10px;
    }
    .compliance-option {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .compliance-option label {
      margin-left: 8px;
      font-size: 14px;
      cursor: pointer;
    }

    /* Buttons and Inputs */
    .compliance-button,
    .compliance-select,
    .compliance-range {
      width: 100%;
      margin-top: 10px;
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid #374151;
      background: #1F2937;
      color: #FFF;
      padding: 6px 8px;
      cursor: pointer;
    }
    .compliance-button:hover {
      background: #3B82F6;
      transform: scale(1.02);
    }
    .compliance-footer {
      border-top: 1px solid #374151;
      padding: 8px;
      font-size: 12px;
      color: #9CA3AF;
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  // Ensure main content exists
  function ensureMainContent() {
    let mainContent = document.getElementById("main-content");
    if (!mainContent) {
      mainContent = document.createElement("div");
      mainContent.id = "main-content";
      // Move all body children into main-content except the widget
      const children = Array.from(document.body.children);
      children.forEach((child) => {
        if (!child.classList.contains("compliance-widget-container")) {
          mainContent.appendChild(child);
        }
      });
      document.body.appendChild(mainContent);
    }
    return mainContent;
  }

  class ComplianceWidget {
    constructor() {
      this.isOpen = false; // Start minimized

      // Accessibility feature states
      this.highContrast = false;
      this.largeText = false;
      this.colorBlind = false;
      this.readableFonts = false;
      this.reduceMotion = false;

      this.contentElement = ensureMainContent();
      this.loadPreferences();
    }

    loadPreferences() {
      const prefs = JSON.parse(localStorage.getItem("accessibilityPrefs") || "{}");
      this.highContrast = prefs.highContrast || false;
      this.largeText = prefs.largeText || false;
      this.colorBlind = prefs.colorBlind || false;
      this.readableFonts = prefs.readableFonts || false;
      this.reduceMotion = prefs.reduceMotion || false;
    }

    savePreferences() {
      const prefs = {
        highContrast: this.highContrast,
        largeText: this.largeText,
        colorBlind: this.colorBlind,
        readableFonts: this.readableFonts,
        reduceMotion: this.reduceMotion,
      };
      localStorage.setItem("accessibilityPrefs", JSON.stringify(prefs));
    }

    init() {
      this.container = document.createElement("div");
      this.container.classList.add("compliance-widget-container", "minimized");
      this.container.setAttribute("role", "region");
      this.container.setAttribute("aria-label", "Accessibility Toolkit");

      const header = document.createElement("div");
      header.classList.add("compliance-header");
      header.innerHTML = `<i class='bx bx-wheelchair logo-icon'></i> Accessibility Toolkit`;
      header.addEventListener("click", () => this.toggleVisibility());

      const content = document.createElement("div");
      content.classList.add("compliance-content");

      // Add options
      content.appendChild(this.createOption("High Contrast", "high-contrast", (checked) => {
        this.toggleHighContrast(checked);
      }));
      content.appendChild(this.createOption("Large Text", "large-text", (checked) => {
        this.toggleLargeText(checked);
      }));
      content.appendChild(this.createOption("Color Blind Friendly", "color-blind", (checked) => {
        this.toggleColorBlind(checked);
      }));
      content.appendChild(this.createOption("Readable Fonts", "readable-fonts", (checked) => {
        this.toggleReadableFonts(checked);
      }));
      content.appendChild(this.createOption("Reduce Motion", "reduce-motion", (checked) => {
        this.toggleReduceMotion(checked);
      }));

      const footer = document.createElement("div");
      footer.classList.add("compliance-footer");
      footer.innerHTML = `©2024 A11yEnhance`;

      this.container.appendChild(header);
      this.container.appendChild(content);
      this.container.appendChild(footer);

      document.body.appendChild(this.container);

      // Apply initial preferences
      this.applyPreferences();
    }

    createOption(label, id, callback) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("compliance-option");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.checked = this[id];

      checkbox.addEventListener("change", (e) => {
        callback(e.target.checked);
        this.savePreferences();
      });

      const labelEl = document.createElement("label");
      labelEl.setAttribute("for", id);
      labelEl.textContent = label;

      wrapper.appendChild(checkbox);
      wrapper.appendChild(labelEl);
      return wrapper;
    }

    toggleVisibility() {
      this.isOpen = !this.isOpen;
      this.container.classList.toggle("minimized", !this.isOpen);
    }

    toggleHighContrast(enabled) {
      this.highContrast = enabled;
      this.updateClass("high-contrast", enabled);
    }

    toggleLargeText(enabled) {
      this.largeText = enabled;
      this.updateClass("large-text", enabled);
    }

    toggleColorBlind(enabled) {
      this.colorBlind = enabled;
      this.updateClass("color-blind", enabled);
    }

    toggleReadableFonts(enabled) {
      this.readableFonts = enabled;
      this.updateClass("readable-fonts", enabled);
    }

    toggleReduceMotion(enabled) {
      this.reduceMotion = enabled;
      this.updateClass("reduce-motion", enabled);
    }

    updateClass(className, add) {
      if (add) {
        this.contentElement.classList.add(className);
      } else {
        this.contentElement.classList.remove(className);
      }
    }

    applyPreferences() {
      this.updateClass("high-contrast", this.highContrast);
      this.updateClass("large-text", this.largeText);
      this.updateClass("color-blind", this.colorBlind);
      this.updateClass("readable-fonts", this.readableFonts);
      this.updateClass("reduce-motion", this.reduceMotion);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const widget = new ComplianceWidget();
    widget.init();
  });
})();
