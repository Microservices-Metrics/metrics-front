import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagerApiService } from '../services/manager-api.service';

@Component({
  selector: 'app-measurements',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './measurements.component.html',
  styleUrl: './measurements.component.css'
})
export class MeasurementsComponent implements OnInit {
  measurements: any[] = [];
  collectors: any[] = [];
  collectorConfigs: any[] = [];
  filterForm: FormGroup;
  loading = false;
  collectorSearch = '';
  collectorDropdownOpen = false;
  collectorConfigSearch = '';
  collectorConfigDropdownOpen = false;

  get filteredCollectors() {
    const search = this.collectorSearch.toLowerCase();
    return search ? this.collectors.filter(c => c.name.toLowerCase().includes(search)) : this.collectors;
  }

  get filteredCollectorConfigs() {
    const search = this.collectorConfigSearch.toLowerCase();
    return search ? this.collectorConfigs.filter(cc => cc.id.toLowerCase().includes(search)) : this.collectorConfigs;
  }

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

  selectCollector(collector: any | null) {
    this.filterForm.patchValue({ collectorId: collector?.id ?? '', collectorConfigId: '' });
    this.collectorSearch = collector?.name ?? '';
    this.collectorConfigSearch = '';
    this.collectorConfigs = [];
    this.collectorDropdownOpen = false;

    if (collector) {
      this.managerApiService.getCollectorById(collector.id).subscribe({
        next: (c) => {
          if (c?.configs) this.collectorConfigs = c.configs;
        }
      });
    }

    this.loadMeasurements();
  }

  onCollectorBlur() {
    setTimeout(() => {
      this.collectorDropdownOpen = false;
      const id = this.filterForm.get('collectorId')?.value;
      this.collectorSearch = this.collectors.find(c => c.id === id)?.name ?? '';
    }, 200);
  }

  selectCollectorConfig(config: any | null) {
    this.filterForm.patchValue({ collectorConfigId: config?.id ?? '' });
    this.collectorConfigSearch = config?.id ?? '';
    this.collectorConfigDropdownOpen = false;
    this.loadMeasurements();
  }

  onCollectorConfigBlur() {
    setTimeout(() => {
      this.collectorConfigDropdownOpen = false;
      this.collectorConfigSearch = this.filterForm.get('collectorConfigId')?.value ?? '';
    }, 200);
  }

  clearFilters() {
    this.collectorSearch = '';
    this.collectorConfigSearch = '';
    this.collectorDropdownOpen = false;
    this.collectorConfigDropdownOpen = false;
    this.filterForm.reset({ collectorId: '', collectorConfigId: '' });
    this.collectorConfigs = [];
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
