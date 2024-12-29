import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaStatsComponent } from './manga-stats.component';

describe('MangaStatsComponent', () => {
  let component: MangaStatsComponent;
  let fixture: ComponentFixture<MangaStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MangaStatsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MangaStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
