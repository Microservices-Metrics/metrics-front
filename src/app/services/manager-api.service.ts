import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerApiService {
  error: string | null = null;

  private servicesEndpoint = environment.metricManagerApiUrl + '/services';

  constructor(private http: HttpClient) { }

  getCollectors(): Observable<any[]> {
    return this.http.get<any[]>(this.servicesEndpoint).pipe(
      catchError((err) => {
        this.error = "Erro ao carregar dados!";
        return of([]);
      })
    );
  }

  postCollector(serviceCollectorData: any) {
    return this.http.post(this.servicesEndpoint, serviceCollectorData).pipe(
      catchError((err) => {
        this.error = "Erro ao registrar novo serviço!";
        return of(null);
      })
    );
  }

  deleteCollector(idService: string): Observable<any> {
    return this.http.delete(`${this.servicesEndpoint}/${idService}`).pipe(
      catchError((err) => {
        this.error = `Erro ao excluir serviço de coleta ${idService}!`;
        return of(null);
      })
    );
  }
}
