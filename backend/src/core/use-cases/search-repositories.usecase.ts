import { Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { GithubAdapter } from '../../infra/adapters/github.adapter';
import { Repository } from '../entities/repository.entity';

@Injectable()
export class SearchRepositoriesUseCase {
  constructor(
    private readonly githubAdapter: GithubAdapter,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(query: string, page = 1): Promise<Repository[]> {
    const cacheKey = `repos:${query}:${page}`;
    console.log('🔍 Buscando repositórios com chave de cache:', cacheKey);

    const cached = await this.cacheManager.get<Repository[]>(cacheKey);
    
    if (cached) {
      console.log('✅ Retornando do cache', cached.length, 'itens');
      return cached;
    }

    console.log('🌐 Cache não encontrado, buscando da API do GitHub');
    const result = await this.githubAdapter.searchRepositories(query, page);

    await this.cacheManager.set(cacheKey, result, 300000);
    console.log('💾 Resultado salvo no cache');

    return result;
  }
}