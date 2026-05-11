import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManagerApiService } from '../services/manager-api.service';

@Component({
  selector: 'app-measurements',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './measurements.component.html',
  styleUrl: './measurements.component.css'
})
export class MeasurementsComponent implements OnInit {
  @ViewChild('measurementModal') measurementModal: any;

  measurements: any[] = [];
  collectors: any[] = [];
  collectorConfigs: any[] = [];
  allCollectorConfigs: any[] = [];
  microservices: any[] = [];
  filterForm: FormGroup;
  loading = false;
  collectorSearch = '';
  collectorDropdownOpen = false;
  collectorConfigSearch = '';
  collectorConfigDropdownOpen = false;
  tableIdSearch = '';
  tableCollectorSearch = '';
  tableMicroserviceSearch = '';
  tableCollectorConfigSearch = '';
  headerFilterOpen: 'id' | 'collector' | 'microservice' | 'collectorConfig' | null = null;
  selectedMeasurement: any = null;

  get filteredCollectors() {
    const search = this.collectorSearch.toLowerCase();
    return search ? this.collectors.filter(c => c.name.toLowerCase().includes(search)) : this.collectors;
  }

  get filteredCollectorConfigs() {
    const search = this.collectorConfigSearch.toLowerCase();
    return search ? this.collectorConfigs.filter(cc => cc.id.toLowerCase().includes(search)) : this.collectorConfigs;
  }

  get filteredMeasurements() {
    const idSearch = this.tableIdSearch.trim().toLowerCase();
    const collectorSearch = this.tableCollectorSearch.trim().toLowerCase();
    const microserviceSearch = this.tableMicroserviceSearch.trim().toLowerCase();
    const collectorConfigSearch = this.tableCollectorConfigSearch.trim().toLowerCase();

    return this.measurements.filter((measurement) => {
      const measurementId = String(measurement.id ?? '').toLowerCase();
      const collectorName = this.collectorNameForMeasurement(measurement).toLowerCase();
      const microserviceName = this.microserviceNameForMeasurement(measurement).toLowerCase();
      const collectorConfigId = String(measurement.collectorConfigId ?? '').toLowerCase();

      return (!idSearch || measurementId.includes(idSearch))
        && (!collectorSearch || collectorName.includes(collectorSearch))
        && (!microserviceSearch || microserviceName.includes(microserviceSearch))
        && (!collectorConfigSearch || collectorConfigId.includes(collectorConfigSearch));
    });
  }

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private managerApiService: ManagerApiService
  ) {
    this.filterForm = this.fb.group({
      collectorId: [''],
      collectorConfigId: ['']
    });
  }

  ngOnInit() {
    this.loadCollectors();
    this.loadAllCollectorConfigs();
    this.loadMicroservices();
    this.loadMeasurements();
  }

  loadCollectors() {
    this.managerApiService.getCollectors().subscribe({
      next: (data) => { this.collectors = data; }
    });
  }

  loadAllCollectorConfigs() {
    this.managerApiService.getCollectorConfigs().subscribe({
      next: (data) => { this.allCollectorConfigs = data; }
    });
  }

  loadMicroservices() {
    this.managerApiService.getMicroservices().subscribe({
      next: (data) => { this.microservices = data; }
    });
  }

  collectorNameForMeasurement(m: any): string {
    const config = this.allCollectorConfigs.find(cc => cc.id === m.collectorConfigId);
    if (!config) return '—';
    return this.collectors.find(c => c.id === config.collectorId)?.name ?? config.collectorId;
  }

  microserviceNameForMeasurement(m: any): string {
    const config = this.allCollectorConfigs.find(cc => cc.id === m.collectorConfigId);
    if (!config) return '—';
    return this.microservices.find(ms => ms.id === config.microserviceId)?.name ?? config.microserviceId;
  }

  openMeasurementModal(m: any) {
    this.selectedMeasurement = m;
    this.modalService.open(this.measurementModal, { size: 'lg' });
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

  clearTableFilters() {
    this.tableIdSearch = '';
    this.tableCollectorSearch = '';
    this.tableMicroserviceSearch = '';
    this.tableCollectorConfigSearch = '';
    this.headerFilterOpen = null;
  }

  toggleHeaderFilter(filter: 'id' | 'collector' | 'microservice' | 'collectorConfig') {
    this.headerFilterOpen = this.headerFilterOpen === filter ? null : filter;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.measurement-header-filter')) {
      this.headerFilterOpen = null;
    }
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

  formatResponseBody(body: string | null | undefined): string {
    if (!body) return '—';
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  }
}
