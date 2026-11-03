
import { Component, inject, signal, OnInit } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  readingMode: boolean;
}

@Component({
  selector: 'app-accessibility',
  standalone: true,
  templateUrl: './accessibility.html',
  styleUrl: './accessibility.css',
  host: {
    '(document:keydown.escape)': 'closePanel()'
  }
})
export class Accessibility implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly isOpen = signal(false);
  protected readonly fontSize = signal(100);
  protected readonly highContrast = signal(false);
  protected readonly readingMode = signal(false);

  private readonly storageKey = 'trampoja-accessibility';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const saved = localStorage.getItem(this.storageKey);

      if (saved) {
        const settings: AccessibilitySettings = JSON.parse(saved);

        this.fontSize.set(
          Math.min(150, Math.max(80, settings.fontSize ?? 100))
        );
        this.highContrast.set(settings.highContrast ?? false);
        this.readingMode.set(settings.readingMode ?? false);
      }
    } catch {
      // Se as configurações salvas forem inválidas, usamos os padrões.
    }

    this.applySettings();
  }

  protected togglePanel(): void {
    this.isOpen.update(value => !value);
  }

  protected closePanel(): void {
    this.isOpen.set(false);
  }

  protected increaseFont(): void {
    this.fontSize.update(value => Math.min(150, value + 10));
    this.saveSettings();
  }

  protected decreaseFont(): void {
    this.fontSize.update(value => Math.max(80, value - 10));
    this.saveSettings();
  }

  protected toggleContrast(): void {
    this.highContrast.update(value => !value);
    this.saveSettings();
  }

  protected toggleReadingMode(): void {
    this.readingMode.update(value => !value);
    this.saveSettings();
  }

  protected restoreDefaults(): void {
    this.fontSize.set(100);
    this.highContrast.set(false);
    this.readingMode.set(false);
    this.saveSettings();
  }

  private saveSettings(): void {
    this.applySettings();

    if (!isPlatformBrowser(this.platformId)) return;

    const settings: AccessibilitySettings = {
      fontSize: this.fontSize(),
      highContrast: this.highContrast(),
      readingMode: this.readingMode()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(settings));
  }

  private applySettings(): void {
    const html = this.document.documentElement;

    html.style.setProperty(
      '--a11y-font-scale',
      `${this.fontSize() / 100}`
    );

    html.classList.toggle('a11y-high-contrast', this.highContrast());
    html.classList.toggle('a11y-reading-mode', this.readingMode());
  }
}
