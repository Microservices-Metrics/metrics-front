import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ManagerApiService } from '../services/manager-api.service';

@Component({
  selector: 'app-measurements',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './measurements.component.html',
  styleUrl: './measurements.component.css'
})
export class MeasurementsComponent implements OnInit {
  measurements: any[] = [];
  collectors: any[] = [];
  collectorConfigs: any[] = [];
  filterForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private managerApiService: ManagerApiService
  ) {
    this.filterForm = this.fb.group({
      collectorId: [''],
      collectorConfigId: ['']
    });
  }

  ngOnInit() {
    this.loadCollectors();
    this.loadMeasurements();
  }

  loadCollectors() {
    this.managerApiService.getCollectors().subscribe({
      next: (data) => {
        this.collectors = data;
      }
    });
  }

  onCollectorChange() {
    const collectorId = this.filterForm.get('collectorId')?.value;
    this.filterForm.patchValue({ collectorConfigId: '' });
    this.collectorConfigs = [];

    if (collectorId) {
      this.managerApiService.getCollectorById(collectorId).subscribe({
        next: (collector) => {
          if (collector?.configs) {
            this.collectorConfigs = collector.configs;
          }
        }
      });
    }

    this.loadMeasurements();
  }

  onCollectorConfigChange() {
    this.loadMeasurements();
  }

  loadMeasurements() {
    this.loading = true;
    const { collectorId, collectorConfigId } = this.filterForm.value;
    const params: { collectorId?: string; collectorConfigId?: string } = {};

    if (collectorConfigId) {
      params.collectorConfigId = collectorConfigId;
    } else if (collectorId) {
      params.collectorId = collectorId;
    }

    this.managerApiService.getMeasurements(params).subscribe({
      next: (data) => {
        this.measurements = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  deleteMeasurement(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta medição?')) return;

    this.managerApiService.deleteMeasurement(id).subscribe({
      next: (res) => {
        if (res !== null || res === undefined) {
          this.measurements = this.measurements.filter(m => m.id !== id);
        }
      }
    });
  }

  deleteByFilter() {
    const { collectorId, collectorConfigId } = this.filterForm.value;
    if (!collectorId && !collectorConfigId) return;

    const filterLabel = collectorConfigId
      ? `collector config ${collectorConfigId}`
      : `collector ${collectorId}`;

    if (!confirm(`Tem certeza que deseja excluir todas as medições para ${filterLabel}?`)) return;

    const params: { collectorId?: string; collectorConfigId?: string } = {};
    if (collectorConfigId) {
      params.collectorConfigId = collectorConfigId;
    } else {
      params.collectorId = collectorId;
    }

    this.managerApiService.deleteMeasurementsByFilter(params).subscribe({
      next: () => {
        this.measurements = [];
      }
    });
  }
}
