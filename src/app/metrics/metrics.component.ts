import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManagerApiService } from '../services/manager-api.service';

@Component({
  selector: 'app-metrics',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.css'
})
export class MetricsComponent implements OnInit {
  @ViewChild('modalContent') modalContent: any;

  currentMetrics: any[] = [];
  metricsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private managerApiService: ManagerApiService
  ) {
    this.metricsForm = this.fb.nonNullable.group({
      name: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      unit: ['']
    });
  }

  ngOnInit() {
    this.managerApiService.getMetrics().subscribe({
      next: (data) => { this.currentMetrics = data; },
      error: (err) => console.error('Erro ao carregar métricas:', err)
    });
  }

  openModal() {
    this.metricsForm.reset();

    const modalRef = this.modalService.open(this.modalContent, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      beforeDismiss: () => {
        if (!this.metricsForm.dirty) return true;
        return confirm('Tem certeza que deseja fechar? Todas as informações preenchidas serão perdidas.');
      }
    });

    modalRef.result.then(
      (result: any) => { console.log(`Modal fechado com: ${result}`); },
      (reason: any) => {
        if (this.metricsForm.dirty) { this.metricsForm.reset(); }
        console.log(`Modal descartado: ${reason}`);
      }
    );
  }

  onSubmit() {
    if (this.metricsForm.valid) {
      this.managerApiService.postMetric(this.metricsForm.value).subscribe({
        next: (created) => {
          if (created) { this.currentMetrics = [...this.currentMetrics, created]; }
          this.metricsForm.reset();
          this.modalService.dismissAll();
        },
        error: (err) => console.error('Erro ao criar métrica:', err)
      });
    } else {
      Object.keys(this.metricsForm.controls).forEach(key => {
        this.metricsForm.get(key)?.markAsTouched();
      });
    }
  }

  deleteMetric(id: string) {
    if (confirm('Tem certeza que deseja excluir esta métrica?')) {
      this.managerApiService.deleteMetric(id).subscribe({
        next: () => { this.currentMetrics = this.currentMetrics.filter(m => m.idMetric !== id); },
        error: (err) => console.error('Erro ao excluir métrica:', err)
      });
    }
  }
}
