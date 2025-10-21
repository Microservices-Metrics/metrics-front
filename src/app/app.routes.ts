import { Routes } from '@angular/router';
import { MetricsComponent } from './metrics/metrics.component';
import { ServiceCollectorComponent } from './service-collector/service-collector.component';
import { MicroservicesComponent } from './microservices/microservices.component';
import { CollectionsComponent } from './collections/collections.component';

export const routes: Routes = [
    { path: 'collections', component: CollectionsComponent },
    { path: 'metrics', component: MetricsComponent },
    { path: 'microservices', component: MicroservicesComponent },
    { path: 'metric-collectors', component: ServiceCollectorComponent }
];
