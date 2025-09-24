import { GithubAdapter } from '../../../src/infra/adapters/github.adapter';
import axios from 'axios';
import { HttpException } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GithubAdapter', () => {
  let adapter: GithubAdapter;

  beforeEach(() => {
    adapter = new GithubAdapter();
  });

  afterEach(() => jest.clearAllMocks());

  it('✅ Deve retornar repositórios quando API responde corretamente', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        items: [
          { name: 'repo1', html_url: 'url', description: 'desc', stargazers_count: 1, watchers_count: 2, open_issues_count: 3 },
        ],
      },
    });

    const result = await adapter.searchRepositories('nestjs', 1);

    expect(result[0]).toMatchObject({
      name: 'repo1',
      url: 'url',
      description: 'desc',
      stars: 1,
      watchers: 2,
      issues: 3,
    });
  });

  it('🚨 Deve lançar erro 404 quando não encontra repositórios', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { items: [] } });

    await expect(adapter.searchRepositories('notfound', 1))
      .rejects.toThrow(HttpException);
  });

  it('🚨 Deve lançar erro com status correto quando API falha', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 500 },
    });

    await expect(adapter.searchRepositories('fail', 1))
      .rejects.toThrow('Erro ao consultar API do GitHub (500)');
  });
});