import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomFloatingComponent } from './bottom-floating.component';

describe('BottomFloatingComponent', () => {
  let component: BottomFloatingComponent;
  let fixture: ComponentFixture<BottomFloatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomFloatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomFloatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
