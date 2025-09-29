import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { delay, of, throwError } from 'rxjs';
import { RepositorySearchComponent } from './repository-search.component';
import { RepositoriesService } from '../../services/repositories.service';
import { MatDialog } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('RepositorySearchComponent', () => {
  let component: RepositorySearchComponent;
  let fixture: ComponentFixture<RepositorySearchComponent>;
  let serviceSpy: jasmine.SpyObj<RepositoriesService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('RepositoriesService', ['searchRepositories']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [RepositorySearchComponent],
      providers: [
        { provide: RepositoriesService, useValue: spy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RepositorySearchComponent);
    component = fixture.componentInstance;
    serviceSpy = TestBed.inject(RepositoriesService) as jasmine.SpyObj<RepositoriesService>;
    fixture.detectChanges();
  });

  it('✅ deve buscar repositórios quando search é chamado', () => {
    serviceSpy.searchRepositories.and.returnValue(of([{ name: 'Repo 1' } as any]));

    component.query = 'angular';
    component.search();

    expect(serviceSpy.searchRepositories).toHaveBeenCalledWith('angular', 1);
  });

  it('✅ deve ignorar nextPage se searchTerm estiver vazio', () => {
    component.searchTerm = '';
    component.hasResults = true;
    component.page = 1;

    spyOn(component, 'fetchRepositories');
    component.nextPage();

    expect(component.page).toBe(1);
    expect(component.fetchRepositories).not.toHaveBeenCalled();
  });

  it('✅ deve resetar para página 1 ao chamar goToFirstPage()', () => {
    serviceSpy.searchRepositories.and.returnValue(of([{ name: 'Repo 1' } as any]));

    component.page = 3;
    component.query = 'angular';
    component.goToFirstPage();

    expect(component.page).toBe(1);
    expect(serviceSpy.searchRepositories).toHaveBeenCalledWith('angular', 1);
  });

  it('✅ deve fechar modal ao chamar closeModal()', () => {
    component.selectedRepo = { name: 'Repo Test' } as any;

    component.closeModal();

    expect(component.selectedRepo).toBeNull();
  });


  it('✅ deve atualizar página ao chamar nextPage()', () => {
    serviceSpy.searchRepositories.and.returnValue(of([{ name: 'Repo 1' } as any]));

    component.searchTerm = 'angular';
    component.hasResults = true;
    component.page = 1;
    component.nextPage();

    expect(component.page).toBe(2);
  });

  it('🚨 deve exibir mensagem de erro quando service falha', () => {
    serviceSpy.searchRepositories.and.returnValue(throwError(() => new Error('Erro API')));

    component.searchTerm = 'angular';
    component.fetchRepositories();

    // força execução do observable
    component.repositories$.subscribe({
      next: () => {},
      error: () => {}
    });

    expect(component.errorMessage).toBe('Erro ao buscar repositórios.');
    expect(component.hasResults).toBeFalse();
  });

 it('🧩 deve renderizar repositórios no template após busca', fakeAsync(() => {
    const mockRepos = [
      {
        name: 'Repo 1',
        url: 'https://github.com/repo1',
        description: 'Descrição do repo',
        stars: 10,
        watchers: 5,
        issues: 2,
      },
    ];

    // devolve o resultado com delay(0) para forçar um segundo ciclo
    serviceSpy.searchRepositories.and.returnValue(
      of(mockRepos).pipe(delay(0))
    );

    component.query = 'angular';
    component.search(true); 

    // primeiro ciclo após chamar search(): loading=true
    fixture.detectChanges();

    // avança tempo para disparar o of(...).pipe(delay(0))
    tick(0);

    // segundo ciclo: resultados chegaram, hasResults e repositories$ já atualizados
    fixture.detectChanges();

    // busca pelo elemento que o card gera
    const cardDebugEls = fixture.debugElement.queryAll(
      By.css('app-repository-card')
    );
    expect(cardDebugEls.length).toBe(1);
        // opcional: inspecionar texto dentro do stub via debugElement.nativeElement
    const cardNative = cardDebugEls[0].nativeElement as HTMLElement;
    expect(cardNative.textContent).toContain('Repo 1');
    expect(cardNative.textContent).toContain('Descrição do repo');
  }));

});