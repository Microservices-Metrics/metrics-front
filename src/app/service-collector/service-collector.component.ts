import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManagerApiService } from '../services/manager-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { MetricManagerExecutionsService } from '../services/metric-manager-executions.service';

@Component({
  selector: 'app-service-collector',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './service-collector.component.html',
  styleUrl: './service-collector.component.css'
})
export class ServiceCollectorComponent {
  @ViewChild('modalContent') modalContent: any;
  @ViewChild('modalRunService') modalRunService: any;
  @ViewChild('modalHistory') modalHistory: any;
  @ViewChild('modalDetails') modalDetails: any;

  currentServiceCollectors: any[] = [];
  selectedExecutions: any[] = [];
  selectedServiceId: string | number | null = null;
  selectedServiceName: string = '';
  selectedExecutionDetails: any = null;
  selectedCollectorDetails: any = null;
  serviceCollectorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private managerApiService: ManagerApiService,
    private metricManagerExecutionsService: MetricManagerExecutionsService
  ) {
    this.serviceCollectorForm = this.fb.nonNullable.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      collectionSettings: this.fb.group({
        cronExpression: [''],
        startDate: [''],
        endDate: ['']
      }),
      metricFormat: ['', [Validators.required]],
      metricDescription: [''],
      outputExample: [''],
      arguments: this.fb.array([
        this.fb.group({
          argumentName: ['', Validators.required],
          argumentValue: ['', Validators.required],
          type: ['', Validators.required],
          description: ['']
        })
      ])
    });
  }

  get arguments(): FormArray {
    return this.serviceCollectorForm.get('arguments') as FormArray;
  }

  addArgument() {
    this.arguments.push(this.fb.group({
      argumentName: [''],
      argumentValue: [''],
      type: [''],
      description: ['']
    }));
  }

  removeArgument(index: number) {
    if (this.arguments.length > 1) {
      this.arguments.removeAt(index);
    } else {
      const fg = this.arguments.at(0) as FormGroup;
      fg.reset({ type: 'string' });
    }
  }

  ngOnInit() {
    this.managerApiService.getCollectors().subscribe({
      next: (data) => {
        this.currentServiceCollectors = data;
      },
      error: (err) => {
        console.error('Erro ao consumir API: ' + err);
      }
    });
  }

  onSubmit() {
    if (this.serviceCollectorForm.valid) {
      const raw = this.serviceCollectorForm.value;
      const body: any = {
        name: raw.name,
        type: raw.type,
        url: raw.url,
        collectionSettings: raw.collectionSettings || {},
        metricFormat: raw.metricFormat,
        metricDescription: raw.metricDescription,
        arguments: (raw.arguments || []).map((a: any) => ({
          argumentName: a.argumentName,
          argumentValue: a.argumentValue,
          type: a.type,
          description: a.description
        }))
      };

      console.log('Request body:', body);

      this.managerApiService.postCollector(body).subscribe({
        next: () => {
          this.serviceCollectorForm.reset();
          this.arguments.clear();
          this.addArgument();
          console.log('Sucesso!');
        },
        error: (err) => {
          console.log('Erro na requisição: ' + (err?.message ?? err));
        }
      });
    }
  }

  confirmClose(modalRef: any) {
    if (!this.serviceCollectorForm.dirty) {
      modalRef.dismiss();
      return;
    }

    const ok = confirm('Tem certeza que deseja fechar? Todas as informações preenchidas serão perdidas.');
    if (ok) {
      modalRef.dismiss();
      this.serviceCollectorForm.reset();
      this.arguments.clear();
      this.addArgument();
    }
  }

  deleteServiceCollector(idService: string) {
    if (confirm('Tem certeza que deseja excluir este coletor de serviços?')) {
      this.managerApiService.deleteCollector(idService).subscribe({
        next: () => {
          this.currentServiceCollectors = this.currentServiceCollectors.filter(collector => collector.idService !== idService);
          console.log('Coletor de serviços excluído com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao excluir coletor de serviços: ' + err);
        }
      });
    }
  }

  openModal() {
    const modalRef = this.modalService.open(this.modalContent, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      beforeDismiss: () => {
        if (!this.serviceCollectorForm.dirty) return true;
        return confirm('Tem certeza que deseja fechar? Todas as informações preenchidas serão perdidas.');
      }
    });

    modalRef.result.then(
      (result: any) => {
        console.log(`Modal fechado com: ${result}`);
      },
      (reason: any) => {
        if (this.serviceCollectorForm.dirty) {
          this.serviceCollectorForm.reset();
          this.arguments.clear();
          this.addArgument();
        }
        console.log(`Modal descartado: ${reason}`);
      }
    );
  }

  runServiceCollector(idService: string) {
    this.metricManagerExecutionsService.postExecution(idService).subscribe({
      next: (response) => {
        console.log('Coletor de serviços iniciado com sucesso:', response);
        this.selectedExecutionDetails = response;
        // open modal to show the execution details
        this.modalService.open(this.modalRunService, { size: 'lg' }).result.then(
          (res) => console.log('Run modal closed', res),
          (reason) => console.log('Run modal dismissed', reason)
        );
      },
      error: (err) => {
        console.error('Erro ao iniciar coletor de serviços:', err);
      }
    });



  }

  openHistory(collector: any) {
    this.selectedExecutions = Array.isArray(collector?.executions) ? collector.executions : [];
    this.selectedServiceId = collector?.idService ?? null;
    this.selectedServiceName = collector?.name ?? '';
    this.modalService.open(this.modalHistory, { size: 'xl' }).result.then(
      (result: any) => console.log('History modal closed', result),
      (reason: any) => console.log('History modal dismissed', reason)
    );
  }

  openDetails(collector: any) {
    // clone collector without executions to avoid accidental mutation
    const { executions, ...rest } = collector || {};
    this.selectedCollectorDetails = rest;
    this.modalService.open(this.modalDetails, { size: 'lg' });
  }
}
