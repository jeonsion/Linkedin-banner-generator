/**
 * LinkedIn Banner Generator
 * Real-time preview, safe zone indicator, and high-resolution download
 */

class LinkedInBannerGenerator {
  constructor() {
    this.canvas = document.getElementById('bannerCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Canvas dimensions (LinkedIn recommended size)
    this.width = 1584;
    this.height = 396;

    // Default settings
    this.settings = {
      bgType: 'solid',
      bgColor: '#0077B5',
      gradientColor1: '#667eea',
      gradientColor2: '#764ba2',
      gradientDirection: 'to right',
      mainText: 'Your Name Here',
      subText: 'Professional Title | Company',
      subText2: '',
      textColor: '#ffffff',
      textAlign: 'center',
      mainTextSize: 48,
      subTextSize: 24,
      patternType: 'none',
      patternOpacity: 20,
      borderType: 'none'
    };

    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.render();
  }

  cacheElements() {
    // Background controls
    this.bgTypeToggle = document.getElementById('bgTypeToggle');
    this.bgColorInput = document.getElementById('bgColor');
    this.bgColorValue = document.getElementById('bgColorValue');
    this.solidColorRow = document.getElementById('solidColorRow');
    this.gradientRow = document.getElementById('gradientRow');
    this.gradientDirectionRow = document.getElementById('gradientDirectionRow');
    this.gradientColor1Input = document.getElementById('gradientColor1');
    this.gradientColor1Value = document.getElementById('gradientColor1Value');
    this.gradientColor2Input = document.getElementById('gradientColor2');
    this.gradientColor2Value = document.getElementById('gradientColor2Value');
    this.gradientDirectionSelect = document.getElementById('gradientDirection');

    // Text controls
    this.mainTextInput = document.getElementById('mainText');
    this.subTextInput = document.getElementById('subText');
    this.subText2Input = document.getElementById('subText2');
    this.textColorInput = document.getElementById('textColor');
    this.textColorValue = document.getElementById('textColorValue');
    this.textAlignSelect = document.getElementById('textAlign');
    this.mainTextSizeInput = document.getElementById('mainTextSize');
    this.mainTextSizeValue = document.getElementById('mainTextSizeValue');
    this.subTextSizeInput = document.getElementById('subTextSize');
    this.subTextSizeValue = document.getElementById('subTextSizeValue');

    // Decoration controls
    this.patternTypeSelect = document.getElementById('patternType');
    this.patternOpacityInput = document.getElementById('patternOpacity');
    this.patternOpacityValue = document.getElementById('patternOpacityValue');
    this.patternOpacityRow = document.getElementById('patternOpacityRow');
    this.borderToggle = document.getElementById('borderToggle');

    // Other controls
    this.toggleSafeZoneBtn = document.getElementById('toggleSafeZone');
    this.safeZoneOverlay = document.getElementById('safeZoneOverlay');
    this.downloadBtn = document.getElementById('downloadBtn');
    this.presetColors = document.querySelectorAll('.preset-color');
  }

  bindEvents() {
    // Background type toggle
    this.bgTypeToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.toggle-btn');
      if (!btn) return;

      this.bgTypeToggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const type = btn.dataset.type;
      this.settings.bgType = type;

      this.solidColorRow.classList.toggle('hidden', type !== 'solid');
      this.gradientRow.classList.toggle('hidden', type !== 'gradient');
      this.gradientDirectionRow.classList.toggle('hidden', type !== 'gradient');

      this.render();
    });

    // Background color
    this.bgColorInput.addEventListener('input', (e) => {
      this.settings.bgColor = e.target.value;
      this.bgColorValue.textContent = e.target.value;
      this.render();
    });

    // Gradient colors
    this.gradientColor1Input.addEventListener('input', (e) => {
      this.settings.gradientColor1 = e.target.value;
      this.gradientColor1Value.textContent = e.target.value;
      this.render();
    });

    this.gradientColor2Input.addEventListener('input', (e) => {
      this.settings.gradientColor2 = e.target.value;
      this.gradientColor2Value.textContent = e.target.value;
      this.render();
    });

    this.gradientDirectionSelect.addEventListener('change', (e) => {
      this.settings.gradientDirection = e.target.value;
      this.render();
    });

    // Text inputs
    this.mainTextInput.addEventListener('input', (e) => {
      this.settings.mainText = e.target.value;
      this.render();
    });

    this.subTextInput.addEventListener('input', (e) => {
      this.settings.subText = e.target.value;
      this.render();
    });

    this.subText2Input.addEventListener('input', (e) => {
      this.settings.subText2 = e.target.value;
      this.render();
    });

    this.textColorInput.addEventListener('input', (e) => {
      this.settings.textColor = e.target.value;
      this.textColorValue.textContent = e.target.value;
      this.render();
    });

    this.textAlignSelect.addEventListener('change', (e) => {
      this.settings.textAlign = e.target.value;
      this.render();
    });

    // Text size sliders
    this.mainTextSizeInput.addEventListener('input', (e) => {
      this.settings.mainTextSize = parseInt(e.target.value);
      this.mainTextSizeValue.textContent = `${e.target.value}px`;
      this.render();
    });

    this.subTextSizeInput.addEventListener('input', (e) => {
      this.settings.subTextSize = parseInt(e.target.value);
      this.subTextSizeValue.textContent = `${e.target.value}px`;
      this.render();
    });

    // Pattern controls
    this.patternTypeSelect.addEventListener('change', (e) => {
      this.settings.patternType = e.target.value;
      this.patternOpacityRow.classList.toggle('hidden', e.target.value === 'none');
      this.render();
    });

    this.patternOpacityInput.addEventListener('input', (e) => {
      this.settings.patternOpacity = parseInt(e.target.value);
      this.patternOpacityValue.textContent = `${e.target.value}%`;
      this.render();
    });

    // Border toggle
    this.borderToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.toggle-btn');
      if (!btn) return;

      this.borderToggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      this.settings.borderType = btn.dataset.border;
      this.render();
    });

    // Preset colors
    this.presetColors.forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        this.settings.bgColor = color;
        this.bgColorInput.value = color;
        this.bgColorValue.textContent = color;

        // Switch to solid if not already
        if (this.settings.bgType !== 'solid') {
          this.settings.bgType = 'solid';
          this.bgTypeToggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
          this.bgTypeToggle.querySelector('[data-type="solid"]').classList.add('active');
          this.solidColorRow.classList.remove('hidden');
          this.gradientRow.classList.add('hidden');
          this.gradientDirectionRow.classList.add('hidden');
        }

        this.render();
      });
    });

    // Safe zone toggle
    this.toggleSafeZoneBtn.addEventListener('click', () => {
      this.toggleSafeZoneBtn.classList.toggle('active');
      this.safeZoneOverlay.classList.toggle('hidden');
    });

    // Download button
    this.downloadBtn.addEventListener('click', () => this.download());
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw background
    this.drawBackground();

    // Draw pattern
    if (this.settings.patternType !== 'none') {
      this.drawPattern();
    }

    // Draw border
    if (this.settings.borderType !== 'none') {
      this.drawBorder();
    }

    // Draw text
    this.drawText();
  }

  drawBackground() {
    if (this.settings.bgType === 'solid') {
      this.ctx.fillStyle = this.settings.bgColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else {
      const gradient = this.createGradient();
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  createGradient() {
    let x0, y0, x1, y1;

    switch (this.settings.gradientDirection) {
      case 'to right':
        x0 = 0; y0 = 0; x1 = this.width; y1 = 0;
        break;
      case 'to left':
        x0 = this.width; y0 = 0; x1 = 0; y1 = 0;
        break;
      case 'to bottom':
        x0 = 0; y0 = 0; x1 = 0; y1 = this.height;
        break;
      case 'to top':
        x0 = 0; y0 = this.height; x1 = 0; y1 = 0;
        break;
      case 'to bottom right':
        x0 = 0; y0 = 0; x1 = this.width; y1 = this.height;
        break;
      case 'to top right':
        x0 = 0; y0 = this.height; x1 = this.width; y1 = 0;
        break;
      default:
        x0 = 0; y0 = 0; x1 = this.width; y1 = 0;
    }

    const gradient = this.ctx.createLinearGradient(x0, y0, x1, y1);
    gradient.addColorStop(0, this.settings.gradientColor1);
    gradient.addColorStop(1, this.settings.gradientColor2);

    return gradient;
  }

  drawPattern() {
    const opacity = this.settings.patternOpacity / 100;
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.fillStyle = '#ffffff';

    switch (this.settings.patternType) {
      case 'dots':
        this.drawDotPattern();
        break;
      case 'lines':
        this.drawLinePattern();
        break;
      case 'grid':
        this.drawGridPattern();
        break;
      case 'circles':
        this.drawCirclePattern();
        break;
    }

    this.ctx.restore();
  }

  drawDotPattern() {
    const spacing = 30;
    const radius = 3;

    for (let x = spacing; x < this.width; x += spacing) {
      for (let y = spacing; y < this.height; y += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  drawLinePattern() {
    const spacing = 40;
    this.ctx.lineWidth = 1;

    for (let x = 0; x < this.width + this.height; x += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x - this.height, this.height);
      this.ctx.stroke();
    }
  }

  drawGridPattern() {
    const spacing = 50;
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < this.width; x += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < this.height; y += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  drawCirclePattern() {
    const centerX = this.width - 200;
    const centerY = this.height / 2;

    for (let i = 1; i <= 5; i++) {
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, i * 80, 0, Math.PI * 2);
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }

  drawBorder() {
    const padding = 20;

    if (this.settings.borderType === 'simple') {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(padding, padding, this.width - padding * 2, this.height - padding * 2);
    } else if (this.settings.borderType === 'accent') {
      // Left accent bar
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(padding, padding, 6, this.height - padding * 2);

      // Right accent bar
      this.ctx.fillRect(this.width - padding - 6, padding, 6, this.height - padding * 2);
    }
  }

  drawText() {
    const { mainText, subText, subText2, textColor, textAlign, mainTextSize, subTextSize } = this.settings;

    // Calculate text position
    let textX;
    switch (textAlign) {
      case 'left':
        textX = 100;
        this.ctx.textAlign = 'left';
        break;
      case 'right':
        textX = this.width - 100;
        this.ctx.textAlign = 'right';
        break;
      default:
        textX = this.width / 2;
        this.ctx.textAlign = 'center';
    }

    // Calculate vertical positions based on number of text lines
    const hasSubText = subText && subText.trim();
    const hasSubText2 = subText2 && subText2.trim();
    const totalLines = 1 + (hasSubText ? 1 : 0) + (hasSubText2 ? 1 : 0);

    let mainY;
    if (totalLines === 1) {
      mainY = this.height / 2;
    } else if (totalLines === 2) {
      mainY = this.height / 2 - 20;
    } else {
      mainY = this.height / 2 - 40;
    }

    // Text shadow for better visibility
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.ctx.shadowBlur = 8;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;

    // Main text
    this.ctx.fillStyle = textColor;
    this.ctx.font = `700 ${mainTextSize}px 'Inter', 'Noto Sans KR', sans-serif`;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(mainText, textX, mainY);

    // Sub text 1
    let subTextY = mainY + mainTextSize / 2 + 15;
    if (hasSubText) {
      this.ctx.font = `500 ${subTextSize}px 'Inter', 'Noto Sans KR', sans-serif`;
      this.ctx.fillStyle = this.adjustColorOpacity(textColor, 0.85);
      this.ctx.fillText(subText, textX, subTextY);
    }

    // Sub text 2
    if (hasSubText2) {
      const subText2Y = hasSubText ? subTextY + subTextSize + 8 : subTextY;
      this.ctx.font = `500 ${subTextSize}px 'Inter', 'Noto Sans KR', sans-serif`;
      this.ctx.fillStyle = this.adjustColorOpacity(textColor, 0.7);
      this.ctx.fillText(subText2, textX, subText2Y);
    }

    // Reset shadow
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }

  adjustColorOpacity(hexColor, opacity) {
    // Convert hex to rgba
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  download() {
    // Create a temporary link element
    const link = document.createElement('a');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `linkedin-banner-${timestamp}.png`;

    // Convert canvas to data URL
    link.href = this.canvas.toDataURL('image/png', 1.0);

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Visual feedback
    const originalContent = this.downloadBtn.innerHTML;
    this.downloadBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      Download Complete!
    `;
    this.downloadBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

    setTimeout(() => {
      this.downloadBtn.innerHTML = originalContent;
      this.downloadBtn.style.background = '';
    }, 2000);
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new LinkedInBannerGenerator();
});
