import { computed, Injectable, signal } from '@angular/core';
import { Enterprise } from '../../model/enterprise';
import { Freelancer } from '../../model/freelancer';
import { User, UserRole } from '../../types/user';

const CURRENT_USER_KEY = 'usuarioAtual';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _user = signal<User | null>(readStoredUser());

  readonly user = this._user.asReadonly();
  readonly role = computed<UserRole | null>(() => this._user()?.role ?? null);
  readonly isLoggedIn = computed(() => this._user() !== null);

  readonly enterprise = computed<Enterprise | null>(() => {
    const user = this._user();
    return user?.role === 'Empresa' ? user.data : null;
  });

  readonly freelancer = computed<Freelancer | null>(() => {
    const user = this._user();
    return user?.role === 'Freelancer' ? user.data : null;
  });

  loginEnterprise(empresa: Enterprise): void {
    this.setUser({ role: 'Empresa', data: empresa });
  }

  loginFreelancer(freelancer: Freelancer): void {
    this.setUser({ role: 'Freelancer', data: freelancer });
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    this._user.set(null);
  }

  private setUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }
}

function readStoredUser(): User | null {
  try {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) ?? 'null');
    const validRole = user?.role === 'Empresa' || user?.role === 'Freelancer';
    return validRole && user.data ? user : null;
  } catch {
    return null;
  }
}
