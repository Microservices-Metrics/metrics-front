import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerApiService {
  error: string | null = null;

  private collectorsEndpoint = environment.metricManagerApiUrl + '/collectors';
  private metricsEndpoint = environment.metricManagerApiUrl + '/metrics';
  private microservicesEndpoint = environment.metricManagerApiUrl + '/microservices';
  private measurementsEndpoint = environment.metricManagerApiUrl + '/measurements';
  private collectorConfigsEndpoint = environment.metricManagerApiUrl + '/collector-configs';

  constructor(private http: HttpClient) { }

  // --- Collectors ---

  getCollectors(): Observable<any[]> {
    return this.http.get<any[]>(this.collectorsEndpoint).pipe(
      catchError((err) => {
        this.error = "Erro ao carregar coletores!";
        return of([]);
      })
    );
  }

  getCollectorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.collectorsEndpoint}/${id}`).pipe(
      catchError((err) => {
        this.error = `Erro ao carregar coletor ${id}!`;
        return of(null);
      })
    );
  }

  postCollector(collectorData: any): Observable<any> {
    return this.http.post(this.collectorsEndpoint, collectorData).pipe(
      catchError((err) => {
        this.error = "Erro ao registrar novo coletor!";
        return of(null);
      })
    );
  }

  deleteCollector(id: string): Observable<any> {
    return this.http.delete(`${this.collectorsEndpoint}/${id}`).pipe(
      catchError((err) => {
        this.error = `Erro ao excluir coletor ${id}!`;
        return of(null);
      })
    );
  }

  getCollectorHealthStatuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.collectorsEndpoint}/health`).pipe(
      catchError(() => of([]))
    );
  }

  getCollectorHealth(id: string): Observable<any> {
    return this.http.get<any>(`${this.collectorsEndpoint}/${id}/health`).pipe(
      catchError(() => of(null))
    );
  }

  // --- Metrics ---

  getMetrics(): Observable<any[]> {
    return this.http.get<any[]>(this.metricsEndpoint).pipe(
      catchError((err) => {
        this.error = "Erro ao carregar métricas!";
        return of([]);
      })
    );
  }

  postMetric(metricData: any): Observable<any> {
    return this.http.post(this.metricsEndpoint, metricData).pipe(
      catchError((err) => {
        this.error = "Erro ao criar métrica!";
        return of(null);
      })
    );
  }

  deleteMetric(id: string): Observable<any> {
    return this.http.delete(`${this.metricsEndpoint}/${id}`).pipe(
      catchError((err) => {
        this.error = `Erro ao excluir métrica ${id}!`;
        return of(null);
      })
    );
  }

  // --- Microservices ---

  getMicroservices(): Observable<any[]> {
    return this.http.get<any[]>(this.microservicesEndpoint).pipe(
      catchError((err) => {
        this.error = "Erro ao carregar microsserviços!";
        return of([]);
      })
    );
  }

  postMicroservice(microserviceData: any): Observable<any> {
    return this.http.post(this.microservicesEndpoint, microserviceData).pipe(
      catchError((err) => {
        this.error = "Erro ao registrar microsserviço!";
        return of(null);
      })
    );
  }

  deleteMicroservice(id: string): Observable<any> {
    return this.http.delete(`${this.microservicesEndpoint}/${id}`).pipe(
      catchError((err) => {
        this.error = `Erro ao excluir microsserviço ${id}!`;
        return of(null);
      })
    );
  }

  // --- Measurements ---

  getMeasurements(params?: { collectorId?: string; collectorConfigId?: string }): Observable<any[]> {
    let queryString = '';
    if (params?.collectorConfigId) {
      queryString = `?collectorConfigId=${params.collectorConfigId}`;
    } else if (params?.collectorId) {
      queryString = `?collectorId=${params.collectorId}`;
    }
    return this.http.get<any[]>(`${this.measurementsEndpoint}${queryString}`).pipe(
      catchError((err) => {
        this.error = 'Erro ao carregar medições!';
        return of([]);
      })
    );
  }

  deleteMeasurement(id: string): Observable<any> {
    return this.http.delete(`${this.measurementsEndpoint}/${id}`).pipe(
      catchError((err) => {
        this.error = `Erro ao excluir medição ${id}!`;
        return of(null);
      })
    );
  }

  deleteMeasurementsByFilter(params: { collectorId?: string; collectorConfigId?: string }): Observable<any> {
    let queryString = '';
    if (params.collectorConfigId) {
      queryString = `?collectorConfigId=${params.collectorConfigId}`;
    } else if (params.collectorId) {
      queryString = `?collectorId=${params.collectorId}`;
    }
    return this.http.delete(`${this.measurementsEndpoint}${queryString}`).pipe(
      catchError((err) => {
        this.error = 'Erro ao excluir medições!';
        return of(null);
      })
    );
  }

  // --- Collector Configs ---

  getCollectorConfigs(): Observable<any[]> {
    return this.http.get<any[]>(this.collectorConfigsEndpoint).pipe(
      catchError((err) => {
        this.error = 'Erro ao carregar configurações de coletores!';
        return of([]);
      })
    );
  }

  postCollectorConfig(data: any): Observable<any> {
    return this.http.post(this.collectorConfigsEndpoint, data).pipe(
      catchError((err) => {
        this.error = 'Erro ao criar configuração de coletor!';
        return of(null);
      })
    );
  }

  putCollectorConfig(id: string, data: any): Observable<any> {
    return this.http.put(`${this.collectorConfigsEndpoint}/${id}`, data).pipe(
      catchError((err) => {
        this.error = `Erro ao atualizar configuração ${id}!`;
        return of(null);
      })
    );
  }

  deleteCollectorConfig(id: string): Observable<any> {
    return this.http.delete(`${this.collectorConfigsEndpoint}/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        this.error = `Erro ao excluir configuração ${id}!`;
        return throwError(() => err);
      })
    );
  }
}
