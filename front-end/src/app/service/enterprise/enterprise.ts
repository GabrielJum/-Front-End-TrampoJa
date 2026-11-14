import { Service, inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Enterprise }  from '../../model/enterprise';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class EnterpriseService {
  private readonly apiUrl = `${environment.apiUrl}empresa`;

  private http = inject(HttpClient);

  constructor() { }

  cadastrar(empresa: Enterprise): Observable<Enterprise> {
    return this.http.post<Enterprise>(
      `${this.apiUrl}/register`,
      empresa
    );
  }

  login(email: string, senha: string): Observable<Enterprise> {
    return this.http.post<Enterprise>(
      `${this.apiUrl}/login`,
      { email, senha }
    );
  }
}
