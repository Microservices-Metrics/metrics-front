import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-microservices',
  imports: [ReactiveFormsModule],
  templateUrl: './microservices.component.html',
  styleUrl: './microservices.component.css'
})
export class MicroservicesComponent {
  @ViewChild('modalContent') modalContent: any;

  microserviceForm: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.microserviceForm = this.fb.group({
      name: [''],
      url: ['']
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
      (result: any) => {
        console.log(`Modal fechado com: ${result}`);
      },
      (reason: any) => {
        if (this.microserviceForm.dirty) {
          this.microserviceForm.reset();
        }
        console.log(`Modal descartado: ${reason}`);
      }
    );
  }

  onSubmit() {
    if (this.microserviceForm.valid) {
      const microserviceData = this.microserviceForm.value;
      console.log('Microservice Data:', microserviceData);
      // Aqui você pode adicionar a lógica para enviar os dados para o backend ou processá-los conforme necessário
      this.microserviceForm.reset();
      this.modalService.dismissAll();
    }
  }
}
