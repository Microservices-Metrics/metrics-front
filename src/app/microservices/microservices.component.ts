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
  @ViewChild('detailsModalContent') detailsModalContent: any;

  currentMicroservices: any[] = [];
  selectedMicroservice: any = null;
  selectedMicroserviceMetadatas: any[] = [];
  editingMetadataId: string | null = null;
  microserviceForm: FormGroup;
  metadataForm: FormGroup;
  editMetadataForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private managerApiService: ManagerApiService
  ) {
    this.microserviceForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.metadataForm = this.fb.group({
      varName: ['', Validators.required],
      varValue: ['', Validators.required]
    });
    this.editMetadataForm = this.fb.group({
      varName: ['', Validators.required],
      varValue: ['', Validators.required]
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

  openDetailsModal(ms: any) {
    this.selectedMicroservice = ms;
    this.selectedMicroserviceMetadatas = [];
    this.editingMetadataId = null;
    this.metadataForm.reset();
    this.managerApiService.getMetadatasByMicroservice(ms.id).subscribe({
      next: (data) => { this.selectedMicroserviceMetadatas = data; },
      error: (err) => console.error('Erro ao carregar metadados:', err)
    });
    this.modalService.open(this.detailsModalContent, {
      size: 'lg',
      ariaLabelledBy: 'details-modal-title'
    });
  }

  startEditingMetadata(meta: any) {
    this.editingMetadataId = meta.id;
    this.editMetadataForm.setValue({ varName: meta.varName, varValue: meta.varValue });
  }

  cancelEditingMetadata() {
    this.editingMetadataId = null;
    this.editMetadataForm.reset();
  }

  saveMetadata(meta: any) {
    if (this.editMetadataForm.invalid) return;
    this.managerApiService.putMetadata(meta.id, this.editMetadataForm.value).subscribe({
      next: (updated) => {
        if (updated) {
          const idx = this.selectedMicroserviceMetadatas.findIndex(m => m.id === meta.id);
          if (idx !== -1) { this.selectedMicroserviceMetadatas[idx] = updated; }
        }
        this.cancelEditingMetadata();
      },
      error: (err) => console.error('Erro ao salvar metadado:', err)
    });
  }

  addMetadata() {
    if (this.metadataForm.invalid || !this.selectedMicroservice) return;
    const payload = { ...this.metadataForm.value, microserviceId: this.selectedMicroservice.id };
    this.managerApiService.postMetadata(payload).subscribe({
      next: (created) => {
        if (created) { this.selectedMicroserviceMetadatas = [...this.selectedMicroserviceMetadatas, created]; }
        this.metadataForm.reset();
      },
      error: (err) => console.error('Erro ao adicionar metadado:', err)
    });
  }

  deleteMetadata(id: string) {
    if (confirm('Tem certeza que deseja excluir este metadado?')) {
      this.managerApiService.deleteMetadata(id).subscribe({
        next: () => { this.selectedMicroserviceMetadatas = this.selectedMicroserviceMetadatas.filter(m => m.id !== id); },
        error: (err) => console.error('Erro ao excluir metadado:', err)
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
