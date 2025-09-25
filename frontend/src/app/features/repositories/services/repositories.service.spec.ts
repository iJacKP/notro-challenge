import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesService', () => {
  let service: RepositoriesService;
  let apolloSpy: jasmine.SpyObj<Apollo>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Apollo', ['watchQuery']);

    TestBed.configureTestingModule({
      providers: [
        RepositoriesService,
        { provide: Apollo, useValue: spy }
      ]
    });

    service = TestBed.inject(RepositoriesService);
    apolloSpy = TestBed.inject(Apollo) as jasmine.SpyObj<Apollo>;
  });

  it('✅ deve buscar repositórios com query e página', (done) => {
    const mockData = {
      data: {
        searchRepositories: [
          { name: 'Repo 1', url: 'http://repo1', description: 'desc', stars: 10, watchers: 5, issues: 2 }
        ]
      }
    };

    apolloSpy.watchQuery.and.returnValue({
      valueChanges: of(mockData)
    } as any);

    service.searchRepositories('angular', 1).subscribe((repos) => {
      expect(repos.length).toBe(1);
      expect(repos[0].name).toBe('Repo 1');
      done();
    });
  });
});