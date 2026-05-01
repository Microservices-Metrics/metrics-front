import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManagerApiService } from '../services/manager-api.service';

@Component({
  selector: 'app-collector-configs',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collector-configs.component.html',
  styleUrl: './collector-configs.component.css'
})
export class CollectorConfigsComponent implements OnInit {
  @ViewChild('modalContent') modalContent: any;

  collectorConfigs: any[] = [];
  collectors: any[] = [];
  microservices: any[] = [];
  editingId: string | null = null;
  configForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private managerApiService: ManagerApiService
  ) {
    this.configForm = this.fb.group({
      collectorId: ['', Validators.required],
      microserviceId: ['', Validators.required],
      cronExpression: [''],
      startDateTime: [''],
      endDateTime: ['']
    });
  }

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.managerApiService.getCollectorConfigs().subscribe({
      next: (data) => { this.collectorConfigs = data; }
    });
    this.managerApiService.getCollectors().subscribe({
      next: (data) => { this.collectors = data; }
    });
    this.managerApiService.getMicroservices().subscribe({
      next: (data) => { this.microservices = data; }
    });
  }

  collectorName(id: string): string {
    return this.collectors.find(c => c.id === id)?.name ?? id;
  }

  microserviceName(id: string): string {
    return this.microservices.find(m => m.id === id)?.name ?? id;
  }

  openCreateModal() {
    this.editingId = null;
    this.configForm.reset();
    this.modalService.open(this.modalContent, { size: 'lg' });
  }

  openEditModal(config: any) {
    this.editingId = config.id;
    this.configForm.setValue({
      collectorId: config.collectorId ?? '',
      microserviceId: config.microserviceId ?? '',
      cronExpression: config.cronExpression ?? '',
      startDateTime: config.startDateTime ? config.startDateTime.slice(0, 16) : '',
      endDateTime: config.endDateTime ? config.endDateTime.slice(0, 16) : ''
    });
    this.modalService.open(this.modalContent, { size: 'lg' });
  }

  onSubmit() {
    if (this.configForm.invalid) return;

    const value = this.configForm.value;
    const payload: any = {
      collectorId: value.collectorId,
      microserviceId: value.microserviceId,
      cronExpression: value.cronExpression || null,
      startDateTime: value.startDateTime ? value.startDateTime + ':00' : null,
      endDateTime: value.endDateTime ? value.endDateTime + ':00' : null
    };

    if (this.editingId) {
      this.managerApiService.putCollectorConfig(this.editingId, payload).subscribe({
        next: (updated) => {
          if (updated) {
            this.collectorConfigs = this.collectorConfigs.map(c => c.id === this.editingId ? updated : c);
          }
          this.modalService.dismissAll();
        }
      });
    } else {
      this.managerApiService.postCollectorConfig(payload).subscribe({
        next: (created) => {
          if (created) {
            this.collectorConfigs = [...this.collectorConfigs, created];
          }
          this.modalService.dismissAll();
        }
      });
    }
  }

  deleteConfig(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta configuração?')) return;
    this.managerApiService.deleteCollectorConfig(id).subscribe({
      next: () => {
        this.collectorConfigs = this.collectorConfigs.filter(c => c.id !== id);
      }
    });
  }
}
