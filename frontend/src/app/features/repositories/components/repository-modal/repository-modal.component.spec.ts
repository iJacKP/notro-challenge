import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepositoryModalComponent } from './repository-modal.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('RepositoryModalComponent', () => {
  let component: RepositoryModalComponent;
  let fixture: ComponentFixture<RepositoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryModalComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { name: 'Repo Test' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryModalComponent);
    component = fixture.componentInstance;
  });

  it('✅ deve receber os dados do repo via MAT_DIALOG_DATA', () => {
    expect(component.repo.name).toBe('Repo Test');
  });
});