import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SproductComponent } from './sproduct.component';

describe('SproductComponent', () => {
  let component: SproductComponent;
  let fixture: ComponentFixture<SproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SproductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
