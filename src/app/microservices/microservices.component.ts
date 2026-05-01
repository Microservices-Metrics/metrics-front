import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManagerApiService } from '../services/manager-api.service';

@Component({
  selector: 'app-microservices',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './microservices.component.html',
  styleUrl: './microservices.component.css'
})
export class MicroservicesComponent implements OnInit {
  @ViewChild('modalContent') modalContent: any;

  currentMicroservices: any[] = [];
  microserviceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private managerApiService: ManagerApiService
  ) {
    this.microserviceForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.managerApiService.getMicroservices().subscribe({
      next: (data) => { this.currentMicroservices = data; },
      error: (err) => console.error('Erro ao carregar microsserviços:', err)
    });
  }

  openModal() {
    const modalRef = this.modalService.open(this.modalContent, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      beforeDismiss: () => {
        if (!this.microserviceForm.dirty) return true;
        return confirm('Tem certeza que deseja fechar? Todas as informações preenchidas serão perdidas.');
      }
    });

    modalRef.result.then(
      (result: any) => { console.log(`Modal fechado com: ${result}`); },
      (reason: any) => {
        if (this.microserviceForm.dirty) { this.microserviceForm.reset(); }
        console.log(`Modal descartado: ${reason}`);
      }
    );
  }

  onSubmit() {
    if (this.microserviceForm.valid) {
      this.managerApiService.postMicroservice(this.microserviceForm.value).subscribe({
        next: (created) => {
          if (created) { this.currentMicroservices = [...this.currentMicroservices, created]; }
          this.microserviceForm.reset();
          this.modalService.dismissAll();
        },
        error: (err) => console.error('Erro ao registrar microsserviço:', err)
      });
    }
  }

  deleteMicroservice(id: string) {
    if (confirm('Tem certeza que deseja excluir este microsserviço?')) {
      this.managerApiService.deleteMicroservice(id).subscribe({
        next: () => { this.currentMicroservices = this.currentMicroservices.filter(m => m.id !== id); },
        error: (err) => console.error('Erro ao excluir microsserviço:', err)
      });
    }
  }
}
