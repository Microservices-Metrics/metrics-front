import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-metrics',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.css'
})
export class MetricsComponent {
  @ViewChild('modalContent') modalContent: any;

  metricsForm: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.metricsForm = this.fb.nonNullable.group({
      name: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      unit: ['']
    });
  }

  openModal() {
    // Reseta o formulário antes de abrir o modal
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
      (result: any) => {
        console.log(`Modal fechado com: ${result}`);
      },
      (reason: any) => {
        if (this.metricsForm.dirty) {
          this.metricsForm.reset();
        }
        console.log(`Modal descartado: ${reason}`);
      }
    );
  }

  onSubmit() {
    if (this.metricsForm.valid) {
      console.log('Formulário de métricas enviado:', this.metricsForm.value);
      this.metricsForm.reset();
      this.modalService.dismissAll();
    } else {
      // Marca todos os campos como touched para exibir as mensagens de erro
      Object.keys(this.metricsForm.controls).forEach(key => {
        this.metricsForm.get(key)?.markAsTouched();
      });
    }
  }
}
