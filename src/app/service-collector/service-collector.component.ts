import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManagerApiService } from '../services/manager-api.service';

@Component({
  selector: 'app-service-collector',
  imports: [ReactiveFormsModule],
  templateUrl: './service-collector.component.html',
  styleUrl: './service-collector.component.css'
})
export class ServiceCollectorComponent {
  serviceCollectorForm: FormGroup;

  constructor(private managetApiService: ManagerApiService, private fb: FormBuilder) { 
    this.serviceCollectorForm = this.fb.nonNullable.group({
      serviceName: ['', [Validators.required]],
      collectorType: ['', [Validators.required]],
      url: [''],
      measurementFormat: [''],
      measurementDescription: [''],
      outputExample: ['']
    });
  }
  
  onSubmit() {
    if (this.serviceCollectorForm.valid) {
      // TODO: remover após requisição construída!
      console.log('Dados do Formulário:', this.serviceCollectorForm.value);
      console.log("==============================");
      console.log(this.managetApiService.getCollectors());
    }
  }

}
