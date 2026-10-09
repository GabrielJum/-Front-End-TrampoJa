import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Header implements OnInit {

  protected readonly year = new Date().getFullYear();
  protected readonly menuOpen = signal(false);

  protected currentUrl: string = '';

  constructor(private router: Router) {}

  protected readonly navLinks: NavLink[] = [
    { label: 'Início', path: '/' },
    { label: 'Vagas', path: '/vagas' },
    { label: 'Para empresas', path: '/empresas' },
    { label: 'Contato', path: '/contato' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    console.log(this.currentUrl); 
  }
}
