import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetricManagerExecutionsService {
  error: string | null = null;

  private triggerEndpoint = environment.metricManagerApiUrl + '/collector-configs/trigger';

  constructor(private http: HttpClient) { }

  triggerCollection(collectorId: string, microserviceId: string) {
    const payload = { collectorId, microserviceId };
    console.log('Trigger request to', this.triggerEndpoint, 'payload:', payload);

    return this.http.post(this.triggerEndpoint, payload).pipe(
      tap((res) => console.log('Trigger response:', res)),
      catchError((err) => {
        this.error = `Não foi possível iniciar coleta para o coletor ${collectorId}! Error: ${err.message || err}`;
        return of(null);
      })
    );
  }
}
