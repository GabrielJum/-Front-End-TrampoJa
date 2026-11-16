import { Injectable } from '@angular/core';
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

  listarTodasAsVagas(): Observable<VacancyType[]> {
    return this.http.get<VacancyType[]>(this.apiUrl);
  }

  listarVagas(empresaId: number): Observable<VacancyType[]> {
    return this.http.get<VacancyType[]>(`${this.apiUrl}?empresaId=${empresaId}`);
  }

  criarVaga(vaga: VacancyType): Observable<VacancyType> {
    return this.http.post<VacancyType>(this.apiUrl, vaga);
  }

  editarVaga(id: number, vaga: VacancyType): Observable<VacancyType> {
    return this.http.put<VacancyType>(`${this.apiUrl}/${id}`, vaga);
  }

  excluirVaga(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
