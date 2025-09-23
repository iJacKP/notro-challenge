import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Repository } from '../../core/entities/repository.entity';

@Injectable()
export class GithubAdapter {
  private baseUrl = 'https://api.github.com';

  async searchRepositories(query: string, page: number): Promise<Repository[]> {
    const response = await axios.get(`${this.baseUrl}/search/repositories`, {
      params: { q: query, page, per_page: 10 },
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });

    return response.data.items.map((repo: any) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count ?? 0,
      watchers: repo.watchers_count ?? 0,
      issues: repo.open_issues_count ?? 0,
    }));
  }
}