import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepositoryCardComponent } from './repository-card.component';
import { Repository } from '../../../../core/entities/repository.entity';

describe('RepositoryCardComponent', () => {
  let component: RepositoryCardComponent;
  let fixture: ComponentFixture<RepositoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryCardComponent);
    component = fixture.componentInstance;
  });

  it('✅ deve emitir evento openDetails ao clicar', () => {
    const repo: Repository = { name: 'Repo Test', url: 'http://repo', description: '', stars: 0, watchers: 0, issues: 0 };
    component.repo = repo;

    spyOn(component.openDetails, 'emit');
    component.handleClick();

    expect(component.openDetails.emit).toHaveBeenCalledWith(repo);
  });
});