import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { CollectorConfigsComponent } from './collector-configs.component';
import { ManagerApiService } from '../services/manager-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('CollectorConfigsComponent', () => {
  let component: CollectorConfigsComponent;
  let fixture: ComponentFixture<CollectorConfigsComponent>;

  const mockManagerApiService = {
    getCollectorConfigs: () => of([]),
    getCollectors: () => of([]),
    getMicroservices: () => of([]),
    postCollectorConfig: () => of(null),
    putCollectorConfig: () => of(null),
    deleteCollectorConfig: () => of(null)
  };

  const mockNgbModal = {
    open: () => ({ result: Promise.resolve(), dismiss: () => {} }),
    dismissAll: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorConfigsComponent, ReactiveFormsModule],
      providers: [
        { provide: ManagerApiService, useValue: mockManagerApiService },
        { provide: NgbModal, useValue: mockNgbModal }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
