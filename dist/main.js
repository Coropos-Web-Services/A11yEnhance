(function(){
  // Insert Boxicons
  const boxiconsLink = document.createElement('link');
  boxiconsLink.rel = 'stylesheet';
  boxiconsLink.href = 'https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css';
  document.head.appendChild(boxiconsLink);

  // Insert CSS
  const style = document.createElement('style');
  style.textContent = `
    html.reduce-motion * {
      animation: none !important;
      transition: none !important;
    }

    html.focus-highlight *:focus {
      outline: 3px solid #3B82F6 !important;
      outline-offset: 2px;
    }

    #reading-guide {
      position: fixed;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255, 255, 0, 0.6);
      z-index: 9999;
      pointer-events: none;
      display: none;
    }

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
      z-index: 9999999;
      color: #FFF;
      overflow: hidden;
      transition: all 0.3s ease;
      pointer-events: auto;
    }
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
    .compliance-header:focus {
      outline: 2px solid #3B82F6;
      outline-offset: 2px;
    }
    .compliance-content {
      padding: 10px;
    }
    .compliance-option {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      transition: background 0.2s ease;
    }
    .compliance-option:hover {
      background: #374151;
      border-radius: 4px;
    }
    .compliance-option label {
      margin-left: 8px;
      font-size: 14px;
      cursor: pointer;
      flex: 1;
    }
    .compliance-info {
      font-size: 12px;
      color: #9CA3AF;
      margin-top: 10px;
      line-height: 1.4;
    }
    .compliance-footer {
      border-top: 1px solid #374151;
      padding: 8px;
      font-size: 12px;
      color: #9CA3AF;
      text-align: center;
    }
    .compliance-button, .compliance-select, .compliance-range {
      width: 100%;
      box-sizing: border-box;
      margin-top: 10px;
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid #374151;
      background: #1F2937;
      color: #FFF;
      padding: 6px 8px;
    }
    .compliance-button {
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      margin-bottom: 10px;
    }
    .compliance-button:hover:not(:disabled) {
      background: #3B82F6;
      transform: scale(1.02);
    }
    .compliance-button:disabled {
      background: #374151;
      cursor: not-allowed;
      transform: none;
    }
    .compliance-select {
      cursor: pointer;
      margin-bottom: 10px;
    }
    .compliance-range {
      margin-bottom: 10px;
    }
    .compliance-widget-minimized .compliance-content,
    .compliance-widget-minimized .compliance-footer {
      display: none;
    }
  `;
  document.head.appendChild(style);

  // Create reading guide element
  const readingGuide = document.createElement('div');
  readingGuide.id = 'reading-guide';
  document.body.appendChild(readingGuide);

  document.addEventListener('DOMContentLoaded', () => {
    class ComplianceWidget {
      constructor() {
        this.isOpen = false; // Start closed (minimized)
        
        this.highContrastEnabled = false;
        this.largeTextEnabled = false;
        this.colorBlindEnabled = false;
        this.readableFontsEnabled = false;
        this.focusHighlightEnabled = false;
        this.reduceMotionEnabled = false;
        this.readingGuideEnabled = false;
        this.selectedLanguage = 'en';
        this.ttsRate = 1.0;
        this.selectedTheme = 'default';

        this.contentElement = document.getElementById('page-content') || document.body;
        this.loadPreferences();
      }

      loadPreferences() {
        const prefs = JSON.parse(localStorage.getItem('accessibilityPrefs') || '{}');
        this.highContrastEnabled = !!prefs.highContrastEnabled;
        this.largeTextEnabled = !!prefs.largeTextEnabled;
        this.colorBlindEnabled = !!prefs.colorBlindEnabled;
        this.readableFontsEnabled = !!prefs.readableFontsEnabled;
        this.focusHighlightEnabled = !!prefs.focusHighlightEnabled;
        this.reduceMotionEnabled = !!prefs.reduceMotionEnabled;
        this.readingGuideEnabled = !!prefs.readingGuideEnabled;
        this.selectedLanguage = prefs.selectedLanguage || 'en';
        this.ttsRate = prefs.ttsRate || 1.0;
        this.selectedTheme = prefs.selectedTheme || 'default';
      }

      savePreferences() {
        const prefs = {
          highContrastEnabled: this.highContrastEnabled,
          largeTextEnabled: this.largeTextEnabled,
          colorBlindEnabled: this.colorBlindEnabled,
          readableFontsEnabled: this.readableFontsEnabled,
          focusHighlightEnabled: this.focusHighlightEnabled,
          reduceMotionEnabled: this.reduceMotionEnabled,
          readingGuideEnabled: this.readingGuideEnabled,
          selectedLanguage: this.selectedLanguage,
          ttsRate: this.ttsRate,
          selectedTheme: this.selectedTheme
        };
        localStorage.setItem('accessibilityPrefs', JSON.stringify(prefs));
      }

      init() {
        this.container = document.createElement('div');
        this.container.classList.add('compliance-widget-container');
        if (!this.isOpen) {
          this.container.classList.add('compliance-widget-minimized');
        }
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-label', 'Accessibility Toolkit');
        this.updateAriaExpanded();

        const header = document.createElement('div');
        header.classList.add('compliance-header');
        header.innerHTML = `<i class='bx bx-wheelchair logo-icon'></i> Accessibility Toolkit`;
        header.tabIndex = 0;
        header.setAttribute('role', 'button');
        header.setAttribute('aria-pressed', 'false');
        header.addEventListener('click', () => this.toggleVisibility());
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggleVisibility();
          }
        });

        const content = document.createElement('div');
        content.classList.add('compliance-content');

        // Language Selector
        const langSelect = this.createSelect(
          'Language',
          'language-select',
          {
            en: 'English',
            es: 'Spanish',
            fr: 'French'
          },
          this.selectedLanguage,
          (val) => { 
            this.selectedLanguage = val; 
            document.documentElement.lang = val; 
            this.savePreferences();
          }
        );
        content.appendChild(langSelect);

        // Theme Selector
        const themeSelect = this.createSelect(
          'Theme',
          'theme-select',
          {
            default: 'Default',
            sepia: 'Sepia',
            'yellow-black': 'Yellow on Black'
          },
          this.selectedTheme,
          (val) => {
            this.selectedTheme = val;
            this.applyStyles();
            this.savePreferences();
          }
        );
        content.appendChild(themeSelect);

        // High Contrast
        content.appendChild(this.createOption(
          'High Contrast',
          'high-contrast-checkbox',
          (checked) => { this.toggleHighContrast(checked); }
        ));

        // Large Text
        content.appendChild(this.createOption(
          'Large Text',
          'large-text-checkbox',
          (checked) => { this.toggleLargeText(checked); }
        ));

        // Color Blind Friendly
        content.appendChild(this.createOption(
          'Color Blind Friendly',
          'color-blind-checkbox',
          (checked) => { this.toggleColorBlind(checked); }
        ));

        // Readable Fonts
        content.appendChild(this.createOption(
          'Readable Fonts',
          'readable-fonts-checkbox',
          (checked) => { this.toggleReadableFonts(checked); }
        ));

        // Focus Highlight
        content.appendChild(this.createOption(
          'Focus Highlight',
          'focus-highlight-checkbox',
          (checked) => { this.toggleFocusHighlight(checked); }
        ));

        // Reduce Motion
        content.appendChild(this.createOption(
          'Reduce Motion',
          'reduce-motion-checkbox',
          (checked) => { this.toggleReduceMotion(checked); }
        ));

        // Reading Guide
        content.appendChild(this.createOption(
          'Reading Guide',
          'reading-guide-checkbox',
          (checked) => { this.toggleReadingGuide(checked); }
        ));

        // TTS Rate
        const ttsRateLabel = document.createElement('label');
        ttsRateLabel.innerText = 'TTS Speed:';
        ttsRateLabel.style.display = 'block';
        ttsRateLabel.style.marginTop = '10px';
        ttsRateLabel.style.fontSize = '14px';
        content.appendChild(ttsRateLabel);

        const ttsRateInput = document.createElement('input');
        ttsRateInput.type = 'range';
        ttsRateInput.min = '0.5';
        ttsRateInput.max = '2.0';
        ttsRateInput.step = '0.1';
        ttsRateInput.value = this.ttsRate;
        ttsRateInput.classList.add('compliance-range');
        ttsRateInput.setAttribute('aria-label', 'TTS Speed');
        ttsRateInput.addEventListener('input', () => {
          this.ttsRate = parseFloat(ttsRateInput.value);
          this.savePreferences();
        });
        content.appendChild(ttsRateInput);

        // Text-to-Speech button
        const ttsButton = document.createElement('button');
        ttsButton.classList.add('compliance-button');
        ttsButton.innerText = 'Read the entire page';
        ttsButton.setAttribute('aria-label', 'Read the entire page text aloud');
        ttsButton.addEventListener('click', () => this.textToSpeech());
        if (!('speechSynthesis' in window)) {
          ttsButton.innerText = 'TTS not supported';
          ttsButton.disabled = true;
        }
        content.appendChild(ttsButton);

        const info = document.createElement('div');
        info.classList.add('compliance-info');
        info.innerHTML = `Toggle features to improve accessibility.<br>Adjust language, theme, or TTS speed.<br>"Read the entire page" will read all text aloud.`;
        content.appendChild(info);

        const footer = document.createElement('div');
        footer.classList.add('compliance-footer');
        footer.innerHTML = `©2024 Coropos Web Services. By Edward Quigley`;

        this.container.appendChild(header);
        this.container.appendChild(content);
        this.container.appendChild(footer);
        document.body.appendChild(this.container);

        // Apply initial preferences
        this.applyAllPreferences();
        document.documentElement.lang = this.selectedLanguage;
      }

      applyAllPreferences() {
        this.applyStyles();
        this.updateFocusHighlight();
        this.updateReduceMotion();
        this.updateReadingGuide();
        this.savePreferences();
      }

      createOption(labelText, id, callback) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('compliance-option');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.tabIndex = 0;

        switch(id) {
          case 'high-contrast-checkbox': checkbox.checked = this.highContrastEnabled; break;
          case 'large-text-checkbox': checkbox.checked = this.largeTextEnabled; break;
          case 'color-blind-checkbox': checkbox.checked = this.colorBlindEnabled; break;
          case 'readable-fonts-checkbox': checkbox.checked = this.readableFontsEnabled; break;
          case 'focus-highlight-checkbox': checkbox.checked = this.focusHighlightEnabled; break;
          case 'reduce-motion-checkbox': checkbox.checked = this.reduceMotionEnabled; break;
          case 'reading-guide-checkbox': checkbox.checked = this.readingGuideEnabled; break;
        }

        checkbox.addEventListener('change', (e) => callback(e.target.checked));

        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.innerText = labelText;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        return wrapper;
      }

      createSelect(labelText, id, options, selectedValue, callback) {
        const label = document.createElement('label');
        label.innerText = labelText + ':';
        label.style.display = 'block';
        label.style.marginTop = '10px';
        label.style.fontSize = '14px';

        const select = document.createElement('select');
        select.classList.add('compliance-select');
        select.id = id;
        for (const [value, text] of Object.entries(options)) {
          const opt = document.createElement('option');
          opt.value = value;
          opt.innerText = text;
          if (value === selectedValue) opt.selected = true;
          select.appendChild(opt);
        }
        select.addEventListener('change', () => {
          callback(select.value);
        });

        const container = document.createElement('div');
        container.appendChild(label);
        container.appendChild(select);
        return container;
      }

      toggleVisibility() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
          this.container.classList.remove('compliance-widget-minimized');
          this.container.setAttribute('aria-expanded', 'true');
          const firstFocusable = this.container.querySelector('input,button,select');
          if (firstFocusable) firstFocusable.focus();
        } else {
          this.container.classList.add('compliance-widget-minimized');
          this.container.setAttribute('aria-expanded', 'false');
          const header = this.container.querySelector('.compliance-header');
          header.focus();
        }
      }

      updateAriaExpanded() {
        this.container.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
      }

      toggleHighContrast(checked) {
        this.highContrastEnabled = checked;
        this.applyStyles();
        this.savePreferences();
      }

      toggleLargeText(checked) {
        this.largeTextEnabled = checked;
        this.applyStyles();
        this.savePreferences();
      }

      toggleColorBlind(checked) {
        this.colorBlindEnabled = checked;
        this.applyStyles();
        this.savePreferences();
      }

      toggleReadableFonts(checked) {
        this.readableFontsEnabled = checked;
        this.applyStyles();
        this.savePreferences();
      }

      toggleFocusHighlight(checked) {
        this.focusHighlightEnabled = checked;
        this.updateFocusHighlight();
        this.savePreferences();
      }

      toggleReduceMotion(checked) {
        this.reduceMotionEnabled = checked;
        this.updateReduceMotion();
        this.savePreferences();
      }

      toggleReadingGuide(checked) {
        this.readingGuideEnabled = checked;
        this.updateReadingGuide();
        this.savePreferences();
      }

      updateFocusHighlight() {
        if (this.focusHighlightEnabled) {
          document.documentElement.classList.add('focus-highlight');
        } else {
          document.documentElement.classList.remove('focus-highlight');
        }
      }

      updateReduceMotion() {
        if (this.reduceMotionEnabled) {
          document.documentElement.classList.add('reduce-motion');
        } else {
          document.documentElement.classList.remove('reduce-motion');
        }
      }

      updateReadingGuide() {
        const guide = document.getElementById('reading-guide');
        if (this.readingGuideEnabled) {
          guide.style.display = 'block';
        } else {
          guide.style.display = 'none';
        }
      }

      applyStyles() {
        const currentScroll = window.pageYOffset;

        this.contentElement.style.backgroundColor = '';
        this.contentElement.style.color = '';
        this.contentElement.style.fontSize = '';
        this.contentElement.style.fontFamily = '';
        this.contentElement.style.filter = '';

        this.applyTheme();

        if (this.highContrastEnabled) {
          this.contentElement.style.backgroundColor = '#000000';
          this.contentElement.style.color = '#FFFFFF';
          this.contentElement.style.filter = 'contrast(1.5)';
        }

        if (this.largeTextEnabled) {
          this.contentElement.style.fontSize = '1.2em';
        }

        if (this.readableFontsEnabled) {
          this.contentElement.style.fontFamily = '"OpenDyslexic", Verdana, Arial, sans-serif';
        }

        if (this.colorBlindEnabled) {
          let filters = 'grayscale(1)';
          if (this.highContrastEnabled) {
            filters = 'contrast(1.5) grayscale(1)';
          } else if (this.contentElement.style.filter) {
            filters = this.contentElement.style.filter + ' grayscale(1)';
          }
          this.contentElement.style.filter = filters;
        }

        window.scrollTo(0, currentScroll);
      }

      applyTheme() {
        if (this.selectedTheme === 'default') {
          return; 
        }

        if (this.selectedTheme === 'sepia') {
          this.contentElement.style.backgroundColor = '#f4ecd8';
          this.contentElement.style.color = '#5b4636';
        } else if (this.selectedTheme === 'yellow-black') {
          this.contentElement.style.backgroundColor = '#000000';
          this.contentElement.style.color = '#ffff00';
        }
      }

      textToSpeech() {
        if (!('speechSynthesis' in window)) return;
        const pageText = document.body.innerText;
        if (!pageText) return;

        const utter = new SpeechSynthesisUtterance(pageText);
        utter.rate = this.ttsRate;
        utter.pitch = 1;
        utter.lang = this.selectedLanguage === 'en' ? 'en-US' :
                     this.selectedLanguage === 'es' ? 'es-ES' : 'fr-FR';
        window.speechSynthesis.speak(utter);
      }
    }

    const widget = new ComplianceWidget();
    widget.init();
  });
})();
