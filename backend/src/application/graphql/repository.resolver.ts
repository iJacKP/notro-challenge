import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { RepositoryType } from './repository.schema';
import { SearchRepositoriesUseCase } from '../../core/use-cases/search-repositories.usecase';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => RepositoryType)
export class RepositoryResolver {
  constructor(private readonly searchUseCase: SearchRepositoriesUseCase) {}

  @Query(() => [RepositoryType])
  async searchRepositories(
    @Args('query') query: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
  ) {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException('A pesquisa deve ter pelo menos 2 caracteres.');
    }

    try {
      return await this.searchUseCase.execute(query, page);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Erro ao buscar repositórios.');
    }
  }
}