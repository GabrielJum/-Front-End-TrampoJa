import { Injectable, signal } from '@angular/core';

export type TooltipType = 'success' | 'error';

export interface TooltipMessage {
  text: string;
  type: TooltipType;
}

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  private readonly duration = 3500;
  private timer?: ReturnType<typeof setTimeout>;

  readonly message = signal<TooltipMessage | null>(null);

  show(text: string, type: TooltipType = 'success'): void {
    clearTimeout(this.timer);
    this.message.set({ text, type });
    this.timer = setTimeout(() => this.hide(), this.duration);
  }

  success(text: string): void {
    this.show(text, 'success');
  }

  error(text: string): void {
    this.show(text, 'error');
  }

  hide(): void {
    clearTimeout(this.timer);
    this.message.set(null);
  }
}
