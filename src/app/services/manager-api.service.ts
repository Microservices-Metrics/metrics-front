import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerApiService {
  error: string | null = null;

  private managerApiUrl = "http://localhost:8080/services";

  constructor(private http: HttpClient) { }

  getCollectors(): Observable<any[]> {
    return this.http.get<any[]>(this.managerApiUrl).pipe(
      catchError((err) => {
        this.error = "Erro ao carregar dados!";
        return of([]);
      })
    );
  }

  postCollector(serviceCollectorData: any) {
    return this.http.post(this.managerApiUrl, serviceCollectorData).pipe(
      catchError((err) => {
        this.error = "Erro ao registrar novo serviço!";
        return of(null);
      })
    );
  }
}
