import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryResolver } from '../../../src/application/graphql/repository.resolver';
import { SearchRepositoriesUseCase } from '../../../src/core/use-cases/search-repositories.usecase';
import { BadRequestException } from '@nestjs/common';

describe('RepositoryResolver', () => {
  let resolver: RepositoryResolver;
  let useCase: SearchRepositoriesUseCase;

  const mockUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoryResolver,
        { provide: SearchRepositoriesUseCase, useValue: mockUseCase },
      ],
    }).compile();

    resolver = module.get<RepositoryResolver>(RepositoryResolver);
    useCase = module.get<SearchRepositoriesUseCase>(SearchRepositoriesUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('✅ Deve chamar useCase e retornar repositórios', async () => {
    const mockRepos = [
      { name: 'repo1', url: 'url1', description: 'desc1', stars: 1, watchers: 2, issues: 3 },
    ];
    mockUseCase.execute.mockResolvedValue(mockRepos);

    const result = await resolver.searchRepositories('nestjs', 1);

    expect(result).toEqual(mockRepos);
    expect(mockUseCase.execute).toHaveBeenCalledWith('nestjs', 1);
  });

  it('🚨 Deve lançar BadRequestException se query tiver menos de 2 caracteres', async () => {
    await expect(resolver.searchRepositories('a', 1))
      .rejects.toThrow(BadRequestException);

    await expect(resolver.searchRepositories('', 1))
      .rejects.toThrow('A pesquisa deve ter pelo menos 2 caracteres.');
  });

  it('🚨 Deve lançar BadRequestException se useCase lançar erro', async () => {
    mockUseCase.execute.mockRejectedValue(new Error('Erro do UseCase'));

    await expect(resolver.searchRepositories('nestjs', 1))
      .rejects.toThrow(BadRequestException);

    await expect(resolver.searchRepositories('nestjs', 1))
      .rejects.toThrow('Erro do UseCase');
  });
});