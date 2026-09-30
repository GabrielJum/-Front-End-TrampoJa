import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { NavigationTabs } from '../../components/navigation-tabs/navigation-tabs';


interface Message {
  id: number;
  fromMe: boolean;
  text: string;
  time: string; // HH:mm
}

interface Conversation {
  id: number;
  company: string;
  role: string;
  online: boolean;
  unread: number;
  messages: Message[];
}

const PAGE_SIZE = 5;

function now(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

@Component({
  selector: 'app-chat',
  imports: [FormsModule, Header, NavigationTabs, RouterLink],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chat {

  footerNav = [
    { label: 'Início', path: '/home' },
    { label: 'Vagas', path: '/vacancy' }
  ];

  footerHelp = [
    { label: 'Contato', path: '/contato' }
  ];

  protected readonly year = new Date().getFullYear();

  private readonly conversations = signal<Conversation[]>([
    {
      id: 1,
      company: 'Mana Poke',
      role: 'Garçom',
      online: true,
      unread: 0,
      messages: [
        { id: 1, fromMe: false, text: 'Gostaríamos que você estivesse aqui no dia 01/01 às 17:30.', time: '14:02' },
        { id: 2, fromMe: true, text: 'Perfeito, chegarei antes das 17:00.', time: '14:05' },
        { id: 3, fromMe: false, text: 'Ótimo, vamos estar esperando!', time: '14:06' },
      ],
    },
    {
      id: 2,
      company: 'Souza Empresa',
      role: 'Ajudante geral',
      online: false,
      unread: 2,
      messages: [
        { id: 1, fromMe: false, text: 'Bom dia, gostaria de confirmar sua disponibilidade para sábado.', time: '09:12' },
        { id: 2, fromMe: false, text: 'O turno seria das 8h às 14h.', time: '09:13' },
      ],
    },
    {
      id: 3,
      company: 'Eventos e CIA',
      role: 'Recepcionista',
      online: true,
      unread: 1,
      messages: [
        { id: 1, fromMe: true, text: 'Qual é o endereço do evento?', time: 'Ontem' },
        { id: 2, fromMe: false, text: 'Fica perto da antiga rua do mercado, no salão azul.', time: 'Ontem' },
      ],
    },
  ]);

  protected readonly search = signal('');
  protected readonly draft = signal('');
  protected readonly activeId = signal<number | null>(1);
  protected readonly visibleCount = signal(PAGE_SIZE);

  private readonly thread = viewChild<ElementRef<HTMLElement>>('thread');

  protected readonly filteredConversations = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.conversations()
      .filter((c) => !term || c.company.toLowerCase().includes(term))
      .slice(0, this.visibleCount())
      .map((c) => {
        const last = c.messages.at(-1);
        return {
          ...c,
          initials: initials(c.company),
          preview: last ? (last.fromMe ? 'Você: ' : '') + last.text : '',
          lastTime: last?.time ?? '',
        };
      });
  });

  protected readonly hasMore = computed(() => this.visibleCount() < this.conversations().length);

  protected readonly active = computed(() => {
    const conv = this.conversations().find((c) => c.id === this.activeId());
    return conv ? { ...conv, initials: initials(conv.company) } : null;
  });

  constructor() {
    afterRenderEffect(() => {
      this.active();
      const el = this.thread()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  protected open(id: number): void {
    this.activeId.set(id);
    this.conversations.update((list) => list.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  protected back(): void {
    this.activeId.set(null);
  }

  protected send(): void {
    const text = this.draft().trim();
    const id = this.activeId();
    if (!text || id === null) return;

    this.conversations.update((list) =>
      list.map((c) =>
        c.id === id
          ? { ...c, messages: [...c.messages, { id: c.messages.length + 1, fromMe: true, text, time: now() }] }
          : c,
      ),
    );
    this.draft.set('');
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  protected loadMore(): void {
    this.visibleCount.update((n) => n + PAGE_SIZE);
  }
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}
