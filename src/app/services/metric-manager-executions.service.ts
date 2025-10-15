import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetricManagerExecutionsService {
  error: string | null = null;

  private executionsEndpoint = environment.metricManagerApiUrl + '/executions';

  constructor(private http: HttpClient) { }

  postExecution(idService: string) {
    const payload = { idService };
    console.log('Execution request to', this.executionsEndpoint, 'payload:', payload);

    return this.http.post(this.executionsEndpoint, payload).pipe(
      tap((res) => console.log('Execution response:', res)),
      catchError((err) => {
        this.error = `Não foi possível iniciar execução do serviço ${idService}! Error: ${err.message || err}`;
        return of(null);
      })
    );
  }
}
