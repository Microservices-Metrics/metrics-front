import { Routes } from '@angular/router';
import { MetricsComponent } from './metrics/metrics.component';
import { ServiceCollectorComponent } from './service-collector/service-collector.component';

export const routes: Routes = [
    { path: 'metrics', component: MetricsComponent },
    { path: 'service-collector', component: ServiceCollectorComponent }
];
