import { Service, inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VacancyType } from '../../model/vacancy';

@Injectable({
  providedIn: 'root'
})

export class VacancyService {
  private readonly apiUrl = `${environment.apiUrl}vagas`;

  constructor(private http: HttpClient) {}

  criarVaga(vaga: any): Observable<VacancyType> {
    return this.http.post<VacancyType>(`${this.apiUrl}`, vaga);
  }


}
