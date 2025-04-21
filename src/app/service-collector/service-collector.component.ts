import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManagerApiService } from '../services/manager-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-collector',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './service-collector.component.html',
  styleUrl: './service-collector.component.css'
})
export class ServiceCollectorComponent {
  @ViewChild('modalContent') modalContent: any;

  currentServiceCollectors: any[] = [];
  serviceCollectorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private managerApiService: ManagerApiService
  ) {
    this.serviceCollectorForm = this.fb.nonNullable.group({
      serviceName: ['', [Validators.required]],
      collectorType: ['', [Validators.required]],
      url: [''],
      measurementFormat: [''],
      measurementDescription: [''],
      outputExample: ['']
    });
  }

  ngOnInit() {
    this.managerApiService.getCollectors().subscribe({
      next: (data) => {
        this.currentServiceCollectors = data;
      },
      error: (err) => {
        console.error("Erro ao consumir API: " + err);
      }
    });
  }

  onSubmit() {
    if (this.serviceCollectorForm.valid) {
      // console.log('Dados do Formulário:', this.serviceCollectorForm.value);

      this.managerApiService.postCollector(this.serviceCollectorForm.value).subscribe({
        next: () => {
          this.serviceCollectorForm.reset();
          console.log("Sucesso!");
        },
        error: (err) => {
          console.log("Erro na requisição: " + err.message);
        }
      });
    }
  }

  openModal() {
    this.modalService.open(this.modalContent, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        console.log(`Modal fechado com: ${result}`);
      },
      (reason) => {
        console.log(`Modal descartado: ${reason}`);
      }
    );
  }
}
