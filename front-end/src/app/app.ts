
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Accessibility } from './components/accessibility/accessibility';

@Component({
  imports: [RouterOutlet, Accessibility],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('trampoja');
}
