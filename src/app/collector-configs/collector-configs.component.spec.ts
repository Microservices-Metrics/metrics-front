import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorConfigsComponent } from './collector-configs.component';

describe('CollectorConfigsComponent', () => {
  let component: CollectorConfigsComponent;
  let fixture: ComponentFixture<CollectorConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorConfigsComponent]
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
