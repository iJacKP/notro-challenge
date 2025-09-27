// src/infra/adapters/github.adapter.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { Repository } from '../../core/entities/repository.entity';

@Injectable()
export class GithubAdapter {
  private baseUrl = 'https://api.github.com';

  async searchRepositories(query: string, page: number): Promise<Repository[]> {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };

      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
      }

      const response = await axios.get(`${this.baseUrl}/search/repositories`, {
        params: { q: query, page, per_page: 10 },
        headers,
      });

      if (!response.data.items?.length) {
        throw new HttpException(
          `Nenhum repositório encontrado para "${query}"`,
          HttpStatus.NOT_FOUND,
        );
      }

      return response.data.items.map((repo: any) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        stars: repo.stargazers_count ?? 0,
        watchers: repo.watchers_count ?? 0,
        issues: repo.open_issues_count ?? 0,
      }));
    } catch (error: any) {
      if (axios.isAxiosError(error) || error.response) {
        const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          `Erro ao consultar API do GitHub (${status})`,
          status,
        );
      }
      throw new HttpException(
        `Nenhum repositório encontrado para "${query}"`,
        404,
      );
    }
  }
}