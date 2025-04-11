import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCollectorComponent } from './service-collector.component';

describe('ServiceCollectorComponent', () => {
  let component: ServiceCollectorComponent;
  let fixture: ComponentFixture<ServiceCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCollectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
