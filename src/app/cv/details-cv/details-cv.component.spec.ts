import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCvComponent } from './details-cv.component';

describe('DetailsCvComponent', () => {
  let component: DetailsCvComponent;
  let fixture: ComponentFixture<DetailsCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DetailsCvComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DetailsCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
