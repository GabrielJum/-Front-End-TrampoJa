import { Service, inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Freelancer } from '../../model/freelancer';


@Injectable({
  providedIn: 'root'
})

export class FreelancerService {
  private readonly apiUrl = `http://localhost:8080/freelancer`;

  private http = inject(HttpClient);

  constructor() { }

  cadastrar(freelancer: Freelancer): Observable<Freelancer> {
    return this.http.post<Freelancer>(
      `${this.apiUrl}/register`,
      freelancer
    );
  }

  login(email: string, senha: string): Observable<Freelancer> {
    return this.http.post<Freelancer>(
      `http://localhost:8080/freelancer/login`,
      { email, senha }
    );
  }
}
