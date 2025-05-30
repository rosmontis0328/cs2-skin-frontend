import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickersComponent } from './stickers.component';

describe('StickersComponent', () => {
  let component: StickersComponent;
  let fixture: ComponentFixture<StickersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StickersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StickersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
