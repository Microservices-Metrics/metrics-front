import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-service-collector',
  imports: [ReactiveFormsModule],
  templateUrl: './service-collector.component.html',
  styleUrl: './service-collector.component.css'
})
export class ServiceCollectorComponent {
  serviceCollectorForm: FormGroup;

  constructor(private fb: FormBuilder) { 
    this.serviceCollectorForm = this.fb.nonNullable.group({
      serviceName: ['', [Validators.required]]
    });
  }
  
  onSubmit() {
    if (this.serviceCollectorForm.valid) {
      console.log('Dados do Formulário:', this.serviceCollectorForm.value);
    }
  }

}
