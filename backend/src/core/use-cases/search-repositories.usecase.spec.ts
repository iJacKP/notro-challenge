import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SearchRepositoriesUseCase } from '../../core/use-cases/search-repositories.usecase';
import { GithubAdapter } from '../../../src/infra/adapters/github.adapter';
import { Repository } from '../../../src/core/entities/repository.entity';

describe('SearchRepositoriesUseCase', () => {
  let useCase: SearchRepositoriesUseCase;

  const mockGithubAdapter = {
    searchRepositories: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchRepositoriesUseCase,
        { provide: GithubAdapter, useValue: mockGithubAdapter },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    useCase = module.get<SearchRepositoriesUseCase>(SearchRepositoriesUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('✅ Deve retornar dados do cache quando disponível', async () => {
    const mockData: Repository[] = [
      {
        name: 'repo1',
        url: '',
        description: '',
        stars: 0,
        watchers: 0,
        issues: 0,
      },
    ];
    mockCacheManager.get = jest.fn().mockResolvedValue(mockData);

    const result = await useCase.execute('nestjs', 1);

    expect(result).toEqual(mockData);
    expect(mockCacheManager.get).toHaveBeenCalledWith('repos:nestjs:1');
    expect(mockGithubAdapter.searchRepositories).not.toHaveBeenCalled();
  });

  it('✅ Deve buscar dados da API quando não está no cache e salvar no cache', async () => {
    const mockData: Repository[] = [
      {
        name: 'repo2',
        url: '',
        description: '',
        stars: 10,
        watchers: 5,
        issues: 1,
      },
    ];
    mockCacheManager.get = jest.fn().mockResolvedValue(null);
    mockGithubAdapter.searchRepositories.mockResolvedValue(mockData);

    const result = await useCase.execute('nestjs', 1);

    expect(result).toEqual(mockData);
    expect(mockCacheManager.get).toHaveBeenCalledWith('repos:nestjs:1');
    expect(mockGithubAdapter.searchRepositories).toHaveBeenCalledWith(
      'nestjs',
      1,
    );
    expect(mockCacheManager.set).toHaveBeenCalledWith(
      'repos:nestjs:1',
      mockData,
      300000,
    );
  });
});
