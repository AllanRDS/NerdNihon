import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsHorizontalComponent } from './cards-horizontal.component';

describe('CardsHorizontalComponent', () => {
  let component: CardsHorizontalComponent;
  let fixture: ComponentFixture<CardsHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
