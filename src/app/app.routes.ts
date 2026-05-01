import { Routes } from '@angular/router';
import { MetricsComponent } from './metrics/metrics.component';
import { ServiceCollectorComponent } from './service-collector/service-collector.component';
import { MicroservicesComponent } from './microservices/microservices.component';
import { CollectorConfigsComponent } from './collector-configs/collector-configs.component';
import { MeasurementsComponent } from './measurements/measurements.component';

export const routes: Routes = [
    { path: 'collector-configs', component: CollectorConfigsComponent },
    { path: 'metrics', component: MetricsComponent },
    { path: 'microservices', component: MicroservicesComponent },
    { path: 'metric-collectors', component: ServiceCollectorComponent },
    { path: 'measurements', component: MeasurementsComponent }
];
